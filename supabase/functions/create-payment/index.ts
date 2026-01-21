import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Product configuration
const PRODUCTS = {
  screening: {
    price_id: "price_1Ss5fZ2HU8ke0Kv1ErMiub9B", // 4,99€ - Análisis completo cuestionario (PRODUCCIÓN)
    product_id: "prod_screening_live",
  },
  test_premium: {
    price_id: "price_1Ss5g82HU8ke0Kv1aB1zvLLz", // 0,99€ - Análisis premium test (PRODUCCIÓN)
    product_id: "prod_test_premium_live",
  },
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

    if (!product_type || !PRODUCTS[product_type as keyof typeof PRODUCTS]) {
      throw new Error("Invalid product type. Use 'screening' or 'test_premium'");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

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

    const selectedProduct = PRODUCTS[product_type as keyof typeof PRODUCTS];
    
    // Build metadata for the payment
    const metadata: Record<string, string> = {
      user_id: user.id,
      product_type,
    };
    
    if (session_id) metadata.session_id = session_id;
    if (test_type) metadata.test_type = test_type;

    const origin = req.headers.get("origin") || "https://espacioneurodivergente.com";
    
    // Determine success URL based on product type
    let successUrl: string;
    if (product_type === 'test_premium' && test_type) {
      // Redirect back to the test page with payment success params
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
          price: selectedProduct.price_id,
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
