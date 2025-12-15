import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Términos y Condiciones de Uso</h1>
            <p className="text-muted-foreground">Última actualización: Diciembre 2025</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <section>
                <h2>1. Disposiciones Generales</h2>
                <p>
                  Al utilizar la plataforma Qbolacel (sitio web y aplicaciones móviles), usted manifiesta su conformidad
                  con estos Términos y Condiciones. Le recomendamos leerlos detenidamente antes de realizar cualquier
                  operación. Si no está de acuerdo con alguna disposición, le solicitamos abstenerse de utilizar
                  nuestros servicios.
                </p>
                <p>
                  Qbolacel se reserva la facultad de actualizar estos términos en cualquier momento. Las modificaciones
                  serán efectivas desde su publicación en esta página. El uso continuado de la plataforma constituye
                  aceptación de los términos vigentes.
                </p>
              </section>

              <section>
                <h2>2. Servicios Ofrecidos</h2>
                <p>Qbolacel proporciona los siguientes servicios:</p>
                <ul>
                  <li>
                    <strong>Recargas Cubacel:</strong> Transferencia de saldo a líneas móviles en Cuba operadas por
                    ETECSA.
                  </li>
                  <li>
                    <strong>Recargas Nauta:</strong> Adición de tiempo de navegación a cuentas Nauta para acceso a
                    internet.
                  </li>
                  <li>
                    <strong>Tienda en Línea:</strong> Comercialización de productos físicos con entrega a domicilio en
                    territorio cubano.
                  </li>
                </ul>
              </section>

              <section>
                <h2>3. Registro de Usuario y Seguridad</h2>
                <p>
                  Para acceder a determinadas funcionalidades es necesario crear una cuenta proporcionando información
                  veraz y actualizada. Usted es responsable de:
                </p>
                <ul>
                  <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
                  <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta.</li>
                  <li>Garantizar que toda la información proporcionada sea exacta.</li>
                </ul>
                <p>
                  Qbolacel podrá suspender o cancelar cuentas que incumplan estos términos o presenten actividad
                  sospechosa, sin previo aviso.
                </p>
              </section>

              <section>
                <h2>4. Política Antifraude</h2>
                <p>Qbolacel mantiene tolerancia cero ante actividades fraudulentas. Nos reservamos el derecho de:</p>
                <ul>
                  <li>Solicitar documentación adicional para verificar la titularidad de métodos de pago.</li>
                  <li>Rechazar o cancelar transacciones que presenten indicios de fraude.</li>
                  <li>Reportar actividades ilícitas a las autoridades competentes.</li>
                  <li>Emprender acciones legales contra usuarios que realicen compras fraudulentas.</li>
                </ul>
                <p>
                  Las compras realizadas con tarjetas robadas, datos falsos o cualquier forma de engaño serán
                  perseguidas con todo el rigor de la ley.
                </p>
              </section>

              <section>
                <h2>5. Recargas Móviles y Nauta</h2>
                <h3>5.1 Procesamiento</h3>
                <p>
                  Las recargas se procesan de manera inmediata a través de nuestra plataforma. Sin embargo, la
                  acreditación del saldo en el destino depende de ETECSA, por lo que ocasionalmente pueden existir
                  demoras ajenas a nuestro control.
                </p>
                <h3>5.2 Política de No Reembolso</h3>
                <p>
                  <strong>Las recargas son ventas finales y no reembolsables una vez procesadas.</strong> Es
                  responsabilidad exclusiva del usuario verificar que el número telefónico o cuenta Nauta ingresado sea
                  correcto antes de confirmar la operación.
                </p>
                <p>
                  Qbolacel no se hace responsable por errores en la digitación del número destino ni por recargas
                  enviadas a números incorrectos.
                </p>
              </section>

              <section>
                <h2>6. Tienda en Línea (Marketplace)</h2>
                <h3>6.1 Pedidos y Entregas</h3>
                <p>
                  Los productos adquiridos en nuestra tienda se entregan en la dirección indicada dentro del territorio
                  cubano. Los plazos de entrega son estimados y pueden variar según la ubicación y disponibilidad.
                </p>
                <h3>6.2 Verificación de Entrega</h3>
                <p>
                  El beneficiario designado deberá verificar el estado del producto al momento de la entrega. Se dispone
                  de un plazo de 7 días naturales desde la recepción para reportar cualquier inconformidad o daño.
                </p>
                <h3>6.3 Devoluciones</h3>
                <p>
                  Solo se aceptan devoluciones de productos que lleguen dañados o defectuosos. El cliente debe
                  proporcionar evidencia fotográfica del problema. Los productos perecederos no son elegibles para
                  devolución.
                </p>
              </section>

              <section>
                <h2>7. Precios y Formas de Pago</h2>
                <p>
                  Todos los precios se expresan en dólares estadounidenses (USD). Aceptamos los siguientes métodos de
                  pago:
                </p>
                <ul>
                  <li>PayPal</li>
                  <li>Tarjetas de crédito y débito (Visa, Mastercard)</li>
                  <li>TropiPay</li>
                </ul>
                <p>
                  Los precios pueden modificarse sin previo aviso. El precio aplicable será el vigente al momento de
                  confirmar la compra.
                </p>
              </section>

              <section>
                <h2>8. Propiedad Intelectual</h2>
                <p>
                  Todo el contenido de Qbolacel, incluyendo pero no limitado a marcas, logotipos, textos, imágenes,
                  diseños y software, es propiedad de Qbolacel o sus licenciantes y está protegido por las leyes de
                  propiedad intelectual aplicables.
                </p>
                <p>
                  Queda prohibida la reproducción, distribución o uso no autorizado de cualquier elemento de nuestra
                  plataforma.
                </p>
              </section>

              <section>
                <h2>9. Limitación de Responsabilidad</h2>
                <p>
                  Qbolacel proporciona sus servicios "tal como están". No garantizamos la disponibilidad ininterrumpida
                  de la plataforma ni nos responsabilizamos por:
                </p>
                <ul>
                  <li>Interrupciones temporales del servicio por mantenimiento o causas técnicas.</li>
                  <li>Demoras en las recargas ocasionadas por ETECSA u otros proveedores externos.</li>
                  <li>Daños indirectos, incidentales o consecuentes derivados del uso de nuestros servicios.</li>
                  <li>Pérdidas ocasionadas por uso indebido de las credenciales de acceso del usuario.</li>
                </ul>
              </section>

              <section>
                <h2>10. Resolución de Conflictos</h2>
                <p>
                  Cualquier disputa relacionada con estos términos se resolverá de acuerdo con las leyes del Estado de
                  Florida, Estados Unidos. Las partes acuerdan someterse a la jurisdicción exclusiva de los tribunales
                  de dicho estado.
                </p>
              </section>

              <section>
                <h2>11. Contacto</h2>
                <p>Para consultas sobre estos Términos y Condiciones, puede comunicarse con nosotros a través de:</p>
                <ul>
                  <li>
                    <strong>Correo electrónico:</strong> qbolacel@gmail.com
                  </li>
                  <li>
                    <strong>Teléfono:</strong> +1 (727) 276-0465
                  </li>
                </ul>
                <p>
                  Nuestro equipo de atención al cliente está disponible de lunes a domingo, de 8:00 AM a 10:00 PM (hora
                  del Este).
                </p>
              </section>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
