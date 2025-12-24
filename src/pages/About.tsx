import { motion } from "framer-motion";
import { Users, Heart, Target, Shield, Zap, Globe } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const values = [
  {
    icon: Heart,
    title: "Compromiso Familiar",
    description: "Entendemos lo importante que es mantener el contacto con tus seres queridos en Cuba.",
  },
  {
    icon: Shield,
    title: "Seguridad",
    description: "Protegemos cada transacción con los más altos estándares de seguridad.",
  },
  {
    icon: Zap,
    title: "Rapidez",
    description: "Recargas instantáneas y entregas eficientes para que no tengas que esperar.",
  },
  {
    icon: Globe,
    title: "Accesibilidad",
    description: "Servicios disponibles 24/7 desde cualquier lugar del mundo.",
  },
];

const timeline = [
  {
    year: "2020",
    title: "El Inicio",
    description: "Nació Qbolacel con una misión clara: facilitar la conexión entre familias cubanas separadas por la distancia.",
  },
  {
    year: "2021",
    title: "Crecimiento",
    description: "Expandimos nuestros servicios de recargas y comenzamos a construir una comunidad de usuarios satisfechos.",
  },
  {
    year: "2022",
    title: "Marketplace",
    description: "Lanzamos nuestra tienda en línea para enviar productos esenciales a Cuba.",
  },
  {
    year: "2023",
    title: "Consolidación",
    description: "Fortalecimos nuestra red de distribución y mejoramos los tiempos de entrega en toda Cuba.",
  },
  {
    year: "2024",
    title: "Innovación",
    description: "Renovamos nuestra plataforma con nuevas funcionalidades y una experiencia de usuario mejorada.",
  },
];

export default function About() {
  useDocumentMeta({
    title: 'Sobre Nosotros',
    description: 'Conoce la historia de Qbolacel, el puente que conecta a miles de familias cubanas con sus seres queridos en la isla. Nuestra misión, visión y valores.',
    ogType: 'website',
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Sobre Nosotros</h1>
            <p className="text-lg text-muted-foreground">
              Somos más que una plataforma de servicios. Somos el puente que conecta 
              a miles de familias cubanas con sus seres queridos en la isla.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="inline-flex p-2 rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Nuestra Misión</h2>
              <p className="text-muted-foreground leading-relaxed">
                Facilitar la comunicación y el apoyo entre familias cubanas en el exterior 
                y sus seres queridos en Cuba, ofreciendo servicios de recargas móviles y 
                envío de productos de manera rápida, segura y accesible.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Cada recarga que procesamos, cada paquete que entregamos, representa un 
                abrazo a la distancia, una muestra de amor que cruza fronteras.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="inline-flex p-2 rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Nuestra Visión</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ser la plataforma líder y de mayor confianza para la comunidad cubana 
                en el mundo, reconocida por nuestra excelencia en el servicio, 
                innovación tecnológica y compromiso genuino con nuestros usuarios.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Aspiramos a expandir continuamente nuestros servicios para satisfacer 
                las necesidades cambiantes de nuestra comunidad, siempre manteniendo 
                los valores que nos definen.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Nuestros Valores</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Los principios que guían cada decisión y acción en Qbolacel
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-xl p-6 border text-center"
              >
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Nuestra Historia</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Un recorrido por los momentos que han definido a Qbolacel
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-start gap-6 mb-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary md:-translate-x-1/2 mt-1.5" />

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                    }`}
                  >
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-2">
                      {item.year}
                    </span>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Message */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Un Mensaje de Nuestro Equipo</h2>
            <blockquote className="text-lg leading-relaxed opacity-90 mb-6">
              "En Qbolacel, cada miembro de nuestro equipo comparte una conexión personal 
              con Cuba. Entendemos la importancia de cada recarga, de cada paquete, porque 
              nosotros también tenemos familia esperando al otro lado. Por eso trabajamos 
              cada día para ofrecerte el mejor servicio posible. Gracias por confiar en nosotros."
            </blockquote>
            <p className="font-semibold">— El Equipo Qbolacel</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
