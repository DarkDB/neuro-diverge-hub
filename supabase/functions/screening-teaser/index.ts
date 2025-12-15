import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TeaserRequest {
  edad: string;
  genero: string;
  destinatario: string;
  historialRespuestas: {
    pregunta: string;
    respuesta: string;
  }[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { edad, genero, destinatario, historialRespuestas }: TeaserRequest = await req.json();
    
    if (!edad || !genero || !historialRespuestas || historialRespuestas.length === 0) {
      return new Response(
        JSON.stringify({ error: "Datos del perfil y respuestas son requeridos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("API key not configured");
    }

    // Formatear historial de respuestas
    const historialFormateado = historialRespuestas.map((item, index) => 
      `Pregunta ${index + 1}: ${item.pregunta}\nRespuesta: ${item.respuesta}`
    ).join("\n\n");

    const esParaSiMismo = destinatario === "Para mí mismo/a";
    const pronombre = esParaSiMismo ? "ti" : "el evaluado";
    const posesivo = esParaSiMismo ? "tu" : "su";

    const systemPrompt = `[ROL] Actúa como un psicólogo experto en neurodivergencia con un tono cálido, empático y esperanzador.

[OBJETIVO] Generar un resumen teaser breve y atractivo que despierte la curiosidad del usuario para continuar con el análisis completo de pago.

[PRINCIPIO ÉTICO] Este es solo un adelanto orientativo, NO un diagnóstico.

[INSTRUCCIONES]
1. Analiza brevemente las respuestas proporcionadas.
2. Identifica 2-3 patrones o características llamativas sin revelar conclusiones.
3. Genera un texto que:
   - Valide las experiencias del usuario
   - Sugiera que hay patrones interesantes para explorar
   - Despierte curiosidad sin dar el análisis completo
   - Invite a continuar para descubrir más

[FORMATO DE RESPUESTA]
Responde SOLO con un JSON válido con esta estructura:
{
  "titulo": "Hemos analizado tus respuestas...",
  "resumen": "Un párrafo de 3-4 oraciones que resuma lo observado de forma intrigante",
  "patrones": ["Patrón 1 identificado", "Patrón 2 identificado", "Patrón 3 identificado"],
  "cierre": "Una frase invitando a continuar para descubrir el análisis completo"
}`;

    const userPrompt = `Perfil del evaluado:
- Edad: ${edad}
- Género: ${genero}
- Destinatario: ${destinatario}

Respuestas de la Fase 1:
${historialFormateado}

Genera un teaser atractivo que despierte curiosidad para continuar con el análisis de pago.`;

    console.log("Calling Lovable AI for screening teaser...");
    console.log("Profile:", { edad, genero, destinatario, numRespuestas: historialRespuestas.length });

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
        max_tokens: 1000,
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
    let content = data.choices?.[0]?.message?.content || "";
    
    // Clean markdown code blocks if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log("Teaser response received");

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", content);
      throw new Error("Error al procesar la respuesta del teaser");
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in screening-teaser function:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
