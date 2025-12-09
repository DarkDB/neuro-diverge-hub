import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TeaserRequest {
  pregunta: string;
  respuesta: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pregunta, respuesta }: TeaserRequest = await req.json();
    
    if (!pregunta || !respuesta) {
      return new Response(
        JSON.stringify({ error: "Pregunta y respuesta son requeridas" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("API key not configured");
    }

    // Prompt 1 - Teaser Gratuito
    const systemPrompt = `[ROL] Actúa como un analista de perfil neurodivergente con un tono cálido y de apoyo.

[OBJETIVO] Analiza la respuesta proporcionada a una única pregunta. Muestra profundidad sin revelar el análisis completo.

[TAREA] Genera un único párrafo conectando esta respuesta con posibles patrones de procesamiento neurodivergente, sin jerga técnica ni conclusiones. Termina invitando al usuario a descubrir su perfil completo.

[RESTRICCIONES] 
- No diagnosticar
- No usar listas
- Producir solo un párrafo
- Máximo 150 palabras
- Tono empático y esperanzador`;

    const userPrompt = `La pregunta fue: "${pregunta}"

La respuesta del usuario fue: "${respuesta}"

Genera un párrafo de teaser que despierte curiosidad sobre el perfil neurodivergente del usuario.`;

    console.log("Calling Lovable AI for teaser analysis...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de uso alcanzado. Inténtalo de nuevo más tarde." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Servicio no disponible temporalmente." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const teaser = data.choices?.[0]?.message?.content || "";

    console.log("Teaser generated successfully");

    return new Response(
      JSON.stringify({ teaser }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in teaser function:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
