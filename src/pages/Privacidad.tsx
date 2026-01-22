import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContentBlock } from '@/components/ui/ContentBlock';

export default function Privacidad() {
  return (
    <Layout>
      <div className="container mx-auto py-16">
        <div className="max-w-3xl mx-auto">
          <SectionTitle as="h1" subtitle="Última actualización: Enero 2025">
            Política de Privacidad
          </SectionTitle>

          <div className="space-y-8 mt-8">
            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">1. Responsable del Tratamiento</h2>
              <p className="text-muted-foreground mb-4">
                De conformidad con el Reglamento General de Protección de Datos (RGPD) UE 2016/679 
                y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y 
                garantía de los derechos digitales (LOPDGDD), le informamos que:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Responsable:</strong> Espacio NeuroDivergente</li>
                <li><strong>Email de contacto:</strong> privacidad@espacioneurodivergente.com</li>
                <li><strong>Finalidad:</strong> Prestación de servicios web y gestión de usuarios</li>
              </ul>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">2. Datos que Recopilamos</h2>
              <p className="text-muted-foreground mb-4">
                Recopilamos los siguientes datos personales:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Datos identificativos:</strong> Dirección de correo electrónico</li>
                <li><strong>Datos de uso:</strong> Respuestas a cuestionarios y tests de autoevaluación</li>
                <li><strong>Datos de transacciones:</strong> Información necesaria para procesar pagos (gestionada por Stripe)</li>
                <li><strong>Datos técnicos:</strong> Dirección IP, tipo de navegador, datos de navegación</li>
              </ul>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">3. Base Legal del Tratamiento</h2>
              <p className="text-muted-foreground mb-4">
                El tratamiento de sus datos está legitimado por las siguientes bases legales:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Consentimiento:</strong> Para el envío de comunicaciones comerciales y newsletters</li>
                <li><strong>Ejecución de contrato:</strong> Para la prestación de los servicios contratados</li>
                <li><strong>Interés legítimo:</strong> Para la mejora de nuestros servicios y análisis estadísticos anonimizados</li>
                <li><strong>Obligación legal:</strong> Cumplimiento de obligaciones fiscales y legales</li>
              </ul>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">4. Finalidad del Tratamiento</h2>
              <p className="text-muted-foreground mb-4">
                Sus datos serán tratados para las siguientes finalidades:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Gestionar el registro de usuarios y autenticación en la plataforma</li>
                <li>Procesar pagos y entregar los servicios adquiridos</li>
                <li>Generar y enviar informes personalizados de autoevaluación</li>
                <li>Enviar comunicaciones relacionadas con el servicio</li>
                <li>Realizar análisis estadísticos de forma anónima y agregada</li>
                <li>Cumplir con obligaciones legales y fiscales</li>
              </ul>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">5. Destinatarios de los Datos</h2>
              <p className="text-muted-foreground mb-4">
                Sus datos podrán ser comunicados a los siguientes destinatarios:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Stripe, Inc.:</strong> Para el procesamiento seguro de pagos (con sede en EE.UU., adherido al Privacy Shield y cláusulas contractuales tipo)</li>
                <li><strong>Proveedores de hosting:</strong> Para el alojamiento de la plataforma</li>
                <li><strong>Administraciones Públicas:</strong> Cuando exista obligación legal</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                No vendemos ni cedemos sus datos a terceros con fines comerciales.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">6. Transferencias Internacionales</h2>
              <p className="text-muted-foreground">
                Algunos de nuestros proveedores de servicios pueden estar ubicados fuera del 
                Espacio Económico Europeo. En estos casos, garantizamos que existen salvaguardas 
                adecuadas como cláusulas contractuales tipo aprobadas por la Comisión Europea o 
                decisiones de adecuación.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">7. Plazo de Conservación</h2>
              <p className="text-muted-foreground mb-4">
                Conservamos sus datos durante los siguientes plazos:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Datos de cuenta:</strong> Mientras mantenga su cuenta activa</li>
                <li><strong>Datos de transacciones:</strong> 5 años (obligación fiscal)</li>
                <li><strong>Datos de cuestionarios:</strong> 2 años o hasta que solicite su eliminación</li>
                <li><strong>Comunicaciones:</strong> Hasta que retire su consentimiento</li>
              </ul>
            </ContentBlock>

            <ContentBlock variant="highlight">
              <h2 className="font-heading font-semibold text-xl mb-4">8. Derechos del Interesado (RGPD)</h2>
              <p className="text-muted-foreground mb-4">
                De acuerdo con el RGPD, usted tiene derecho a:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Acceso:</strong> Conocer qué datos personales tratamos sobre usted</li>
                <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos</li>
                <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos ("derecho al olvido")</li>
                <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos</li>
                <li><strong>Limitación:</strong> Solicitar la limitación del tratamiento</li>
                <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
                <li><strong>Retirar consentimiento:</strong> En cualquier momento, sin efecto retroactivo</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Para ejercer estos derechos, envíe un correo a <strong>privacidad@espacioneurodivergente.com</strong> 
                indicando su solicitud y adjuntando copia de su DNI o documento identificativo.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">9. Derecho a Reclamar</h2>
              <p className="text-muted-foreground">
                Si considera que el tratamiento de sus datos no se ajusta a la normativa vigente, 
                puede presentar una reclamación ante la <strong>Agencia Española de Protección de Datos 
                (AEPD)</strong> en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" 
                className="text-primary hover:underline">www.aepd.es</a>.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">10. Medidas de Seguridad</h2>
              <p className="text-muted-foreground">
                Implementamos medidas técnicas y organizativas apropiadas para garantizar un nivel 
                de seguridad adecuado al riesgo, incluyendo: cifrado de datos en tránsito (HTTPS), 
                control de acceso restringido, copias de seguridad periódicas, y monitorización de 
                sistemas. Los datos de pago son procesados directamente por Stripe bajo estándares 
                PCI-DSS y nunca almacenamos información de tarjetas.
              </p>
            </ContentBlock>

            <ContentBlock>
              <h2 className="font-heading font-semibold text-xl mb-4">11. Modificaciones</h2>
              <p className="text-muted-foreground">
                Nos reservamos el derecho a modificar esta Política de Privacidad. Cualquier cambio 
                será notificado a través de nuestra web. Le recomendamos revisar esta página 
                periódicamente.
              </p>
            </ContentBlock>
          </div>
        </div>
      </div>
    </Layout>
  );
}
