import { motion } from "framer-motion";
import { Zap, Gift, Percent, Timer, ArrowRight, Smartphone, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PromoBannerProps {
  variant?: "primary" | "secondary" | "urgent" | "gift";
  className?: string;
}

export function PromoBanner({ variant = "primary", className }: PromoBannerProps) {
  const variants = {
    primary: {
      bg: "bg-gradient-to-r from-primary via-accent to-primary",
      text: "text-primary-foreground",
      icon: Zap,
      title: "¡Recarga y GANA!",
      subtitle: "Cada recarga te acerca a premios exclusivos",
    },
    secondary: {
      bg: "bg-gradient-to-r from-success via-success/80 to-success",
      text: "text-success-foreground",
      icon: Percent,
      title: "10% EXTRA en tu primera recarga",
      subtitle: "Usa código: NUEVO10",
    },
    urgent: {
      bg: "bg-gradient-to-r from-destructive via-warning to-destructive",
      text: "text-destructive-foreground",
      icon: Timer,
      title: "⏰ OFERTA FLASH: 2 horas restantes",
      subtitle: "$5 de BONUS en recargas +$20",
    },
    gift: {
      bg: "bg-gradient-to-r from-accent via-primary to-accent",
      text: "text-primary-foreground",
      icon: Gift,
      title: "🎁 Descarga la app = $2 GRATIS",
      subtitle: "Para tu primera recarga móvil o Nauta",
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        config.bg,
        config.text,
        "py-3 px-4 relative overflow-hidden",
        className
      )}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent_50%)]" />
      
      <div className="container mx-auto flex items-center justify-center gap-3 relative z-10">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
        
        <div className="flex items-center gap-2 text-sm md:text-base">
          <span className="font-bold">{config.title}</span>
          <span className="hidden sm:inline opacity-90">- {config.subtitle}</span>
        </div>
        
        <Button 
          size="sm" 
          variant="secondary"
          className="ml-2 gap-1 h-7 text-xs font-bold"
        >
          ¡RECARGAR!
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
}

interface RechargeOfferCardProps {
  amount: number;
  bonus?: number;
  popular?: boolean;
  bestValue?: boolean;
  discount?: number;
  className?: string;
  onClick?: () => void;
}

export function RechargeOfferCard({
  amount,
  bonus,
  popular,
  bestValue,
  discount,
  className,
  onClick
}: RechargeOfferCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative cursor-pointer rounded-2xl p-4 border-2 transition-all",
        popular 
          ? "border-primary bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 shadow-lg shadow-primary/20" 
          : "border-border bg-card hover:border-primary/50",
        bestValue && "ring-2 ring-warning ring-offset-2",
        className
      )}
    >
      {/* Badges */}
      {popular && (
        <Badge 
          variant="gradient" 
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] px-3"
        >
          MÁS POPULAR
        </Badge>
      )}
      {bestValue && (
        <Badge 
          variant="default" 
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-warning text-warning-foreground text-[10px] px-3"
        >
          MEJOR VALOR
        </Badge>
      )}
      {discount && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2.5 -right-2 text-[10px] rotate-12"
        >
          -{discount}%
        </Badge>
      )}

      <div className="text-center space-y-2">
        {/* Amount */}
        <div className="relative">
          <span className="text-3xl font-bold text-foreground">${amount}</span>
          <span className="text-sm text-muted-foreground ml-1">USD</span>
        </div>

        {/* Bonus */}
        {bonus && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center justify-center gap-1 text-success"
          >
            <Gift className="h-4 w-4" />
            <span className="font-bold text-sm">+${bonus} BONUS</span>
          </motion.div>
        )}

        {/* Receiver gets */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground">Recibe en Cuba</p>
          <p className="text-lg font-semibold text-foreground">
            ${bonus ? amount + bonus : amount} CUP equiv.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function QuickRechargeSection() {
  const offers = [
    { amount: 5, bonus: 0 },
    { amount: 10, bonus: 1, popular: true },
    { amount: 15, bonus: 2 },
    { amount: 20, bonus: 3, bestValue: true },
    { amount: 25, bonus: 4 },
    { amount: 30, bonus: 5, discount: 10 },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 via-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Smartphone className="h-5 w-5" />
            <span className="font-semibold">Recargas Cubacel</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Elige tu recarga
            <span className="gradient-text block">y envía al instante</span>
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Tu familia recibe el saldo en segundos. Bonos exclusivos en cada recarga.
          </p>
        </motion.div>

        {/* Offers Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          {offers.map((offer, i) => (
            <motion.div
              key={offer.amount}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <RechargeOfferCard {...offer} />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="hero" size="xl" className="gap-2">
            <Zap className="h-5 w-5" />
            Recargar Ahora
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            ⚡ Entrega instantánea • 🔒 100% seguro • 💬 Soporte 24/7
          </p>
        </div>
      </div>
    </section>
  );
}

export function NautaRechargeSection() {
  const nautaPlans = [
    { hours: 1, price: 3, popular: false },
    { hours: 5, price: 12, popular: true },
    { hours: 10, price: 20, popular: false },
    { hours: 30, price: 50, bestValue: true },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-500/5 via-background to-blue-500/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-4">
            <Wifi className="h-5 w-5" />
            <span className="font-semibold">Recargas Nauta</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Internet para Cuba
          </h2>
          
          <p className="text-muted-foreground text-lg">
            Horas de navegación Nauta al mejor precio
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {nautaPlans.map((plan, i) => (
            <motion.div
              key={plan.hours}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={cn(
                "relative cursor-pointer rounded-2xl p-5 text-center border-2 transition-all",
                plan.popular 
                  ? "border-indigo-500 bg-indigo-500/5 shadow-lg" 
                  : "border-border bg-card hover:border-indigo-500/50",
                plan.bestValue && "ring-2 ring-warning ring-offset-2"
              )}
            >
              {plan.popular && (
                <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-500 text-[10px]">
                  POPULAR
                </Badge>
              )}
              {plan.bestValue && (
                <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-warning text-warning-foreground text-[10px]">
                  AHORRA 20%
                </Badge>
              )}
              
              <Wifi className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
              <p className="text-2xl font-bold">{plan.hours}h</p>
              <p className="text-sm text-muted-foreground mb-2">de navegación</p>
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                ${plan.price}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="gap-2 border-indigo-500 text-indigo-600 hover:bg-indigo-500/10">
            <Wifi className="h-5 w-5" />
            Ver Todos los Planes
          </Button>
        </div>
      </div>
    </section>
  );
}

export function FlashOfferBanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-8 bg-gradient-to-r from-destructive via-warning to-destructive relative overflow-hidden"
    >
      {/* Animated stripes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_20px)]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Timer className="h-12 w-12 text-white" />
          </motion.div>
          
          <div className="text-white">
            <h3 className="text-2xl md:text-3xl font-bold">
              🔥 OFERTA FLASH: Solo HOY
            </h3>
            <p className="text-lg opacity-90">
              Recarga $20 o más y recibe <span className="font-bold text-white">$5 EXTRA GRATIS</span>
            </p>
          </div>
          
          <Button 
            size="xl" 
            variant="secondary"
            className="font-bold"
          >
            ¡APROVECHAR AHORA!
          </Button>
        </div>
      </div>
    </motion.section>
  );
}

export function FloatingPromoWidget() {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 2, type: "spring" }}
      className="fixed right-4 bottom-24 z-40 hidden lg:block"
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="bg-gradient-to-br from-primary to-accent p-4 rounded-2xl shadow-2xl shadow-primary/30 max-w-[200px]"
      >
        <div className="text-primary-foreground text-center">
          <Gift className="h-8 w-8 mx-auto mb-2" />
          <p className="font-bold text-sm">$2 GRATIS</p>
          <p className="text-xs opacity-90 mb-3">al descargar la app</p>
          <Button size="sm" variant="secondary" className="w-full text-xs">
            Descargar
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
