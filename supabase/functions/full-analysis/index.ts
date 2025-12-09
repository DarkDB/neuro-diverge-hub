import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalysisRequest {
  preguntas: string[];
  respuestas: string[];
  email: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preguntas, respuestas, email }: AnalysisRequest = await req.json();
    
    if (!preguntas || !respuestas || preguntas.length !== respuestas.length) {
      return new Response(
        JSON.stringify({ error: "Preguntas y respuestas son requeridas" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("API key not configured");
    }

    // Formatear las preguntas y respuestas
    const preguntasRespuestas = preguntas.map((p, i) => 
      `Pregunta ${i + 1}: ${p}\nRespuesta: ${respuestas[i]}`
    ).join("\n\n");

    // Prompt 2 – Informe Completo
    const systemPrompt = `[ROL] Eres un Analista de Perfiles Neurodivergentes. Tono cálido, empático, no clínico.

[OBJETIVO] Analiza todas las respuestas del usuario para generar un informe estructurado.

[ESTRUCTURA DEL INFORME]

A. ANÁLISIS DETALLADO (3-4 párrafos)
Examina las siguientes áreas basándote en las respuestas:
- Funciones ejecutivas: planificación, organización, gestión del tiempo
- Sensorialidad: procesamiento sensorial, sobrecarga, preferencias
- Interacción social: comunicación, energía social, masking

B. RESUMEN DE PATRONES (2 párrafos)
Identifica 2-3 patrones dominantes que emergen de las respuestas.

C. CONCLUSIÓN Y PERFIL SUGERIDO
Indica qué tipo de neurodivergencia es más compatible con las respuestas (TDAH, TEA, AACC, o combinación).

[RESTRICCIÓN ÉTICA OBLIGATORIA]
Incluye EXACTAMENTE esta frase en negrita al final:

**"Este análisis tiene fines exclusivamente exploratorios. No sustituye ni reemplaza la evaluación o el diagnóstico realizado por un profesional sanitario o clínico. Tu perfil es altamente compatible con una exploración de [PERFIL SUGERIDO]. Busca apoyo profesional."**

[FORMATO]
- Usa subtítulos claros para cada sección
- Lenguaje accesible, sin jerga técnica excesiva
- Tono empático y validador
- Aproximadamente 800-1000 palabras`;

    const userPrompt = `Analiza las siguientes respuestas del cuestionario de autodescubrimiento neurodivergente:

${preguntasRespuestas}

Genera el informe completo estructurado según las instrucciones.`;

    console.log("Calling Lovable AI for full analysis...");

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
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "";

    console.log("Full analysis generated successfully");

    return new Response(
      JSON.stringify({ 
        analysis,
        email,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in full-analysis function:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
