import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';

export default function AvisoLegal() {
  return (
    <Layout>
      <div className="container mx-auto py-16">
        <div className="max-w-3xl mx-auto">
          <SectionTitle as="h1" subtitle="Términos y condiciones de uso">
            Aviso Legal
          </SectionTitle>

          <div className="space-y-8 mt-8">
            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">1. Identificación</h2>
              <p className="text-muted-foreground">
                Este sitio web es propiedad de Espacio NeuroDivergente. Para cualquier 
                consulta legal, puedes contactarnos en: legal@espacioneurodivergente.com
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">2. Propósito del Sitio</h2>
              <p className="text-muted-foreground">
                Espacio NeuroDivergente ofrece contenido informativo y herramientas de 
                autoexploración relacionadas con la neurodivergencia. Todo el contenido 
                tiene fines educativos y de orientación personal.
              </p>
            </ContentBlock>

            <ContentBlock variant="warning">
              <h2 className="font-heading font-semibold text-xl mb-4">3. Descargo de Responsabilidad</h2>
              <p className="text-muted-foreground">
                <strong>Este sitio no proporciona diagnósticos médicos ni psicológicos.</strong> 
                Los tests, cuestionarios y análisis ofrecidos son herramientas de screening y 
                autoconocimiento que no sustituyen la evaluación profesional. Para obtener un 
                diagnóstico formal, consulta con un profesional de la salud cualificado.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">4. Propiedad Intelectual</h2>
              <p className="text-muted-foreground">
                Todo el contenido de este sitio (textos, diseños, logos, código) está protegido 
                por derechos de propiedad intelectual. Queda prohibida su reproducción sin 
                autorización expresa.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">5. Política de Reembolso</h2>
              <p className="text-muted-foreground">
                Los servicios de análisis personalizado son productos digitales. Una vez 
                procesado el pago y entregado el informe, no se realizarán reembolsos. 
                Si tienes problemas técnicos, contáctanos y buscaremos una solución.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">6. Legislación Aplicable</h2>
              <p className="text-muted-foreground">
                Este sitio se rige por la legislación española y europea en materia de 
                protección de datos (RGPD) y comercio electrónico.
              </p>
            </ContentBlock>
          </div>
        </div>
      </div>
    </Layout>
  );
}
