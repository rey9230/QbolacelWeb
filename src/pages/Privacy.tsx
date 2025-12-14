import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Política de Privacidad</h1>
            <p className="text-muted-foreground">Última actualización: Diciembre 2024</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <section>
                <h2>1. Introducción</h2>
                <p>
                  En Qbolacel, nos comprometemos a proteger su privacidad. Esta Política de Privacidad explica cómo
                  recopilamos, usamos, divulgamos y protegemos su información cuando utiliza nuestros servicios.
                </p>
              </section>

              <section>
                <h2>2. Información que Recopilamos</h2>
                <h3>2.1 Información Personal</h3>
                <ul>
                  <li>Nombre completo</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Número de teléfono</li>
                  <li>Dirección de envío (para productos del marketplace)</li>
                  <li>Información de pago (procesada de forma segura por terceros)</li>
                </ul>

                <h3>2.2 Información de Uso</h3>
                <ul>
                  <li>Historial de transacciones</li>
                  <li>Preferencias de servicio</li>
                  <li>Direcciones IP</li>
                  <li>Tipo de dispositivo y navegador</li>
                  <li>Páginas visitadas y tiempo de permanencia</li>
                </ul>
              </section>

              <section>
                <h2>3. Uso de la Información</h2>
                <p>Utilizamos su información para:</p>
                <ul>
                  <li>Procesar transacciones y envíos</li>
                  <li>Enviar confirmaciones y actualizaciones de pedidos</li>
                  <li>Proporcionar soporte al cliente</li>
                  <li>Mejorar nuestros servicios</li>
                  <li>Enviar comunicaciones promocionales (con su consentimiento)</li>
                  <li>Cumplir con obligaciones legales</li>
                  <li>Prevenir fraudes</li>
                </ul>
              </section>

              <section>
                <h2>4. Compartir Información</h2>
                <p>No vendemos su información personal. Podemos compartir información con:</p>
                <ul>
                  <li>
                    <strong>Proveedores de servicios:</strong> procesadores de pago, servicios de envío
                  </li>
                  <li>
                    <strong>Socios comerciales:</strong> vendedores del marketplace (información necesaria para la
                    entrega)
                  </li>
                  <li>
                    <strong>Autoridades legales:</strong> cuando sea requerido por ley
                  </li>
                </ul>
              </section>

              <section>
                <h2>5. Seguridad de los Datos</h2>
                <p>Implementamos medidas de seguridad técnicas y organizativas para proteger su información:</p>
                <ul>
                  <li>Encriptación SSL/TLS para todas las transmisiones</li>
                  <li>Cumplimiento PCI DSS para datos de pago</li>
                  <li>Acceso restringido a información personal</li>
                  <li>Monitoreo continuo de seguridad</li>
                  <li>Copias de seguridad regulares</li>
                </ul>
              </section>

              <section>
                <h2>6. Cookies y Tecnologías de Seguimiento</h2>
                <p>Utilizamos cookies y tecnologías similares para:</p>
                <ul>
                  <li>Mantener su sesión activa</li>
                  <li>Recordar sus preferencias</li>
                  <li>Analizar el uso del sitio</li>
                  <li>Personalizar contenido</li>
                </ul>
                <p>
                  Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del
                  sitio.
                </p>
              </section>

              <section>
                <h2>7. Sus Derechos</h2>
                <p>Usted tiene derecho a:</p>
                <ul>
                  <li>
                    <strong>Acceso:</strong> Solicitar copia de sus datos personales
                  </li>
                  <li>
                    <strong>Rectificación:</strong> Corregir datos inexactos
                  </li>
                  <li>
                    <strong>Eliminación:</strong> Solicitar la eliminación de sus datos
                  </li>
                  <li>
                    <strong>Portabilidad:</strong> Recibir sus datos en formato estructurado
                  </li>
                  <li>
                    <strong>Oposición:</strong> Oponerse al procesamiento de sus datos
                  </li>
                  <li>
                    <strong>Retiro de consentimiento:</strong> Retirar su consentimiento en cualquier momento
                  </li>
                </ul>
              </section>

              <section>
                <h2>8. Retención de Datos</h2>
                <p>
                  Conservamos su información personal durante el tiempo necesario para cumplir con los propósitos
                  descritos en esta política, a menos que la ley requiera un período de retención más largo.
                </p>
              </section>

              <section>
                <h2>9. Menores de Edad</h2>
                <p>
                  Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos conscientemente información
                  de menores. Si descubrimos que hemos recopilado información de un menor, la eliminaremos de inmediato.
                </p>
              </section>

              <section>
                <h2>10. Transferencias Internacionales</h2>
                <p>
                  Su información puede ser transferida y procesada en servidores ubicados fuera de su país de
                  residencia. Tomamos medidas para garantizar que sus datos estén protegidos según los estándares
                  aplicables.
                </p>
              </section>

              <section>
                <h2>11. Cambios a esta Política</h2>
                <p>
                  Podemos actualizar esta política periódicamente. Le notificaremos sobre cambios significativos
                  publicando la nueva política en nuestro sitio y, si es necesario, enviándole un aviso por correo
                  electrónico.
                </p>
              </section>

              <section>
                <h2>12. Contacto</h2>
                <p>Para preguntas sobre esta política o para ejercer sus derechos, contáctenos:</p>
                <ul>
                  <li>Email: qbolacel@gmail.com</li>
                  <li>Teléfono: +1 (727) 276-0465</li>
                  <li>Dirección: Saint Petersburg, Florida, Estados Unidos</li>
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
