import { motion } from "framer-motion";
import { Zap, Shield, HeadphonesIcon, CreditCard, Clock, Heart } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Recargas Instantáneas",
    description: "Tu recarga llega en segundos. Sin esperas, sin complicaciones.",
  },
  {
    icon: Shield,
    title: "100% Seguro",
    description: "Transacciones protegidas con encriptación de nivel bancario.",
  },
  {
    icon: HeadphonesIcon,
    title: "Soporte Dedicado",
    description: "Equipo disponible de 8 AM a 10 PM para ayudarte en lo que necesites.",
  },
  {
    icon: CreditCard,
    title: "Múltiples Pagos",
    description: "PayPal, tarjetas de crédito/débito y TropiPay. Tú eliges.",
  },
  {
    icon: Clock,
    title: "Disponible 24/7",
    description: "Recarga cuando quieras, desde donde estés, a cualquier hora.",
  },
  {
    icon: Heart,
    title: "Hecho con Pasión",
    description: "Creado por cubanos, para cubanos. Entendemos tus necesidades.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nos esforzamos cada día para ofrecerte la mejor experiencia en recargas y envíos a Cuba
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
