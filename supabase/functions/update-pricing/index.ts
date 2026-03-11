import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[UPDATE-PRICING] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("User not authenticated");

    // Check admin role
    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) throw new Error("Unauthorized: admin role required");
    logStep("Admin verified", { userId: userData.user.id });

    const { product_key, price_cents, is_free } = await req.json();
    logStep("Request body", { product_key, price_cents, is_free });

    if (!product_key) throw new Error("product_key is required");

    // Get current pricing record
    const { data: currentPricing, error: fetchError } = await supabaseClient
      .from('product_pricing')
      .select('*')
      .eq('product_key', product_key)
      .single();

    if (fetchError || !currentPricing) throw new Error("Product not found");

    let newStripePriceId = currentPricing.stripe_price_id;

    if (!is_free && price_cents > 0) {
      // Create new Stripe price
      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
        apiVersion: "2025-08-27.basil",
      });

      // Find or create product in Stripe
      const productName = currentPricing.product_name;
      let stripeProductId: string;

      // Search existing products
      const products = await stripe.products.search({
        query: `name:'${productName}'`,
        limit: 1,
      });

      if (products.data.length > 0) {
        stripeProductId = products.data[0].id;
        logStep("Found existing Stripe product", { stripeProductId });
      } else {
        const newProduct = await stripe.products.create({
          name: productName,
          description: currentPricing.description || undefined,
        });
        stripeProductId = newProduct.id;
        logStep("Created new Stripe product", { stripeProductId });
      }

      // Create new price
      const newPrice = await stripe.prices.create({
        product: stripeProductId,
        unit_amount: price_cents,
        currency: 'eur',
      });
      newStripePriceId = newPrice.id;
      logStep("Created new Stripe price", { priceId: newPrice.id, amount: price_cents });

      // Deactivate old price if different
      if (currentPricing.stripe_price_id && currentPricing.stripe_price_id !== newStripePriceId) {
        try {
          await stripe.prices.update(currentPricing.stripe_price_id, { active: false });
          logStep("Deactivated old price", { oldPriceId: currentPricing.stripe_price_id });
        } catch (e) {
          logStep("Could not deactivate old price (may not exist)", { error: String(e) });
        }
      }
    }

    // Update database
    const updateData: Record<string, any> = {
      price_cents: is_free ? 0 : price_cents,
      is_free: !!is_free,
      stripe_price_id: is_free ? null : newStripePriceId,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabaseClient
      .from('product_pricing')
      .update(updateData)
      .eq('product_key', product_key);

    if (updateError) throw updateError;
    logStep("Database updated successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      stripe_price_id: is_free ? null : newStripePriceId,
      price_cents: is_free ? 0 : price_cents,
      is_free: !!is_free,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
