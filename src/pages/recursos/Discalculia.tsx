import { Link } from 'react-router-dom';
import { Calculator, ArrowLeft, ArrowRight, Users, Baby, User, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DiscalculiaPage() {
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
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <Calculator className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold">Discalculia</h1>
              <p className="text-muted-foreground">Dificultad en el procesamiento numérico</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Definición */}
          <section>
            <SectionTitle as="h2">¿Qué es la Discalculia?</SectionTitle>
            <ContentBlock>
              <p className="text-lg mb-4">
                La discalculia es una dificultad específica del aprendizaje que afecta la 
                <strong> comprensión de números</strong>, el <strong>cálculo matemático</strong> y 
                el <strong>razonamiento cuantitativo</strong>.
              </p>
              <p className="text-muted-foreground">
                A menudo descrita como "dislexia de los números", la discalculia no está 
                relacionada con la inteligencia. Las personas con discalculia pueden tener 
                fortalezas en otras áreas como el lenguaje, la creatividad o el pensamiento 
                conceptual.
              </p>
            </ContentBlock>
          </section>

          {/* Características clave */}
          <section>
            <SectionTitle as="h2">Características Clave</SectionTitle>
            <div className="grid md:grid-cols-3 gap-4">
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Números y Cantidades</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Dificultad para entender cantidades</li>
                  <li>• Confusión con símbolos matemáticos</li>
                  <li>• Problemas para comparar números</li>
                  <li>• Dificultad con la línea numérica</li>
                  <li>• Inversión de números (12/21)</li>
                </ul>
              </ContentBlock>
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Cálculo</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Dificultad con operaciones básicas</li>
                  <li>• Necesidad de usar los dedos para contar</li>
                  <li>• Problemas con el cálculo mental</li>
                  <li>• Dificultad para memorizar tablas</li>
                  <li>• Errores frecuentes al operar</li>
                </ul>
              </ContentBlock>
              <ContentBlock>
                <h3 className="font-heading font-semibold text-lg mb-3">Vida Cotidiana</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Dificultad para leer la hora</li>
                  <li>• Problemas con el dinero</li>
                  <li>• Dificultad para estimar distancias/tiempo</li>
                  <li>• Ansiedad con las matemáticas</li>
                  <li>• Problemas para seguir direcciones</li>
                </ul>
              </ContentBlock>
            </div>
          </section>

          {/* Manifestaciones por grupo */}
          <section>
            <SectionTitle as="h2" subtitle="La discalculia se manifiesta de forma diferente según la edad">
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
                  <h3 className="font-heading font-semibold text-lg mb-4">Discalculia en la Infancia</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Las señales tempranas incluyen dificultad para aprender a contar, 
                      problemas para reconocer patrones, confusión con conceptos como 
                      "más" y "menos", y dificultad para aprender juegos que involucran 
                      números.
                    </p>
                    <p>
                      En la escuela, las matemáticas se convierten en una fuente de 
                      frustración y ansiedad. Los niños pueden ser etiquetados como 
                      "vagos" cuando en realidad tienen una dificultad específica.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
              
              <TabsContent value="adultos">
                <ContentBlock>
                  <h3 className="font-heading font-semibold text-lg mb-4">Discalculia en la Edad Adulta</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Los adultos con discalculia pueden tener dificultades con tareas 
                      cotidianas como manejar dinero, calcular propinas, seguir recetas 
                      con medidas, o gestionar horarios y citas.
                    </p>
                    <p>
                      Muchos desarrollan estrategias compensatorias como usar calculadoras 
                      constantemente o evitar trabajos que requieran matemáticas. La 
                      tecnología puede ser una gran ayuda en la vida diaria.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
              
              <TabsContent value="mujeres">
                <ContentBlock>
                  <h3 className="font-heading font-semibold text-lg mb-4">Discalculia en Mujeres</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Históricamente, las dificultades matemáticas en mujeres han sido 
                      atribuidas a estereotipos de género ("las chicas no son buenas en 
                      matemáticas") en lugar de reconocer una posible discalculia.
                    </p>
                    <p>
                      Esto puede llevar a que las mujeres interioricen estas creencias 
                      y eviten campos STEM, cuando en realidad podrían beneficiarse de 
                      apoyo específico y adaptaciones que les permitan desarrollar sus 
                      capacidades.
                    </p>
                  </div>
                </ContentBlock>
              </TabsContent>
            </Tabs>
          </section>

          {/* Estrategias */}
          <section>
            <SectionTitle as="h2">Estrategias de Apoyo</SectionTitle>
            <ContentBlock variant="highlight" className="border-red-500/30">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-3">Herramientas Visuales</h3>
                  <p className="text-sm text-muted-foreground">
                    Usar representaciones visuales de cantidades, líneas numéricas, 
                    bloques manipulativos y diagramas puede ayudar a comprender 
                    conceptos matemáticos abstractos.
                  </p>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-3">Tecnología</h3>
                  <p className="text-sm text-muted-foreground">
                    Calculadoras, apps de gestión de dinero, relojes digitales, y 
                    software especializado pueden reducir significativamente las 
                    dificultades en la vida diaria.
                  </p>
                </div>
              </div>
            </ContentBlock>
          </section>

          {/* CTA */}
          <section>
            <ContentBlock className="text-center bg-gradient-to-br from-red-500/5 to-red-500/10 border-red-500/20">
              <Calculator className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="font-heading font-semibold text-xl mb-2">
                ¿Te identificas con estas características?
              </h2>
              <p className="text-muted-foreground mb-6">
                Explora nuestros tests de screening para obtener una orientación inicial.
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
                  (neuropsicólogo, psicopedagogo) puede realizar un diagnóstico de 
                  discalculia mediante una evaluación completa. Si te identificas 
                  con estas características, te animamos a buscar una evaluación profesional.
                </p>
              </div>
            </div>
          </ContentBlock>
        </div>
      </div>
    </Layout>
  );
}
