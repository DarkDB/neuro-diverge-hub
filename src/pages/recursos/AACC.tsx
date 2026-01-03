import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, ArrowRight, Users, Baby, User, AlertCircle, Lightbulb } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AACCPage() {
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
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-purple-500" />
            </div>
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold">AACC</h1>
              <p className="text-muted-foreground">Altas Capacidades Cognitivas</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Definición */}
          <section>
            <SectionTitle as="h2">¿Qué son las Altas Capacidades?</SectionTitle>
            <ContentBlock>
              <p className="text-lg mb-4">
                Las Altas Capacidades Cognitivas (AACC) se refieren a una capacidad intelectual 
                significativamente superior a la media, junto con <strong>alta creatividad</strong> y 
                <strong> alta motivación hacia el aprendizaje</strong>.
              </p>
              <p className="text-muted-foreground">
                Las AACC van más allá de un CI alto. Incluyen características como intensidad 
                emocional, sensibilidad, pensamiento divergente, curiosidad insaciable y una 
                profunda necesidad de comprensión. No es simplemente "ser listo", sino una 
                forma diferente de procesar el mundo.
              </p>
            </ContentBlock>
          </section>

          {/* Características clave */}
          <section>
            <SectionTitle as="h2">Características Clave</SectionTitle>
            <div className="grid md:grid-cols-3 gap-4">
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Cognitivas</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Aprendizaje rápido y profundo</li>
                  <li>• Excelente memoria</li>
                  <li>• Pensamiento abstracto temprano</li>
                  <li>• Conexión de conceptos complejos</li>
                  <li>• Curiosidad intensa y diversa</li>
                </ul>
              </ContentBlock>
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Emocionales</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Intensidad emocional</li>
                  <li>• Alta sensibilidad</li>
                  <li>• Fuerte sentido de la justicia</li>
                  <li>• Empatía profunda</li>
                  <li>• Perfeccionismo</li>
                </ul>
              </ContentBlock>
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Conductuales</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Necesidad de estimulación intelectual</li>
                  <li>• Cuestionamiento de la autoridad</li>
                  <li>• Preferencia por compañía de adultos o mayores</li>
                  <li>• Intereses inusuales para su edad</li>
                  <li>• Aburrimiento con tareas repetitivas</li>
                </ul>
              </ContentBlock>
            </div>
          </section>

          {/* Manifestaciones por grupo */}
          <section>
            <SectionTitle as="h2" subtitle="Las AACC se manifiestan de forma diferente según la edad y el género">
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
                  <h3 className="font-heading font-semibold text-lg mb-4">AACC en la Infancia</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Los niños con AACC pueden mostrar desarrollo temprano del lenguaje, 
                      preguntas existenciales a edades tempranas, interés por temas complejos, 
                      y dificultad para relacionarse con compañeros de su edad.
                    </p>
                    <p>
                      Pueden parecer "diferentes" o tener dificultades en el sistema educativo 
                      tradicional si no reciben la estimulación adecuada. El aburrimiento en 
                      clase puede manifestarse como problemas de conducta o desinterés.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
              
              <TabsContent value="adultos">
                <ContentBlock>
                  <h3 className="font-heading font-semibold text-lg mb-4">AACC en la Edad Adulta</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Muchos adultos con AACC nunca fueron identificados en la infancia. 
                      Pueden experimentar sensación de ser "diferentes", dificultad para 
                      encajar, múltiples intereses que cambian frecuentemente, o frustración 
                      con entornos laborales poco estimulantes.
                    </p>
                    <p>
                      La intensidad emocional y la sensibilidad pueden llevar a problemas 
                      de ansiedad o depresión si no se comprenden estas características 
                      como parte de las AACC.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
              
              <TabsContent value="mujeres">
                <ContentBlock>
                  <h3 className="font-heading font-semibold text-lg mb-4">AACC en Mujeres</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Las mujeres con AACC han sido históricamente infraidentificadas. 
                      A menudo ocultan sus capacidades para encajar socialmente, fenómeno 
                      conocido como "dumbing down" o hacerse las tontas.
                    </p>
                    <p>
                      La presión social para no destacar, combinada con el perfeccionismo 
                      y la intensidad emocional, puede resultar en ansiedad, síndrome del 
                      impostor o agotamiento. Muchas no se identifican hasta la edad adulta.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
            </Tabs>
          </section>

          {/* Sección 2E */}
          <section>
            <ContentBlock variant="highlight" className="border-purple-500/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-2">Doble Excepcionalidad (2E)</h3>
                  <p className="text-muted-foreground mb-4">
                    La doble excepcionalidad ocurre cuando las AACC coexisten con otra 
                    condición como TDAH, TEA, dislexia u otra dificultad de aprendizaje. 
                    Esto crea un perfil único donde las fortalezas pueden enmascarar las 
                    dificultades y viceversa.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Las personas 2E necesitan apoyo tanto para sus capacidades excepcionales 
                    como para sus desafíos específicos. Es común que ni las AACC ni la otra 
                    condición sean identificadas correctamente.
                  </p>
                </div>
              </div>
            </ContentBlock>
          </section>

          {/* CTA */}
          <section>
            <ContentBlock className="text-center bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
              <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h2 className="font-heading font-semibold text-xl mb-2">
                ¿Te identificas con estas características?
              </h2>
              <p className="text-muted-foreground mb-6">
                Explora nuestros tests de screening para comprender mejor tu perfil cognitivo.
              </p>
              <Button asChild className="gap-2">
                <Link to="/tests">
                  Ver Tests Disponibles
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
                  Esta información es educativa. La evaluación de AACC requiere una evaluación 
                  psicológica completa realizada por un profesional cualificado que incluya 
                  pruebas de inteligencia, creatividad y otras áreas. Si te identificas con 
                  estas características, te animamos a buscar una evaluación profesional.
                </p>
              </div>
            </div>
          </ContentBlock>
        </div>
      </div>
    </Layout>
  );
}
