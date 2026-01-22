import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Cookies() {
  return (
    <Layout>
      <div className="container mx-auto py-16">
        <div className="max-w-3xl mx-auto">
          <SectionTitle as="h1" subtitle="Última actualización: Enero 2025">
            Política de Cookies
          </SectionTitle>

          <div className="space-y-8 mt-8">
            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">1. ¿Qué son las Cookies?</h2>
              <p className="text-muted-foreground">
                De conformidad con el artículo 22.2 de la Ley 34/2002, de 11 de julio, de Servicios 
                de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), le informamos 
                que las cookies son pequeños archivos de texto que se descargan y almacenan en su 
                dispositivo (ordenador, smartphone, tablet) cuando accede a determinadas páginas web. 
                Permiten a la web recordar sus acciones y preferencias durante un periodo de tiempo.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">2. Tipos de Cookies que Utilizamos</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2 text-foreground">2.1 Según su Finalidad:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Cookies técnicas:</strong> Permiten la navegación y el uso de funciones básicas</li>
                    <li><strong>Cookies de personalización:</strong> Permiten recordar preferencias (tema claro/oscuro)</li>
                    <li><strong>Cookies de análisis:</strong> Permiten medir y analizar la navegación (anonimizadas)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-lg mb-2 text-foreground">2.2 Según su Duración:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Cookies de sesión:</strong> Se eliminan al cerrar el navegador</li>
                    <li><strong>Cookies persistentes:</strong> Permanecen un tiempo determinado en su dispositivo</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-lg mb-2 text-foreground">2.3 Según su Titularidad:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Cookies propias:</strong> Enviadas desde nuestro dominio</li>
                    <li><strong>Cookies de terceros:</strong> Enviadas desde dominios de proveedores de servicios</li>
                  </ul>
                </div>
              </div>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">3. Detalle de Cookies Utilizadas</h2>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Finalidad</TableHead>
                      <TableHead>Duración</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">theme</TableCell>
                      <TableCell>Propia</TableCell>
                      <TableCell>Preferencia de tema claro/oscuro</TableCell>
                      <TableCell>1 año</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">sb-*</TableCell>
                      <TableCell>Propia</TableCell>
                      <TableCell>Gestión de sesión de usuario</TableCell>
                      <TableCell>Sesión</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">__stripe_*</TableCell>
                      <TableCell>Terceros (Stripe)</TableCell>
                      <TableCell>Procesamiento seguro de pagos</TableCell>
                      <TableCell>Variable</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">cookie_consent</TableCell>
                      <TableCell>Propia</TableCell>
                      <TableCell>Recordar preferencias de cookies</TableCell>
                      <TableCell>1 año</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">4. Cookies Estrictamente Necesarias</h2>
              <p className="text-muted-foreground">
                Algunas cookies son estrictamente necesarias para el funcionamiento del sitio web y 
                no pueden ser desactivadas. Estas incluyen las cookies de sesión de autenticación y 
                las cookies de seguridad. Estas cookies no requieren su consentimiento ya que son 
                esenciales para la prestación del servicio.
              </p>
            </ContentBlock>

            <ContentBlock variant="highlight">
              <h2 className="font-heading font-semibold text-xl mb-4">5. ¿Cómo Gestionar las Cookies?</h2>
              <p className="text-muted-foreground mb-4">
                Puede configurar su navegador para aceptar o rechazar cookies. A continuación le 
                indicamos cómo hacerlo en los principales navegadores:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Google Chrome:</strong>{' '}
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Configuración de cookies
                  </a>
                </li>
                <li>
                  <strong>Mozilla Firefox:</strong>{' '}
                  <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Configuración de cookies
                  </a>
                </li>
                <li>
                  <strong>Safari:</strong>{' '}
                  <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Configuración de cookies
                  </a>
                </li>
                <li>
                  <strong>Microsoft Edge:</strong>{' '}
                  <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Configuración de cookies
                  </a>
                </li>
              </ul>
              <p className="text-muted-foreground mt-4 text-sm">
                <strong>Nota:</strong> Si desactiva las cookies, es posible que algunas funciones del 
                sitio web no funcionen correctamente.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">6. Cookies de Terceros</h2>
              <p className="text-muted-foreground mb-4">
                Este sitio utiliza servicios de terceros que pueden instalar cookies en su dispositivo:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Stripe:</strong> Procesamiento de pagos. 
                  <a href="https://stripe.com/es/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                    Política de privacidad de Stripe
                  </a>
                </li>
              </ul>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">7. Actualizaciones</h2>
              <p className="text-muted-foreground">
                Esta Política de Cookies puede ser actualizada periódicamente. Le recomendamos 
                revisar esta página para estar informado sobre cómo utilizamos las cookies. 
                La fecha de la última actualización se muestra al inicio de este documento.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">8. Contacto</h2>
              <p className="text-muted-foreground">
                Si tiene alguna pregunta sobre nuestra Política de Cookies, puede contactarnos en: {' '}
                <a href="mailto:privacidad@espacioneurodivergente.com" className="text-primary hover:underline">
                  privacidad@espacioneurodivergente.com
                </a>
              </p>
            </ContentBlock>
          </div>
        </div>
      </div>
    </Layout>
  );
}
