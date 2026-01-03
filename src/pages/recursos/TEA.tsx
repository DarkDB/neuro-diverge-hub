import { Link } from 'react-router-dom';
import { Brain, ArrowLeft, ArrowRight, Users, Baby, User, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TEAPage() {
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
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Brain className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold">TEA</h1>
              <p className="text-muted-foreground">Trastorno del Espectro Autista</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Definición */}
          <section>
            <SectionTitle as="h2">¿Qué es el TEA?</SectionTitle>
            <ContentBlock>
              <p className="text-lg mb-4">
                El Trastorno del Espectro Autista es una condición del neurodesarrollo que afecta la 
                <strong> comunicación social</strong>, los <strong>patrones de comportamiento</strong> y los <strong>intereses</strong>.
              </p>
              <p className="text-muted-foreground">
                Se le llama "espectro" porque existe una amplia variedad de formas en que se 
                manifiesta. Cada persona autista es única, con su propia combinación de fortalezas 
                y desafíos. Muchas personas autistas tienen habilidades excepcionales en áreas 
                como el pensamiento lógico, la atención al detalle y el reconocimiento de patrones.
              </p>
            </ContentBlock>
          </section>

          {/* Características clave */}
          <section>
            <SectionTitle as="h2">Características Clave</SectionTitle>
            <div className="grid md:grid-cols-3 gap-4">
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Comunicación Social</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Dificultad con las señales sociales no verbales</li>
                  <li>• Preferencia por la comunicación directa</li>
                  <li>• Dificultad para mantener conversaciones recíprocas</li>
                  <li>• Interpretación literal del lenguaje</li>
                  <li>• Diferente uso del contacto visual</li>
                </ul>
              </ContentBlock>
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Patrones de Comportamiento</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Necesidad de rutinas y predictibilidad</li>
                  <li>• Movimientos repetitivos (stimming)</li>
                  <li>• Sensibilidad a cambios inesperados</li>
                  <li>• Rituales específicos</li>
                  <li>• Preferencia por el orden</li>
                </ul>
              </ContentBlock>
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Intereses e Hipersensibilidad</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Intereses intensos y profundos</li>
                  <li>• Sensibilidad sensorial (luz, sonido, texturas)</li>
                  <li>• Hiperfoco en temas específicos</li>
                  <li>• Atención excepcional a los detalles</li>
                  <li>• Memoria detallada en áreas de interés</li>
                </ul>
              </ContentBlock>
            </div>
          </section>

          {/* Manifestaciones por grupo */}
          <section>
            <SectionTitle as="h2" subtitle="El TEA se manifiesta de forma diferente según la edad y el género">
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
                  <h3 className="font-heading font-semibold text-lg mb-4">TEA en la Infancia</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      En la infancia, las señales pueden incluir retraso en el habla, preferencia 
                      por jugar solos, dificultad para entender las reglas sociales no escritas, 
                      y una conexión intensa con ciertos juguetes u objetos.
                    </p>
                    <p>
                      Algunos niños muestran habilidades avanzadas en áreas específicas como 
                      la memoria, las matemáticas o la música, mientras que pueden tener 
                      dificultades en situaciones sociales no estructuradas.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
              
              <TabsContent value="adultos">
                <ContentBlock>
                  <h3 className="font-heading font-semibold text-lg mb-4">TEA en la Edad Adulta</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Muchos adultos autistas han desarrollado estrategias de camuflaje 
                      (masking) para adaptarse socialmente, lo que puede llevar a agotamiento 
                      y problemas de salud mental.
                    </p>
                    <p>
                      Las dificultades pueden manifestarse en el entorno laboral (especialmente 
                      en la dinámica social), en las relaciones personales, y en la gestión 
                      de la sobrecarga sensorial del día a día.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
              
              <TabsContent value="mujeres">
                <ContentBlock>
                  <h3 className="font-heading font-semibold text-lg mb-4">TEA en Mujeres</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Las mujeres autistas han sido históricamente infradiagnosticadas debido 
                      a que los criterios diagnósticos se desarrollaron principalmente observando 
                      a hombres. Las mujeres suelen hacer más "masking" y camuflaje social.
                    </p>
                    <p>
                      Sus intereses especiales pueden ser más "socialmente aceptables" (animales, 
                      psicología, literatura), lo que dificulta la identificación. Muchas 
                      reciben diagnóstico tardío en la edad adulta.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
            </Tabs>
          </section>

          {/* CTA Test */}
          <section>
            <ContentBlock className="text-center bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
              <Brain className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h2 className="font-heading font-semibold text-xl mb-2">
                ¿Te identificas con estas características?
              </h2>
              <p className="text-muted-foreground mb-6">
                Realiza nuestro test de screening AQ-10 y obtén una orientación inicial.
              </p>
              <Button asChild className="gap-2">
                <Link to="/tests/tea-aq10">
                  Realizar Test TEA
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
                  Esta información es educativa. Solo un profesional de la salud cualificado 
                  (psicólogo clínico, neuropsicólogo, psiquiatra) puede realizar un diagnóstico 
                  de TEA. Si te identificas con estas características, te animamos a buscar 
                  una evaluación profesional.
                </p>
              </div>
            </div>
          </ContentBlock>
        </div>
      </div>
    </Layout>
  );
}
