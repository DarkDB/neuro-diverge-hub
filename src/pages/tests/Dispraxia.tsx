import { TestPage, TestConfig, TestResult } from '@/components/tests/TestPage';

// Test basado en criterios del DSM-5 para TDC y el Adult DCD Checklist (ADC)
const dispraxiaConfig: TestConfig = {
  id: 'dispraxia',
  name: 'Test de Dispraxia/TDC',
  fullName: 'Test de Screening de Dispraxia/Trastorno del Desarrollo de la Coordinación',
  description: 'Evalúa indicadores del TDC basado en el Adult DCD Checklist y criterios del DSM-5.',
  instructions: 'Responde a cada pregunta pensando en cómo te afectan estas situaciones en tu vida diaria. Piensa en patrones persistentes, no en incidentes aislados. Sé honesto/a para obtener resultados más precisos.',
  disclaimer: 'Este test es una herramienta de orientación, no un diagnóstico. Solo un profesional cualificado (terapeuta ocupacional, neuropsicólogo) puede realizar un diagnóstico formal de dispraxia/TDC.',
  questions: [
    {
      id: 1,
      text: "¿Tienes dificultad para realizar tareas que requieren coordinación mano-ojo (ej: atrapar una pelota)?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 2,
      text: "¿Te tropiezas, chocas con objetos o personas con más frecuencia que otros?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 3,
      text: "¿Tienes dificultad para aprender nuevas habilidades físicas o movimientos (ej: pasos de baile)?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 4,
      text: "¿Tu escritura a mano es difícil de leer o te cuesta mucho esfuerzo escribir de forma legible?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 5,
      text: "¿Te resulta difícil usar cubiertos, especialmente cuchillo y tenedor juntos?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 6,
      text: "¿Tienes problemas con tareas de motricidad fina como abotonarte o atarte los cordones?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 7,
      text: "¿Derramas bebidas o dejas caer objetos con frecuencia?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 8,
      text: "¿Te cuesta mantener el equilibrio en escaleras, superficies irregulares o transporte público?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 9,
      text: "¿Tienes dificultad para organizar tareas que involucran múltiples pasos físicos (ej: cocinar)?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 10,
      text: "¿Te fatigan más que a otros las actividades físicas o tareas manuales?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 11,
      text: "¿Has evitado deportes o actividades físicas debido a la dificultad que representan?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 12,
      text: "¿Tienes problemas con la percepción espacial (ej: calcular distancias, aparcar)?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 13,
      text: "¿Te cuesta articular el habla claramente, especialmente palabras largas o hablando rápido?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 14,
      text: "¿Tienes dificultad para estimar la fuerza necesaria para tareas (cerrar puertas muy fuerte)?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 15,
      text: "¿Te resulta difícil seguir ritmos o coordinar movimientos con música?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 16,
      text: "¿Tienes sensibilidad aumentada a ciertos estímulos (texturas de ropa, luces, sonidos)?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 17,
      text: "¿Olvidas o pierdes el hilo de lo que estás haciendo en medio de una tarea física?",
      options: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "A veces" },
        { value: 2, label: "Frecuentemente" },
        { value: 3, label: "Siempre" },
      ],
    },
    {
      id: 18,
      text: "¿Estas dificultades han estado presentes desde tu infancia?",
      options: [
        { value: 0, label: "No, son recientes" },
        { value: 1, label: "Creo que sí" },
        { value: 2, label: "Probablemente sí" },
        { value: 3, label: "Definitivamente sí" },
      ],
    },
  ],
  calculateResult: (answers: Record<number, number>): TestResult => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const maxScore = 54; // 18 preguntas x 3 puntos max
    const percentage = (totalScore / maxScore) * 100;

    if (percentage < 30) {
      return {
        puntuacion: totalScore,
        maxPuntuacion: maxScore,
        banda: 'Riesgo Bajo',
        descripcion: 'Tus respuestas no sugieren indicadores significativos de dispraxia/TDC. La torpeza ocasional es común y no indica necesariamente un trastorno.',
        color: 'success',
      };
    } else if (percentage < 55) {
      return {
        puntuacion: totalScore,
        maxPuntuacion: maxScore,
        banda: 'Riesgo Moderado',
        descripcion: 'Tus respuestas indican algunas dificultades con la coordinación motora. Te recomendamos consultar con un terapeuta ocupacional o neuropsicólogo.',
        color: 'warning',
      };
    } else {
      return {
        puntuacion: totalScore,
        maxPuntuacion: maxScore,
        banda: 'Riesgo Alto',
        descripcion: 'Tus respuestas muestran múltiples indicadores consistentes con dispraxia/TDC. Es altamente recomendable buscar una evaluación profesional completa.',
        color: 'destructive',
      };
    }
  },
};

export default function DispraxiaTest() {
  return <TestPage config={dispraxiaConfig} />;
}
