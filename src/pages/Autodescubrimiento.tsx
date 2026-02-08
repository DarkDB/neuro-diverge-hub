import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Compass, Lock, Sparkles, FileText, Mail, ArrowRight, AlertCircle, Loader2, User, Calendar, CheckCircle2, LogIn, Download } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useScreeningSession } from '@/hooks/useScreeningSession';
import { supabase } from '@/integrations/supabase/client';

type Step = 'intro' | 'profile' | 'phase1' | 'phase1-teaser' | 'register-prompt' | 'phase1-payment' | 'phase2-loading' | 'phase2' | 'phase2-questions' | 'phase3' | 'complete';

interface RespuestaHistorial {
  pregunta: string;
  respuesta: string;
}

interface AnalisisPreliminar {
  fortalezas: string;
  desafios: string;
  hipotesisPrincipal: string;
  justificacion: string;
}

interface InformeFinal {
  titulo: string;
  perfilEvaluado: {
    edad: string;
    genero: string;
  };
  conclusiones: {
    hipotesisPerfil: string;
    rasgosClave: {
      fortalezas: string[];
      desafios: string[];
      caracteristicasND: string[];
    };
    resumenNarrativo: string;
  };
  recomendaciones: {
    hogar: string[];
    escolar: string[];
  };
  evaluacionProfesional: {
    profesionalesSugeridos: string[];
    pruebasSugeridas: string[];
    urgencia: string;
  };
  disclaimer: string;
}

export default function Autodescubrimiento() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<Step>('intro');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { sessionId, setSessionIdManual, createSession, savePhase1, savePhase2, completeSession, resetSession, isSaving } = useScreeningSession();

  // Handle return from payment
  useEffect(() => {
    const sessionFromUrl = searchParams.get('session');
    const continueFlow = searchParams.get('continue');
    
    if (sessionFromUrl && continueFlow === 'true' && user) {
      setSessionIdManual(sessionFromUrl);
      setStep('phase2-loading');
      // Clear URL params
      navigate('/autodescubrimiento', { replace: true });
    }
  }, [searchParams, user, navigate, setSessionIdManual]);

  // Profile data
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState('');
  const [destinatario, setDestinatario] = useState('');
  const [email, setEmail] = useState('');

  // Phase 1 data
  const [phase1Intro, setPhase1Intro] = useState('');
  const [phase1Questions, setPhase1Questions] = useState<string[]>([]);
  const [phase1Answers, setPhase1Answers] = useState<string[]>([]);
  const [phase1Disclaimer, setPhase1Disclaimer] = useState('');

  // Teaser data
  const [teaserData, setTeaserData] = useState<{
    titulo: string;
    resumen: string;
    patrones: string[];
    cierre: string;
  } | null>(null);

  // Phase 2 data
  const [analisisPreliminar, setAnalisisPreliminar] = useState<AnalisisPreliminar | null>(null);
  const [phase2Questions, setPhase2Questions] = useState<string[]>([]);
  const [phase2Answers, setPhase2Answers] = useState<string[]>([]);

  // Phase 3 data
  const [informeFinal, setInformeFinal] = useState<InformeFinal | null>(null);

  // Prefill email from user if logged in
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // Restore session data after registration
  useEffect(() => {
    if (user && !authLoading) {
      const tempData = sessionStorage.getItem('screening_temp');
      if (tempData) {
        try {
          const parsed = JSON.parse(tempData);
          setEdad(parsed.edad || '');
          setGenero(parsed.genero || '');
          setDestinatario(parsed.destinatario || '');
          setPhase1Questions(parsed.phase1Questions || []);
          setPhase1Answers(parsed.phase1Answers || []);
          setTeaserData(parsed.teaserData || null);
          
          // Clear temp storage
          sessionStorage.removeItem('screening_temp');
          
          // Navigate to register-prompt to continue the flow
          setStep('register-prompt');
          
          toast({
            title: '¡Bienvenido/a!',
            description: 'Tu cuenta ha sido creada. Continuemos con tu análisis.',
          });
        } catch (e) {
          console.error('Error restoring screening data:', e);
        }
      }
    }
  }, [user, authLoading, toast]);

  // Guest mode state
  const [isGuestMode, setIsGuestMode] = useState(false);

  const handleStartProfile = () => {
    // Phase 1 is public - no login required
    setStep('profile');
  };

  const handleSubmitProfile = async () => {
    if (!edad || !genero || !destinatario) {
      toast({
        title: 'Datos requeridos',
        description: 'Por favor, completa todos los campos del perfil.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Don't create session yet - Phase 1 is public
      // Session will be created after registration

      console.log('Calling screening-phase1 function...');
      const { data, error } = await supabase.functions.invoke('screening-phase1', {
        body: { edad, genero, destinatario },
      });

      if (error) {
        console.error('Phase 1 error:', error);
        throw new Error(error.message || 'Error al generar las preguntas');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setPhase1Intro(data.introduccion || '');
      setPhase1Questions(data.preguntas || []);
      setPhase1Answers(Array(data.preguntas?.length || 0).fill(''));
      setPhase1Disclaimer(data.disclaimer || '');
      setStep('phase1');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudieron generar las preguntas.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhase1AnswerChange = (index: number, value: string) => {
    const newAnswers = [...phase1Answers];
    newAnswers[index] = value;
    setPhase1Answers(newAnswers);
  };

  const handleSubmitPhase1 = async () => {
    const unanswered = phase1Answers.filter(a => !a.trim()).length;
    if (unanswered > 0) {
      toast({
        title: 'Respuestas incompletas',
        description: `Por favor, responde todas las preguntas (${unanswered} sin responder).`,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const historialRespuestas = phase1Questions.map((pregunta, i) => ({
        pregunta,
        respuesta: phase1Answers[i],
      }));

      console.log('Calling screening-teaser function...');
      const { data, error } = await supabase.functions.invoke('screening-teaser', {
        body: { edad, genero, destinatario, historialRespuestas },
      });

      if (error) {
        console.error('Teaser error:', error);
        throw new Error(error.message || 'Error al generar el resumen');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Don't save to database yet - wait for registration
      setTeaserData(data);
      setStep('phase1-teaser');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo generar el resumen.',
        variant: 'destructive',
      });
      // Fall back to payment step if teaser fails
      setStep('phase1-payment');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Stripe payment
  const handleStripePayment = async () => {
    if (!sessionId) {
      toast({
        title: 'Error',
        description: 'No se encontró la sesión. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          product_type: 'screening',
          session_id: sessionId,
        },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      if (!data?.url) throw new Error('No se recibió URL de pago');

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo iniciar el pago.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  // Load session data and proceed to Phase 2
  const loadSessionAndProceed = async () => {
    if (!sessionId || !user) return;

    setIsLoading(true);
    try {
      // Fetch session data from database
      const { data: session, error } = await supabase
        .from('screening_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (error) throw new Error(error.message);
      if (!session) throw new Error('Sesión no encontrada');
      if (!session.paid) {
        toast({
          title: 'Pago no verificado',
          description: 'El pago no se ha completado correctamente.',
          variant: 'destructive',
        });
        setStep('phase1-payment');
        return;
      }

      // Restore session data
      setEdad(session.edad);
      setGenero(session.genero);
      setDestinatario(session.destinatario);
      
      const fase1Respuestas = session.fase1_respuestas as { pregunta: string; respuesta: string }[] | null;
      if (fase1Respuestas) {
        setPhase1Questions(fase1Respuestas.map(r => r.pregunta));
        setPhase1Answers(fase1Respuestas.map(r => r.respuesta));
      }

      // Generate Phase 2 analysis
      const historialRespuestas: RespuestaHistorial[] = fase1Respuestas || [];

      console.log('Calling screening-phase2 function...');
      const { data, error: phase2Error } = await supabase.functions.invoke('screening-phase2', {
        body: { edad: session.edad, genero: session.genero, historialRespuestas },
      });

      if (phase2Error) throw new Error(phase2Error.message);
      if (data?.error) throw new Error(data.error);

      setAnalisisPreliminar(data.analisis || null);
      setPhase2Questions(data.preguntas || []);
      setPhase2Answers(Array(data.preguntas?.length || 0).fill(''));
      setStep('phase2');
    } catch (error) {
      console.error('Error loading session:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo cargar la sesión.',
        variant: 'destructive',
      });
      setStep('intro');
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to load session when returning from payment
  useEffect(() => {
    if (step === 'phase2-loading' && sessionId && user) {
      loadSessionAndProceed();
    }
  }, [step, sessionId, user]);

  const handlePaymentAndPhase2 = async () => {
    if (!email.trim()) {
      toast({
        title: 'Email requerido',
        description: 'Necesitamos tu email para enviarte el informe.',
        variant: 'destructive',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Email inválido',
        description: 'Por favor, introduce un email válido.',
        variant: 'destructive',
      });
      return;
    }

    // Proceed to Stripe payment
    await handleStripePayment();
  };

  const handlePhase2AnswerChange = (index: number, value: string) => {
    const newAnswers = [...phase2Answers];
    newAnswers[index] = value;
    setPhase2Answers(newAnswers);
  };

  const handleSubmitPhase2 = async () => {
    const unanswered = phase2Answers.filter(a => !a.trim()).length;
    if (unanswered > 0) {
      toast({
        title: 'Respuestas incompletas',
        description: `Por favor, responde todas las preguntas (${unanswered} sin responder).`,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const historialFase1: RespuestaHistorial[] = phase1Questions.map((pregunta, i) => ({
        pregunta,
        respuesta: phase1Answers[i],
      }));

      const historialFase2: RespuestaHistorial[] = phase2Questions.map((pregunta, i) => ({
        pregunta,
        respuesta: phase2Answers[i],
      }));

      // Save phase 2 data to database
      if (analisisPreliminar) {
        await savePhase2(phase2Questions, historialFase2, analisisPreliminar as unknown as import("@/integrations/supabase/types").Json);
      }

      console.log('Calling screening-phase3 function...');
      const { data, error } = await supabase.functions.invoke('screening-phase3', {
        body: { 
          edad, 
          genero, 
          historialFase1,
          historialFase2,
          analisisPreliminar,
        },
      });

      if (error) {
        console.error('Phase 3 error:', error);
        throw new Error(error.message || 'Error al generar el informe');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Save final report to database
      await completeSession(data);

      setInformeFinal(data);
      setStep('complete');

      toast({
        title: '¡Informe completado!',
        description: 'Tu informe ha sido generado correctamente.',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo generar el informe.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (!informeFinal) return;
    
    setIsDownloadingPdf(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-pdf', {
        body: { informeFinal, email, destinatario },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      // Convert base64 to blob and download
      const byteCharacters = atob(data.pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.filename || 'informe-exploracion.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'PDF descargado',
        description: 'Tu informe ha sido descargado correctamente.',
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo generar el PDF.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const resetProcessHandler = () => {
    resetSession();
    setStep('intro');
    setEdad('');
    setGenero('');
    setDestinatario('');
    if (!user?.email) setEmail('');
    setPhase1Intro('');
    setPhase1Questions([]);
    setPhase1Answers([]);
    setPhase1Disclaimer('');
    setTeaserData(null);
    setAnalisisPreliminar(null);
    setPhase2Questions([]);
    setPhase2Answers([]);
    setInformeFinal(null);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-20">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Compass className="w-4 h-4" />
              <span>Exploración Personalizada</span>
            </div>
            <SectionTitle
              as="h1"
              align="center"
              subtitle="Un proceso en 3 fases para explorar tus fortalezas y comprender mejor tu perfil neurocognitivo."
            >
              Mi Viaje de Autodescubrimiento
            </SectionTitle>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12">
        <div className="max-w-3xl mx-auto">

          {/* Progress indicator */}
          {step !== 'intro' && step !== 'complete' && (
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${['profile', 'phase1', 'phase1-payment'].includes(step) ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${['profile', 'phase1', 'phase1-payment'].includes(step) ? 'bg-primary text-primary-foreground' : step === 'phase2' || step === 'phase2-questions' || step === 'phase3' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {step === 'phase2' || step === 'phase2-questions' || step === 'phase3' ? <CheckCircle2 className="w-4 h-4" /> : '1'}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">Fase 1</span>
                </div>
                <div className="flex-1 h-1 mx-4 bg-muted rounded-full">
                  <div className={`h-full rounded-full transition-all ${step === 'phase2' || step === 'phase2-questions' || step === 'phase3' ? 'w-full bg-success' : step === 'phase1-payment' ? 'w-1/2 bg-primary' : 'w-0 bg-primary'}`} />
                </div>
                <div className={`flex items-center gap-2 ${['phase2', 'phase2-questions'].includes(step) ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${['phase2', 'phase2-questions'].includes(step) ? 'bg-primary text-primary-foreground' : step === 'phase3' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {step === 'phase3' ? <CheckCircle2 className="w-4 h-4" /> : '2'}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">Fase 2</span>
                </div>
                <div className="flex-1 h-1 mx-4 bg-muted rounded-full">
                  <div className={`h-full rounded-full transition-all ${step === 'phase3' ? 'w-full bg-primary' : 'w-0 bg-primary'}`} />
                </div>
                <div className={`flex items-center gap-2 ${step === 'phase3' ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'phase3' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    3
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">Informe</span>
                </div>
              </div>
            </div>
          )}

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
                      <h3 className="font-medium">Fase 1: Exploración Inicial (Gratuita)</h3>
                      <p className="text-sm text-muted-foreground">
                        Indícanos la edad y género del evaluado. Generaremos 6-8 preguntas personalizadas para explorar fortalezas y posibles desafíos.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h3 className="font-medium">Fase 2: Análisis y Profundización (5€)</h3>
                      <p className="text-sm text-muted-foreground">
                        Tras el pago, recibe un análisis preliminar con hipótesis y 4-6 preguntas específicas para confirmar o descartar patrones.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-sm font-medium">
                      3
                    </div>
                    <div>
                      <h3 className="font-medium">Fase 3: Informe Final</h3>
                      <p className="text-sm text-muted-foreground">
                        Recibe un informe completo con hipótesis de perfil, recomendaciones para hogar y escuela, y orientación profesional.
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
                      Esta exploración tiene fines orientativos y NO constituye un diagnóstico clínico. 
                      Siempre recomendamos buscar una evaluación profesional completa.
                    </p>
                  </div>
                </div>
              </ContentBlock>

              <div className="text-center">
                <Button size="lg" onClick={handleStartProfile} className="gap-2">
                  Comenzar Exploración
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Profile Step */}
          {step === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <ContentBlock>
                <h2 className="font-heading font-semibold text-xl mb-4">
                  Perfil del Evaluado
                </h2>
                <p className="text-muted-foreground mb-6">
                  Esta información nos ayuda a generar preguntas adaptadas al perfil específico.
                </p>
                
                <div className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="edad" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Edad
                    </Label>
                    <Select value={edad} onValueChange={setEdad}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la edad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-5 años">3-5 años (Preescolar)</SelectItem>
                        <SelectItem value="6-8 años">6-8 años (Infantil)</SelectItem>
                        <SelectItem value="9-11 años">9-11 años (Primaria)</SelectItem>
                        <SelectItem value="12-14 años">12-14 años (Adolescente temprano)</SelectItem>
                        <SelectItem value="15-17 años">15-17 años (Adolescente)</SelectItem>
                        <SelectItem value="18+ años">18+ años (Adulto)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="genero" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Género
                    </Label>
                    <Select value={genero} onValueChange={setGenero}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Niña/Mujer">Niña/Mujer</SelectItem>
                        <SelectItem value="Niño/Hombre">Niño/Hombre</SelectItem>
                        <SelectItem value="No binario">No binario</SelectItem>
                        <SelectItem value="Prefiero no decir">Prefiero no decir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destinatario" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      ¿Para quién es esta evaluación?
                    </Label>
                    <Select value={destinatario} onValueChange={setDestinatario}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el destinatario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Para mí mismo/a">Para mí mismo/a</SelectItem>
                        <SelectItem value="Para mi hijo/a">Para mi hijo/a</SelectItem>
                        <SelectItem value="Para un familiar">Para un familiar</SelectItem>
                        <SelectItem value="Para un amigo/a">Para un amigo/a</SelectItem>
                        <SelectItem value="Para un alumno/a">Para un alumno/a</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </ContentBlock>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('intro')}>
                  Volver
                </Button>
                <Button 
                  onClick={handleSubmitProfile} 
                  disabled={isLoading || !edad || !genero || !destinatario}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generando preguntas...
                    </>
                  ) : (
                    <>
                      Continuar
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Phase 1 Questions */}
          {step === 'phase1' && (
            <div className="space-y-6 animate-fade-in">
              <ContentBlock variant="highlight">
                <h2 className="font-heading font-semibold text-xl mb-2">
                  Fase 1: Exploración Inicial
                </h2>
                {phase1Intro && (
                  <p className="text-muted-foreground">{phase1Intro}</p>
                )}
              </ContentBlock>

              <ContentBlock>
                <div className="space-y-8">
                  {phase1Questions.map((pregunta, index) => (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={`phase1-q${index}`} className="text-base font-medium">
                        {index + 1}. {pregunta}
                      </Label>
                      <Textarea
                        id={`phase1-q${index}`}
                        placeholder="Escribe tu respuesta aquí..."
                        value={phase1Answers[index] || ''}
                        onChange={(e) => handlePhase1AnswerChange(index, e.target.value)}
                        className="min-h-[100px] resize-none"
                      />
                    </div>
                  ))}
                </div>
              </ContentBlock>

              {phase1Disclaimer && (
                <ContentBlock variant="warning">
                  <p className="text-sm">{phase1Disclaimer}</p>
                </ContentBlock>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('profile')}>
                  Volver
                </Button>
                <Button onClick={handleSubmitPhase1} disabled={isLoading} className="gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analizando respuestas...
                    </>
                  ) : (
                    <>
                      Continuar a Fase 2
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Phase 1 Teaser */}
          {step === 'phase1-teaser' && teaserData && (
            <div className="space-y-8 animate-fade-in">
              <ContentBlock variant="success">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <h2 className="font-heading font-semibold text-xl">Fase 1 Completada</h2>
                </div>
                <p className="text-muted-foreground">
                  Hemos analizado tus respuestas y encontrado patrones interesantes.
                </p>
              </ContentBlock>

              <ContentBlock variant="highlight">
                <div className="space-y-6">
                  <h3 className="font-heading font-semibold text-lg text-center">
                    {teaserData.titulo}
                  </h3>
                  
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {teaserData.resumen}
                  </p>

                  <div className="flex flex-wrap justify-center gap-2">
                    {teaserData.patrones.map((patron, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        <Sparkles className="w-3 h-3" />
                        {patron}
                      </span>
                    ))}
                  </div>

                  <p className="text-center text-sm text-muted-foreground italic">
                    {teaserData.cierre}
                  </p>
                </div>
              </ContentBlock>

              <div className="text-center">
                <Button size="lg" onClick={() => setStep('register-prompt')} className="gap-2">
                  Desbloquear Análisis Completo
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Register Prompt Step */}
          {step === 'register-prompt' && (
            <div className="space-y-8 animate-fade-in">
              <ContentBlock variant="warning">
                <div className="flex gap-4">
                  <AlertCircle className="w-6 h-6 text-warning-foreground shrink-0" />
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2">¡No pierdas tu progreso!</h3>
                    <p className="text-muted-foreground mb-4">
                      Has completado la Fase 1 y hemos encontrado patrones interesantes en tus respuestas. 
                      Si no creas una cuenta ahora, <strong>toda esta información se perderá</strong> y no podrás acceder a tu historial de análisis.
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        Guarda tus respuestas y análisis de forma segura
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        Accede a tu historial de informes cuando quieras
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        Recibe tu informe final por email
                      </li>
                    </ul>
                  </div>
                </div>
              </ContentBlock>

              <div className="flex flex-col gap-4">
                {user ? (
                  <ContentBlock variant="success">
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="w-6 h-6 text-success" />
                      <div>
                        <p className="font-medium">Ya tienes una cuenta activa</p>
                        <p className="text-sm text-muted-foreground">Tu progreso se guardará automáticamente.</p>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      className="w-full mt-4 gap-2"
                      onClick={async () => {
                        setIsLoading(true);
                        try {
                          // Create session and save Phase 1 data
                          const newSessionId = await createSession({ edad, genero, destinatario });
                          if (newSessionId) {
                            const historialRespuestas = phase1Questions.map((pregunta, i) => ({
                              pregunta,
                              respuesta: phase1Answers[i],
                            }));
                            await savePhase1(phase1Questions, historialRespuestas, teaserData);
                          }
                          setIsGuestMode(false);
                          setStep('phase1-payment');
                        } catch (error) {
                          console.error('Error saving session:', error);
                          toast({
                            title: 'Error',
                            description: 'No se pudo guardar la sesión.',
                            variant: 'destructive',
                          });
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          Continuar al Análisis Completo
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </ContentBlock>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      className="w-full gap-2"
                      onClick={() => {
                        // Store current state in sessionStorage for after registration
                        sessionStorage.setItem('screening_temp', JSON.stringify({
                          edad, genero, destinatario,
                          phase1Questions, phase1Answers,
                          teaserData
                        }));
                        navigate('/auth?redirect=/autodescubrimiento&action=register');
                      }}
                    >
                      <LogIn className="w-4 h-4" />
                      Crear Cuenta y Guardar Progreso
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">o</span>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full gap-2"
                      onClick={() => {
                        setIsGuestMode(true);
                        toast({
                          title: 'Modo invitado',
                          description: 'Continuarás sin guardar tu progreso. Solo podrás completar la Fase 1.',
                        });
                        // In guest mode, they can't proceed - redirect back to intro or show limitation
                        setStep('intro');
                        resetProcessHandler();
                      }}
                    >
                      Continuar como Invitado (sin guardar)
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Los usuarios invitados solo pueden completar la Fase 1 y no tendrán acceso al análisis completo ni al historial.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Phase 1 Payment */}
          {step === 'phase1-payment' && (
            <div className="space-y-8 animate-fade-in">
              <ContentBlock variant="success">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <h2 className="font-heading font-semibold text-xl">Fase 1 Completada</h2>
                </div>
                <p className="text-muted-foreground">
                  Has respondido todas las preguntas de la exploración inicial. 
                  Para continuar con el análisis completo, realiza el pago seguro con Stripe.
                </p>
              </ContentBlock>

              <ContentBlock>
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Lock className="w-5 h-5" />
                    <span>Análisis premium bloqueado</span>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-heading font-semibold text-lg">
                      Desbloquea el Análisis Completo por 5€
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>Análisis preliminar con hipótesis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span>Preguntas de profundización</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>Informe final PDF</span>
                      </div>
                    </div>
                  </div>

                  <div className="max-w-sm mx-auto space-y-4">
                    <Button 
                      onClick={handleStripePayment} 
                      disabled={isLoading || !sessionId}
                      className="w-full gap-2"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Redirigiendo a pago...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Pagar 4,99€ con Stripe
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Pago seguro procesado por Stripe. Tu información de pago está protegida.
                    </p>
                  </div>
                </div>
              </ContentBlock>

              <div className="text-center">
                <Button variant="ghost" onClick={() => setStep('phase1-teaser')}>
                  Volver al resumen
                </Button>
              </div>
            </div>
          )}

          {/* Phase 2 Loading */}
          {step === 'phase2-loading' && (
            <div className="space-y-8 animate-fade-in">
              <ContentBlock>
                <div className="text-center py-12 space-y-4">
                  <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
                  <h2 className="font-heading font-semibold text-xl">
                    Preparando tu análisis...
                  </h2>
                  <p className="text-muted-foreground">
                    Estamos cargando tus respuestas y generando el análisis preliminar.
                  </p>
                </div>
              </ContentBlock>
            </div>
          )}

          {/* Phase 2 Analysis */}
          {step === 'phase2' && analisisPreliminar && (
            <div className="space-y-6 animate-fade-in">
              <ContentBlock variant="highlight">
                <h2 className="font-heading font-semibold text-xl mb-4">
                  Fase 2: Análisis Preliminar
                </h2>
              </ContentBlock>

              <ContentBlock>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-success mb-2">Fortalezas Observadas</h3>
                    <p className="text-muted-foreground">{analisisPreliminar.fortalezas}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-warning mb-2">Desafíos Identificados</h3>
                    <p className="text-muted-foreground">{analisisPreliminar.desafios}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary mb-2">Hipótesis Principal</h3>
                    <p className="text-foreground font-medium">{analisisPreliminar.hipotesisPrincipal}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Justificación</h3>
                    <p className="text-muted-foreground">{analisisPreliminar.justificacion}</p>
                  </div>
                </div>
              </ContentBlock>

              <div className="text-center">
                <Button onClick={() => setStep('phase2-questions')} className="gap-2">
                  Continuar con Preguntas de Profundización
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Phase 2 Questions */}
          {step === 'phase2-questions' && (
            <div className="space-y-6 animate-fade-in">
              <ContentBlock variant="highlight">
                <h2 className="font-heading font-semibold text-xl mb-2">
                  Preguntas de Profundización
                </h2>
                <p className="text-muted-foreground">
                  Estas preguntas están diseñadas para confirmar o refinar la hipótesis inicial.
                </p>
              </ContentBlock>

              <ContentBlock>
                <div className="space-y-8">
                  {phase2Questions.map((pregunta, index) => (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={`phase2-q${index}`} className="text-base font-medium">
                        {index + 1}. {pregunta}
                      </Label>
                      <Textarea
                        id={`phase2-q${index}`}
                        placeholder="Escribe tu respuesta aquí..."
                        value={phase2Answers[index] || ''}
                        onChange={(e) => handlePhase2AnswerChange(index, e.target.value)}
                        className="min-h-[100px] resize-none"
                      />
                    </div>
                  ))}
                </div>
              </ContentBlock>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('phase2')}>
                  Volver al análisis
                </Button>
                <Button 
                  onClick={handleSubmitPhase2} 
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generando informe final...
                    </>
                  ) : (
                    <>
                      Generar Informe Final
                      <FileText className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Complete Step - Final Report */}
          {step === 'complete' && informeFinal && (
            <div className="space-y-8 animate-fade-in">
              <ContentBlock variant="success">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-success" />
                  <h2 className="font-heading font-semibold text-xl">{informeFinal.titulo}</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Perfil evaluado: {informeFinal.perfilEvaluado.genero}, {informeFinal.perfilEvaluado.edad}
                </p>
              </ContentBlock>

              {/* Hipótesis de Perfil */}
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-4 text-primary">
                  Hipótesis de Perfil
                </h3>
                <p className="text-foreground leading-relaxed">
                  {informeFinal.conclusiones.hipotesisPerfil}
                </p>
              </ContentBlock>

              {/* Rasgos Clave */}
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-4">
                  Rasgos Clave
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-success mb-2">Fortalezas</h4>
                    <ul className="space-y-1">
                      {informeFinal.conclusiones.rasgosClave.fortalezas.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-warning mb-2">Desafíos</h4>
                    <ul className="space-y-1">
                      {informeFinal.conclusiones.rasgosClave.desafios.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-primary mb-2">Características Neurodivergentes</h4>
                    <ul className="space-y-1">
                      {informeFinal.conclusiones.rasgosClave.caracteristicasND.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-foreground leading-relaxed">
                    {informeFinal.conclusiones.resumenNarrativo}
                  </p>
                </div>
              </ContentBlock>

              {/* Recomendaciones */}
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-4">
                  Recomendaciones de Apoyo
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">En el Hogar</h4>
                    <ul className="space-y-2">
                      {informeFinal.recomendaciones.hogar.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground pl-4 border-l-2 border-primary">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">En el Entorno Escolar</h4>
                    <ul className="space-y-2">
                      {informeFinal.recomendaciones.escolar.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground pl-4 border-l-2 border-secondary">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ContentBlock>

              {/* Evaluación Profesional */}
              <ContentBlock variant="highlight">
                <h3 className="font-heading font-semibold text-lg mb-4">
                  Orientación para Evaluación Profesional
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Profesionales Sugeridos</h4>
                    <div className="flex flex-wrap gap-2">
                      {informeFinal.evaluacionProfesional.profesionalesSugeridos.map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Pruebas o Evaluaciones Sugeridas</h4>
                    <ul className="space-y-1">
                      {informeFinal.evaluacionProfesional.pruebasSugeridas.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Urgencia Recomendada</h4>
                    <p className="text-foreground">{informeFinal.evaluacionProfesional.urgencia}</p>
                  </div>
                </div>
              </ContentBlock>

              {/* Disclaimer */}
              <ContentBlock variant="warning">
                <div className="flex gap-4">
                  <AlertCircle className="w-6 h-6 text-warning-foreground shrink-0" />
                  <p className="text-sm leading-relaxed">
                    <strong>AVISO IMPORTANTE:</strong> {informeFinal.disclaimer}
                  </p>
                </div>
              </ContentBlock>

              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Informe generado para: <strong>{email}</strong>
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleDownloadPdf} disabled={isDownloadingPdf} className="gap-2">
                    {isDownloadingPdf ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generando PDF...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Descargar PDF
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetProcessHandler}>
                    Realizar nueva exploración
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
