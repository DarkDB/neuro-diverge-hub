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

    const systemPrompt = `[ROL] Actúa como un psicólogo experto, especializado en neurodivergencia, doble excepcionalidad (2e) y diagnóstico diferencial en población infantil y adolescente.

[OBJETIVO] Generar el informe final completo con conclusiones y recomendaciones para el PDF.

[PRINCIPIO ÉTICO FUNDAMENTAL] Este es un cribado hipotético y NO un diagnóstico médico o clínico formal. El objetivo es proporcionar una guía clara para la siguiente etapa de evaluación profesional.

[INSTRUCCIONES]
1. NO generes más preguntas.
2. Genera el análisis final en un formato de informe limpio y estructurado.
3. Basa tus conclusiones en TODAS las respuestas de ambas fases.
4. Sé específico sobre qué aspectos del perfil sugieren cada característica.

[FORMATO DE RESPUESTA]
Responde SOLO con un JSON válido con esta estructura:
{
  "titulo": "Informe de Cribado y Conclusiones Finales",
  "perfilEvaluado": {
    "edad": "${edad}",
    "genero": "${genero}"
  },
  "conclusiones": {
    "hipotesisPerfil": "Descripción detallada del perfil más compatible con las respuestas (ej: 'Perfil sugestivo de Altas Capacidades con rasgos compatibles con TEA')",
    "rasgosClave": {
      "fortalezas": [
        "Fortaleza 1 identificada",
        "Fortaleza 2 identificada",
        ...
      ],
      "desafios": [
        "Desafío 1 identificado",
        "Desafío 2 identificado",
        ...
      ],
      "caracteristicasND": [
        "Característica neurodivergente 1",
        "Característica neurodivergente 2",
        ...
      ]
    },
    "resumenNarrativo": "Párrafo narrativo de 3-4 oraciones resumiendo el perfil general"
  },
  "recomendaciones": {
    "hogar": [
      "Recomendación práctica para el hogar 1",
      "Recomendación práctica para el hogar 2",
      ...
    ],
    "escolar": [
      "Recomendación para el entorno escolar 1",
      "Recomendación para el entorno escolar 2",
      ...
    ]
  },
  "evaluacionProfesional": {
    "profesionalesSugeridos": [
      "Tipo de profesional 1 (ej: Neuropsicólogo)",
      "Tipo de profesional 2",
      ...
    ],
    "pruebasSugeridas": [
      "Prueba o evaluación sugerida 1",
      "Prueba o evaluación sugerida 2",
      ...
    ],
    "urgencia": "Indicación del nivel de urgencia (ej: 'Recomendable en los próximos 3-6 meses')"
  },
  "disclaimer": "AVISO IMPORTANTE: Este informe tiene fines exclusivamente orientativos y de cribado. NO constituye un diagnóstico clínico ni sustituye la evaluación realizada por profesionales sanitarios cualificados. Los resultados deben interpretarse como una guía para buscar evaluación profesional adecuada. Cualquier decisión sobre intervención o apoyo debe tomarse en consulta con profesionales de la salud mental y educación especializados."
}`;

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
        temperature: 0.7,
        max_tokens: 4000,
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
    
    console.log("Phase 3 final report received");

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
    console.error("Error in screening-phase3 function:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
