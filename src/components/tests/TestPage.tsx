import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Loader2, Lock, FileText, Download } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export interface TestQuestion {
  id: number;
  text: string;
  options: { value: number; label: string }[];
}

export interface TestResult {
  puntuacion: number;
  maxPuntuacion: number;
  banda: string;
  descripcion: string;
  color: 'success' | 'warning' | 'destructive';
}

export interface TestConfig {
  id: string;
  name: string;
  fullName: string;
  description: string;
  instructions: string;
  questions: TestQuestion[];
  calculateResult: (answers: Record<number, number>) => TestResult;
  disclaimer: string;
}

interface TestPageProps {
  config: TestConfig;
}

export function TestPage({ config }: TestPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'intro' | 'questions' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<TestResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [premiumPdfUrl, setPremiumPdfUrl] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Check for payment success on mount
  useEffect(() => {
    const paymentSuccess = searchParams.get('payment_success');
    const testType = searchParams.get('test_type');
    
    if (paymentSuccess === 'true' && testType === config.id) {
      // Restore result from sessionStorage
      const savedResult = sessionStorage.getItem(`test_result_${config.id}`);
      const savedAnswers = sessionStorage.getItem(`test_answers_${config.id}`);
      
      if (savedResult && savedAnswers) {
        setResult(JSON.parse(savedResult));
        setAnswers(JSON.parse(savedAnswers));
        setCurrentStep('results');
        setIsPremiumUnlocked(true);
        toast.success('¡Pago completado! Generando tu análisis premium...');
        
        // Clean up URL params
        setSearchParams({});
        
        // Clean up session storage
        sessionStorage.removeItem(`test_result_${config.id}`);
        sessionStorage.removeItem(`test_answers_${config.id}`);
      }
    }
  }, [searchParams, config.id, setSearchParams]);

  // Auto-generate premium PDF when unlocked
  useEffect(() => {
    if (isPremiumUnlocked && result && !premiumPdfUrl && !generatingPdf) {
      generatePremiumPdf();
    }
  }, [isPremiumUnlocked, result]);

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [config.questions[currentQuestion].id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < config.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Calculate results
      const testResult = config.calculateResult(answers);
      setResult(testResult);
      setCurrentStep('results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const progress = ((currentQuestion + 1) / config.questions.length) * 100;
  const currentAnswer = answers[config.questions[currentQuestion]?.id];

  const handleGetAnalysis = async () => {
    if (!result) return;
    
    setLoadingAnalysis(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-analyzer', {
        body: {
          testName: config.fullName,
          puntuacion: result.puntuacion,
          banda: result.banda,
          maxPuntuacion: result.maxPuntuacion,
        },
      });

      if (error) throw error;
      
      setAiAnalysis(data.analysis);
    } catch (error) {
      console.error('Error getting analysis:', error);
      toast.error('No se pudo obtener el análisis. Inténtalo de nuevo.');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handlePremiumPayment = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para obtener el análisis premium');
      return;
    }

    if (!result) return;

    setLoadingPayment(true);
    try {
      // Save result to sessionStorage before redirecting
      sessionStorage.setItem(`test_result_${config.id}`, JSON.stringify(result));
      sessionStorage.setItem(`test_answers_${config.id}`, JSON.stringify(answers));

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          product_type: 'test_premium',
          test_type: config.id,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Error al procesar el pago. Inténtalo de nuevo.');
      sessionStorage.removeItem(`test_result_${config.id}`);
      sessionStorage.removeItem(`test_answers_${config.id}`);
    } finally {
      setLoadingPayment(false);
    }
  };

  const generatePremiumPdf = async () => {
    if (!result) return;

    setGeneratingPdf(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-pdf', {
        body: {
          type: 'test_premium',
          testName: config.fullName,
          testId: config.id,
          puntuacion: result.puntuacion,
          maxPuntuacion: result.maxPuntuacion,
          banda: result.banda,
          descripcion: result.descripcion,
          answers: answers,
          questions: config.questions,
        },
      });

      if (error) throw error;

      if (data?.pdfBase64) {
        // Convert base64 to blob and create download URL
        const byteCharacters = atob(data.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPremiumPdfUrl(url);
        toast.success('¡Tu informe premium está listo para descargar!');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF. Inténtalo de nuevo.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const restartTest = () => {
    setCurrentStep('intro');
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setAiAnalysis(null);
    setIsPremiumUnlocked(false);
    setPremiumPdfUrl(null);
  };

  return (
    <Layout>
      {/* Hero */}
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
            <SectionTitle as="h1" subtitle={config.description}>
              {config.name}
            </SectionTitle>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Intro Step */}
          {currentStep === 'intro' && (
            <div className="animate-fade-in">
              <ContentBlock className="mb-6">
                <h2 className="font-heading font-semibold text-xl mb-4">Instrucciones</h2>
                <p className="text-muted-foreground mb-6">{config.instructions}</p>
                <div className="flex gap-4 text-sm text-muted-foreground mb-6">
                  <span>{config.questions.length} preguntas</span>
                  <span>·</span>
                  <span>~{Math.ceil(config.questions.length * 0.5)} minutos</span>
                </div>
                <Button size="lg" onClick={() => setCurrentStep('questions')} className="gap-2">
                  Comenzar Test
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </ContentBlock>

              <ContentBlock variant="warning">
                <div className="flex gap-4">
                  <AlertCircle className="w-6 h-6 text-warning-foreground shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Importante</h3>
                    <p className="text-sm text-muted-foreground">{config.disclaimer}</p>
                  </div>
                </div>
              </ContentBlock>
            </div>
          )}

          {/* Questions Step */}
          {currentStep === 'questions' && (
            <div className="animate-fade-in">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Pregunta {currentQuestion + 1} de {config.questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question */}
              <ContentBlock className="mb-6">
                <h2 className="font-heading font-medium text-lg mb-6">
                  {config.questions[currentQuestion].text}
                </h2>

                <RadioGroup
                  value={currentAnswer?.toString()}
                  onValueChange={(value) => handleAnswer(parseInt(value))}
                  className="space-y-3"
                >
                  {config.questions[currentQuestion].options.map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                        currentAnswer === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                      onClick={() => handleAnswer(option.value)}
                    >
                      <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                      <Label htmlFor={`option-${option.value}`} className="cursor-pointer flex-1">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </ContentBlock>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={currentAnswer === undefined}
                  className="gap-2"
                >
                  {currentQuestion === config.questions.length - 1 ? 'Ver Resultados' : 'Siguiente'}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Results Step */}
          {currentStep === 'results' && result && (
            <div className="animate-fade-in space-y-6">
              {/* Score Card */}
              <ContentBlock className="text-center">
                <div
                  className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    result.color === 'success'
                      ? 'bg-success/20 text-success'
                      : result.color === 'warning'
                      ? 'bg-warning/20 text-warning-foreground'
                      : 'bg-destructive/20 text-destructive'
                  }`}
                >
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="font-heading font-semibold text-2xl mb-2">Tu Resultado</h2>
                <p className="text-4xl font-bold mb-2">
                  {result.puntuacion} / {result.maxPuntuacion}
                </p>
                <p
                  className={`text-lg font-medium mb-4 ${
                    result.color === 'success'
                      ? 'text-success'
                      : result.color === 'warning'
                      ? 'text-warning-foreground'
                      : 'text-destructive'
                  }`}
                >
                  {result.banda}
                </p>
                <p className="text-muted-foreground">{result.descripcion}</p>
              </ContentBlock>

              {/* Free AI Analysis Section */}
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-4">Análisis Básico (Gratuito)</h3>
                {!aiAnalysis ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">
                      Obtén un análisis breve de tus resultados generado por IA.
                    </p>
                    <Button
                      onClick={handleGetAnalysis}
                      disabled={loadingAnalysis}
                      variant="outline"
                      className="gap-2"
                    >
                      {loadingAnalysis ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generando análisis...
                        </>
                      ) : (
                        'Obtener Análisis Gratuito'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {aiAnalysis.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </ContentBlock>

              {/* Premium Analysis Section */}
              <ContentBlock className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg">Análisis Premium</h3>
                    <p className="text-sm text-muted-foreground">Informe detallado en PDF por 0,99€</p>
                  </div>
                </div>
                
                {isPremiumUnlocked ? (
                  <div className="space-y-4">
                    {generatingPdf ? (
                      <div className="flex items-center justify-center gap-3 py-6">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span className="text-muted-foreground">Generando tu informe premium...</span>
                      </div>
                    ) : premiumPdfUrl ? (
                      <div className="text-center py-4">
                        <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
                        <p className="text-foreground font-medium mb-4">¡Tu informe está listo!</p>
                        <Button asChild className="gap-2">
                          <a href={premiumPdfUrl} download={`informe-${config.id}.pdf`}>
                            <Download className="w-4 h-4" />
                            Descargar Informe PDF
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={generatePremiumPdf} className="w-full gap-2">
                        <FileText className="w-4 h-4" />
                        Generar Informe PDF
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        Análisis exhaustivo de tus respuestas
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        Interpretación profesional de resultados
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        Recomendaciones personalizadas
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        PDF descargable para compartir con profesionales
                      </li>
                    </ul>
                    
                    {!user ? (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-3">
                          Inicia sesión para obtener el análisis premium
                        </p>
                        <Button asChild variant="outline" className="gap-2">
                          <Link to="/auth">
                            <Lock className="w-4 h-4" />
                            Iniciar Sesión
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={handlePremiumPayment} 
                        disabled={loadingPayment}
                        className="w-full gap-2"
                      >
                        {loadingPayment ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Obtener por 0,99€
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </ContentBlock>

              {/* Disclaimer */}
              <ContentBlock variant="warning">
                <div className="flex gap-4">
                  <AlertCircle className="w-6 h-6 text-warning-foreground shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Recuerda</h3>
                    <p className="text-sm text-muted-foreground">
                      Este test es una herramienta de screening, no un diagnóstico. Si tu puntuación
                      sugiere la presencia de rasgos significativos, te recomendamos consultar con un
                      profesional especializado para una evaluación formal.
                    </p>
                  </div>
                </div>
              </ContentBlock>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" onClick={restartTest}>
                  Repetir Test
                </Button>
                <Button asChild>
                  <Link to="/tests">Ver Otros Tests</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
