import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-RESOURCE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { resource_id, resource_title, price_cents, email } = await req.json();
    logStep("Request body", { resource_id, resource_title, price_cents, email });

    if (!resource_id || !price_cents) {
      throw new Error("resource_id and price_cents are required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "https://espacioneurodivergente.com";

    // Create a one-time price for this resource
    const session = await stripe.checkout.sessions.create({
      ...(email ? { customer_email: email } : {}),
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: resource_title || "Guía descargable",
              description: "Acceso para descargar este recurso",
            },
            unit_amount: price_cents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/recursos?purchase_success=true&resource_id=${resource_id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/recursos?purchase_cancelled=true`,
      metadata: {
        resource_id,
        product_type: "downloadable_resource",
      },
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
