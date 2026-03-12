import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) throw new Error('RESEND_API_KEY not configured');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { subject, htmlContent, testMode } = await req.json();

    if (!subject || !htmlContent) {
      return new Response(
        JSON.stringify({ error: 'subject and htmlContent are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get active subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true);

    if (subError) throw subError;

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: 'No active subscribers' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // In test mode, only send to first subscriber
    const recipients = testMode ? [subscribers[0]] : subscribers;

    let sent = 0, errors = 0;
    const errorDetails: string[] = [];

    // Send in batches of 10 to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const promises = batch.map(async (sub) => {
        try {
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Neurodivergente.me <no-reply@neurodivergente.me>',
              to: [sub.email],
              subject,
              html: `
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                  ${htmlContent}
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                  <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                    Neurodivergente.me — Comprendiendo la neurodivergencia<br/>
                    <a href="https://neurodivergente.me" style="color: #9ca3af;">Visitar web</a>
                  </p>
                </div>
              `,
            }),
          });
          if (res.ok) { sent++; } 
          else { 
            errors++;
            const errBody = await res.text();
            errorDetails.push(`${sub.email}: ${errBody}`);
          }
        } catch (e) {
          errors++;
          errorDetails.push(`${sub.email}: ${e instanceof Error ? e.message : 'Unknown'}`);
        }
      });

      await Promise.all(promises);

      // Small delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent, 
        errors, 
        total: recipients.length,
        testMode: !!testMode,
        ...(errorDetails.length > 0 && { errorDetails: errorDetails.slice(0, 5) })
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
