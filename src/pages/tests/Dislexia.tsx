import { TestPage, TestConfig, TestQuestion, TestResult } from '@/components/tests/TestPage';

// Adult Dyslexia Screening Test
// Based on validated adult dyslexia screening instruments

const frequencyOptions = [
  { value: 0, label: 'Rara vez o nunca' },
  { value: 1, label: 'A veces' },
  { value: 2, label: 'A menudo' },
  { value: 3, label: 'Muy frecuentemente' },
];

const difficultyOptions = [
  { value: 0, label: 'Fácil' },
  { value: 1, label: 'Algo difícil' },
  { value: 2, label: 'Difícil' },
  { value: 3, label: 'Muy difícil' },
];

const questions: TestQuestion[] = [
  {
    id: 1,
    text: '¿Confundes palabras visualmente similares al leer (como "coser" y "comer", o "calvo" y "clavo")?',
    options: frequencyOptions,
  },
  {
    id: 2,
    text: '¿Pierdes el punto o te saltas líneas al leer un texto?',
    options: frequencyOptions,
  },
  {
    id: 3,
    text: '¿Confundes los nombres de objetos similares (por ejemplo, "mesa" por "silla")?',
    options: frequencyOptions,
  },
  {
    id: 4,
    text: '¿Tienes problemas para distinguir la izquierda de la derecha?',
    options: frequencyOptions,
  },
  {
    id: 5,
    text: '¿Te resulta confusa la lectura de mapas o encontrar el camino a lugares nuevos?',
    options: frequencyOptions,
  },
  {
    id: 6,
    text: '¿Necesitas releer los párrafos varias veces para entenderlos completamente?',
    options: frequencyOptions,
  },
  {
    id: 7,
    text: '¿Te confundes cuando te dan varias instrucciones a la vez?',
    options: frequencyOptions,
  },
  {
    id: 8,
    text: '¿Cometes errores frecuentes de ortografía al escribir mensajes o correos?',
    options: frequencyOptions,
  },
  {
    id: 9,
    text: '¿Te resulta difícil encontrar la palabra adecuada cuando hablas o escribes?',
    options: frequencyOptions,
  },
  {
    id: 10,
    text: '¿Se te ocurren soluciones creativas o diferentes a los problemas?',
    options: [
      { value: 3, label: 'Rara vez' },
      { value: 2, label: 'A veces' },
      { value: 1, label: 'A menudo' },
      { value: 0, label: 'Muy frecuentemente' },
    ], // Reverse scored - creativity is common in dyslexia
  },
  {
    id: 11,
    text: '¿Qué tan difícil te resulta pronunciar palabras largas o desconocidas (como "otorrinolaringología")?',
    options: difficultyOptions,
  },
  {
    id: 12,
    text: 'Cuando escribes, ¿qué tan difícil te resulta organizar tus pensamientos en papel?',
    options: difficultyOptions,
  },
  {
    id: 13,
    text: '¿Qué tan difícil fue para ti aprender las tablas de multiplicar?',
    options: difficultyOptions,
  },
  {
    id: 14,
    text: '¿Qué tan difícil te resulta leer en voz alta con fluidez?',
    options: difficultyOptions,
  },
  {
    id: 15,
    text: '¿Evitas leer por placer o te resulta una tarea ardua?',
    options: frequencyOptions,
  },
];

const calculateResult = (answers: Record<number, number>): TestResult => {
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const maxScore = 45; // 15 questions * 3 max points

  let banda: string;
  let descripcion: string;
  let color: 'success' | 'warning' | 'destructive';

  // Scoring thresholds based on adult dyslexia screening research
  if (totalScore >= 30) {
    banda = 'Alta probabilidad';
    descripcion = 'Tu puntuación indica una alta probabilidad de dislexia. Se recomienda encarecidamente buscar una evaluación profesional completa con un especialista en dificultades de aprendizaje.';
    color = 'destructive';
  } else if (totalScore >= 20) {
    banda = 'Probabilidad moderada';
    descripcion = 'Tu puntuación sugiere la presencia de varios indicadores asociados a la dislexia. Sería beneficioso consultar con un profesional para una evaluación más detallada.';
    color = 'warning';
  } else if (totalScore >= 12) {
    banda = 'Algunos indicadores';
    descripcion = 'Tu puntuación muestra algunos indicadores que podrían estar relacionados con la dislexia. Si experimentas dificultades significativas en lectura o escritura, considera buscar orientación profesional.';
    color = 'warning';
  } else {
    banda = 'Bajo riesgo';
    descripcion = 'Tu puntuación no indica una probabilidad significativa de dislexia. Sin embargo, si experimentas dificultades persistentes con la lectura o escritura, no dudes en consultar con un especialista.';
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
  id: 'dislexia',
  name: 'Screening de Dislexia',
  fullName: 'Test de Screening de Dislexia para Adultos',
  description: 'Evaluación inicial de indicadores de dislexia en personas adultas.',
  instructions: 'Responde a cada pregunta pensando en tu experiencia habitual, no en situaciones excepcionales. Considera cómo te has sentido durante la mayor parte de tu vida. No hay respuestas correctas o incorrectas.',
  questions,
  calculateResult,
  disclaimer: 'Este test es una herramienta de screening orientativa. La dislexia es una condición compleja que requiere una evaluación profesional completa para su diagnóstico. Este cuestionario no sustituye una evaluación clínica.',
};

export default function DislexiaTest() {
  return <TestPage config={testConfig} />;
}
