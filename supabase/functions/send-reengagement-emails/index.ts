import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_URL = 'https://neurodivergente.me';

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

    // Parse optional body for manual trigger with specific type
    let emailType = 'all';
    try {
      const body = await req.json();
      emailType = body.type || 'all';
    } catch { /* no body, run all */ }

    const results: { type: string; sent: number; errors: number }[] = [];

    // 1. Unfinished screening sessions (started > 2 days ago, not completed)
    if (emailType === 'all' || emailType === 'unfinished_screening') {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
      
      const { data: incompleteSessions } = await supabase
        .from('screening_sessions')
        .select('user_id, status, created_at')
        .neq('status', 'completed')
        .lt('created_at', twoDaysAgo);

      if (incompleteSessions && incompleteSessions.length > 0) {
        const userIds = [...new Set(incompleteSessions.map(s => s.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email, display_name')
          .in('id', userIds);

        let sent = 0, errors = 0;
        for (const profile of (profiles || [])) {
          const session = incompleteSessions.find(s => s.user_id === profile.id);
          const statusLabel = session?.status === 'fase1' ? 'la primera fase' 
            : session?.status === 'teaser' ? 'el análisis preliminar'
            : session?.status === 'fase2' ? 'la segunda fase'
            : 'el proceso';

          try {
            const res = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: 'Neurodivergente.me <no-reply@neurodivergente.me>',
                to: [profile.email],
                subject: '🧠 Tu proceso de autodescubrimiento te espera',
                html: `
                  <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                    <h2 style="color: #6d28d9;">Hola ${profile.display_name || 'ahí'} 👋</h2>
                    <p>Vimos que empezaste tu proceso de autodescubrimiento pero te quedaste en <strong>${statusLabel}</strong>.</p>
                    <p>No te preocupes, <strong>todas tus respuestas están guardadas</strong>. Puedes continuar donde lo dejaste cuando quieras.</p>
                    <div style="text-align: center; margin: 32px 0;">
                      <a href="${SITE_URL}/autodescubrimiento" style="background: #6d28d9; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                        Continuar mi proceso
                      </a>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">Recuerda que el autodescubrimiento es un camino, no una carrera. Avanza a tu ritmo. 💜</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                      Neurodivergente.me — Comprendiendo la neurodivergencia
                    </p>
                  </div>
                `,
              }),
            });
            if (res.ok) sent++; else errors++;
          } catch { errors++; }
        }
        results.push({ type: 'unfinished_screening', sent, errors });
      }
    }

    // 2. Resource recommendations based on test results
    if (emailType === 'all' || emailType === 'resource_recommendations') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const { data: recentTests } = await supabase
        .from('test_completions')
        .select('user_id, test_name, banda')
        .not('user_id', 'is', null)
        .gte('completed_at', sevenDaysAgo);

      if (recentTests && recentTests.length > 0) {
        const userIds = [...new Set(recentTests.filter(t => t.user_id).map(t => t.user_id!))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email, display_name')
          .in('id', userIds);

        const { data: resources } = await supabase
          .from('downloadable_resources')
          .select('id, title, category, neurodivergence_type, is_paid')
          .eq('is_active', true)
          .limit(10);

        let sent = 0, errors = 0;
        for (const profile of (profiles || [])) {
          const userTests = recentTests.filter(t => t.user_id === profile.id);
          const testNames = userTests.map(t => t.test_name).join(', ');

          const relevantResources = (resources || []).slice(0, 3);
          const resourceListHtml = relevantResources.map(r => 
            `<li style="margin-bottom: 8px;"><strong>${r.title}</strong> — ${r.category}${r.is_paid ? ' (Premium)' : ' (Gratuito)'}</li>`
          ).join('');

          try {
            const res = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: 'Neurodivergente.me <no-reply@neurodivergente.me>',
                to: [profile.email],
                subject: '📚 Recursos recomendados para ti',
                html: `
                  <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                    <h2 style="color: #6d28d9;">Hola ${profile.display_name || 'ahí'} 👋</h2>
                    <p>Completaste recientemente: <strong>${testNames}</strong>. ¡Genial!</p>
                    <p>Basándonos en tus resultados, te recomendamos estos recursos:</p>
                    <ul style="padding-left: 20px;">${resourceListHtml}</ul>
                    <div style="text-align: center; margin: 32px 0;">
                      <a href="${SITE_URL}/recursos" style="background: #6d28d9; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                        Ver todos los recursos
                      </a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                      Neurodivergente.me — Comprendiendo la neurodivergencia
                    </p>
                  </div>
                `,
              }),
            });
            if (res.ok) sent++; else errors++;
          } catch { errors++; }
        }
        results.push({ type: 'resource_recommendations', sent, errors });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
