import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const now = new Date().toISOString();
    
    console.log(`[publish-scheduled-articles] Checking for scheduled articles at ${now}`);
    
    // Find all scheduled articles where scheduled_at is in the past
    const { data: articlesToPublish, error: fetchError } = await supabase
      .from('articles')
      .select('id, title, scheduled_at')
      .eq('status', 'scheduled')
      .lte('scheduled_at', now);
    
    if (fetchError) {
      console.error('[publish-scheduled-articles] Error fetching articles:', fetchError);
      throw fetchError;
    }
    
    if (!articlesToPublish || articlesToPublish.length === 0) {
      console.log('[publish-scheduled-articles] No articles to publish');
      return new Response(
        JSON.stringify({ message: 'No articles to publish', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`[publish-scheduled-articles] Found ${articlesToPublish.length} articles to publish`);
    
    // Update each article to published status
    const articleIds = articlesToPublish.map(a => a.id);
    
    const { error: updateError } = await supabase
      .from('articles')
      .update({ 
        status: 'published',
        published_at: now
      })
      .in('id', articleIds);
    
    if (updateError) {
      console.error('[publish-scheduled-articles] Error updating articles:', updateError);
      throw updateError;
    }
    
    console.log(`[publish-scheduled-articles] Successfully published ${articlesToPublish.length} articles:`, 
      articlesToPublish.map(a => a.title));
    
    return new Response(
      JSON.stringify({ 
        message: 'Articles published successfully', 
        count: articlesToPublish.length,
        articles: articlesToPublish.map(a => ({ id: a.id, title: a.title }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('[publish-scheduled-articles] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
