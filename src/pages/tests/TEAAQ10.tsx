import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Loader2, Lock, FileText, Download, User, Users } from 'lucide-react';
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

// Tipos de perfil para el test diferenciado
type ProfileType = 'nino' | 'nina' | 'hombre' | 'mujer';

interface ProfileInfo {
  id: ProfileType;
  label: string;
  description: string;
  icon: 'child' | 'adult';
}

const profiles: ProfileInfo[] = [
  { id: 'nino', label: 'Niño (menor de 16)', description: 'Varón en edad infantil o adolescente', icon: 'child' },
  { id: 'nina', label: 'Niña (menor de 16)', description: 'Mujer en edad infantil o adolescente', icon: 'child' },
  { id: 'hombre', label: 'Hombre adulto', description: 'Varón mayor de 16 años', icon: 'adult' },
  { id: 'mujer', label: 'Mujer adulta', description: 'Mujer mayor de 16 años', icon: 'adult' },
];

// Opciones de respuesta
const frequencyOptions = [
  { value: 0, label: 'Nunca o rara vez' },
  { value: 1, label: 'A veces' },
  { value: 2, label: 'Frecuentemente' },
  { value: 3, label: 'Siempre o casi siempre' },
];

const agreementOptions = [
  { value: 0, label: 'Totalmente en desacuerdo' },
  { value: 1, label: 'En desacuerdo' },
  { value: 2, label: 'De acuerdo' },
  { value: 3, label: 'Totalmente de acuerdo' },
];

interface Question {
  id: number;
  text: string;
  options: { value: number; label: string }[];
  category: 'social' | 'sensorial' | 'rutinas' | 'comunicacion' | 'camuflaje' | 'intereses' | 'emocional';
  scoring: 'direct' | 'inverse'; // direct = mayor valor = más rasgos, inverse = menor valor = más rasgos
}

// ============================================
// PREGUNTAS ESPECÍFICAS POR PERFIL
// ============================================

const questionsNino: Question[] = [
  // COMUNICACIÓN SOCIAL
  { id: 1, text: 'Le cuesta mantener el contacto visual de forma natural durante las conversaciones.', options: frequencyOptions, category: 'comunicacion', scoring: 'direct' },
  { id: 2, text: 'Prefiere jugar solo o tiene dificultades para unirse a juegos grupales con otros niños.', options: frequencyOptions, category: 'social', scoring: 'direct' },
  { id: 3, text: 'Tiene dificultades para entender las bromas, el sarcasmo o el doble sentido.', options: frequencyOptions, category: 'comunicacion', scoring: 'direct' },
  { id: 4, text: 'Le resulta difícil reconocer cuando alguien está aburrido, molesto o no quiere seguir hablando.', options: frequencyOptions, category: 'social', scoring: 'direct' },
  
  // INTERESES RESTRINGIDOS (típicos masculinos)
  { id: 5, text: 'Tiene intereses muy intensos en temas específicos (dinosaurios, trenes, videojuegos, números, mapas) sobre los que puede hablar durante mucho tiempo.', options: frequencyOptions, category: 'intereses', scoring: 'direct' },
  { id: 6, text: 'Memoriza datos, estadísticas o información detallada sobre sus temas de interés de forma excepcional.', options: frequencyOptions, category: 'intereses', scoring: 'direct' },
  { id: 7, text: 'Se frustra o enfada si no puede dedicar tiempo a sus intereses especiales.', options: frequencyOptions, category: 'intereses', scoring: 'direct' },
  
  // RUTINAS Y RIGIDEZ
  { id: 8, text: 'Se altera mucho ante cambios inesperados en la rutina o los planes.', options: frequencyOptions, category: 'rutinas', scoring: 'direct' },
  { id: 9, text: 'Insiste en hacer las cosas siempre de la misma manera (mismo orden, mismo camino, mismos rituales).', options: frequencyOptions, category: 'rutinas', scoring: 'direct' },
  { id: 10, text: 'Tiene dificultades con las transiciones entre actividades.', options: frequencyOptions, category: 'rutinas', scoring: 'direct' },
  
  // SENSORIAL
  { id: 11, text: 'Es muy sensible a ciertos sonidos (ruidos fuertes, multitudes, determinadas voces o tonos).', options: frequencyOptions, category: 'sensorial', scoring: 'direct' },
  { id: 12, text: 'Tiene sensibilidades con las texturas de la ropa, etiquetas, costuras o ciertos tejidos.', options: frequencyOptions, category: 'sensorial', scoring: 'direct' },
  { id: 13, text: 'Es selectivo con la comida por texturas, olores o la forma en que está presentada.', options: frequencyOptions, category: 'sensorial', scoring: 'direct' },
  
  // MOVIMIENTOS Y CONDUCTAS REPETITIVAS
  { id: 14, text: 'Realiza movimientos repetitivos (aletear las manos, balancearse, girar objetos, saltar).', options: frequencyOptions, category: 'rutinas', scoring: 'direct' },
  { id: 15, text: 'Repite frases de películas, series o conversaciones de forma frecuente (ecolalia).', options: frequencyOptions, category: 'comunicacion', scoring: 'direct' },
  
  // EMOCIONAL Y REGULACIÓN
  { id: 16, text: 'Tiene rabietas o colapsos intensos que parecen desproporcionados ante la situación.', options: frequencyOptions, category: 'emocional', scoring: 'direct' },
  { id: 17, text: 'Le cuesta identificar o expresar sus propias emociones.', options: frequencyOptions, category: 'emocional', scoring: 'direct' },
  { id: 18, text: 'Parece no darse cuenta de las normas sociales no escritas que otros niños captan intuitivamente.', options: frequencyOptions, category: 'social', scoring: 'direct' },
];

const questionsNina: Question[] = [
  // COMUNICACIÓN SOCIAL - Presentación femenina
  { id: 1, text: 'Observa y copia el comportamiento de otras niñas para saber cómo actuar en situaciones sociales.', options: frequencyOptions, category: 'camuflaje', scoring: 'direct' },
  { id: 2, text: 'Tiene una o dos amigas muy cercanas pero le cuesta relacionarse en grupos grandes.', options: frequencyOptions, category: 'social', scoring: 'direct' },
  { id: 3, text: 'Practica mentalmente conversaciones o situaciones sociales antes de que ocurran.', options: frequencyOptions, category: 'camuflaje', scoring: 'direct' },
  { id: 4, text: 'Se siente agotada después de situaciones sociales (colegio, fiestas, reuniones familiares).', options: frequencyOptions, category: 'camuflaje', scoring: 'direct' },
  
  // CAMUFLAJE (más pronunciado en niñas)
  { id: 5, text: 'Fuerza el contacto visual aunque le resulte incómodo porque sabe que es "lo que hay que hacer".', options: frequencyOptions, category: 'camuflaje', scoring: 'direct' },
  { id: 6, text: 'Imita expresiones faciales, gestos o formas de hablar de personajes de TV/películas o de otras personas.', options: frequencyOptions, category: 'camuflaje', scoring: 'direct' },
  { id: 7, text: 'En casa se comporta de forma muy diferente a como lo hace en el colegio o con desconocidos.', options: frequencyOptions, category: 'camuflaje', scoring: 'direct' },
  
  // INTERESES RESTRINGIDOS (socialmente aceptables - pueden pasar desapercibidos)
  { id: 8, text: 'Tiene intereses intensos en temas como animales (caballos, gatos, perros), personajes de ficción, cantantes o series, de los que puede hablar mucho tiempo.', options: frequencyOptions, category: 'intereses', scoring: 'direct' },
  { id: 9, text: 'Colecciona información detallada sobre sus intereses (sabe todos los datos sobre un tema, dibuja constantemente lo mismo, investiga a fondo).', options: frequencyOptions, category: 'intereses', scoring: 'direct' },
  { id: 10, text: 'Lee o consume contenido sobre los mismos temas una y otra vez.', options: frequencyOptions, category: 'intereses', scoring: 'direct' },
  
  // SÍNTOMAS INTERNALIZADOS (ansiedad, perfeccionismo)
  { id: 11, text: 'Experimenta ansiedad frecuente, especialmente relacionada con situaciones sociales o cambios.', options: frequencyOptions, category: 'emocional', scoring: 'direct' },
  { id: 12, text: 'Es muy perfeccionista y se frustra intensamente cuando las cosas no salen como esperaba.', options: frequencyOptions, category: 'emocional', scoring: 'direct' },
  { id: 13, text: 'Tiene miedos intensos o fobias específicas.', options: frequencyOptions, category: 'emocional', scoring: 'direct' },
  
  // SENSORIAL
  { id: 14, text: 'Es muy sensible a texturas de ropa, etiquetas, costuras o ciertos tejidos.', options: frequencyOptions, category: 'sensorial', scoring: 'direct' },
  { id: 15, text: 'Se siente abrumada en lugares con mucha gente, ruido o estimulación sensorial.', options: frequencyOptions, category: 'sensorial', scoring: 'direct' },
  { id: 16, text: 'Tiene rituales o comportamientos repetitivos sutiles (tocarse el pelo, rascarse, ordenar cosas).', options: frequencyOptions, category: 'rutinas', scoring: 'direct' },
  
  // COMUNICACIÓN Y EMPATÍA
  { id: 17, text: 'A veces dice cosas que otros consideran "inapropiadas" o "demasiado directas" sin darse cuenta.', options: frequencyOptions, category: 'comunicacion', scoring: 'direct' },
  { id: 18, text: 'Tiene dificultades para entender las "reglas no escritas" de las relaciones sociales entre niñas.', options: frequencyOptions, category: 'social', scoring: 'direct' },
  
  // IMAGINACIÓN Y JUEGO
  { id: 19, text: 'Prefiere el juego imaginativo en solitario o controla mucho el guion cuando juega con otros.', options: frequencyOptions, category: 'social', scoring: 'direct' },
  { id: 20, text: 'Se identifica más con personajes de ficción, animales o adultos que con niños de su edad.', options: frequencyOptions, category: 'social', scoring: 'direct' },
];

const questionsHombre: Question[] = [
  // COMUNICACIÓN SOCIAL
  { id: 1, text: 'Me resulta difícil mantener una conversación casual o "charla trivial".', options: agreementOptions, category: 'comunicacion', scoring: 'direct' },
  { id: 2, text: 'Prefiero actividades en solitario o con pocas personas a los eventos sociales grandes.', options: agreementOptions, category: 'social', scoring: 'direct' },
  { id: 3, text: 'Me cuesta interpretar el lenguaje corporal, las expresiones faciales o el tono de voz de otros.', options: agreementOptions, category: 'comunicacion', scoring: 'direct' },
  { id: 4, text: 'Las personas me han dicho que soy "demasiado directo" o "insensible" aunque no era mi intención.', options: agreementOptions, category: 'comunicacion', scoring: 'direct' },
  { id: 5, text: 'Me resulta difícil saber cuándo es mi turno de hablar en una conversación.', options: agreementOptions, category: 'comunicacion', scoring: 'direct' },
  
  // INTERESES RESTRINGIDOS
  { id: 6, text: 'Tengo intereses muy intensos y específicos en los que puedo pasar horas sin darme cuenta.', options: agreementOptions, category: 'intereses', scoring: 'direct' },
  { id: 7, text: 'Acumulo conocimiento detallado sobre mis temas de interés que otros consideran excesivo.', options: agreementOptions, category: 'intereses', scoring: 'direct' },
  { id: 8, text: 'A veces me cuesta cambiar de tema o dejar de hablar sobre mis intereses aunque noto que la otra persona no está interesada.', options: agreementOptions, category: 'intereses', scoring: 'direct' },
  
  // RUTINAS Y RIGIDEZ
  { id: 9, text: 'Los cambios inesperados en mis planes o rutinas me generan malestar significativo.', options: agreementOptions, category: 'rutinas', scoring: 'direct' },
  { id: 10, text: 'Tengo rutinas específicas que prefiero no alterar (orden de actividades, caminos, rituales).', options: agreementOptions, category: 'rutinas', scoring: 'direct' },
  { id: 11, text: 'Me resulta difícil ser flexible cuando las cosas no salen como las había planificado.', options: agreementOptions, category: 'rutinas', scoring: 'direct' },
  
  // SENSORIAL
  { id: 12, text: 'Soy muy sensible a ciertos sonidos, luces, olores o texturas que otros parecen ignorar.', options: agreementOptions, category: 'sensorial', scoring: 'direct' },
  { id: 13, text: 'Me siento abrumado en lugares con mucha estimulación sensorial (centros comerciales, conciertos, fiestas).', options: agreementOptions, category: 'sensorial', scoring: 'direct' },
  { id: 14, text: 'Tengo movimientos repetitivos que hago cuando estoy estresado, emocionado o concentrado (mover la pierna, tamborilear, balancearme).', options: agreementOptions, category: 'rutinas', scoring: 'direct' },
  
  // EMOCIONAL Y REGULACIÓN
  { id: 15, text: 'Me cuesta identificar o poner nombre a mis propias emociones.', options: agreementOptions, category: 'emocional', scoring: 'direct' },
  { id: 16, text: 'A veces tengo reacciones emocionales intensas que otros consideran desproporcionadas.', options: agreementOptions, category: 'emocional', scoring: 'direct' },
  
  // FUNCIONAMIENTO EJECUTIVO
  { id: 17, text: 'Me resulta difícil realizar varias tareas a la vez o cambiar rápidamente entre tareas.', options: agreementOptions, category: 'rutinas', scoring: 'direct' },
  { id: 18, text: 'Tiendo a pensar en términos muy literales y me cuesta entender metáforas o expresiones figuradas.', options: agreementOptions, category: 'comunicacion', scoring: 'direct' },
];

const questionsMujer: Question[] = [
  // CAMUFLAJE Y MASKING (muy relevante para mujeres)
  { id: 1, text: 'A menudo me siento como si estuviera "actuando" un papel en situaciones sociales.', options: agreementOptions, category: 'camuflaje', scoring: 'direct' },
  { id: 2, text: 'Copio conscientemente el comportamiento, gestos o expresiones de otros para encajar.', options: agreementOptions, category: 'camuflaje', scoring: 'direct' },
  { id: 3, text: 'Practico mentalmente conversaciones o situaciones sociales antes de que ocurran.', options: agreementOptions, category: 'camuflaje', scoring: 'direct' },
  { id: 4, text: 'Después de eventos sociales me siento completamente agotada y necesito tiempo sola para recuperarme.', options: agreementOptions, category: 'camuflaje', scoring: 'direct' },
  { id: 5, text: 'Me comporto de forma muy diferente en casa (mi "yo real") comparado con el trabajo o situaciones sociales.', options: agreementOptions, category: 'camuflaje', scoring: 'direct' },
  { id: 6, text: 'Fuerzo el contacto visual aunque me resulte incómodo porque sé que es esperado socialmente.', options: agreementOptions, category: 'camuflaje', scoring: 'direct' },
  
  // COMUNICACIÓN SOCIAL - Presentación femenina
  { id: 7, text: 'Puedo mantener conversaciones superficiales, pero me resulta difícil profundizar en amistades.', options: agreementOptions, category: 'social', scoring: 'direct' },
  { id: 8, text: 'A menudo no entiendo las "reglas no escritas" de las dinámicas sociales femeninas (grupos, conflictos indirectos).', options: agreementOptions, category: 'social', scoring: 'direct' },
  { id: 9, text: 'Me han descrito como "diferente", "rara", "demasiado intensa" o "demasiado sensible" desde la infancia.', options: agreementOptions, category: 'social', scoring: 'direct' },
  { id: 10, text: 'Prefiero conversaciones profundas y significativas sobre temas específicos a la charla casual.', options: agreementOptions, category: 'comunicacion', scoring: 'direct' },
  
  // INTERESES RESTRINGIDOS (socialmente aceptables en mujeres)
  { id: 11, text: 'Tengo intereses intensos (series, libros, celebridades, animales, causas, hobbies) sobre los que investigo a fondo y puedo hablar extensamente.', options: agreementOptions, category: 'intereses', scoring: 'direct' },
  { id: 12, text: 'Cuando algo me interesa, me sumerjo completamente hasta saber todo sobre el tema.', options: agreementOptions, category: 'intereses', scoring: 'direct' },
  { id: 13, text: 'Mis intereses intensos han sido una fuente importante de bienestar y regulación emocional.', options: agreementOptions, category: 'intereses', scoring: 'direct' },
  
  // SÍNTOMAS INTERNALIZADOS
  { id: 14, text: 'He experimentado ansiedad significativa, especialmente relacionada con situaciones sociales.', options: agreementOptions, category: 'emocional', scoring: 'direct' },
  { id: 15, text: 'He pasado por períodos de depresión o agotamiento severo (burnout).', options: agreementOptions, category: 'emocional', scoring: 'direct' },
  { id: 16, text: 'He tenido problemas con la alimentación (restricciones, texturas, rituales) o con la imagen corporal.', options: agreementOptions, category: 'emocional', scoring: 'direct' },
  { id: 17, text: 'Soy muy perfeccionista y autocrítica, especialmente con mis interacciones sociales.', options: agreementOptions, category: 'emocional', scoring: 'direct' },
  
  // SENSORIAL
  { id: 18, text: 'Soy muy sensible a texturas (ropa, etiquetas, ciertos tejidos), sonidos, luces u olores.', options: agreementOptions, category: 'sensorial', scoring: 'direct' },
  { id: 19, text: 'Me siento abrumada en lugares con mucha estimulación sensorial y necesito "escapar" o recuperarme después.', options: agreementOptions, category: 'sensorial', scoring: 'direct' },
  { id: 20, text: 'Tengo comportamientos de auto-regulación (stimming) que pueden ser sutiles: jugar con el pelo, rascarse, morder labios, balancearse.', options: agreementOptions, category: 'rutinas', scoring: 'direct' },
  
  // RUTINAS
  { id: 21, text: 'Los cambios inesperados me generan un malestar significativo.', options: agreementOptions, category: 'rutinas', scoring: 'direct' },
  { id: 22, text: 'Tengo rutinas o rituales que me ayudan a sentirme segura y regulada.', options: agreementOptions, category: 'rutinas', scoring: 'direct' },
  
  // DIFICULTADES HISTÓRICAS
  { id: 23, text: 'De niña/adolescente me costaba encajar con otras niñas y entender sus dinámicas sociales.', options: agreementOptions, category: 'social', scoring: 'direct' },
  { id: 24, text: 'He recibido diagnósticos previos de ansiedad, depresión, TOC, TLP o trastorno alimentario antes de considerar el TEA.', options: agreementOptions, category: 'emocional', scoring: 'direct' },
];

// Función para calcular resultados
const calculateResult = (answers: Record<number, number>, questions: Question[], profile: ProfileType) => {
  let score = 0;
  let maxScore = 0;
  
  // Puntuación por categorías
  const categoryScores: Record<string, { score: number; max: number }> = {};
  
  questions.forEach((q) => {
    const answer = answers[q.id] ?? 0;
    const pointsEarned = q.scoring === 'direct' ? answer : (3 - answer);
    
    score += pointsEarned;
    maxScore += 3;
    
    if (!categoryScores[q.category]) {
      categoryScores[q.category] = { score: 0, max: 0 };
    }
    categoryScores[q.category].score += pointsEarned;
    categoryScores[q.category].max += 3;
  });

  const percentage = (score / maxScore) * 100;
  
  // Determinar banda de riesgo
  let banda: string;
  let descripcion: string;
  let color: 'success' | 'warning' | 'destructive';

  // Ajustar umbrales según perfil (mujeres/niñas tienden a puntuar más bajo por camuflaje)
  const isFemalProfile = profile === 'mujer' || profile === 'nina';
  const highThreshold = isFemalProfile ? 45 : 50;
  const mediumThreshold = isFemalProfile ? 30 : 35;

  if (percentage >= highThreshold) {
    banda = 'Evaluación profesional recomendada';
    if (isFemalProfile) {
      descripcion = `Tu puntuación indica una presencia significativa de rasgos asociados al espectro autista. Es importante destacar que el autismo en ${profile === 'mujer' ? 'mujeres' : 'niñas'} frecuentemente pasa desapercibido debido al camuflaje social. Una evaluación especializada podría proporcionarte claridad y acceso a apoyo adecuado.`;
    } else {
      descripcion = 'Tu puntuación indica una presencia significativa de rasgos asociados al espectro autista. Se recomienda buscar una evaluación profesional especializada para un análisis más detallado.';
    }
    color = 'destructive';
  } else if (percentage >= mediumThreshold) {
    banda = 'Algunos rasgos presentes';
    if (isFemalProfile) {
      descripcion = `Tu puntuación muestra algunos rasgos que pueden estar asociados al espectro autista. Dado que ${profile === 'mujer' ? 'las mujeres' : 'las niñas'} a menudo desarrollan estrategias de camuflaje que pueden enmascarar la presentación, considera una evaluación si experimentas dificultades en tu vida diaria o sientes que "actúas" para encajar socialmente.`;
    } else {
      descripcion = 'Tu puntuación indica la presencia de algunos rasgos que pueden estar asociados al espectro autista. Podrías considerar una evaluación profesional si experimentas dificultades significativas en tu vida diaria.';
    }
    color = 'warning';
  } else {
    banda = 'Bajo nivel de indicadores';
    descripcion = 'Tu puntuación no indica una probabilidad elevada de estar en el espectro autista según este screening. Sin embargo, esto no descarta completamente la posibilidad, especialmente si experimentas dificultades significativas. Si tienes dudas, consultar con un profesional especializado es siempre una opción válida.';
    color = 'success';
  }

  return {
    puntuacion: score,
    maxPuntuacion: maxScore,
    banda,
    descripcion,
    color,
    categoryScores,
    percentage,
  };
};

// Componente principal
export default function TEADiferenciadoTest() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'profile' | 'intro' | 'questions' | 'results'>('profile');
  const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<ReturnType<typeof calculateResult> | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [premiumPdfUrl, setPremiumPdfUrl] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Obtener preguntas según perfil
  const getQuestionsForProfile = (profile: ProfileType): Question[] => {
    switch (profile) {
      case 'nino': return questionsNino;
      case 'nina': return questionsNina;
      case 'hombre': return questionsHombre;
      case 'mujer': return questionsMujer;
      default: return [];
    }
  };

  const questions = selectedProfile ? getQuestionsForProfile(selectedProfile) : [];
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  const currentAnswer = questions[currentQuestion] ? answers[questions[currentQuestion].id] : undefined;

  const handleProfileSelect = (profile: ProfileType) => {
    setSelectedProfile(profile);
    setCurrentStep('intro');
    setAnswers({});
    setCurrentQuestion(0);
  };

  const handleAnswer = (value: number) => {
    if (questions[currentQuestion]) {
      setAnswers((prev) => ({
        ...prev,
        [questions[currentQuestion].id]: value,
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else if (selectedProfile) {
      const testResult = calculateResult(answers, questions, selectedProfile);
      setResult(testResult);
      setCurrentStep('results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleGetAnalysis = async () => {
    if (!result || !selectedProfile) return;
    
    setLoadingAnalysis(true);
    try {
      const profileLabels: Record<ProfileType, string> = {
        nino: 'niño',
        nina: 'niña',
        hombre: 'hombre adulto',
        mujer: 'mujer adulta'
      };

      const { data, error } = await supabase.functions.invoke('test-analyzer', {
        body: {
          testName: `Screening TEA Diferenciado - Perfil: ${profileLabels[selectedProfile]}`,
          puntuacion: result.puntuacion,
          banda: result.banda,
          maxPuntuacion: result.maxPuntuacion,
          additionalContext: `Perfil evaluado: ${profileLabels[selectedProfile]}. Porcentaje: ${result.percentage.toFixed(1)}%. Este test incluye evaluación de camuflaje social, intereses restringidos adaptados al género, y síntomas internalizados.`,
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

    if (!result || !selectedProfile) return;

    setLoadingPayment(true);
    try {
      sessionStorage.setItem('test_result_tea-diferenciado', JSON.stringify({ ...result, profile: selectedProfile }));
      sessionStorage.setItem('test_answers_tea-diferenciado', JSON.stringify(answers));

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          product_type: 'test_premium',
          test_type: 'tea-diferenciado',
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Error al procesar el pago. Inténtalo de nuevo.');
      sessionStorage.removeItem('test_result_tea-diferenciado');
      sessionStorage.removeItem('test_answers_tea-diferenciado');
    } finally {
      setLoadingPayment(false);
    }
  };

  const generatePremiumPdf = async () => {
    if (!result || !selectedProfile) return;

    setGeneratingPdf(true);
    try {
      const profileLabels: Record<ProfileType, string> = {
        nino: 'niño',
        nina: 'niña',
        hombre: 'hombre adulto',
        mujer: 'mujer adulta'
      };

      const { data, error } = await supabase.functions.invoke('generate-pdf', {
        body: {
          type: 'test_premium',
          testName: `Screening TEA Diferenciado - ${profileLabels[selectedProfile]}`,
          testId: 'tea-diferenciado',
          puntuacion: result.puntuacion,
          maxPuntuacion: result.maxPuntuacion,
          banda: result.banda,
          descripcion: result.descripcion,
          answers: answers,
          questions: questions,
          profile: selectedProfile,
        },
      });

      if (error) throw error;

      if (data?.pdfBase64) {
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
    setCurrentStep('profile');
    setSelectedProfile(null);
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setAiAnalysis(null);
    setIsPremiumUnlocked(false);
    setPremiumPdfUrl(null);
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      social: 'Interacción Social',
      sensorial: 'Procesamiento Sensorial',
      rutinas: 'Rutinas y Flexibilidad',
      comunicacion: 'Comunicación',
      camuflaje: 'Camuflaje Social',
      intereses: 'Intereses Intensos',
      emocional: 'Regulación Emocional',
    };
    return labels[category] || category;
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
            <SectionTitle as="h1" subtitle="Screening adaptado según género y edad para una detección más precisa del espectro autista.">
              Screening TEA Diferenciado
            </SectionTitle>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          
          {/* Profile Selection Step */}
          {currentStep === 'profile' && (
            <div className="animate-fade-in">
              <ContentBlock className="mb-6">
                <h2 className="font-heading font-semibold text-xl mb-2">¿Para quién es este test?</h2>
                <p className="text-muted-foreground mb-6">
                  El autismo se manifiesta de forma diferente según el género y la edad. Selecciona el perfil para obtener preguntas adaptadas y una evaluación más precisa.
                </p>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {profiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => handleProfileSelect(profile.id)}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        {profile.icon === 'child' ? (
                          <User className="w-6 h-6 text-primary" />
                        ) : (
                          <Users className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{profile.label}</h3>
                        <p className="text-sm text-muted-foreground">{profile.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </ContentBlock>

              <ContentBlock variant="warning">
                <div className="flex gap-4">
                  <AlertCircle className="w-6 h-6 text-warning-foreground shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">¿Por qué un test diferenciado?</h3>
                    <p className="text-sm text-muted-foreground">
                      La investigación muestra que el autismo se presenta de forma diferente en mujeres y niñas, quienes a menudo desarrollan estrategias de "camuflaje" que enmascaran los síntomas típicos. Este test incluye preguntas específicas para detectar estos patrones frecuentemente pasados por alto.
                    </p>
                  </div>
                </div>
              </ContentBlock>
            </div>
          )}

          {/* Intro Step */}
          {currentStep === 'intro' && selectedProfile && (
            <div className="animate-fade-in">
              <ContentBlock className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {(selectedProfile === 'nino' || selectedProfile === 'nina') ? (
                      <User className="w-5 h-5 text-primary" />
                    ) : (
                      <Users className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Perfil seleccionado</h3>
                    <p className="text-sm text-muted-foreground">
                      {profiles.find(p => p.id === selectedProfile)?.label}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setCurrentStep('profile')}
                    className="ml-auto"
                  >
                    Cambiar
                  </Button>
                </div>

                <h2 className="font-heading font-semibold text-xl mb-4">Instrucciones</h2>
                <p className="text-muted-foreground mb-4">
                  {selectedProfile === 'nina' || selectedProfile === 'mujer' 
                    ? 'Este test ha sido diseñado para captar la presentación del autismo típica en el género femenino, incluyendo el camuflaje social, los intereses intensos en áreas socialmente aceptables, y los síntomas internalizados como ansiedad.'
                    : 'Lee cada afirmación y selecciona la opción que mejor describe la situación. Responde basándote en el comportamiento habitual, no en situaciones puntuales.'
                  }
                </p>
                <p className="text-muted-foreground mb-6">
                  No hay respuestas correctas o incorrectas. Responde con honestidad para obtener un resultado más preciso.
                </p>
                
                <div className="flex gap-4 text-sm text-muted-foreground mb-6">
                  <span>{questions.length} preguntas</span>
                  <span>·</span>
                  <span>~{Math.ceil(questions.length * 0.4)} minutos</span>
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
                    <p className="text-sm text-muted-foreground">
                      Este es un test de screening orientativo, NO un diagnóstico. Solo un profesional especializado (psicólogo clínico, neuropsicólogo o psiquiatra con experiencia en TEA) puede realizar un diagnóstico formal de Trastorno del Espectro Autista.
                    </p>
                  </div>
                </div>
              </ContentBlock>
            </div>
          )}

          {/* Questions Step */}
          {currentStep === 'questions' && questions.length > 0 && (
            <div className="animate-fade-in">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Category indicator */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                  {getCategoryLabel(questions[currentQuestion].category)}
                </span>
              </div>

              {/* Question */}
              <ContentBlock className="mb-6">
                <h2 className="font-heading font-medium text-lg mb-6">
                  {questions[currentQuestion].text}
                </h2>

                <RadioGroup
                  value={currentAnswer?.toString()}
                  onValueChange={(value) => handleAnswer(parseInt(value))}
                  className="space-y-3"
                >
                  {questions[currentQuestion].options.map((option) => (
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
                  {currentQuestion === questions.length - 1 ? 'Ver Resultados' : 'Siguiente'}
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
                  {result.percentage.toFixed(0)}%
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  ({result.puntuacion} / {result.maxPuntuacion} puntos)
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

              {/* Category Breakdown */}
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-4">Desglose por Áreas</h3>
                <div className="space-y-4">
                  {Object.entries(result.categoryScores).map(([category, scores]) => {
                    const categoryPercentage = (scores.score / scores.max) * 100;
                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{getCategoryLabel(category)}</span>
                          <span className="text-muted-foreground">{categoryPercentage.toFixed(0)}%</span>
                        </div>
                        <Progress value={categoryPercentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
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
                          <a href={premiumPdfUrl} download="informe-tea-diferenciado.pdf">
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
                        Análisis exhaustivo por categorías
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        Interpretación adaptada a tu perfil ({profiles.find(p => p.id === selectedProfile)?.label})
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        Recomendaciones personalizadas
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        Información sobre camuflaje y próximos pasos
                      </li>
                    </ul>

                    {user ? (
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
                            Desbloquear por 0,99€
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-3">
                          Inicia sesión para acceder al análisis premium
                        </p>
                        <Button asChild variant="outline">
                          <Link to="/auth">Iniciar Sesión</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </ContentBlock>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" onClick={restartTest}>
                  Repetir Test
                </Button>
                <Button asChild variant="outline">
                  <Link to="/tests">Ver Otros Tests</Link>
                </Button>
              </div>

              {/* Disclaimer */}
              <ContentBlock variant="warning">
                <div className="flex gap-4">
                  <AlertCircle className="w-6 h-6 text-warning-foreground shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Recordatorio Importante</h3>
                    <p className="text-sm text-muted-foreground">
                      Este test es una herramienta de screening orientativa, NO un diagnóstico clínico. El Trastorno del Espectro Autista solo puede ser diagnosticado por un profesional especializado mediante una evaluación exhaustiva. Si los resultados sugieren rasgos significativos o si experimentas dificultades en tu vida diaria, te recomendamos consultar con un psicólogo clínico o neuropsicólogo especializado en TEA.
                    </p>
                  </div>
                </div>
              </ContentBlock>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
