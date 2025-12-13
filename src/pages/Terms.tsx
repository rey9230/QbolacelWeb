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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-muted-foreground">
              Última actualización: Diciembre 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <section>
                <h2>1. Aceptación de los Términos</h2>
                <p>
                  Al acceder y utilizar los servicios de Qbolacel, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
                </p>
              </section>

              <section>
                <h2>2. Descripción del Servicio</h2>
                <p>
                  Qbolacel ofrece los siguientes servicios:
                </p>
                <ul>
                  <li>Recargas de saldo móvil Cubacel</li>
                  <li>Recargas de tiempo de navegación Nauta</li>
                  <li>Marketplace de productos con envío a Cuba</li>
                </ul>
              </section>

              <section>
                <h2>3. Registro y Cuenta de Usuario</h2>
                <p>
                  Para realizar compras, debe crear una cuenta proporcionando información precisa y completa. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña, así como de todas las actividades que ocurran bajo su cuenta.
                </p>
              </section>

              <section>
                <h2>4. Precios y Pagos</h2>
                <p>
                  Todos los precios están expresados en dólares estadounidenses (USD). Nos reservamos el derecho de modificar los precios en cualquier momento. Los métodos de pago aceptados incluyen PayPal, tarjetas de crédito/débito y TropiPay.
                </p>
              </section>

              <section>
                <h2>5. Recargas Móviles y Nauta</h2>
                <p>
                  Las recargas se procesan de forma instantánea. Una vez procesada la recarga, no se pueden realizar reembolsos. Es responsabilidad del usuario verificar que el número de teléfono o cuenta Nauta sea correcto antes de completar la transacción.
                </p>
              </section>

              <section>
                <h2>6. Productos del Marketplace</h2>
                <h3>6.1 Envíos</h3>
                <p>
                  Los tiempos de entrega varían según la ubicación en Cuba. Hacemos nuestro mejor esfuerzo para cumplir con los tiempos estimados, pero no garantizamos fechas exactas de entrega debido a factores externos.
                </p>
                <h3>6.2 Devoluciones y Reembolsos</h3>
                <p>
                  Los productos pueden ser devueltos dentro de los 7 días siguientes a la entrega si llegan dañados o defectuosos. El cliente debe proporcionar evidencia fotográfica del daño.
                </p>
              </section>

              <section>
                <h2>7. Propiedad Intelectual</h2>
                <p>
                  Todo el contenido de Qbolacel, incluyendo textos, gráficos, logos, imágenes y software, es propiedad de Qbolacel o sus proveedores y está protegido por leyes de propiedad intelectual.
                </p>
              </section>

              <section>
                <h2>8. Limitación de Responsabilidad</h2>
                <p>
                  Qbolacel no será responsable por daños indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar nuestros servicios.
                </p>
              </section>

              <section>
                <h2>9. Modificaciones</h2>
                <p>
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web.
                </p>
              </section>

              <section>
                <h2>10. Ley Aplicable</h2>
                <p>
                  Estos Términos se regirán e interpretarán de acuerdo con las leyes del Estado de Florida, Estados Unidos, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
                </p>
              </section>

              <section>
                <h2>11. Contacto</h2>
                <p>
                  Si tiene preguntas sobre estos Términos, contáctenos en:
                </p>
                <ul>
                  <li>Email: legal@qbolacel.com</li>
                  <li>Teléfono: +1 (786) 555-0123</li>
                </ul>
              </section>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
