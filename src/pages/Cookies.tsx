import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';

export default function Cookies() {
  return (
    <Layout>
      <div className="container mx-auto py-16">
        <div className="max-w-3xl mx-auto">
          <SectionTitle as="h1" subtitle="Última actualización: Enero 2024">
            Política de Cookies
          </SectionTitle>

          <div className="space-y-8 mt-8">
            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">¿Qué son las cookies?</h2>
              <p className="text-muted-foreground">
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo 
                cuando visitas un sitio web. Se utilizan para recordar tus preferencias y 
                mejorar tu experiencia de navegación.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">Cookies que utilizamos</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Cookies esenciales</h3>
                  <p className="text-muted-foreground text-sm">
                    Necesarias para el funcionamiento básico del sitio, como recordar tu 
                    preferencia de modo claro/oscuro.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Cookies de sesión</h3>
                  <p className="text-muted-foreground text-sm">
                    Utilizadas para mantener tu sesión activa mientras navegas por el sitio.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Cookies de procesamiento de pagos</h3>
                  <p className="text-muted-foreground text-sm">
                    Stripe puede utilizar cookies para procesar pagos de forma segura.
                  </p>
                </div>
              </div>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">Gestión de cookies</h2>
              <p className="text-muted-foreground">
                Puedes gestionar las cookies a través de la configuración de tu navegador. 
                Ten en cuenta que desactivar ciertas cookies puede afectar la funcionalidad 
                del sitio.
              </p>
            </ContentBlock>
          </div>
        </div>
      </div>
    </Layout>
  );
}
