import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-RESOURCE-PURCHASE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const { session_id, resource_id } = await req.json();
    if (!session_id || !resource_id) {
      throw new Error("session_id and resource_id are required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    logStep("Checkout session retrieved", { 
      status: checkoutSession.payment_status,
      metadata: checkoutSession.metadata 
    });

    if (checkoutSession.payment_status !== "paid") {
      return new Response(JSON.stringify({ verified: false, reason: "not_paid" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (checkoutSession.metadata?.resource_id !== resource_id) {
      return new Response(JSON.stringify({ verified: false, reason: "resource_mismatch" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check if purchase already recorded
    const { data: existing } = await supabaseClient
      .from("resource_purchases")
      .select("id")
      .eq("stripe_checkout_session_id", session_id)
      .maybeSingle();

    if (!existing) {
      // Record the purchase
      const email = checkoutSession.customer_details?.email || checkoutSession.customer_email || "unknown";
      const { error } = await supabaseClient
        .from("resource_purchases")
        .insert({
          resource_id,
          email,
          stripe_checkout_session_id: session_id,
        });

      if (error) {
        logStep("Error recording purchase", { error: error.message });
      } else {
        logStep("Purchase recorded");
      }
    }

    // Get the resource file URL
    const { data: resource } = await supabaseClient
      .from("downloadable_resources")
      .select("file_url, title")
      .eq("id", resource_id)
      .single();

    if (!resource) {
      throw new Error("Resource not found");
    }

    logStep("Returning download URL");
    return new Response(JSON.stringify({ 
      verified: true, 
      file_url: resource.file_url,
      title: resource.title,
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
