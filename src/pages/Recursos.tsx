import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Brain, Zap, Sparkles, BookMarked, Calculator, Move } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { Button } from '@/components/ui/button';
import { DownloadableResourcesSection } from '@/components/resources/DownloadableResourcesSection';

const neurodivergencias = [
  {
    icon: <Zap className="w-6 h-6" />,
    name: 'TDAH',
    fullName: 'Trastorno por Déficit de Atención e Hiperactividad',
    description: 'Diferencias en la atención, impulsividad y regulación de la energía que afectan el funcionamiento diario.',
    href: '/recursos/tdah',
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    name: 'TEA',
    fullName: 'Trastorno del Espectro Autista',
    description: 'Diferencias en la comunicación social, patrones de comportamiento e intereses intensos.',
    href: '/recursos/tea',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    name: 'AACC',
    fullName: 'Altas Capacidades Cognitivas',
    description: 'Capacidad intelectual significativamente superior a la media, con características específicas.',
    href: '/recursos/aacc',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
  {
    icon: <BookMarked className="w-6 h-6" />,
    name: 'Dislexia',
    fullName: 'Dificultad en el procesamiento del lenguaje escrito',
    description: 'Diferencias en el procesamiento de la lectura y escritura que no afectan la inteligencia.',
    href: '/recursos/dislexia',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400',
  },
  {
    icon: <Calculator className="w-6 h-6" />,
    name: 'Discalculia',
    fullName: 'Dificultad en el procesamiento numérico',
    description: 'Diferencias en la comprensión y manipulación de conceptos matemáticos.',
    href: '/recursos/discalculia',
    color: 'bg-red-500/10 text-red-600 dark:text-red-400',
  },
  {
    icon: <Move className="w-6 h-6" />,
    name: 'Dispraxia',
    fullName: 'Dificultad en la coordinación motora',
    description: 'Diferencias en la planificación y coordinación de movimientos físicos.',
    href: '/recursos/dispraxia',
    color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  },
];

export default function Recursos() {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-20">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              <span>Biblioteca de Recursos</span>
            </div>
            <SectionTitle
              as="h1"
              align="center"
              subtitle="Guías completas sobre cada tipo de neurodivergencia, con información adaptada por edad y género."
            >
              Recursos y Herramientas
            </SectionTitle>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12">
        {/* Neurodivergencias Grid */}
        <section className="mb-16">
          <SectionTitle as="h2" subtitle="Explora cada condición en profundidad">
            Guías por Neurodivergencia
          </SectionTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {neurodivergencias.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className="group block p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all animate-fade-in focus-ring"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-heading font-semibold text-xl mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.fullName}</p>
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                  <span>Leer más</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Downloadable Resources Section */}
        <DownloadableResourcesSection />

        {/* Tests Section */}
        <section className="mb-16">
          <ContentBlock className="text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading font-semibold text-2xl mb-4">
                Tests de Autoevaluación
              </h2>
              <p className="text-muted-foreground mb-6">
                Herramientas de screening validadas para explorar diferentes características 
                neurodivergentes. Gratuitos con opción de análisis detallado.
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link to="/tests">
                  Ver Tests Disponibles
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </ContentBlock>
        </section>

        {/* 2E Section */}
        <section>
          <ContentBlock variant="highlight">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <span className="font-heading font-bold text-2xl text-primary">2E</span>
              </div>
              <div className="text-center md:text-left">
                <h2 className="font-heading font-semibold text-xl mb-2">
                  Doble Excepcionalidad (2E)
                </h2>
                <p className="text-muted-foreground">
                  Cuando las altas capacidades se combinan con otra neurodivergencia como TDAH o TEA, 
                  se produce una doble excepcionalidad que requiere un enfoque único. 
                  Explora nuestros recursos especializados en AACC para más información.
                </p>
              </div>
              <Button asChild variant="outline" className="shrink-0">
                <Link to="/recursos/aacc">
                  Más sobre 2E
                </Link>
              </Button>
            </div>
          </ContentBlock>
        </section>
      </div>
    </Layout>
  );
}
