import { TestPage, TestConfig, TestQuestion, TestResult } from '@/components/tests/TestPage';

// AQ-10 - Autism Spectrum Quotient (10 items)
// Based on Baron-Cohen et al. Autism Research Centre, Cambridge University

const agreeOptions = [
  { value: 0, label: 'Totalmente en desacuerdo' },
  { value: 1, label: 'Ligeramente en desacuerdo' },
  { value: 2, label: 'Ligeramente de acuerdo' },
  { value: 3, label: 'Totalmente de acuerdo' },
];

const questions: TestQuestion[] = [
  {
    id: 1,
    text: 'A menudo noto pequeños sonidos cuando otros no lo hacen.',
    options: agreeOptions,
  },
  {
    id: 2,
    text: 'Normalmente me concentro más en el conjunto de la imagen que en los pequeños detalles.',
    options: agreeOptions,
  },
  {
    id: 3,
    text: 'Me resulta fácil hacer más de una cosa a la vez.',
    options: agreeOptions,
  },
  {
    id: 4,
    text: 'Si hay una interrupción, puedo volver a lo que estaba haciendo muy rápidamente.',
    options: agreeOptions,
  },
  {
    id: 5,
    text: 'Me resulta fácil "leer entre líneas" cuando alguien me está hablando.',
    options: agreeOptions,
  },
  {
    id: 6,
    text: 'Sé cómo saber si alguien que me escucha se está aburriendo.',
    options: agreeOptions,
  },
  {
    id: 7,
    text: 'Cuando leo una historia, me resulta difícil entender las intenciones de los personajes.',
    options: agreeOptions,
  },
  {
    id: 8,
    text: 'Me gusta coleccionar información sobre categorías de cosas (por ejemplo, tipos de coches, tipos de pájaros, tipos de trenes, tipos de plantas, etc.).',
    options: agreeOptions,
  },
  {
    id: 9,
    text: 'Me resulta fácil saber lo que alguien está pensando o sintiendo solo con mirar su cara.',
    options: agreeOptions,
  },
  {
    id: 10,
    text: 'Me resulta difícil entender las intenciones de las personas.',
    options: agreeOptions,
  },
];

// Scoring: 
// Score 1 point for "agree" (2 or 3) on questions 1, 7, 8, 10
// Score 1 point for "disagree" (0 or 1) on questions 2, 3, 4, 5, 6, 9
const calculateResult = (answers: Record<number, number>): TestResult => {
  let score = 0;
  
  // Questions where agree = 1 point (1, 7, 8, 10)
  const agreeQuestions = [1, 7, 8, 10];
  // Questions where disagree = 1 point (2, 3, 4, 5, 6, 9)
  const disagreeQuestions = [2, 3, 4, 5, 6, 9];
  
  agreeQuestions.forEach((q) => {
    if (answers[q] >= 2) score++;
  });
  
  disagreeQuestions.forEach((q) => {
    if (answers[q] <= 1) score++;
  });

  const maxScore = 10;

  let banda: string;
  let descripcion: string;
  let color: 'success' | 'warning' | 'destructive';

  if (score >= 6) {
    banda = 'Evaluación recomendada';
    descripcion = 'Tu puntuación sugiere la presencia de rasgos asociados al espectro autista. Se recomienda buscar una evaluación profesional completa para un análisis más detallado.';
    color = 'destructive';
  } else if (score >= 4) {
    banda = 'Algunos rasgos presentes';
    descripcion = 'Tu puntuación indica la presencia de algunos rasgos que pueden estar asociados al espectro autista. Podrías considerar una evaluación si experimentas dificultades en tu vida diaria.';
    color = 'warning';
  } else {
    banda = 'Bajo riesgo';
    descripcion = 'Tu puntuación no indica una probabilidad significativa de estar en el espectro autista. Esto no descarta completamente la posibilidad, pero sugiere un bajo riesgo.';
    color = 'success';
  }

  return {
    puntuacion: score,
    maxPuntuacion: maxScore,
    banda,
    descripcion,
    color,
  };
};

const testConfig: TestConfig = {
  id: 'tea-aq10',
  name: 'AQ-10 - Screening TEA',
  fullName: 'Cociente del Espectro Autista - 10 ítems (AQ-10)',
  description: 'Cuestionario breve validado para identificar rasgos del espectro autista en adultos.',
  instructions: 'Lee cada afirmación e indica tu grado de acuerdo. Responde basándote en cómo eres habitualmente, no en situaciones puntuales. No hay respuestas correctas o incorrectas.',
  questions,
  calculateResult,
  disclaimer: 'Este test está basado en el AQ-10 del Autism Research Centre de Cambridge. Es una herramienta de screening, no un diagnóstico. Solo un profesional especializado puede realizar un diagnóstico de TEA.',
};

export default function TEAAQ10Test() {
  return <TestPage config={testConfig} />;
}
