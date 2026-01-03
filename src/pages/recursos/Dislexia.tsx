import { Link } from 'react-router-dom';
import { BookMarked, ArrowLeft, ArrowRight, Users, Baby, User, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DislexiaPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-20">
        <div className="container mx-auto">
          <Link 
            to="/recursos" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 focus-ring rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Recursos
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <BookMarked className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold">Dislexia</h1>
              <p className="text-muted-foreground">Dificultad en el procesamiento del lenguaje escrito</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Definición */}
          <section>
            <SectionTitle as="h2">¿Qué es la Dislexia?</SectionTitle>
            <ContentBlock>
              <p className="text-lg mb-4">
                La dislexia es una dificultad específica del aprendizaje que afecta principalmente 
                la <strong>lectura</strong>, la <strong>escritura</strong> y el <strong>procesamiento fonológico</strong>.
              </p>
              <p className="text-muted-foreground">
                No está relacionada con la inteligencia ni con la visión. Las personas con 
                dislexia procesan el lenguaje escrito de manera diferente. Muchas tienen 
                fortalezas notables en pensamiento visual, creatividad, resolución de 
                problemas y visión global.
              </p>
            </ContentBlock>
          </section>

          {/* Características clave */}
          <section>
            <SectionTitle as="h2">Características Clave</SectionTitle>
            <div className="grid md:grid-cols-3 gap-4">
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Lectura</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Lectura lenta y con esfuerzo</li>
                  <li>• Confusión de letras similares (b/d, p/q)</li>
                  <li>• Omisión o adición de palabras</li>
                  <li>• Dificultad para comprender lo leído</li>
                  <li>• Evitación de la lectura en voz alta</li>
                </ul>
              </ContentBlock>
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Escritura</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Errores ortográficos frecuentes</li>
                  <li>• Inversión de letras o números</li>
                  <li>• Dificultad con la puntuación</li>
                  <li>• Escritura desordenada</li>
                  <li>• Dificultad para copiar textos</li>
                </ul>
              </ContentBlock>
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Otras Áreas</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Dificultad con secuencias (días, meses)</li>
                  <li>• Confusión derecha/izquierda</li>
                  <li>• Dificultad para seguir instrucciones escritas</li>
                  <li>• Problemas con la gestión del tiempo</li>
                  <li>• Fatiga al leer o escribir</li>
                </ul>
              </ContentBlock>
            </div>
          </section>

          {/* Fortalezas */}
          <section>
            <SectionTitle as="h2">Fortalezas Asociadas</SectionTitle>
            <ContentBlock variant="highlight" className="border-green-500/30">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-3">Pensamiento Visual</h3>
                  <p className="text-sm text-muted-foreground">
                    Muchas personas con dislexia piensan en imágenes y tienen una excelente 
                    capacidad de visualización espacial. Esto les permite destacar en campos 
                    como el diseño, la arquitectura o la ingeniería.
                  </p>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-3">Visión Global</h3>
                  <p className="text-sm text-muted-foreground">
                    La capacidad de ver el "panorama completo" y hacer conexiones que otros 
                    no ven. Esto puede traducirse en creatividad empresarial y pensamiento 
                    innovador.
                  </p>
                </div>
              </div>
            </ContentBlock>
          </section>

          {/* Manifestaciones por grupo */}
          <section>
            <SectionTitle as="h2" subtitle="La dislexia se manifiesta de forma diferente según la edad">
              Manifestaciones
            </SectionTitle>
            
            <Tabs defaultValue="adultos" className="w-full">
              <TabsList className="w-full flex flex-wrap h-auto gap-2 bg-transparent p-0 mb-6">
                <TabsTrigger value="ninos" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Baby className="w-4 h-4" />
                  Niños/as
                </TabsTrigger>
                <TabsTrigger value="adultos" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <User className="w-4 h-4" />
                  Adultos
                </TabsTrigger>
                <TabsTrigger value="mujeres" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Users className="w-4 h-4" />
                  Mujeres
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="ninos">
                <ContentBlock>
                  <h3 className="font-heading font-semibold text-lg mb-4">Dislexia en la Infancia</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Las primeras señales pueden aparecer en preescolar: dificultad para 
                      aprender rimas, confusión con sonidos de letras, y retraso en el 
                      desarrollo del habla. En primaria, la lectura y escritura suponen 
                      un esfuerzo mucho mayor que para otros niños.
                    </p>
                    <p>
                      Sin identificación temprana, los niños pueden desarrollar baja autoestima, 
                      ansiedad escolar y rechazo hacia el aprendizaje académico.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
              
              <TabsContent value="adultos">
                <ContentBlock>
                  <h3 className="font-heading font-semibold text-lg mb-4">Dislexia en la Edad Adulta</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Muchos adultos con dislexia han desarrollado estrategias compensatorias, 
                      pero siguen experimentando dificultades con la lectura rápida, la 
                      ortografía, o la toma de notas. El esfuerzo extra puede resultar en 
                      fatiga.
                    </p>
                    <p>
                      En el entorno laboral, pueden evitar tareas que requieran lectura o 
                      escritura extensiva. La tecnología (correctores ortográficos, texto 
                      a voz) puede ser una gran aliada.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
              
              <TabsContent value="mujeres">
                <ContentBlock>
                  <h3 className="font-heading font-semibold text-lg mb-4">Dislexia en Mujeres</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Las mujeres con dislexia tienden a desarrollar estrategias de 
                      compensación más elaboradas, lo que puede retrasar el diagnóstico. 
                      Suelen esforzarse más para "encajar" y ocultar sus dificultades.
                    </p>
                    <p>
                      La presión adicional para el rendimiento perfecto puede llevar a 
                      ansiedad y agotamiento. Muchas no son diagnosticadas hasta la edad 
                      adulta, cuando reconocen sus dificultades persistentes.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
            </Tabs>
          </section>

          {/* CTA Test */}
          <section>
            <ContentBlock className="text-center bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
              <BookMarked className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="font-heading font-semibold text-xl mb-2">
                ¿Te identificas con estas características?
              </h2>
              <p className="text-muted-foreground mb-6">
                Realiza nuestro test de screening de dislexia y obtén una orientación inicial.
              </p>
              <Button asChild className="gap-2">
                <Link to="/tests/dislexia">
                  Realizar Test Dislexia
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </ContentBlock>
          </section>

          {/* Nota importante */}
          <ContentBlock variant="warning">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-warning-foreground shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Nota Importante</h3>
                <p className="text-sm text-muted-foreground">
                  Esta información es educativa. Solo un profesional cualificado (logopeda, 
                  neuropsicólogo, psicopedagogo) puede realizar un diagnóstico de dislexia 
                  mediante una evaluación completa. Si te identificas con estas características, 
                  te animamos a buscar una evaluación profesional.
                </p>
              </div>
            </div>
          </ContentBlock>
        </div>
      </div>
    </Layout>
  );
}
