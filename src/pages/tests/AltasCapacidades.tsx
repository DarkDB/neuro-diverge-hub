import { useState } from 'react';
import { TestPage, TestConfig, TestQuestion, TestResult } from '@/components/tests/TestPage';
import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, User, Baby } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Opciones comunes ───

const frecuenciaOptions = [
  { value: 0, label: 'Nunca o casi nunca' },
  { value: 1, label: 'Pocas veces' },
  { value: 2, label: 'A veces' },
  { value: 3, label: 'Con frecuencia' },
  { value: 4, label: 'Siempre o casi siempre' },
];

// ─── TEST ADULTOS ───
// Screening basado en características comunes de AACC en adultos:
// intensidad intelectual, sobreexcitabilidades de Dabrowski, disincronía, creatividad

const adultQuestions: TestQuestion[] = [
  { id: 1, text: '¿Sientes una necesidad constante de aprender cosas nuevas o profundizar en temas que te interesan?', options: frecuenciaOptions },
  { id: 2, text: '¿Te resulta difícil tolerar las injusticias o la incoherencia en tu entorno?', options: frecuenciaOptions },
  { id: 3, text: '¿Sientes las emociones con una intensidad que a veces te desborda o que los demás no parecen experimentar?', options: frecuenciaOptions },
  { id: 4, text: '¿Tiendes a ver conexiones entre ideas o conceptos que otros no perciben?', options: frecuenciaOptions },
  { id: 5, text: '¿Te has sentido diferente a los demás desde la infancia, como si no "encajaras" del todo?', options: frecuenciaOptions },
  { id: 6, text: '¿Sueles cuestionar normas, reglas o formas de hacer las cosas que otros aceptan sin más?', options: frecuenciaOptions },
  { id: 7, text: '¿Necesitas poco tiempo para comprender conceptos nuevos o aprender habilidades complejas?', options: frecuenciaOptions },
  { id: 8, text: '¿Te aburres con facilidad si una tarea es repetitiva o no supone un reto intelectual?', options: frecuenciaOptions },
  { id: 9, text: '¿Tienes una imaginación muy activa o mundos internos ricos en los que te sumerges?', options: frecuenciaOptions },
  { id: 10, text: '¿Eres especialmente sensible a los estímulos sensoriales (ruidos, luces, texturas)?', options: frecuenciaOptions },
  { id: 11, text: '¿Tiendes al perfeccionismo hasta el punto de que puede paralizarte o generarte frustración?', options: frecuenciaOptions },
  { id: 12, text: '¿Tienes o has tenido muchos intereses simultáneos que te cuesta priorizar?', options: frecuenciaOptions },
  { id: 13, text: '¿Tu sentido del humor es peculiar, irónico o basado en juegos de palabras que no todos captan?', options: frecuenciaOptions },
  { id: 14, text: '¿Desde pequeño/a aprendiste a leer, escribir o hacer cálculos antes que la mayoría de tus compañeros?', options: frecuenciaOptions },
  { id: 15, text: '¿Experimentas una empatía muy intensa, sintiendo profundamente el sufrimiento ajeno?', options: frecuenciaOptions },
  { id: 16, text: '¿Te cuesta relacionarte con personas que no comparten tu nivel de profundidad intelectual o emocional?', options: frecuenciaOptions },
  { id: 17, text: '¿Tiendes a pensar de forma divergente, encontrando soluciones originales o no convencionales?', options: frecuenciaOptions },
  { id: 18, text: '¿Has experimentado la sensación del "síndrome del impostor" a pesar de tus logros?', options: frecuenciaOptions },
  { id: 19, text: '¿Te resulta difícil desconectar la mente, como si siempre estuviera procesando información?', options: frecuenciaOptions },
  { id: 20, text: '¿Sientes una profunda necesidad de coherencia y autenticidad en tus relaciones y en tu vida?', options: frecuenciaOptions },
];

const calculateAdultResult = (answers: Record<number, number>): TestResult => {
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const maxScore = 80; // 20 × 4

  let banda: string;
  let descripcion: string;
  let color: 'success' | 'warning' | 'destructive';

  if (totalScore >= 60) {
    banda = 'Alta compatibilidad con perfil AACC';
    descripcion = 'Tus respuestas muestran una alta coincidencia con las características habituales de las altas capacidades. Te recomendamos buscar una evaluación profesional para conocer mejor tu perfil.';
    color = 'destructive';
  } else if (totalScore >= 40) {
    banda = 'Compatibilidad moderada';
    descripcion = 'Presentas varias características asociadas a las altas capacidades. Explorar este camino con un profesional podría ayudarte a comprenderte mejor.';
    color = 'warning';
  } else {
    banda = 'Baja compatibilidad';
    descripcion = 'Tus respuestas no muestran un patrón claramente asociado a las altas capacidades, aunque esto no descarta su presencia. Si sientes que tu forma de pensar o sentir es diferente, consultar con un profesional siempre es una buena idea.';
    color = 'success';
  }

  return { puntuacion: totalScore, maxPuntuacion: maxScore, banda, descripcion, color };
};

const adultConfig: TestConfig = {
  id: 'aacc-adultos',
  name: 'Screening AACC - Adultos',
  fullName: 'Screening de Altas Capacidades en Adultos',
  description: 'Evaluación orientativa de rasgos asociados a las altas capacidades intelectuales en personas adultas.',
  instructions: 'Responde a cada pregunta pensando en cómo te sientes y te comportas habitualmente. No hay respuestas correctas o incorrectas. Sé lo más sincero/a posible contigo mismo/a.',
  questions: adultQuestions,
  calculateResult: calculateAdultResult,
  disclaimer: 'Este test es una herramienta de screening orientativo. Las altas capacidades son un perfil complejo que requiere una evaluación profesional integral (incluyendo pruebas cognitivas como la WAIS-IV/WISC-V) para su identificación formal.',
};

// ─── TEST INFANTIL (para padres) ───

const childQuestions: TestQuestion[] = [
  { id: 1, text: '¿Aprendió a hablar, leer o escribir antes que la mayoría de los niños/as de su edad?', options: frecuenciaOptions },
  { id: 2, text: '¿Hace preguntas inusuales o sorprendentemente profundas para su edad?', options: frecuenciaOptions },
  { id: 3, text: '¿Muestra una curiosidad intensa y persistente por temas específicos?', options: frecuenciaOptions },
  { id: 4, text: '¿Tiene un vocabulario muy amplio o utiliza palabras poco habituales para su edad?', options: frecuenciaOptions },
  { id: 5, text: '¿Se aburre o desconecta cuando las actividades escolares le resultan demasiado fáciles?', options: frecuenciaOptions },
  { id: 6, text: '¿Prefiere relacionarse con niños/as mayores o con adultos?', options: frecuenciaOptions },
  { id: 7, text: '¿Muestra una sensibilidad emocional inusualmente intensa (llora con facilidad ante injusticias, se emociona con la música, etc.)?', options: frecuenciaOptions },
  { id: 8, text: '¿Tiene una gran capacidad para memorizar datos, hechos o aprender de forma autodidacta?', options: frecuenciaOptions },
  { id: 9, text: '¿Cuestiona las normas o la autoridad pidiendo explicaciones lógicas?', options: frecuenciaOptions },
  { id: 10, text: '¿Es especialmente sensible a estímulos sensoriales (ruidos, etiquetas de ropa, olores)?', options: frecuenciaOptions },
  { id: 11, text: '¿Tiene una imaginación muy activa, inventa historias complejas o mundos de fantasía elaborados?', options: frecuenciaOptions },
  { id: 12, text: '¿Se frustra con facilidad cuando las cosas no le salen perfectas o cuando no puede lograr lo que imagina?', options: frecuenciaOptions },
  { id: 13, text: '¿Muestra un sentido del humor sofisticado o diferente al de otros niños/as de su edad?', options: frecuenciaOptions },
  { id: 14, text: '¿Tiene una capacidad de concentración muy alta cuando algo le interesa de verdad?', options: frecuenciaOptions },
  { id: 15, text: '¿Muestra preocupación por temas como la muerte, el universo, la justicia o los problemas del mundo?', options: frecuenciaOptions },
  { id: 16, text: '¿Se ha sentido diferente a sus compañeros/as o le cuesta encontrar amigos/as con intereses similares?', options: frecuenciaOptions },
  { id: 17, text: '¿Aprende nuevos conceptos con gran rapidez, a veces con una sola explicación?', options: frecuenciaOptions },
  { id: 18, text: '¿Tiene una gran energía física o mental, como si su mente nunca se detuviera?', options: frecuenciaOptions },
];

const calculateChildResult = (answers: Record<number, number>): TestResult => {
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const maxScore = 72; // 18 × 4

  let banda: string;
  let descripcion: string;
  let color: 'success' | 'warning' | 'destructive';

  if (totalScore >= 54) {
    banda = 'Alta compatibilidad con perfil AACC';
    descripcion = 'Las respuestas sugieren una alta coincidencia con las características habituales de las altas capacidades en la infancia. Recomendamos una evaluación profesional (WISC-V u otra prueba adecuada) para conocer mejor su perfil.';
    color = 'destructive';
  } else if (totalScore >= 36) {
    banda = 'Compatibilidad moderada';
    descripcion = 'Se observan varias características asociadas a las altas capacidades. Una evaluación profesional podría ayudar a entender mejor sus necesidades educativas y emocionales.';
    color = 'warning';
  } else {
    banda = 'Baja compatibilidad';
    descripcion = 'Las respuestas no muestran un patrón claramente asociado a las altas capacidades, aunque esto no lo descarta. Si observas diferencias en su forma de aprender o relacionarse, consultar con un profesional siempre puede ser útil.';
    color = 'success';
  }

  return { puntuacion: totalScore, maxPuntuacion: maxScore, banda, descripcion, color };
};

const childConfig: TestConfig = {
  id: 'aacc-infantil',
  name: 'Screening AACC - Infantil',
  fullName: 'Screening de Altas Capacidades en la Infancia (para padres/madres)',
  description: 'Cuestionario orientativo para que padres y madres identifiquen rasgos de altas capacidades en sus hijos/as.',
  instructions: 'Responde a cada pregunta pensando en el comportamiento habitual de tu hijo/a. No hay respuestas correctas o incorrectas. Intenta ser lo más objetivo/a posible.',
  questions: childQuestions,
  calculateResult: calculateChildResult,
  disclaimer: 'Este cuestionario es orientativo. La identificación de altas capacidades requiere una evaluación profesional completa que incluya pruebas estandarizadas (como la WISC-V), observación y entrevistas. Solo un profesional cualificado puede determinar la presencia de AACC.',
};

// ─── Componente selector ───

export default function AltasCapacidadesTest() {
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
            <SectionTitle as="h1" subtitle="Elige la versión del screening de altas capacidades que mejor se adapte a tu situación.">
              Screening de Altas Capacidades
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
                <h3 className="font-heading font-semibold text-lg mb-1">Para Adultos</h3>
                <p className="text-sm text-muted-foreground">
                  Autoevaluación de rasgos de altas capacidades: intensidad intelectual, emocional, sensibilidad y creatividad.
                </p>
                <p className="text-xs text-muted-foreground mt-1">20 preguntas · 8-12 min</p>
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
                <h3 className="font-heading font-semibold text-lg mb-1">Para Padres/Madres (sobre sus hijos/as)</h3>
                <p className="text-sm text-muted-foreground">
                  Cuestionario para identificar rasgos de AACC en niños/as: curiosidad, sensibilidad, aprendizaje precoz y más.
                </p>
                <p className="text-xs text-muted-foreground mt-1">18 preguntas · 7-10 min</p>
              </div>
            </div>
          </button>

          <ContentBlock variant="warning" className="mt-6">
            <div className="flex gap-4">
              <Sparkles className="w-6 h-6 text-warning-foreground shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Sobre las pruebas profesionales</h3>
                <p className="text-sm text-muted-foreground">
                  La evaluación profesional de AACC incluye pruebas estandarizadas como la <strong>WISC-V</strong> (niños) 
                  o la <strong>WAIS-IV</strong> (adultos), además de entrevistas y observación. Este screening es un 
                  primer paso orientativo que puede ayudarte a decidir si buscar esa evaluación formal.
                </p>
              </div>
            </div>
          </ContentBlock>
        </div>
      </div>
    </Layout>
  );
}
