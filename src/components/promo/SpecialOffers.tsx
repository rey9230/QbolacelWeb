import { motion } from "framer-motion";
import { 
  Gift, 
  Percent, 
  Users, 
  Repeat,
  Crown,
  Sparkles,
  ArrowRight,
  Clock,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const offers = [
  {
    id: 1,
    icon: Gift,
    title: "Primera Recarga",
    description: "10% extra en tu primera recarga móvil o Nauta",
    code: "BIENVENIDO10",
    gradient: "from-primary to-accent",
    bgGradient: "from-primary/10 to-accent/10",
    badge: "NUEVO USUARIO",
  },
  {
    id: 2,
    icon: Users,
    title: "Invita y Gana",
    description: "$5 para ti y $5 para tu amigo en cada referido",
    code: "TU-CÓDIGO",
    gradient: "from-success to-emerald-500",
    bgGradient: "from-success/10 to-emerald-500/10",
    badge: "ILIMITADO",
  },
  {
    id: 3,
    icon: Repeat,
    title: "Recarga Recurrente",
    description: "5% de descuento en recargas automáticas mensuales",
    code: "AUTO5",
    gradient: "from-blue-500 to-indigo-500",
    bgGradient: "from-blue-500/10 to-indigo-500/10",
    badge: "AHORRA",
  },
  {
    id: 4,
    icon: Crown,
    title: "Cliente VIP",
    description: "Beneficios exclusivos al acumular +$100 en recargas",
    gradient: "from-warning to-orange-500",
    bgGradient: "from-warning/10 to-orange-500/10",
    badge: "PREMIUM",
  },
];

export function SpecialOffers() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-muted/50" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning mb-4"
          >
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">Ofertas Especiales</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Más saldo, mejores
            <span className="gradient-text"> beneficios</span>
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Aprovecha nuestras promociones exclusivas y haz que cada recarga valga más
          </p>
        </motion.div>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={cn(
                "relative rounded-2xl p-6 border border-border overflow-hidden",
                "bg-gradient-to-br",
                offer.bgGradient
              )}
            >
              {/* Badge */}
              <Badge 
                className={cn(
                  "absolute top-4 right-4 text-[10px]",
                  `bg-gradient-to-r ${offer.gradient} text-white border-0`
                )}
              >
                {offer.badge}
              </Badge>

              {/* Icon */}
              <div className={cn(
                "inline-flex p-3 rounded-2xl mb-4",
                `bg-gradient-to-br ${offer.gradient}`
              )}>
                <offer.icon className="h-6 w-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold mb-2">{offer.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{offer.description}</p>

              {/* Code */}
              {offer.code && (
                <div className="bg-background/80 backdrop-blur rounded-lg px-3 py-2 inline-flex items-center gap-2 mb-4">
                  <span className="text-xs text-muted-foreground">Código:</span>
                  <span className="font-mono font-bold text-sm">{offer.code}</span>
                </div>
              )}

              {/* CTA */}
              <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto">
                Aplicar oferta
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CountdownBanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-6 bg-gradient-to-r from-purple-600 via-primary to-accent relative overflow-hidden"
    >
      {/* Shimmer effect */}
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-white text-center">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            <span className="font-bold text-lg">OFERTA POR TIEMPO LIMITADO:</span>
          </div>
          
          {/* Countdown */}
          <div className="flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-lg">
              <span className="text-2xl font-bold font-mono">23</span>
              <span className="text-xs block">horas</span>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-lg">
              <span className="text-2xl font-bold font-mono">45</span>
              <span className="text-xs block">min</span>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-lg">
              <span className="text-2xl font-bold font-mono">12</span>
              <span className="text-xs block">seg</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <span>20% EXTRA en recargas +$25</span>
          </div>
          
          <Button variant="secondary" size="sm" className="font-bold">
            ¡LO QUIERO!
          </Button>
        </div>
      </div>
    </motion.section>
  );
}

export function TrustIndicators() {
  const stats = [
    { value: "50K+", label: "Usuarios activos" },
    { value: "1M+", label: "Recargas enviadas" },
    { value: "4.9", label: "Rating promedio", suffix: "⭐" },
    { value: "24/7", label: "Soporte en español" },
  ];

  return (
    <section className="py-12 border-y border-border bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <motion.p
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-primary"
              >
                {stat.value}
                {stat.suffix && <span className="ml-1">{stat.suffix}</span>}
              </motion.p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
