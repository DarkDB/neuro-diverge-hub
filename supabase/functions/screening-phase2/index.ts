import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Phase2Request {
  edad: string;
  genero: string;
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
    const { edad, genero, historialRespuestas }: Phase2Request = await req.json();
    
    if (!edad || !genero || !historialRespuestas || historialRespuestas.length === 0) {
      return new Response(
        JSON.stringify({ error: "Edad, género e historial de respuestas son requeridos" }),
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

    const systemPrompt = `[ROL] Actúa como un psicólogo experto, especializado en neurodivergencia, doble excepcionalidad (2e) y diagnóstico diferencial en población infantil y adolescente.

[OBJETIVO] Entregar un análisis preliminar basado en las respuestas de la Fase 1 y refinar la hipótesis para dirigir las siguientes preguntas de profundización.

[PRINCIPIO ÉTICO] Este es un cribado hipotético y no un diagnóstico médico o clínico formal.

[INSTRUCCIONES]
1. Analiza las respuestas de la Fase 1 cuidadosamente.
2. Identifica patrones que sugieran:
   - Altas Capacidades (AC): pensamiento divergente, intensidad, curiosidad profunda
   - TEA: rigidez, sensorialidad, comunicación social atípica
   - TDAH: regulación atencional, impulsividad, hiperactividad
   - Posible doble excepcionalidad (2e)
3. Genera una hipótesis principal basada en los patrones encontrados.
4. Formula 4 a 6 preguntas nuevas y específicas dirigidas a confirmar o descartar rasgos de la hipótesis más fuerte.
5. Las preguntas deben explorar:
   - Si sospechas TEA: stimming, rigidez, literalidad
   - Si sospechas TDAH: hiperfoco vs dispersión, regulación emocional
   - Si sospechas AC: intensidad emocional, perfeccionismo, pensamiento abstracto

[FORMATO DE RESPUESTA]
Responde SOLO con un JSON válido con esta estructura:
{
  "titulo": "Fase 2: Análisis Preliminar e Hipótesis",
  "analisis": {
    "fortalezas": "Párrafo describiendo fortalezas observadas",
    "desafios": "Párrafo describiendo desafíos identificados",
    "hipotesisPrincipal": "Párrafo con la hipótesis más probable (ej: 'Fuertes rasgos de AC y posible TEA')",
    "justificacion": "Párrafo explicando por qué se sugiere esta hipótesis"
  },
  "preguntas": [
    "Pregunta específica 1...",
    "Pregunta específica 2...",
    ...
  ]
}`;

    const userPrompt = `Perfil del usuario a evaluar:
- Edad: ${edad}
- Género: ${genero}

Respuestas de la Fase 1:
${historialFormateado}

Genera el análisis preliminar y las preguntas de profundización para la Fase 2.`;

    console.log("Calling Lovable AI for Phase 2 analysis...");
    console.log("Profile:", { edad, genero, numRespuestas: historialRespuestas.length });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 3000,
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
    
    console.log("Phase 2 response received");

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", content);
      throw new Error("Error al procesar la respuesta del análisis");
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in screening-phase2 function:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
