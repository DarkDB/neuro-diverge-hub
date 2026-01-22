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
              <h2 className="font-heading font-semibold text-xl mb-4">1. Datos Identificativos</h2>
              <p className="text-muted-foreground mb-4">
                En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de 
                la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se pone a disposición 
                la siguiente información:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Denominación social:</strong> Espacio NeuroDivergente</li>
                <li><strong>Dominio web:</strong> espacioneurodivergente.com</li>
                <li><strong>Email de contacto:</strong> contacto@espacioneurodivergente.com</li>
                <li><strong>Actividad:</strong> Servicios de información, orientación y herramientas de autoevaluación sobre neurodivergencia</li>
              </ul>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">2. Objeto y Ámbito de Aplicación</h2>
              <p className="text-muted-foreground">
                El presente Aviso Legal regula el acceso y uso del sitio web espacioneurodivergente.com 
                (en adelante, "el Sitio Web"). El acceso al Sitio Web implica la aceptación expresa 
                y sin reservas de todas las condiciones incluidas en este Aviso Legal. Si no está 
                de acuerdo con alguna de las condiciones, le rogamos que no utilice el Sitio Web.
              </p>
            </ContentBlock>

            <ContentBlock variant="warning">
              <h2 className="font-heading font-semibold text-xl mb-4">3. Descargo de Responsabilidad Médica</h2>
              <p className="text-muted-foreground mb-4">
                <strong>IMPORTANTE: Este sitio web NO proporciona diagnósticos médicos, psicológicos 
                ni psiquiátricos.</strong>
              </p>
              <p className="text-muted-foreground mb-4">
                Los tests, cuestionarios, análisis y contenidos ofrecidos son herramientas de 
                <strong> screening y autoconocimiento</strong> con fines exclusivamente informativos 
                y educativos. Estos recursos:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>NO sustituyen la evaluación, diagnóstico o tratamiento profesional</li>
                <li>NO deben utilizarse como base para tomar decisiones médicas</li>
                <li>Son orientativos y no tienen validez clínica</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Para obtener un diagnóstico formal, consulte siempre con un profesional de la salud 
                cualificado (psicólogo, psiquiatra, neurólogo).
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">4. Condiciones de Uso</h2>
              <p className="text-muted-foreground mb-4">
                El usuario se compromete a hacer un uso adecuado del Sitio Web, de conformidad con 
                la ley, el presente Aviso Legal y las buenas costumbres. El usuario se obliga a:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>No utilizar el Sitio Web con fines ilícitos o contrarios al orden público</li>
                <li>No introducir virus, programas maliciosos o cualquier otro sistema que pueda dañar los sistemas informáticos</li>
                <li>No intentar acceder a áreas restringidas del servidor</li>
                <li>No suplantar la identidad de otros usuarios</li>
                <li>Proporcionar información veraz en los formularios de registro y pago</li>
              </ul>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">5. Propiedad Intelectual e Industrial</h2>
              <p className="text-muted-foreground mb-4">
                Todos los contenidos del Sitio Web, incluyendo pero no limitándose a: textos, 
                fotografías, gráficos, imágenes, iconos, diseño, software, código fuente, logos, 
                marcas, nombres comerciales y cualquier otro material, están protegidos por derechos 
                de propiedad intelectual e industrial.
              </p>
              <p className="text-muted-foreground">
                Queda prohibida la reproducción, distribución, comunicación pública, transformación 
                o cualquier otra forma de explotación, total o parcial, de los contenidos sin la 
                autorización expresa y por escrito de Espacio NeuroDivergente.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">6. Servicios y Precios</h2>
              <p className="text-muted-foreground mb-4">
                El Sitio Web ofrece los siguientes servicios:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Contenido gratuito:</strong> Información sobre neurodivergencia, recursos educativos y tests de autoevaluación básicos</li>
                <li><strong>Servicios de pago:</strong> Análisis personalizados e informes detallados de autoevaluación</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Los precios se muestran en euros (€) e incluyen los impuestos aplicables. 
                Nos reservamos el derecho a modificar los precios en cualquier momento.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">7. Política de Pagos y Reembolso</h2>
              <p className="text-muted-foreground mb-4">
                Los pagos se procesan de forma segura a través de Stripe, bajo estándares PCI-DSS. 
                No almacenamos datos de tarjetas de crédito.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Política de reembolso:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Los servicios de análisis personalizado son productos digitales de contenido personalizado</li>
                <li>De conformidad con el artículo 103.m) del Real Decreto Legislativo 1/2007, una vez procesado el pago y generado el contenido digital, no existe derecho de desistimiento</li>
                <li>Si experimenta problemas técnicos que impidan el acceso al servicio, contacte con nosotros para buscar una solución</li>
              </ul>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">8. Exclusión de Garantías y Responsabilidad</h2>
              <p className="text-muted-foreground mb-4">
                Espacio NeuroDivergente no garantiza:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>La disponibilidad continua e ininterrumpida del Sitio Web</li>
                <li>La ausencia de errores o virus en los contenidos</li>
                <li>La exactitud, fiabilidad o actualidad de la información proporcionada</li>
                <li>Resultados específicos derivados del uso de nuestros servicios</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                No seremos responsables de los daños derivados del uso o la imposibilidad de uso 
                del Sitio Web, salvo en los casos expresamente previstos por la ley.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">9. Enlaces Externos</h2>
              <p className="text-muted-foreground">
                El Sitio Web puede contener enlaces a sitios web de terceros. Espacio NeuroDivergente 
                no se hace responsable del contenido, políticas de privacidad o prácticas de estos 
                sitios externos. Le recomendamos leer los términos y condiciones de cada sitio que visite.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">10. Protección de Datos</h2>
              <p className="text-muted-foreground">
                El tratamiento de datos personales se realiza conforme al Reglamento (UE) 2016/679 
                (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD). Para más información, consulte nuestra{' '}
                <a href="/privacidad" className="text-primary hover:underline">Política de Privacidad</a>.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">11. Legislación Aplicable y Jurisdicción</h2>
              <p className="text-muted-foreground mb-4">
                El presente Aviso Legal se rige por la legislación española y europea aplicable, 
                incluyendo pero no limitándose a:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Reglamento (UE) 2016/679 (RGPD)</li>
                <li>Ley Orgánica 3/2018 (LOPDGDD)</li>
                <li>Ley 34/2002 (LSSI-CE)</li>
                <li>Real Decreto Legislativo 1/2007 (Ley General para la Defensa de los Consumidores y Usuarios)</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Para la resolución de controversias, las partes se someten a los juzgados y tribunales 
                del domicilio del usuario, de conformidad con la normativa de consumidores.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">12. Resolución de Litigios en Línea</h2>
              <p className="text-muted-foreground">
                De conformidad con el Reglamento (UE) 524/2013, le informamos que puede acceder a la 
                plataforma de resolución de litigios en línea de la UE en:{' '}
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">13. Modificaciones</h2>
              <p className="text-muted-foreground">
                Nos reservamos el derecho a modificar el presente Aviso Legal en cualquier momento. 
                Las modificaciones entrarán en vigor desde su publicación en el Sitio Web. Le 
                recomendamos revisar periódicamente esta página.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">14. Contacto</h2>
              <p className="text-muted-foreground">
                Para cualquier consulta legal o relacionada con este Aviso Legal, puede contactarnos en:{' '}
                <a href="mailto:legal@espacioneurodivergente.com" className="text-primary hover:underline">
                  legal@espacioneurodivergente.com
                </a>
              </p>
            </ContentBlock>
          </div>
        </div>
      </div>
    </Layout>
  );
}
