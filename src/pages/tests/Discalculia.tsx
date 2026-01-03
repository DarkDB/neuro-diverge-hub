import { TestPage, TestConfig, TestResult } from '@/components/tests/TestPage';

// Test basado en criterios del DSM-5 y escalas de screening como el DBC (Dyscalculia Screener)
const discalculiaConfig: TestConfig = {
  id: 'discalculia',
  name: 'Test de Discalculia',
  fullName: 'Test de Screening de Discalculia',
  description: 'Evalúa indicadores de dificultades en el procesamiento numérico basado en criterios del DSM-5.',
  instructions: 'Responde a cada pregunta pensando en cómo te afectan estas situaciones en tu vida diaria. No hay respuestas correctas o incorrectas. Sé honesto/a en tus respuestas para obtener un resultado más preciso.',
  disclaimer: 'Este test es una herramienta de orientación, no un diagnóstico. Solo un profesional cualificado (neuropsicólogo, psicopedagogo) puede realizar un diagnóstico formal de discalculia.',
  questions: [
    {
      id: 1,
      text: "¿Tienes dificultad para recordar las tablas de multiplicar, incluso después de haberlas practicado muchas veces?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 2,
      text: "¿Necesitas usar los dedos para contar o hacer cálculos simples que otras personas hacen mentalmente?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 3,
      text: "¿Te cuesta estimar cantidades aproximadas (ej: cuántas personas hay en una habitación)?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 4,
      text: "¿Tienes problemas para manejar el dinero, calcular el cambio o dividir una cuenta?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 5,
      text: "¿Confundes los signos matemáticos (+, -, ×, ÷) o los aplicas incorrectamente?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 6,
      text: "¿Te resulta difícil leer la hora en un reloj analógico (de agujas)?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 7,
      text: "¿Tienes dificultad para entender conceptos como 'mayor que', 'menor que', 'doble' o 'mitad'?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 8,
      text: "¿Inviertes o confundes números al escribirlos (ej: 12 por 21, 6 por 9)?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 9,
      text: "¿Experimentas ansiedad significativa cuando tienes que realizar tareas con números?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 10,
      text: "¿Te cuesta seguir secuencias numéricas (contar hacia atrás, de 2 en 2, de 5 en 5)?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 11,
      text: "¿Tienes problemas para recordar números de teléfono, códigos PIN o fechas importantes?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 12,
      text: "¿Te resulta difícil estimar el tiempo que tardarás en completar una tarea?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 13,
      text: "¿Tienes dificultad para entender gráficos, tablas o datos estadísticos?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 14,
      text: "¿Cometes errores frecuentes al copiar números o al pasarlos de un lugar a otro?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 15,
      text: "¿Te cuesta entender instrucciones que incluyen información numérica (ej: recetas, direcciones)?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
  ],
  calculateResult: (answers: Record<number, number>): TestResult => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const maxScore = 45; // 15 preguntas x 3 puntos max
    const percentage = (totalScore / maxScore) * 100;

    if (percentage < 30) {
      return {
        puntuacion: totalScore,
        maxPuntuacion: maxScore,
        banda: 'Riesgo Bajo',
        descripcion: 'Tus respuestas no sugieren indicadores significativos de discalculia. Las dificultades ocasionales con números son normales.',
        color: 'success',
      };
    } else if (percentage < 60) {
      return {
        puntuacion: totalScore,
        maxPuntuacion: maxScore,
        banda: 'Riesgo Moderado',
        descripcion: 'Tus respuestas indican algunas dificultades con el procesamiento numérico. Te recomendamos consultar con un profesional especializado.',
        color: 'warning',
      };
    } else {
      return {
        puntuacion: totalScore,
        maxPuntuacion: maxScore,
        banda: 'Riesgo Alto',
        descripcion: 'Tus respuestas muestran múltiples indicadores consistentes con discalculia. Es altamente recomendable buscar una evaluación profesional.',
        color: 'destructive',
      };
    }
  },
};

export default function DiscalculiaTest() {
  return <TestPage config={discalculiaConfig} />;
}
