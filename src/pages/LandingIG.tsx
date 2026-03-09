import { useState, useEffect } from 'react';
import { Brain, Zap, ArrowRight, CheckCircle, Download, Star, Shield, Clock, Sparkles, Heart, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

// Quiz questions that subtly segment TDAH vs TEA
const quizQuestions = [
  {
    question: '¿Cuál de estas situaciones te resulta más familiar?',
    options: [
      { text: 'Me cuesta concentrarme en una tarea sin saltar a otra constantemente', score: { tdah: 2, tea: 0 } },
      { text: 'Me resulta difícil interpretar lo que los demás esperan de mí socialmente', score: { tdah: 0, tea: 2 } },
      { text: 'Me siento abrumado/a por estímulos del entorno (ruidos, luces, texturas)', score: { tdah: 1, tea: 2 } },
      { text: 'A menudo pierdo cosas, olvido citas o llego tarde sin querer', score: { tdah: 2, tea: 0 } },
    ],
  },
  {
    question: '¿Cómo describirías tu relación con las rutinas?',
    options: [
      { text: 'Me cuesta mucho seguir rutinas, me aburro y las abandono', score: { tdah: 2, tea: 0 } },
      { text: 'Necesito rutinas claras; los cambios inesperados me generan mucha ansiedad', score: { tdah: 0, tea: 2 } },
      { text: 'Depende del día — a veces las necesito, a veces me asfixian', score: { tdah: 1, tea: 1 } },
    ],
  },
  {
    question: 'En una conversación grupal, ¿qué te ocurre más a menudo?',
    options: [
      { text: 'Interrumpo sin querer porque las ideas me vienen a la cabeza y temo olvidarlas', score: { tdah: 2, tea: 0 } },
      { text: 'Me cuesta saber cuándo es mi turno o qué tono usar', score: { tdah: 0, tea: 2 } },
      { text: 'Me desconecto mentalmente y pierdo el hilo de la conversación', score: { tdah: 2, tea: 1 } },
    ],
  },
  {
    question: '¿Qué tipo de intereses describes mejor?',
    options: [
      { text: 'Tengo muchos intereses, pero salto de uno a otro con frecuencia', score: { tdah: 2, tea: 0 } },
      { text: 'Tengo uno o pocos intereses muy intensos en los que puedo pasar horas', score: { tdah: 0, tea: 2 } },
      { text: 'Cuando algo me atrapa puedo hiperfocalizarme durante horas y olvidar todo lo demás', score: { tdah: 2, tea: 1 } },
    ],
  },
  {
    question: '¿Cómo gestionas tus emociones?',
    options: [
      { text: 'Reacciono de forma impulsiva y después me arrepiento', score: { tdah: 2, tea: 0 } },
      { text: 'Siento las emociones muy intensamente pero me cuesta expresarlas', score: { tdah: 0, tea: 2 } },
      { text: 'Paso de 0 a 100 rápidamente y me cuesta volver a la calma', score: { tdah: 2, tea: 1 } },
    ],
  },
];

const testimonials = [
  { name: 'María G.', text: 'Por fin entiendo por qué mi cabeza funciona así. La guía me ayudó a dejar de sentirme rara y empezar a entenderme.', stars: 5 },
  { name: 'Carlos R.', text: 'Ojalá hubiera tenido esta información hace 10 años. Clara, directa y sin tecnicismos innecesarios.', stars: 5 },
  { name: 'Laura M.', text: 'Me identifiqué con casi todo. Es como si alguien hubiera puesto en palabras lo que yo no sabía explicar.', stars: 5 },
];

export default function LandingIG() {
  const [step, setStep] = useState<'hero' | 'quiz' | 'result'>('hero');
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ tdah: 0, tea: 0 });
  const [result, setResult] = useState<'tdah' | 'tea' | null>(null);
  const [downloadCount, setDownloadCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [resourceData, setResourceData] = useState<any>(null);

  // Fetch real download counts
  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase
        .from('downloadable_resources')
        .select('id, title, download_count, price_cents, neurodivergence_type, is_paid')
        .eq('is_active', true)
        .in('neurodivergence_type', ['tdah', 'tea']);
      
      if (data) {
        const total = data.reduce((sum, r) => sum + (r.download_count || 0), 0);
        setDownloadCount(total);
      }
    };
    fetchStats();
  }, []);

  // Fetch specific resource when result is determined
  useEffect(() => {
    if (!result) return;
    const fetchResource = async () => {
      const { data } = await supabase
        .from('downloadable_resources')
        .select('*')
        .eq('neurodivergence_type', result)
        .eq('is_active', true)
        .eq('is_paid', true)
        .limit(1)
        .maybeSingle();
      setResourceData(data);
    };
    fetchResource();
  }, [result]);

  const handleAnswer = (option: { score: { tdah: number; tea: number } }) => {
    const newScores = {
      tdah: scores.tdah + option.score.tdah,
      tea: scores.tea + option.score.tea,
    };
    setScores(newScores);

    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setResult(newScores.tdah >= newScores.tea ? 'tdah' : 'tea');
      setStep('result');
    }
  };

  const handlePurchase = async () => {
    if (!resourceData) return;
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke('create-resource-payment', {
        body: {
          resource_id: resourceData.id,
          resource_title: resourceData.title,
          price_cents: resourceData.price_cents,
        },
      });
      if (data?.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resultConfig = {
    tdah: {
      icon: <Zap className="w-8 h-8" />,
      title: 'Tu perfil apunta a características de TDAH',
      color: 'from-orange-500/20 to-amber-500/10',
      accent: 'text-orange-500',
      bgAccent: 'bg-orange-500/10',
      description: 'Tu forma de pensar tiene rasgos asociados al Trastorno por Déficit de Atención e Hiperactividad: mente acelerada, creatividad desbordante y dificultad para seguir el ritmo del mundo "convencional".',
    },
    tea: {
      icon: <Brain className="w-8 h-8" />,
      title: 'Tu perfil apunta a características de TEA',
      color: 'from-blue-500/20 to-indigo-500/10',
      accent: 'text-blue-500',
      bgAccent: 'bg-blue-500/10',
      description: 'Tu forma de percibir el mundo tiene rasgos asociados al Trastorno del Espectro Autista: sensibilidad profunda, pensamiento analítico y una forma única de conectar con los demás.',
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Minimal Header */}
      <header className="py-4 px-6 border-b border-border/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-heading font-bold text-lg">Espacio NeuroDivergente</span>
          </div>
          {downloadCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
              <Download className="w-3.5 h-3.5" />
              <span>+{downloadCount} descargas</span>
            </div>
          )}
        </div>
      </header>

      {/* HERO STEP */}
      {step === 'hero' && (
        <div className="animate-fade-in">
          {/* Hero */}
          <section className="py-16 md:py-24 px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                <span>Test gratuito · 2 minutos</span>
              </div>
              
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                ¿Y si tu forma de pensar{' '}
                <span className="text-primary">no es un problema</span>,{' '}
                sino una diferencia?
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Miles de adultos descubren cada año que son neurodivergentes. 
                Responde 5 preguntas y descubre qué perfil encaja más contigo. 
                <strong className="text-foreground"> Es gratis, anónimo y tarda 2 minutos.</strong>
              </p>

              <Button 
                size="lg" 
                className="gap-2 text-lg px-8 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => setStep('quiz')}
              >
                Descubrir mi perfil
                <ArrowRight className="w-5 h-5" />
              </Button>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>100% anónimo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Solo 2 minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  <span>Sin registro</span>
                </div>
              </div>
            </div>
          </section>

          {/* Pain points */}
          <section className="py-16 px-6 bg-accent/30">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-10">
                ¿Te sientes identificado/a?
              </h2>
              <div className="grid gap-4">
                {[
                  'Sientes que tu cabeza va más rápido (o más lento) que el mundo',
                  'Te dicen que eres "demasiado sensible" o "demasiado intenso/a"',
                  'Te cuesta organizarte, concentrarte o seguir conversaciones sociales',
                  'Sientes que encajas en todo… y en nada al mismo tiempo',
                  'Has llegado al agotamiento intentando parecer "normal"',
                ].map((pain, i) => (
                  <div 
                    key={i} 
                    className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50 animate-fade-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{pain}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <Button 
                  size="lg" 
                  className="gap-2"
                  onClick={() => setStep('quiz')}
                >
                  Hacer el quiz ahora
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-10">
                Lo que dicen quienes ya dieron el paso
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((t, i) => (
                  <div 
                    key={i} 
                    className="p-6 rounded-xl bg-card border border-border/50 animate-fade-in"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: t.stars }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 italic">"{t.text}"</p>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* QUIZ STEP */}
      {step === 'quiz' && (
        <section className="py-16 md:py-24 px-6 animate-fade-in">
          <div className="max-w-2xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Pregunta {currentQ + 1} de {quizQuestions.length}</span>
                <span>{Math.round(((currentQ + 1) / quizQuestions.length) * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">
              {quizQuestions[currentQ].question}
            </h2>

            <div className="grid gap-3">
              {quizQuestions[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="w-full text-left p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-accent/50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary flex items-center justify-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-foreground">{opt.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RESULT STEP */}
      {step === 'result' && result && (
        <div className="animate-fade-in">
          {/* Result hero */}
          <section className="py-16 md:py-20 px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${resultConfig[result].bgAccent} ${resultConfig[result].accent} mb-6`}>
                {resultConfig[result].icon}
              </div>
              
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                {resultConfig[result].title}
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                {resultConfig[result].description}
              </p>

              <div className="p-1 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 inline-block">
                <div className="bg-card rounded-xl p-8 max-w-xl">
                  <p className="text-sm text-muted-foreground mb-2">Esto es solo una orientación. Para entender realmente tu perfil:</p>
                  <h3 className="font-heading text-xl font-bold mb-4">
                    Guía completa de {result === 'tdah' ? 'TDAH' : 'TEA'}
                  </h3>
                  
                  {/* What's included */}
                  <ul className="text-left space-y-2 mb-6">
                    {[
                      'Síntomas detallados por edad y género',
                      'Estrategias prácticas para el día a día',
                      'Diferencias en mujeres vs hombres',
                      'Cuándo y cómo buscar diagnóstico profesional',
                      'Herramientas de autogestión',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Pricing */}
                  {resourceData ? (
                    <div className="mb-6">
                      <div className="flex items-center justify-center gap-3 mb-1">
                        <span className="text-2xl text-muted-foreground line-through">
                          {((resourceData.price_cents * 2.5) / 100).toFixed(2).replace('.', ',')}€
                        </span>
                        <span className="text-4xl font-bold text-foreground">
                          {(resourceData.price_cents / 100).toFixed(2).replace('.', ',')}€
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Precio de lanzamiento · Acceso inmediato</p>
                    </div>
                  ) : (
                    <div className="h-16 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  <Button 
                    size="lg" 
                    className="w-full gap-2 text-lg py-6 h-auto rounded-xl"
                    onClick={handlePurchase}
                    disabled={loading || !resourceData}
                  >
                    {loading ? 'Redirigiendo a pago seguro...' : 'Descargar mi guía ahora'}
                    <ArrowRight className="w-5 h-5" />
                  </Button>

                  {/* Trust */}
                  <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Pago seguro con Stripe</span>
                    <span className="flex items-center gap-1"><Download className="w-3 h-3" /> Descarga inmediata</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Social proof */}
          {downloadCount > 0 && (
            <section className="py-8 px-6">
              <div className="max-w-md mx-auto text-center p-6 rounded-xl bg-accent/30 border border-border/50">
                <div className="flex items-center justify-center gap-2 text-primary mb-1">
                  <Download className="w-5 h-5" />
                  <span className="text-2xl font-bold">{downloadCount}+</span>
                </div>
                <p className="text-sm text-muted-foreground">personas ya han descargado nuestras guías</p>
              </div>
            </section>
          )}

          {/* Testimonials */}
          <section className="py-12 px-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-heading text-xl font-bold text-center mb-8">Opiniones reales</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {testimonials.map((t, i) => (
                  <div key={i} className="p-5 rounded-xl bg-card border border-border/50">
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: t.stars }).map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground italic mb-3">"{t.text}"</p>
                    <p className="text-xs font-medium">{t.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-12 px-6 mb-8">
            <div className="max-w-xl mx-auto text-center">
              <p className="text-muted-foreground mb-4">
                No necesitas un diagnóstico para empezar a entenderte. Esta guía es tu primer paso.
              </p>
              <Button 
                size="lg" 
                className="gap-2"
                onClick={handlePurchase}
                disabled={loading || !resourceData}
              >
                Quiero mi guía
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </section>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-border/50 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Espacio NeuroDivergente · Este quiz no sustituye un diagnóstico profesional</p>
      </footer>
    </div>
  );
}
