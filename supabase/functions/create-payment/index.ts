import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const { product_type, session_id, test_type } = await req.json();
    logStep("Request body", { product_type, session_id, test_type });

    if (!product_type) {
      throw new Error("product_type is required");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Fetch pricing from database using service role to bypass RLS
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: pricing, error: pricingError } = await serviceClient
      .from('product_pricing')
      .select('*')
      .eq('product_key', product_type)
      .eq('is_active', true)
      .single();

    if (pricingError || !pricing) {
      throw new Error(`Product '${product_type}' not found or inactive`);
    }
    logStep("Pricing fetched", { pricing });

    // If product is free, return success directly without Stripe
    if (pricing.is_free) {
      logStep("Product is free, skipping payment");
      
      // If it's a screening, mark as paid
      if (product_type === 'screening' && session_id) {
        await serviceClient
          .from('screening_sessions')
          .update({ paid: true })
          .eq('id', session_id);
      }

      const origin = req.headers.get("origin") || "https://espacioneurodivergente.com";
      let redirectUrl: string;
      if (product_type === 'test_premium' && test_type) {
        redirectUrl = `${origin}/tests/${test_type}?payment_success=true&test_type=${test_type}&free=true`;
      } else {
        redirectUrl = `${origin}/pago-exitoso?product=${product_type}&free=true`;
        if (session_id) redirectUrl += `&session_id=${session_id}`;
      }

      return new Response(JSON.stringify({ url: redirectUrl, free: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (!pricing.stripe_price_id) {
      throw new Error("No Stripe price configured for this product");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    }

    // Build metadata
    const metadata: Record<string, string> = {
      user_id: user.id,
      product_type,
    };
    if (session_id) metadata.session_id = session_id;
    if (test_type) metadata.test_type = test_type;

    const origin = req.headers.get("origin") || "https://espacioneurodivergente.com";
    
    let successUrl: string;
    if (product_type === 'test_premium' && test_type) {
      successUrl = `${origin}/tests/${test_type}?payment_success=true&test_type=${test_type}`;
    } else {
      successUrl = `${origin}/pago-exitoso?product=${product_type}`;
      if (session_id) successUrl += `&session_id=${session_id}`;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: pricing.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: `${origin}/pago-cancelado`,
      metadata,
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
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
