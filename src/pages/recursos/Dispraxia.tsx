import { Link } from 'react-router-dom';
import { Move, ArrowLeft, ArrowRight, Users, Baby, User, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DispraxiaPage() {
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
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center">
              <Move className="w-8 h-8 text-teal-500" />
            </div>
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold">Dispraxia</h1>
              <p className="text-muted-foreground">Trastorno del Desarrollo de la Coordinación (TDC)</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Definición */}
          <section>
            <SectionTitle as="h2">¿Qué es la Dispraxia?</SectionTitle>
            <ContentBlock>
              <p className="text-lg mb-4">
                La dispraxia, también conocida como Trastorno del Desarrollo de la Coordinación (TDC), 
                afecta la <strong>planificación motora</strong>, la <strong>coordinación</strong> y 
                el <strong>procesamiento sensorial</strong>.
              </p>
              <p className="text-muted-foreground">
                No es simplemente "ser torpe". El cerebro tiene dificultades para planificar 
                y ejecutar movimientos de forma automática. Tareas que otros realizan sin 
                pensar requieren un esfuerzo consciente significativo. Las personas con 
                dispraxia suelen tener fortalezas en pensamiento estratégico, creatividad 
                y determinación.
              </p>
            </ContentBlock>
          </section>

          {/* Características clave */}
          <section>
            <SectionTitle as="h2">Características Clave</SectionTitle>
            <div className="grid md:grid-cols-3 gap-4">
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Motricidad Gruesa</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Dificultad con el equilibrio</li>
                  <li>• Torpeza general</li>
                  <li>• Problemas con deportes</li>
                  <li>• Fatiga al caminar largas distancias</li>
                  <li>• Dificultad para aprender movimientos nuevos</li>
                </ul>
              </ContentBlock>
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Motricidad Fina</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Escritura difícil o ilegible</li>
                  <li>• Problemas con botones, cremalleras</li>
                  <li>• Dificultad usando cubiertos</li>
                  <li>• Problemas con el dibujo</li>
                  <li>• Dificultad con herramientas pequeñas</li>
                </ul>
              </ContentBlock>
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Otras Áreas</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Dificultad con la organización</li>
                  <li>• Problemas de percepción espacial</li>
                  <li>• Sensibilidad sensorial</li>
                  <li>• Dificultad con la gestión del tiempo</li>
                  <li>• Problemas con secuencias de tareas</li>
                </ul>
              </ContentBlock>
            </div>
          </section>

          {/* Manifestaciones por grupo */}
          <section>
            <SectionTitle as="h2" subtitle="La dispraxia se manifiesta de forma diferente según la edad y el género">
              Manifestaciones
            </SectionTitle>
            
            <Tabs defaultValue="hombres" className="w-full">
              <TabsList className="w-full flex flex-wrap h-auto gap-2 bg-transparent p-0 mb-6">
                <TabsTrigger value="ninos" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Baby className="w-4 h-4" />
                  Niños
                </TabsTrigger>
                <TabsTrigger value="ninas" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Baby className="w-4 h-4" />
                  Niñas
                </TabsTrigger>
                <TabsTrigger value="hombres" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <User className="w-4 h-4" />
                  Hombres
                </TabsTrigger>
                <TabsTrigger value="mujeres" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Users className="w-4 h-4" />
                  Mujeres
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="ninos">
                <ContentBlock>
                  <h3 className="font-heading font-semibold text-lg mb-4">Dispraxia en Niños</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Los niños con dispraxia pueden tardar más en alcanzar hitos motores 
                      como gatear, caminar, o usar cubiertos. Las tareas como escribir, 
                      recortar o atarse los cordones suponen un reto significativo.
                    </p>
                    <p>
                      En educación física y en el recreo pueden sentirse excluidos de 
                      deportes y juegos físicos. Sin apoyo adecuado, pueden desarrollar 
                      baja autoestima relacionada con su coordinación.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>

              <TabsContent value="ninas">
                <ContentBlock>
                  <h3 className="font-heading font-semibold text-lg mb-4">Dispraxia en Niñas</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Las niñas con dispraxia pueden pasar más desapercibidas ya que se 
                      les exige menos participación en deportes competitivos. Sus 
                      dificultades pueden ser minimizadas o atribuidas a "falta de interés".
                    </p>
                    <p>
                      Pueden tener dificultades con actividades como peinarse, maquillarse 
                      más adelante, o vestirse con ropa con muchos cierres. Esto puede 
                      afectar su autoestima y relaciones sociales.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
              
              <TabsContent value="hombres">
                <ContentBlock>
                  <h3 className="font-heading font-semibold text-lg mb-4">Dispraxia en Hombres Adultos</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Los hombres adultos con dispraxia pueden tener dificultades con tareas 
                      cotidianas como cocinar, conducir, o mantener el hogar organizado. 
                      La fatiga es común debido al esfuerzo extra requerido.
                    </p>
                    <p>
                      En el trabajo, pueden destacar en tareas que requieran pensamiento 
                      estratégico o creatividad, mientras que las tareas manuales o de 
                      organización física pueden ser desafiantes.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
              
              <TabsContent value="mujeres">
                <ContentBlock>
                  <h3 className="font-heading font-semibold text-lg mb-4">Dispraxia en Mujeres Adultas</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      La dispraxia en mujeres ha sido menos estudiada. Las expectativas 
                      sociales (como el maquillaje, peinados elaborados, o ropa con muchos 
                      cierres) pueden suponer desafíos adicionales que no se consideran 
                      en los hombres.
                    </p>
                    <p>
                      Las mujeres pueden desarrollar más estrategias compensatorias y 
                      experimentar mayor ansiedad al tratar de cumplir expectativas 
                      sociales que requieren habilidades motoras finas.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
            </Tabs>
          </section>

          {/* Fortalezas */}
          <section>
            <SectionTitle as="h2">Fortalezas Asociadas</SectionTitle>
            <ContentBlock variant="highlight" className="border-teal-500/30">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-3">Determinación</h3>
                  <p className="text-sm text-muted-foreground">
                    Las personas con dispraxia desarrollan una gran perseverancia y 
                    determinación. Están acostumbradas a trabajar más duro para lograr 
                    lo que otros hacen fácilmente, lo que fortalece su resiliencia.
                  </p>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-3">Pensamiento Estratégico</h3>
                  <p className="text-sm text-muted-foreground">
                    La necesidad de planificar conscientemente tareas que otros automatizan 
                    desarrolla habilidades de pensamiento estratégico y resolución de 
                    problemas que son valiosas en muchos contextos.
                  </p>
                </div>
              </div>
            </ContentBlock>
          </section>

          {/* CTA */}
          <section>
            <ContentBlock className="text-center bg-gradient-to-br from-teal-500/5 to-teal-500/10 border-teal-500/20">
              <Move className="w-12 h-12 text-teal-500 mx-auto mb-4" />
              <h2 className="font-heading font-semibold text-xl mb-2">
                ¿Te identificas con estas características?
              </h2>
              <p className="text-muted-foreground mb-6">
                Explora nuestros tests de screening para obtener una orientación inicial 
                sobre diferentes condiciones.
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
                  Esta información es educativa. Solo un profesional cualificado 
                  (terapeuta ocupacional, neuropsicólogo, fisioterapeuta especializado) 
                  puede realizar un diagnóstico de dispraxia/TDC mediante una evaluación 
                  completa. Si te identificas con estas características, te animamos a 
                  buscar una evaluación profesional.
                </p>
              </div>
            </div>
          </ContentBlock>
        </div>
      </div>
    </Layout>
  );
}
