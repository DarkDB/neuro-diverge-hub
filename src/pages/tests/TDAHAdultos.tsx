import { useState } from 'react';
import { TestPage, TestConfig, TestQuestion, TestResult } from '@/components/tests/TestPage';
import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { ArrowLeft, User, Baby, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Opciones comunes ───

const standardOptions = [
  { value: 0, label: 'Nunca' },
  { value: 1, label: 'Raramente' },
  { value: 2, label: 'A veces' },
  { value: 3, label: 'A menudo' },
  { value: 4, label: 'Muy a menudo' },
];

// ═══════════════════════════════════════════════════
// TEST ADULTOS — ASRS v1.1
// ═══════════════════════════════════════════════════

const adultQuestions: TestQuestion[] = [
  { id: 1, text: '¿Con qué frecuencia tienes problemas para terminar los detalles finales de un proyecto, una vez que las partes difíciles ya están hechas?', options: standardOptions },
  { id: 2, text: '¿Con qué frecuencia tienes dificultad para poner las cosas en orden cuando tienes que hacer una tarea que requiere organización?', options: standardOptions },
  { id: 3, text: '¿Con qué frecuencia tienes problemas para recordar citas u obligaciones?', options: standardOptions },
  { id: 4, text: 'Cuando tienes una tarea que requiere mucha concentración, ¿con qué frecuencia evitas o retrasas comenzarla?', options: standardOptions },
  { id: 5, text: '¿Con qué frecuencia mueves o retuerces las manos o los pies cuando tienes que permanecer sentado/a mucho tiempo?', options: standardOptions },
  { id: 6, text: '¿Con qué frecuencia te sientes excesivamente activo/a e impulsado/a a hacer cosas, como si tuvieras un motor dentro?', options: standardOptions },
  { id: 7, text: '¿Con qué frecuencia cometes errores por descuido cuando trabajas en un proyecto aburrido o difícil?', options: standardOptions },
  { id: 8, text: '¿Con qué frecuencia tienes dificultad para mantener la atención cuando haces un trabajo aburrido o repetitivo?', options: standardOptions },
  { id: 9, text: '¿Con qué frecuencia tienes dificultad para concentrarte en lo que te dice la gente, incluso cuando te hablan directamente?', options: standardOptions },
  { id: 10, text: '¿Con qué frecuencia extravías o tienes dificultad para encontrar cosas en casa o en el trabajo?', options: standardOptions },
  { id: 11, text: '¿Con qué frecuencia te distrae la actividad o el ruido a tu alrededor?', options: standardOptions },
  { id: 12, text: '¿Con qué frecuencia te levantas de tu asiento en reuniones u otras situaciones en las que se espera que permanezcas sentado/a?', options: standardOptions },
  { id: 13, text: '¿Con qué frecuencia te sientes inquieto/a o nervioso/a?', options: standardOptions },
  { id: 14, text: '¿Con qué frecuencia tienes dificultad para relajarte cuando tienes tiempo libre?', options: standardOptions },
  { id: 15, text: '¿Con qué frecuencia hablas demasiado cuando estás en situaciones sociales?', options: standardOptions },
  { id: 16, text: 'Cuando estás en una conversación, ¿con qué frecuencia terminas las frases de las personas antes de que ellas puedan hacerlo?', options: standardOptions },
  { id: 17, text: '¿Con qué frecuencia tienes dificultad para esperar tu turno en situaciones donde se requiere?', options: standardOptions },
  { id: 18, text: '¿Con qué frecuencia interrumpes a otros cuando están ocupados?', options: standardOptions },
];

const calculateAdultResult = (answers: Record<number, number>): TestResult => {
  let partAScore = 0;
  const partAThresholds: Record<number, number> = { 1: 2, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3 };

  for (let i = 1; i <= 6; i++) {
    if (answers[i] >= partAThresholds[i]) partAScore++;
  }

  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const maxScore = 72;

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

  return { puntuacion: totalScore, maxPuntuacion: maxScore, banda, descripcion, color };
};

const adultConfig: TestConfig = {
  id: 'tdah-adultos',
  name: 'ASRS v1.1 - TDAH en Adultos',
  fullName: 'Escala de Autorreporte de TDAH en Adultos (ASRS v1.1)',
  description: 'Test de screening validado por la OMS para identificar síntomas de TDAH en personas adultas.',
  instructions: 'Responde a cada pregunta considerando cómo te has sentido y comportado durante los últimos 6 meses. No hay respuestas correctas o incorrectas. Sé lo más honesto/a posible.',
  questions: adultQuestions,
  calculateResult: calculateAdultResult,
  disclaimer: 'Este test es una herramienta de screening basada en el ASRS v1.1 de la OMS. No constituye un diagnóstico. Solo un profesional de salud mental cualificado puede diagnosticar el TDAH.',
};

// ═══════════════════════════════════════════════════
// TEST INFANTIL — SNAP-IV (para padres/madres/tutores)
// Basado en criterios DSM-5 adaptados para niños/as
// ═══════════════════════════════════════════════════

const childOptions = [
  { value: 0, label: 'Nada' },
  { value: 1, label: 'Un poco' },
  { value: 2, label: 'Bastante' },
  { value: 3, label: 'Mucho' },
];

const childQuestions: TestQuestion[] = [
  // Inatención (1-9)
  { id: 1, text: '¿No presta atención suficiente a los detalles o comete errores por descuido en las tareas escolares u otras actividades?', options: childOptions },
  { id: 2, text: '¿Tiene dificultad para mantener la atención en tareas o actividades de juego?', options: childOptions },
  { id: 3, text: '¿Parece no escuchar cuando se le habla directamente?', options: childOptions },
  { id: 4, text: '¿No sigue las instrucciones y no termina las tareas escolares o los encargos?', options: childOptions },
  { id: 5, text: '¿Tiene dificultad para organizar tareas y actividades?', options: childOptions },
  { id: 6, text: '¿Evita o le disgustan las tareas que requieren un esfuerzo mental sostenido (deberes, lecturas)?', options: childOptions },
  { id: 7, text: '¿Pierde cosas necesarias para tareas y actividades (juguetes, material escolar, lápices)?', options: childOptions },
  { id: 8, text: '¿Se distrae fácilmente por estímulos irrelevantes?', options: childOptions },
  { id: 9, text: '¿Es descuidado/a en las actividades diarias?', options: childOptions },
  // Hiperactividad-Impulsividad (10-18)
  { id: 10, text: '¿Mueve en exceso manos o pies, o se remueve en el asiento?', options: childOptions },
  { id: 11, text: '¿Se levanta de la silla cuando debería permanecer sentado/a?', options: childOptions },
  { id: 12, text: '¿Corre o salta excesivamente en situaciones inapropiadas?', options: childOptions },
  { id: 13, text: '¿Tiene dificultad para jugar o participar en actividades de ocio tranquilamente?', options: childOptions },
  { id: 14, text: '¿Actúa como si estuviera "impulsado/a por un motor" o no para quieto/a?', options: childOptions },
  { id: 15, text: '¿Habla en exceso?', options: childOptions },
  { id: 16, text: '¿Responde antes de que se hayan completado las preguntas (precipita respuestas)?', options: childOptions },
  { id: 17, text: '¿Tiene dificultad para guardar turno?', options: childOptions },
  { id: 18, text: '¿Interrumpe o se inmiscuye en las actividades de otros (conversaciones, juegos)?', options: childOptions },
];

const calculateChildResult = (answers: Record<number, number>): TestResult => {
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const maxScore = 54; // 18 × 3

  // Subscale scores
  const inatencionScore = [1,2,3,4,5,6,7,8,9].reduce((sum, id) => sum + (answers[id] || 0), 0);
  const hiperactividadScore = [10,11,12,13,14,15,16,17,18].reduce((sum, id) => sum + (answers[id] || 0), 0);

  // Average per item (SNAP-IV clinical threshold is ~1.44 per item for clinical concern)
  const inatencionAvg = inatencionScore / 9;
  const hiperactividadAvg = hiperactividadScore / 9;
  const totalAvg = totalScore / 18;

  let banda: string;
  let descripcion: string;
  let color: 'success' | 'warning' | 'destructive';

  if (inatencionAvg >= 2 || hiperactividadAvg >= 2 || totalAvg >= 1.8) {
    banda = 'Indicadores significativos';
    descripcion = `Las respuestas sugieren indicadores significativos de TDAH. Inatención: ${inatencionScore}/27, Hiperactividad-Impulsividad: ${hiperactividadScore}/27. Se recomienda una evaluación profesional completa.`;
    color = 'destructive';
  } else if (inatencionAvg >= 1.4 || hiperactividadAvg >= 1.4 || totalAvg >= 1.2) {
    banda = 'Indicadores moderados';
    descripcion = `Se observan indicadores moderados. Inatención: ${inatencionScore}/27, Hiperactividad-Impulsividad: ${hiperactividadScore}/27. Podría ser beneficioso consultar con un especialista.`;
    color = 'warning';
  } else {
    banda = 'Indicadores bajos';
    descripcion = `Las respuestas no sugieren indicadores significativos de TDAH. Inatención: ${inatencionScore}/27, Hiperactividad-Impulsividad: ${hiperactividadScore}/27. Si persisten las preocupaciones, consulte con un profesional.`;
    color = 'success';
  }

  return { puntuacion: totalScore, maxPuntuacion: maxScore, banda, descripcion, color };
};

const childConfig: TestConfig = {
  id: 'tdah-infantil',
  name: 'SNAP-IV - TDAH Infantil',
  fullName: 'Escala SNAP-IV de Screening de TDAH Infantil (para padres/madres)',
  description: 'Cuestionario para padres y madres basado en criterios DSM-5 para identificar síntomas de TDAH en niños y niñas.',
  instructions: 'Responde a cada pregunta pensando en el comportamiento habitual de tu hijo/a durante los últimos 6 meses. Compara con otros niños/as de su misma edad. No hay respuestas correctas o incorrectas.',
  questions: childQuestions,
  calculateResult: calculateChildResult,
  disclaimer: 'Este cuestionario es una herramienta de screening orientativo basada en la escala SNAP-IV. No constituye un diagnóstico. Solo un profesional de salud mental cualificado puede diagnosticar el TDAH. La evaluación clínica incluye entrevistas, observación y pruebas adicionales.',
};

// ─── Componente selector ───

export default function TDAHAdultosTest() {
  const [version, setVersion] = useState<'selector' | 'adultos' | 'infantil'>('selector');

  if (version === 'adultos') return <TestPage config={adultConfig} />;
  if (version === 'infantil') return <TestPage config={childConfig} />;

  return (
    <Layout>
      <section className="hero-gradient py-12 md:py-16">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/tests"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Tests
            </Link>
            <SectionTitle as="h1" subtitle="Elige la versión del screening de TDAH que mejor se adapte a tu situación.">
              Screening de TDAH
            </SectionTitle>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-4">
          <button
            onClick={() => setVersion('adultos')}
            className="group block w-full p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg mb-1">Para Adultos (ASRS v1.1)</h3>
                <p className="text-sm text-muted-foreground">
                  Escala de autorreporte validada por la OMS para identificar síntomas de TDAH en personas adultas.
                </p>
                <p className="text-xs text-muted-foreground mt-1">18 preguntas · 5-10 min</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setVersion('infantil')}
            className="group block w-full p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-accent/50 flex items-center justify-center shrink-0">
                <Baby className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg mb-1">Para Niños/as (SNAP-IV, para padres)</h3>
                <p className="text-sm text-muted-foreground">
                  Cuestionario para padres/madres basado en criterios DSM-5. Evalúa inatención e hiperactividad-impulsividad.
                </p>
                <p className="text-xs text-muted-foreground mt-1">18 preguntas · 5-10 min</p>
              </div>
            </div>
          </button>

          <ContentBlock variant="warning" className="mt-6">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-warning-foreground shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Sobre el diagnóstico de TDAH</h3>
                <p className="text-sm text-muted-foreground">
                  El diagnóstico de TDAH requiere una evaluación clínica completa que incluye entrevistas, 
                  observación conductual, y a menudo pruebas neuropsicológicas. Estos screenings son un 
                  primer paso orientativo que puede ayudarte a decidir si buscar esa evaluación profesional.
                </p>
              </div>
            </div>
          </ContentBlock>
        </div>
      </div>
    </Layout>
  );
}
