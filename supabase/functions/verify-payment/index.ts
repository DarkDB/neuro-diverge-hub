import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
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

    const { session_id } = await req.json();
    if (!session_id) throw new Error("session_id is required");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Find payment intents for this user's email
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found");
      return new Response(JSON.stringify({ paid: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found customer", { customerId });

    // Get recent successful payments
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 20,
    });

    // Check if there's a successful payment with matching session_id in metadata
    const matchingPayment = paymentIntents.data.find(
      (pi: { status: string; metadata?: Record<string, string> }) => 
        pi.status === "succeeded" && pi.metadata?.session_id === session_id
    );

    if (matchingPayment) {
      logStep("Found matching payment", { paymentIntentId: matchingPayment.id });
      
      // Update the screening session as paid
      const { error } = await supabaseClient
        .from("screening_sessions")
        .update({ paid: true })
        .eq("id", session_id)
        .eq("user_id", user.id);

      if (error) {
        logStep("Error updating session", { error: error.message });
      } else {
        logStep("Session marked as paid");
      }

      return new Response(JSON.stringify({ paid: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Also check checkout sessions
    const checkoutSessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 20,
    });

    const matchingCheckout = checkoutSessions.data.find(
      (cs: { payment_status: string; metadata?: Record<string, string> }) => 
        cs.payment_status === "paid" && cs.metadata?.session_id === session_id
    );

    if (matchingCheckout) {
      logStep("Found matching checkout session", { checkoutId: matchingCheckout.id });
      
      // Update the screening session as paid
      const { error } = await supabaseClient
        .from("screening_sessions")
        .update({ paid: true })
        .eq("id", session_id)
        .eq("user_id", user.id);

      if (error) {
        logStep("Error updating session", { error: error.message });
      } else {
        logStep("Session marked as paid");
      }

      return new Response(JSON.stringify({ paid: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("No matching payment found");
    return new Response(JSON.stringify({ paid: false }), {
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
