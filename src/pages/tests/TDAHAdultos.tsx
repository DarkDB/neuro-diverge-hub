import { TestPage, TestConfig, TestQuestion, TestResult } from '@/components/tests/TestPage';

// ASRS v1.1 - Adult ADHD Self-Report Scale
// Based on the official WHO ASRS v1.1 screening tool

const standardOptions = [
  { value: 0, label: 'Nunca' },
  { value: 1, label: 'Raramente' },
  { value: 2, label: 'A veces' },
  { value: 3, label: 'A menudo' },
  { value: 4, label: 'Muy a menudo' },
];

const questions: TestQuestion[] = [
  // Part A - Screening questions (1-6)
  {
    id: 1,
    text: '¿Con qué frecuencia tienes problemas para terminar los detalles finales de un proyecto, una vez que las partes difíciles ya están hechas?',
    options: standardOptions,
  },
  {
    id: 2,
    text: '¿Con qué frecuencia tienes dificultad para poner las cosas en orden cuando tienes que hacer una tarea que requiere organización?',
    options: standardOptions,
  },
  {
    id: 3,
    text: '¿Con qué frecuencia tienes problemas para recordar citas u obligaciones?',
    options: standardOptions,
  },
  {
    id: 4,
    text: 'Cuando tienes una tarea que requiere mucha concentración, ¿con qué frecuencia evitas o retrasas comenzarla?',
    options: standardOptions,
  },
  {
    id: 5,
    text: '¿Con qué frecuencia mueves o retuerces las manos o los pies cuando tienes que permanecer sentado/a mucho tiempo?',
    options: standardOptions,
  },
  {
    id: 6,
    text: '¿Con qué frecuencia te sientes excesivamente activo/a e impulsado/a a hacer cosas, como si tuvieras un motor dentro?',
    options: standardOptions,
  },
  // Part B - Additional symptoms (7-18)
  {
    id: 7,
    text: '¿Con qué frecuencia cometes errores por descuido cuando trabajas en un proyecto aburrido o difícil?',
    options: standardOptions,
  },
  {
    id: 8,
    text: '¿Con qué frecuencia tienes dificultad para mantener la atención cuando haces un trabajo aburrido o repetitivo?',
    options: standardOptions,
  },
  {
    id: 9,
    text: '¿Con qué frecuencia tienes dificultad para concentrarte en lo que te dice la gente, incluso cuando te hablan directamente?',
    options: standardOptions,
  },
  {
    id: 10,
    text: '¿Con qué frecuencia extravías o tienes dificultad para encontrar cosas en casa o en el trabajo?',
    options: standardOptions,
  },
  {
    id: 11,
    text: '¿Con qué frecuencia te distrae la actividad o el ruido a tu alrededor?',
    options: standardOptions,
  },
  {
    id: 12,
    text: '¿Con qué frecuencia te levantas de tu asiento en reuniones u otras situaciones en las que se espera que permanezcas sentado/a?',
    options: standardOptions,
  },
  {
    id: 13,
    text: '¿Con qué frecuencia te sientes inquieto/a o nervioso/a?',
    options: standardOptions,
  },
  {
    id: 14,
    text: '¿Con qué frecuencia tienes dificultad para relajarte cuando tienes tiempo libre?',
    options: standardOptions,
  },
  {
    id: 15,
    text: '¿Con qué frecuencia hablas demasiado cuando estás en situaciones sociales?',
    options: standardOptions,
  },
  {
    id: 16,
    text: 'Cuando estás en una conversación, ¿con qué frecuencia terminas las frases de las personas antes de que ellas puedan hacerlo?',
    options: standardOptions,
  },
  {
    id: 17,
    text: '¿Con qué frecuencia tienes dificultad para esperar tu turno en situaciones donde se requiere?',
    options: standardOptions,
  },
  {
    id: 18,
    text: '¿Con qué frecuencia interrumpes a otros cuando están ocupados?',
    options: standardOptions,
  },
];

const calculateResult = (answers: Record<number, number>): TestResult => {
  // Calculate Part A score (questions 1-6)
  // Using updated scoring: count answers of 2 or higher for Part A
  let partAScore = 0;
  const partAThresholds: Record<number, number> = {
    1: 2, // Sometimes or higher
    2: 2,
    3: 2,
    4: 3, // Often or higher
    5: 3,
    6: 3,
  };
  
  for (let i = 1; i <= 6; i++) {
    if (answers[i] >= partAThresholds[i]) {
      partAScore++;
    }
  }

  // Calculate total score
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const maxScore = 72; // 18 questions * 4 max points

  // Determine band based on Part A screening and total score
  let banda: string;
  let descripcion: string;
  let color: 'success' | 'warning' | 'destructive';

  if (partAScore >= 4) {
    banda = 'Altamente probable';
    descripcion = 'Tu puntuación en el screening indica una alta probabilidad de TDAH en adultos. Se recomienda encarecidamente buscar una evaluación profesional completa.';
    color = 'destructive';
  } else if (partAScore >= 2 || totalScore >= 36) {
    banda = 'Posible presencia';
    descripcion = 'Tu puntuación sugiere la posible presencia de síntomas de TDAH. Podría ser beneficioso consultar con un especialista para una evaluación más detallada.';
    color = 'warning';
  } else {
    banda = 'Bajo riesgo';
    descripcion = 'Tu puntuación no indica una probabilidad significativa de TDAH. Sin embargo, si experimentas dificultades en tu vida diaria, considera hablar con un profesional.';
    color = 'success';
  }

  return {
    puntuacion: totalScore,
    maxPuntuacion: maxScore,
    banda,
    descripcion,
    color,
  };
};

const testConfig: TestConfig = {
  id: 'tdah-adultos',
  name: 'ASRS v1.1 - TDAH en Adultos',
  fullName: 'Escala de Autorreporte de TDAH en Adultos (ASRS v1.1)',
  description: 'Test de screening validado por la OMS para identificar síntomas de TDAH en personas adultas.',
  instructions: 'Responde a cada pregunta considerando cómo te has sentido y comportado durante los últimos 6 meses. No hay respuestas correctas o incorrectas. Sé lo más honesto/a posible.',
  questions,
  calculateResult,
  disclaimer: 'Este test es una herramienta de screening basada en el ASRS v1.1 de la OMS. No constituye un diagnóstico. Solo un profesional de salud mental cualificado puede diagnosticar el TDAH.',
};

export default function TDAHAdultosTest() {
  return <TestPage config={testConfig} />;
}
