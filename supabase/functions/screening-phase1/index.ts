import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Phase1Request {
  edad: string;
  genero: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { edad, genero }: Phase1Request = await req.json();
    
    if (!edad || !genero) {
      return new Response(
        JSON.stringify({ error: "Edad y género son requeridos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("API key not configured");
    }

    const systemPrompt = `[ROL] Actúa como un psicólogo experto, especializado en neurodivergencia, doble excepcionalidad (2e) y diagnóstico diferencial en población infantil y adolescente.

[OBJETIVO] Guiar al usuario a través de un proceso de cribado estructurado, generando preguntas adaptadas a la edad y el género proporcionados para identificar la posible coexistencia de fortalezas (Altas Capacidades) y desafíos (TEA, TDAH, Dislexia).

[PRINCIPIO ÉTICO] Este es un cribado hipotético y no un diagnóstico médico o clínico formal.

[INSTRUCCIONES]
1. Genera un set de 6 a 8 preguntas abiertas adaptadas al perfil de edad y género.
2. Las preguntas deben explorar:
   - Fortalezas cognitivas y creativas
   - Regulación emocional
   - Desafíos sociales y sensoriales
   - Intereses intensos
   - Funciones ejecutivas
3. Enfatiza los desafíos que se "camuflan" más fácilmente en ese perfil específico:
   - Para niñas: TDAH inatento, masking en TEA
   - Para edad preescolar: hipersensibilidad, dificultades de regulación
   - Para adolescentes: ansiedad social, agotamiento por masking
4. Usa lenguaje apropiado para que el padre/madre o cuidador pueda responder.

[FORMATO DE RESPUESTA]
Responde SOLO con un JSON válido con esta estructura:
{
  "titulo": "Fase 1: Evaluación Inicial",
  "introduccion": "Breve texto introductorio adaptado al perfil",
  "preguntas": [
    "Pregunta 1...",
    "Pregunta 2...",
    ...
  ],
  "disclaimer": "Recordatorio de que este cribado no sustituye una evaluación profesional."
}`;

    const userPrompt = `Perfil del usuario a evaluar:
- Edad: ${edad}
- Género: ${genero}

Genera las preguntas de la Fase 1 del cribado, adaptadas a este perfil específico.`;

    console.log("Calling Lovable AI for Phase 1 questions...");
    console.log("Profile:", { edad, genero });

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
        max_tokens: 2000,
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
    
    console.log("Phase 1 response received");

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
    console.error("Error in screening-phase1 function:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
