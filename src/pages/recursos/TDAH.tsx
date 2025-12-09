import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, ArrowRight, Users, Baby, User, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TDAHPage() {
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
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold">TDAH</h1>
              <p className="text-muted-foreground">Trastorno por Déficit de Atención e Hiperactividad</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Definición */}
          <section>
            <SectionTitle as="h2">¿Qué es el TDAH?</SectionTitle>
            <ContentBlock>
              <p className="text-lg mb-4">
                El TDAH es una condición del neurodesarrollo caracterizada por diferencias en la 
                <strong> atención</strong>, <strong>impulsividad</strong> y <strong>regulación de la energía</strong>.
              </p>
              <p className="text-muted-foreground">
                Afecta aproximadamente al 5% de la población mundial. No es falta de voluntad o 
                inteligencia, sino una diferencia en cómo el cerebro regula la atención, las 
                emociones y el comportamiento. Las personas con TDAH a menudo tienen fortalezas 
                en creatividad, pensamiento divergente y capacidad de hiperfoco.
              </p>
            </ContentBlock>
          </section>

          {/* Características clave */}
          <section>
            <SectionTitle as="h2">Características Clave</SectionTitle>
            <div className="grid md:grid-cols-3 gap-4">
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Inatención</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Dificultad para mantener la atención</li>
                  <li>• Olvidos frecuentes</li>
                  <li>• Dificultad para organizar tareas</li>
                  <li>• Evitación de tareas que requieren esfuerzo mental sostenido</li>
                  <li>• Perder objetos con frecuencia</li>
                </ul>
              </ContentBlock>
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Hiperactividad</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Inquietud física o mental</li>
                  <li>• Dificultad para permanecer sentado</li>
                  <li>• Sensación de estar "acelerado"</li>
                  <li>• Hablar excesivamente</li>
                  <li>• Dificultad para relajarse</li>
                </ul>
              </ContentBlock>
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Impulsividad</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Responder antes de que terminen la pregunta</li>
                  <li>• Dificultad para esperar turno</li>
                  <li>• Interrumpir conversaciones</li>
                  <li>• Tomar decisiones precipitadas</li>
                  <li>• Dificultad con la autorregulación</li>
                </ul>
              </ContentBlock>
            </div>
          </section>

          {/* Manifestaciones por grupo */}
          <section>
            <SectionTitle as="h2" subtitle="El TDAH se manifiesta de forma diferente según la edad y el género">
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
                  <h3 className="font-heading font-semibold text-lg mb-4">TDAH en la Infancia</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      En niños, el TDAH suele manifestarse con hiperactividad más visible: 
                      correr, trepar, dificultad para quedarse quietos. Los problemas académicos 
                      suelen ser la señal de alarma más común.
                    </p>
                    <p>
                      Las niñas frecuentemente presentan el subtipo inatento, lo que puede 
                      pasar desapercibido. Suelen ser descritas como "soñadoras" o "despistadas" 
                      sin que se sospeche TDAH.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
              
              <TabsContent value="adultos">
                <ContentBlock>
                  <h3 className="font-heading font-semibold text-lg mb-4">TDAH en la Edad Adulta</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      La hiperactividad física suele transformarse en inquietud interna, 
                      sensación de estar "acelerado mentalmente", dificultad para relajarse.
                    </p>
                    <p>
                      Los adultos con TDAH suelen luchar con la gestión del tiempo, la 
                      organización, las finanzas y el mantenimiento de relaciones. Muchos 
                      desarrollan ansiedad o depresión como consecuencia de años sin diagnóstico.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
              
              <TabsContent value="mujeres">
                <ContentBlock>
                  <h3 className="font-heading font-semibold text-lg mb-4">TDAH en Mujeres</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Las mujeres con TDAH han sido históricamente infradiagnosticadas. 
                      Suelen presentar el subtipo inatento y desarrollar estrategias de 
                      compensación que enmascaran los síntomas.
                    </p>
                    <p>
                      Los cambios hormonales (menstruación, embarazo, menopausia) pueden 
                      intensificar los síntomas. Muchas mujeres no son diagnosticadas hasta 
                      la edad adulta, cuando las estrategias de compensación dejan de funcionar.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
            </Tabs>
          </section>

          {/* CTA Test */}
          <section>
            <ContentBlock className="text-center bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/20">
              <Zap className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h2 className="font-heading font-semibold text-xl mb-2">
                ¿Te identificas con estas características?
              </h2>
              <p className="text-muted-foreground mb-6">
                Realiza nuestro test de screening ASRS para adultos y obtén una orientación inicial.
              </p>
              <Button asChild className="gap-2">
                <Link to="/tests/tdah-adultos">
                  Realizar Test TDAH
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
                  (psiquiatra, neuropsicólogo) puede realizar un diagnóstico de TDAH. Si te 
                  identificas con estas características, te animamos a buscar una evaluación profesional.
                </p>
              </div>
            </div>
          </ContentBlock>
        </div>
      </div>
    </Layout>
  );
}
