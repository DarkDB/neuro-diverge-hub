import { Brain, Users, Lightbulb, Shield, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';

const neurodivergencias = [
  { name: 'TDAH', description: 'Trastorno por Déficit de Atención e Hiperactividad' },
  { name: 'TEA', description: 'Trastorno del Espectro Autista' },
  { name: 'AACC', description: 'Altas Capacidades Cognitivas' },
  { name: 'Dislexia', description: 'Dificultad en el procesamiento del lenguaje escrito' },
  { name: 'Discalculia', description: 'Dificultad en el procesamiento numérico' },
  { name: 'Dispraxia', description: 'Dificultad en la coordinación motora' },
];

const conceptos = [
  {
    icon: <Shield className="w-5 h-5" />,
    term: 'Masking',
    definition: 'Estrategia de camuflaje social donde una persona neurodivergente oculta o suprime sus rasgos naturales para encajar en entornos neurotípicos. Es agotador y puede causar burnout.',
  },
  {
    icon: <Brain className="w-5 h-5" />,
    term: 'Disfunción Ejecutiva',
    definition: 'Dificultad para planificar, organizar, iniciar tareas y regular el comportamiento. Afecta la gestión del tiempo, la toma de decisiones y la memoria de trabajo.',
  },
  {
    icon: <Lightbulb className="w-5 h-5" />,
    term: 'Sensorialidad',
    definition: 'Diferencias en cómo se procesan los estímulos sensoriales. Puede incluir hipersensibilidad (sobrecarga) o hiposensibilidad (búsqueda de estímulos) a sonidos, luces, texturas, etc.',
  },
];

const mitos = [
  {
    mito: 'La neurodivergencia es una enfermedad que hay que curar',
    realidad: 'Es una variación natural del cerebro humano. No necesita cura, sino comprensión y adaptaciones.',
    esVerdad: false,
  },
  {
    mito: 'Solo los niños pueden ser neurodivergentes',
    realidad: 'La neurodivergencia es para toda la vida. Muchos adultos descubren su condición tarde.',
    esVerdad: false,
  },
  {
    mito: 'Las personas neurodivergentes no pueden tener éxito',
    realidad: 'Con los apoyos adecuados, las personas neurodivergentes pueden destacar en múltiples áreas.',
    esVerdad: false,
  },
  {
    mito: 'Cada persona neurodivergente es diferente',
    realidad: 'Cada cerebro es único. No hay dos personas con TDAH o TEA exactamente iguales.',
    esVerdad: true,
  },
];

export default function QueEsNeurodivergencia() {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-20">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <SectionTitle
              as="h1"
              align="center"
              subtitle="Comprender la diversidad neurológica es el primer paso hacia la aceptación y el autoconocimiento."
            >
              ¿Qué es la Neurodivergencia?
            </SectionTitle>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12 space-y-16">
        {/* Definición */}
        <section className="sensory-friendly">
          <ContentBlock>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-heading font-semibold text-xl">Neurotípico</h2>
                </div>
                <p className="text-muted-foreground">
                  Describe a personas cuyo funcionamiento cerebral se alinea con lo que se considera 
                  "típico" o "estándar" en la sociedad. Sus patrones cognitivos, emocionales y de 
                  comportamiento se ajustan a las normas sociales establecidas.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-heading font-semibold text-xl">Neurodivergente</h2>
                </div>
                <p className="text-muted-foreground">
                  Describe a personas cuyo cerebro funciona de manera diferente a la norma estadística. 
                  Esto incluye diferencias en el aprendizaje, la atención, las interacciones sociales 
                  y el procesamiento sensorial. No es un déficit, sino una diferencia.
                </p>
              </div>
            </div>
          </ContentBlock>
        </section>

        {/* Tipos de Neurodivergencias */}
        <section className="sensory-friendly">
          <SectionTitle as="h2" subtitle="Condiciones que forman parte del paraguas de la neurodivergencia">
            Tipos de Neurodivergencias
          </SectionTitle>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {neurodivergencias.map((item, index) => (
              <div 
                key={item.name}
                className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="font-heading font-semibold text-lg text-primary mb-2">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Conceptos Clave */}
        <section className="sensory-friendly">
          <SectionTitle as="h2" subtitle="Términos importantes para entender la experiencia neurodivergente">
            Conceptos Clave
          </SectionTitle>
          
          <div className="space-y-4">
            {conceptos.map((concepto, index) => (
              <ContentBlock 
                key={concepto.term}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-accent-foreground shrink-0">
                    {concepto.icon}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2">{concepto.term}</h3>
                    <p className="text-muted-foreground">{concepto.definition}</p>
                  </div>
                </div>
              </ContentBlock>
            ))}
          </div>
        </section>

        {/* Mitos Comunes */}
        <section className="sensory-friendly">
          <SectionTitle as="h2" subtitle="Desmontando creencias erróneas sobre la neurodivergencia">
            Mitos y Realidades
          </SectionTitle>
          
          <div className="space-y-4">
            {mitos.map((item, index) => (
              <ContentBlock 
                key={index}
                variant={item.esVerdad ? 'success' : 'warning'}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
              >
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    item.esVerdad ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning-foreground'
                  }`}>
                    {item.esVerdad ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-2">
                      "{item.mito}"
                    </p>
                    <p className="text-muted-foreground text-sm">
                      <strong className="text-foreground">{item.esVerdad ? 'Verdad: ' : 'Realidad: '}</strong>
                      {item.realidad}
                    </p>
                  </div>
                </div>
              </ContentBlock>
            ))}
          </div>
        </section>

        {/* Nota importante */}
        <section className="sensory-friendly">
          <ContentBlock variant="highlight">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-heading font-semibold text-lg mb-2">Nota Importante</h3>
                <p className="text-muted-foreground">
                  La información en esta página tiene fines educativos y de autoexploración. 
                  Solo un profesional de la salud cualificado puede realizar un diagnóstico formal. 
                  Si sospechas que podrías ser neurodivergente, te animamos a buscar una evaluación 
                  profesional con un especialista en neurodiversidad.
                </p>
              </div>
            </div>
          </ContentBlock>
        </section>
      </div>
    </Layout>
  );
}
