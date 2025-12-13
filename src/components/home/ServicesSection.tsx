import { motion } from "framer-motion";
import { Smartphone, Wifi, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const services = [
  {
    id: 1,
    title: "Recargas Móvil",
    description: "Envía saldo Cubacel al instante. Bonos exclusivos en cada recarga.",
    icon: Smartphone,
    link: "/recargas",
    color: "primary",
    bgClass: "bg-primary/10",
    iconClass: "text-primary",
  },
  {
    id: 2,
    title: "Recargas Nauta",
    description: "Internet para Cuba. Planes desde 1 hora hasta 30 horas de navegación.",
    icon: Wifi,
    link: "/recargas",
    color: "indigo",
    bgClass: "bg-indigo-500/10",
    iconClass: "text-indigo-500",
  },
  {
    id: 3,
    title: "Marketplace",
    description: "Envía productos a tu familia. Miles de artículos con entrega garantizada.",
    icon: ShoppingBag,
    link: "/marketplace",
    color: "warning",
    bgClass: "bg-warning/10",
    iconClass: "text-warning",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ServicesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Nuestros Servicios
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Todo lo que necesitas para mantener conectada a tu familia en Cuba
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={itemVariants}>
              <Link
                to={service.link}
                className="group block p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className={cn("inline-flex p-4 rounded-2xl mb-4", service.bgClass)}>
                  <service.icon className={cn("h-8 w-8", service.iconClass)} />
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground mb-4">
                  {service.description}
                </p>
                
                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  Ver más
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
