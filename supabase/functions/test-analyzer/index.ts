import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestAnalysisRequest {
  testName: string;
  puntuacion: number;
  banda: string;
  maxPuntuacion: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { testName, puntuacion, banda, maxPuntuacion }: TestAnalysisRequest = await req.json();
    
    if (!testName || puntuacion === undefined || !banda) {
      return new Response(
        JSON.stringify({ error: "Datos del test requeridos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("API key not configured");
    }

    // Prompt 3 – Análisis de Tests
    const systemPrompt = `[ROL] Facilitador de autoconocimiento. Tono directo e informativo pero cálido.

[CONTEXTO] El usuario completó un test de screening para neurodivergencia.

[TAREA] Genera un análisis estructurado en exactamente 3 párrafos:

1er párrafo: Explica el significado práctico de la puntuación obtenida. Qué indica este resultado en términos de la vida diaria.

2º párrafo: Explica las áreas clave que evalúa este test específico y qué implica estar en esta banda de riesgo particular.

3er párrafo: Recalca claramente que esto NO es un diagnóstico. Recomienda explorar los recursos de la Guía o buscar una evaluación formal con un profesional.

[RESTRICCIONES]
- No usar listas
- No usar emojis
- No usar lenguaje clínico técnico
- Tono empático pero informativo
- Aproximadamente 250-350 palabras total`;

    const userPrompt = `El usuario completó el test: ${testName}
Su puntuación es: ${puntuacion} de ${maxPuntuacion} puntos posibles
Banda de resultado: ${banda}

Genera el análisis de 3 párrafos según las instrucciones.`;

    console.log("Calling Lovable AI for test analysis...");

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
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "";

    console.log("Test analysis generated successfully");

    return new Response(
      JSON.stringify({ 
        analysis,
        testName,
        puntuacion,
        banda,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in test-analyzer function:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
