import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Phase3Request {
  edad: string;
  genero: string;
  historialFase1: {
    pregunta: string;
    respuesta: string;
  }[];
  historialFase2: {
    pregunta: string;
    respuesta: string;
  }[];
  analisisPreliminar: {
    fortalezas: string;
    desafios: string;
    hipotesisPrincipal: string;
    justificacion: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { edad, genero, historialFase1, historialFase2, analisisPreliminar }: Phase3Request = await req.json();
    
    if (!edad || !genero || !historialFase1 || !historialFase2) {
      return new Response(
        JSON.stringify({ error: "Todos los datos del cribado son requeridos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("API key not configured");
    }

    // Formatear historiales
    const historial1Formateado = historialFase1.map((item, index) => 
      `Pregunta ${index + 1}: ${item.pregunta}\nRespuesta: ${item.respuesta}`
    ).join("\n\n");

    const historial2Formateado = historialFase2.map((item, index) => 
      `Pregunta ${index + 1}: ${item.pregunta}\nRespuesta: ${item.respuesta}`
    ).join("\n\n");

    const DISCLAIMER =
      "AVISO IMPORTANTE: Este informe tiene fines exclusivamente orientativos y de cribado. NO constituye un diagnóstico clínico ni sustituye la evaluación realizada por profesionales sanitarios cualificados. Los resultados deben interpretarse como una guía para buscar evaluación profesional adecuada. Cualquier decisión sobre intervención o apoyo debe tomarse en consulta con profesionales de la salud mental y educación especializados.";

    const reportTool = {
      type: "function",
      function: {
        name: "build_final_report",
        description:
          "Devuelve el informe final de cribado en un objeto estructurado para generar un PDF.",
        parameters: {
          type: "object",
          properties: {
            titulo: { type: "string" },
            perfilEvaluado: {
              type: "object",
              properties: {
                edad: { type: "string" },
                genero: { type: "string" },
              },
              required: ["edad", "genero"],
              additionalProperties: false,
            },
            conclusiones: {
              type: "object",
              properties: {
                hipotesisPerfil: { type: "string" },
                rasgosClave: {
                  type: "object",
                  properties: {
                    fortalezas: { type: "array", items: { type: "string" } },
                    desafios: { type: "array", items: { type: "string" } },
                    caracteristicasND: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                  required: ["fortalezas", "desafios", "caracteristicasND"],
                  additionalProperties: false,
                },
                resumenNarrativo: { type: "string" },
              },
              required: ["hipotesisPerfil", "rasgosClave", "resumenNarrativo"],
              additionalProperties: false,
            },
            recomendaciones: {
              type: "object",
              properties: {
                hogar: { type: "array", items: { type: "string" } },
                escolar: { type: "array", items: { type: "string" } },
              },
              required: ["hogar", "escolar"],
              additionalProperties: false,
            },
            evaluacionProfesional: {
              type: "object",
              properties: {
                profesionalesSugeridos: {
                  type: "array",
                  items: { type: "string" },
                },
                pruebasSugeridas: { type: "array", items: { type: "string" } },
                urgencia: { type: "string" },
              },
              required: [
                "profesionalesSugeridos",
                "pruebasSugeridas",
                "urgencia",
              ],
              additionalProperties: false,
            },
          },
          required: [
            "titulo",
            "perfilEvaluado",
            "conclusiones",
            "recomendaciones",
            "evaluacionProfesional",
          ],
          additionalProperties: false,
        },
      },
    } as const;

    const systemPrompt = `[ROL] Actúa como un psicólogo experto, especializado en neurodivergencia, doble excepcionalidad (2e) y diagnóstico diferencial en población infantil y adolescente.

[OBJETIVO] Generar el informe final completo con conclusiones y recomendaciones para el PDF.

[PRINCIPIO ÉTICO FUNDAMENTAL] Este es un cribado hipotético y NO un diagnóstico médico o clínico formal. El objetivo es proporcionar una guía clara para la siguiente etapa de evaluación profesional.

[INSTRUCCIONES]
1. NO generes más preguntas.
2. Responde usando EXCLUSIVAMENTE la herramienta build_final_report.
3. Mantén el informe conciso para evitar recortes: usa 4-6 ítems por lista como máximo y frases claras.
4. En perfilEvaluado, usa exactamente la edad y el género proporcionados en el perfil.
5. No incluyas saltos de línea dentro de frases; usa texto en una sola línea cuando sea posible.`;

    const userPrompt = `Perfil del usuario evaluado:
- Edad: ${edad}
- Género: ${genero}

=== RESPUESTAS FASE 1 (Cribado Inicial) ===
${historial1Formateado}

=== ANÁLISIS PRELIMINAR DE FASE 2 ===
Fortalezas identificadas: ${analisisPreliminar?.fortalezas || 'No disponible'}
Desafíos identificados: ${analisisPreliminar?.desafios || 'No disponible'}
Hipótesis principal: ${analisisPreliminar?.hipotesisPrincipal || 'No disponible'}
Justificación: ${analisisPreliminar?.justificacion || 'No disponible'}

=== RESPUESTAS FASE 2 (Profundización) ===
${historial2Formateado}

Genera el informe final completo para el PDF.`;

    console.log("Calling Lovable AI for Phase 3 final report...");
    console.log("Profile:", { edad, genero, numRespuestasFase1: historialFase1.length, numRespuestasFase2: historialFase2.length });

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
         tools: [reportTool],
         tool_choice: { type: "function", function: { name: "build_final_report" } },
         temperature: 0.3,
         max_tokens: 5500,
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
     const choice = data.choices?.[0];
     const finishReason = choice?.finish_reason;

     if (finishReason === "length") {
       console.error("AI response was truncated (finish_reason=length)");
       return new Response(
         JSON.stringify({
           error:
             "La respuesta del informe fue demasiado larga y se recortó. Vuelve a intentarlo.",
         }),
         {
           status: 502,
           headers: { ...corsHeaders, "Content-Type": "application/json" },
         }
       );
     }

     console.log("Phase 3 final report received");

     let parsedResponse: any;

     // Prefer tool-calling arguments for guaranteed JSON structure
     const toolArgs = choice?.message?.tool_calls?.[0]?.function?.arguments;
     if (toolArgs) {
       try {
         parsedResponse = JSON.parse(toolArgs);
       } catch (_e) {
         console.error("Failed to parse tool arguments:", toolArgs);
         throw new Error("Error al procesar la respuesta del análisis");
       }
     } else {
       let content = choice?.message?.content || "";

       // Clean markdown code blocks if present
       content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

       try {
         parsedResponse = JSON.parse(content);
       } catch (_parseError) {
         console.error("Failed to parse AI response as JSON:", content);
         throw new Error("Error al procesar la respuesta del análisis");
       }
     }

     // Ensure disclaimer is always present (prevents long-text truncation issues)
     parsedResponse.disclaimer = DISCLAIMER;

    return new Response(
      JSON.stringify(parsedResponse),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in screening-phase3 function:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
