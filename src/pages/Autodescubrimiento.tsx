import { useState } from 'react';
import { Compass, Lock, Sparkles, FileText, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const preguntas = [
  "¿Cómo describirías tu relación con el tiempo y la gestión de tareas diarias?",
  "¿Qué tipo de entornos te resultan más cómodos o incómodos? ¿Hay sonidos, luces o texturas que te afecten especialmente?",
  "¿Cómo te sientes en situaciones sociales? ¿Necesitas tiempo a solas después de interactuar con otros?",
  "¿Tienes intereses o pasiones muy intensos sobre temas específicos?",
  "¿Cómo procesas las emociones, tanto propias como ajenas?",
  "¿Te resulta difícil iniciar tareas, aunque sepas que son importantes?",
  "¿Cómo manejas los cambios inesperados en tus planes o rutinas?",
  "¿Sientes que a veces actúas de forma diferente a como realmente eres para encajar?",
];

type Step = 'intro' | 'questionnaire' | 'teaser' | 'payment' | 'complete';

export default function Autodescubrimiento() {
  const [step, setStep] = useState<Step>('intro');
  const [respuestas, setRespuestas] = useState<string[]>(Array(preguntas.length).fill(''));
  const [email, setEmail] = useState('');
  const [teaser, setTeaser] = useState('');
  const [fullAnalysis, setFullAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRespuestaChange = (index: number, value: string) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[index] = value;
    setRespuestas(nuevasRespuestas);
  };

  const handleSubmitQuestionnaire = async () => {
    if (!respuestas[0].trim()) {
      toast({
        title: 'Respuesta requerida',
        description: 'Por favor, responde al menos la primera pregunta para continuar.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Calling teaser function...');
      const { data, error } = await supabase.functions.invoke('teaser', {
        body: {
          pregunta: preguntas[0],
          respuesta: respuestas[0],
        },
      });

      if (error) {
        console.error('Teaser error:', error);
        throw new Error(error.message || 'Error al generar el análisis');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setTeaser(data.teaser);
      setStep('teaser');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo generar el análisis. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!email.trim()) {
      toast({
        title: 'Email requerido',
        description: 'Necesitamos tu email para enviarte el informe completo.',
        variant: 'destructive',
      });
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Email inválido',
        description: 'Por favor, introduce un email válido.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Por ahora, simulamos el pago y generamos el análisis completo
      // TODO: Integrar Stripe para pagos reales
      
      console.log('Calling full-analysis function...');
      const { data, error } = await supabase.functions.invoke('full-analysis', {
        body: {
          preguntas,
          respuestas,
          email,
        },
      });

      if (error) {
        console.error('Full analysis error:', error);
        throw new Error(error.message || 'Error al generar el análisis');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setFullAnalysis(data.analysis);
      setStep('complete');
      
      toast({
        title: '¡Análisis completado!',
        description: 'Tu informe ha sido generado exitosamente.',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo generar el análisis. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-20">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Compass className="w-4 h-4" />
              <span>Herramienta Interactiva con IA</span>
            </div>
            <SectionTitle
              as="h1"
              align="center"
              subtitle="Explora tu perfil neurodivergente con nuestra herramienta guiada por inteligencia artificial."
            >
              Mi Viaje de Autodescubrimiento
            </SectionTitle>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12">
        <div className="max-w-3xl mx-auto">
          
          {/* Intro Step */}
          {step === 'intro' && (
            <div className="space-y-8 animate-fade-in">
              <ContentBlock>
                <h2 className="font-heading font-semibold text-xl mb-4">
                  ¿Cómo funciona?
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-sm font-medium">
                      1
                    </div>
                    <div>
                      <h3 className="font-medium">Responde el cuestionario</h3>
                      <p className="text-sm text-muted-foreground">
                        8 preguntas diseñadas para explorar tu forma de procesar el mundo.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h3 className="font-medium">Recibe un adelanto gratuito</h3>
                      <p className="text-sm text-muted-foreground">
                        Nuestra IA analiza tu primera respuesta y te muestra una vista previa.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-sm font-medium">
                      3
                    </div>
                    <div>
                      <h3 className="font-medium">Desbloquea tu informe completo</h3>
                      <p className="text-sm text-muted-foreground">
                        Por solo 5€, recibe un análisis detallado en PDF directamente en tu email.
                      </p>
                    </div>
                  </div>
                </div>
              </ContentBlock>

              <ContentBlock variant="warning">
                <div className="flex gap-4">
                  <AlertCircle className="w-6 h-6 text-warning-foreground shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Aviso importante</h3>
                    <p className="text-sm text-muted-foreground">
                      Este análisis tiene fines exploratorios y de autoconocimiento. 
                      No sustituye una evaluación profesional ni constituye un diagnóstico clínico.
                    </p>
                  </div>
                </div>
              </ContentBlock>

              <div className="text-center">
                <Button size="lg" onClick={() => setStep('questionnaire')} className="gap-2">
                  Comenzar Cuestionario
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Questionnaire Step */}
          {step === 'questionnaire' && (
            <div className="space-y-6 animate-fade-in">
              <ContentBlock>
                <p className="text-muted-foreground mb-6">
                  Responde con honestidad y sin pensarlo demasiado. No hay respuestas correctas o incorrectas.
                </p>
                
                <div className="space-y-8">
                  {preguntas.map((pregunta, index) => (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={`pregunta-${index}`} className="text-base font-medium">
                        {index + 1}. {pregunta}
                      </Label>
                      <Textarea
                        id={`pregunta-${index}`}
                        placeholder="Escribe tu respuesta aquí..."
                        value={respuestas[index]}
                        onChange={(e) => handleRespuestaChange(index, e.target.value)}
                        className="min-h-[100px] resize-none"
                      />
                    </div>
                  ))}
                </div>
              </ContentBlock>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('intro')}>
                  Volver
                </Button>
                <Button 
                  onClick={handleSubmitQuestionnaire} 
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      Obtener Análisis
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Teaser Step */}
          {step === 'teaser' && (
            <div className="space-y-8 animate-fade-in">
              <ContentBlock variant="highlight">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="font-heading font-semibold text-xl">Tu Vista Previa</h2>
                </div>
                <p className="text-foreground leading-relaxed">{teaser}</p>
              </ContentBlock>

              <ContentBlock>
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Lock className="w-5 h-5" />
                    <span>Contenido completo bloqueado</span>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-heading font-semibold text-lg">
                      Desbloquea tu Informe Completo por 5€
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span>Análisis detallado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>Enviado a tu email</span>
                      </div>
                    </div>
                  </div>

                  <div className="max-w-sm mx-auto space-y-4">
                    <div>
                      <Label htmlFor="email">Tu email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handlePayment} 
                      disabled={isLoading}
                      className="w-full gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generando análisis...
                        </>
                      ) : (
                        <>
                          Obtener Análisis Completo
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      * Pago con Stripe próximamente. Por ahora, demo gratuita.
                    </p>
                  </div>
                </div>
              </ContentBlock>

              <div className="text-center">
                <Button variant="ghost" onClick={() => setStep('questionnaire')}>
                  Volver al cuestionario
                </Button>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <div className="space-y-8 animate-fade-in">
              <ContentBlock variant="success">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-success" />
                  <h2 className="font-heading font-semibold text-xl">Tu Informe Completo</h2>
                </div>
              </ContentBlock>

              <ContentBlock>
                <div className="prose prose-sm max-w-none text-foreground">
                  {fullAnalysis.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph.startsWith('**') && paragraph.endsWith('**') ? (
                          <strong>{paragraph.replace(/\*\*/g, '')}</strong>
                        ) : paragraph.startsWith('##') ? (
                          <strong className="text-lg block mt-6 mb-2">{paragraph.replace(/##/g, '').trim()}</strong>
                        ) : (
                          paragraph
                        )}
                      </p>
                    )
                  ))}
                </div>
              </ContentBlock>

              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Informe enviado a: <strong>{email}</strong>
                </p>
                <Button variant="outline" onClick={() => {
                  setStep('intro');
                  setRespuestas(Array(preguntas.length).fill(''));
                  setTeaser('');
                  setFullAnalysis('');
                  setEmail('');
                }}>
                  Realizar nuevo cuestionario
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
