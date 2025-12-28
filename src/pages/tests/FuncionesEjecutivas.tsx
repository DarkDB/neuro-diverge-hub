import { TestPage, TestConfig, TestQuestion, TestResult } from '@/components/tests/TestPage';

// Executive Function Screening Test
// Based on BRIEF-A dimensions for adult executive function assessment

const frequencyOptions = [
  { value: 0, label: 'Nunca' },
  { value: 1, label: 'A veces' },
  { value: 2, label: 'A menudo' },
  { value: 3, label: 'Siempre o casi siempre' },
];

const questions: TestQuestion[] = [
  // Inhibición
  {
    id: 1,
    text: '¿Actúas impulsivamente sin pensar en las consecuencias?',
    options: frequencyOptions,
  },
  {
    id: 2,
    text: '¿Interrumpes a otros cuando están hablando?',
    options: frequencyOptions,
  },
  {
    id: 3,
    text: '¿Tienes dificultad para controlar tus reacciones emocionales?',
    options: frequencyOptions,
  },
  // Flexibilidad
  {
    id: 4,
    text: '¿Te molestan los cambios inesperados en tu rutina?',
    options: frequencyOptions,
  },
  {
    id: 5,
    text: '¿Te cuesta cambiar de una actividad a otra?',
    options: frequencyOptions,
  },
  {
    id: 6,
    text: '¿Te quedas "atascado/a" en un tema o tarea y te cuesta dejarlo?',
    options: frequencyOptions,
  },
  // Automonitoreo
  {
    id: 7,
    text: '¿No te das cuenta de cómo tu comportamiento afecta a los demás?',
    options: frequencyOptions,
  },
  {
    id: 8,
    text: '¿Tienes dificultad para darte cuenta de tus propios errores?',
    options: frequencyOptions,
  },
  // Iniciación
  {
    id: 9,
    text: '¿Te cuesta empezar tareas o proyectos por tu cuenta?',
    options: frequencyOptions,
  },
  {
    id: 10,
    text: '¿Necesitas que alguien te presione para comenzar las cosas?',
    options: frequencyOptions,
  },
  // Memoria de trabajo
  {
    id: 11,
    text: '¿Olvidas lo que ibas a hacer cuando entras en una habitación?',
    options: frequencyOptions,
  },
  {
    id: 12,
    text: '¿Tienes problemas para recordar varias instrucciones a la vez?',
    options: frequencyOptions,
  },
  {
    id: 13,
    text: '¿Pierdes el hilo de lo que estás haciendo si te interrumpen?',
    options: frequencyOptions,
  },
  // Planificación/Organización
  {
    id: 14,
    text: '¿Te cuesta planificar los pasos necesarios para completar una tarea?',
    options: frequencyOptions,
  },
  {
    id: 15,
    text: '¿Tienes dificultad para establecer prioridades?',
    options: frequencyOptions,
  },
  {
    id: 16,
    text: '¿Tu espacio de trabajo o casa suele estar desorganizado?',
    options: frequencyOptions,
  },
  // Organización de materiales
  {
    id: 17,
    text: '¿Pierdes o extravías objetos importantes con frecuencia (llaves, cartera, móvil)?',
    options: frequencyOptions,
  },
  {
    id: 18,
    text: '¿Tienes dificultad para mantener tus pertenencias ordenadas?',
    options: frequencyOptions,
  },
  // Monitoreo de tareas
  {
    id: 19,
    text: '¿Cometes errores por descuido en tu trabajo o actividades?',
    options: frequencyOptions,
  },
  {
    id: 20,
    text: '¿Tienes dificultad para terminar tareas o proyectos a tiempo?',
    options: frequencyOptions,
  },
];

const calculateResult = (answers: Record<number, number>): TestResult => {
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const maxScore = 60; // 20 questions * 3 max points

  // Calculate subscale scores for more detailed analysis
  const inhibitionScore = (answers[1] || 0) + (answers[2] || 0) + (answers[3] || 0);
  const flexibilityScore = (answers[4] || 0) + (answers[5] || 0) + (answers[6] || 0);
  const workingMemoryScore = (answers[11] || 0) + (answers[12] || 0) + (answers[13] || 0);
  const planningScore = (answers[14] || 0) + (answers[15] || 0) + (answers[16] || 0);

  let banda: string;
  let descripcion: string;
  let color: 'success' | 'warning' | 'destructive';

  if (totalScore >= 40) {
    banda = 'Dificultades significativas';
    descripcion = 'Tu puntuación indica dificultades significativas en las funciones ejecutivas. Esto puede afectar tu capacidad de planificación, organización y autorregulación. Se recomienda una evaluación profesional.';
    color = 'destructive';
  } else if (totalScore >= 28) {
    banda = 'Dificultades moderadas';
    descripcion = 'Tu puntuación sugiere algunas dificultades en el funcionamiento ejecutivo. Podrías beneficiarte de estrategias de organización y, posiblemente, de una evaluación más detallada.';
    color = 'warning';
  } else if (totalScore >= 16) {
    banda = 'Dificultades leves';
    descripcion = 'Tu puntuación indica algunas áreas donde podrías mejorar tu funcionamiento ejecutivo. Estas dificultades son comunes y pueden manejarse con estrategias apropiadas.';
    color = 'warning';
  } else {
    banda = 'Funcionamiento adecuado';
    descripcion = 'Tu puntuación sugiere un buen funcionamiento ejecutivo general. No se identifican dificultades significativas en planificación, organización o autorregulación.';
    color = 'success';
  }

  // Add subscale insights to description
  const areas: string[] = [];
  if (inhibitionScore >= 6) areas.push('inhibición');
  if (flexibilityScore >= 6) areas.push('flexibilidad');
  if (workingMemoryScore >= 6) areas.push('memoria de trabajo');
  if (planningScore >= 6) areas.push('planificación');

  if (areas.length > 0 && totalScore >= 16) {
    descripcion += ` Las áreas donde muestras más dificultad son: ${areas.join(', ')}.`;
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
  id: 'funciones-ejecutivas',
  name: 'Funciones Ejecutivas',
  fullName: 'Screening de Funciones Ejecutivas en Adultos',
  description: 'Evalúa dificultades en planificación, organización, memoria de trabajo y autorregulación.',
  instructions: 'Responde pensando en cómo te comportas habitualmente en tu vida diaria, durante los últimos meses. No hay respuestas correctas o incorrectas. Sé lo más honesto/a posible.',
  questions,
  calculateResult,
  disclaimer: 'Este test evalúa aspectos del funcionamiento ejecutivo basado en dimensiones del BRIEF-A. Es una herramienta de orientación, no un diagnóstico. Las dificultades en funciones ejecutivas pueden estar asociadas a diversas condiciones como TDAH, lesiones cerebrales o estrés. Consulta con un profesional para una evaluación completa.',
};

export default function FuncionesEjecutivasTest() {
  return <TestPage config={testConfig} />;
}
