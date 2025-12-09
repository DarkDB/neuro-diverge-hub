import { Link } from 'react-router-dom';
import { Brain, Compass, BookOpen, PenLine, ArrowRight, Sparkles, Heart, Users } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: '¿Qué es la Neurodivergencia?',
    description: 'Comprende los conceptos fundamentales, tipos de neurodivergencias y desmitifica creencias comunes.',
    href: '/que-es-neurodivergencia',
  },
  {
    icon: <Compass className="w-6 h-6" />,
    title: 'Mi Viaje de Autodescubrimiento',
    description: 'Una herramienta interactiva guiada por IA para explorar tu perfil neurodivergente personal.',
    href: '/autodescubrimiento',
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Recursos y Herramientas',
    description: 'Guías detalladas sobre TDAH, TEA, AACC, Dislexia y más. Tests de autoevaluación incluidos.',
    href: '/recursos',
  },
  {
    icon: <PenLine className="w-6 h-6" />,
    title: 'El Diario del Autodescubrimiento',
    description: 'Un blog con reflexiones, experiencias y conocimiento sobre el camino neurodivergente.',
    href: '/diario',
  },
];

const values = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'Diseño Accesible',
    description: 'Interfaz de baja carga sensorial, clara y estructurada.',
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: 'Enfoque Empático',
    description: 'Contenido creado con comprensión y respeto.',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Comunidad',
    description: 'Un espacio seguro para explorar y compartir.',
  },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24 lg:py-32">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Brain className="w-4 h-4" aria-hidden="true" />
              <span>Bienvenido a tu espacio</span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Descubre y Celebra tu{' '}
              <span className="text-primary">Mente Única</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Un espacio seguro para explorar la neurodiversidad. Comprende tu forma de pensar, 
              accede a recursos validados y conecta con una comunidad que entiende.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/autodescubrimiento">
                  Comenzar Mi Viaje
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/que-es-neurodivergencia">
                  Aprender Más
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing">
        <div className="container mx-auto">
          <SectionTitle 
            as="h2" 
            align="center"
            subtitle="Todo lo que necesitas para entender y explorar tu neurodivergencia"
          >
            Explora el Espacio
          </SectionTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {features.map((feature, index) => (
              <div 
                key={feature.href} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={value.title} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  {value.icon}
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
            <Compass className="w-12 h-12 text-primary mx-auto mb-6" aria-hidden="true" />
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-4">
              ¿Listo para Descubrirte?
            </h2>
            <p className="text-muted-foreground mb-6">
              Nuestro cuestionario interactivo te ayudará a explorar patrones y características 
              que podrían indicar una mente neurodivergente.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link to="/autodescubrimiento">
                Iniciar Cuestionario
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
