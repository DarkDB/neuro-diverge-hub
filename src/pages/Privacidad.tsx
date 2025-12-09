import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';

export default function Privacidad() {
  return (
    <Layout>
      <div className="container mx-auto py-16">
        <div className="max-w-3xl mx-auto">
          <SectionTitle as="h1" subtitle="Última actualización: Enero 2024">
            Política de Privacidad
          </SectionTitle>

          <div className="space-y-8 mt-8">
            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">1. Información que Recopilamos</h2>
              <p className="text-muted-foreground mb-4">
                En Espacio NeuroDivergente recopilamos la siguiente información:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Dirección de correo electrónico (cuando realizas una compra)</li>
                <li>Respuestas a cuestionarios y tests (almacenadas de forma anónima)</li>
                <li>Información de pago procesada de forma segura a través de Stripe</li>
              </ul>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">2. Uso de la Información</h2>
              <p className="text-muted-foreground">
                Utilizamos tu información exclusivamente para:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                <li>Procesar pagos y entregar los productos adquiridos</li>
                <li>Enviar el informe personalizado a tu correo electrónico</li>
                <li>Mejorar nuestros servicios de forma anónima y agregada</li>
              </ul>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">3. Protección de Datos</h2>
              <p className="text-muted-foreground">
                Implementamos medidas de seguridad técnicas y organizativas para proteger 
                tu información personal. Los datos de pago son procesados directamente por 
                Stripe y nunca almacenamos información de tarjetas de crédito.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">4. Tus Derechos</h2>
              <p className="text-muted-foreground mb-4">
                Tienes derecho a:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Acceder a tus datos personales</li>
                <li>Rectificar datos incorrectos</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
              </ul>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">5. Contacto</h2>
              <p className="text-muted-foreground">
                Para ejercer tus derechos o realizar consultas sobre privacidad, 
                puedes contactarnos en: privacidad@espacioneurodivergente.com
              </p>
            </ContentBlock>
          </div>
        </div>
      </div>
    </Layout>
  );
}
