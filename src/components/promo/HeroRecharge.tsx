import { motion } from "framer-motion";
import { 
  Smartphone, 
  Zap, 
  Shield, 
  Clock, 
  Star,
  ArrowRight,
  Gift,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroRecharge() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-accent/20 via-accent/5 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 text-success mb-6"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">+50,000 familias confían en nosotros</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              <span className="text-foreground">Recarga</span>
              <br />
              <span className="gradient-text">Cubacel & Nauta</span>
              <br />
              <span className="text-foreground">al instante</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Envía saldo a Cuba en segundos. Tu familia lo recibe 
              <span className="text-primary font-semibold"> inmediatamente</span>.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button variant="hero" size="xl" className="gap-3 text-lg">
                <Smartphone className="h-6 w-6" />
                Recargar Móvil
                <Badge variant="new" className="ml-1 text-[10px]">
                  BONUS
                </Badge>
              </Button>
              
              <Button variant="outline" size="xl" className="gap-2 text-lg">
                <Zap className="h-5 w-5" />
                Recargar Nauta
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-success/10">
                  <Clock className="h-4 w-4 text-success" />
                </div>
                <span className="text-sm font-medium">Entrega inmediata</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">100% seguro</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-warning/10">
                  <Star className="h-4 w-4 text-warning" />
                </div>
                <span className="text-sm font-medium">4.9/5 rating</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Interactive Recharge Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative bg-card border border-border rounded-3xl p-6 shadow-2xl shadow-primary/10">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="gradient-primary p-3 rounded-2xl">
                    <Smartphone className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Recarga Rápida</h3>
                    <p className="text-sm text-muted-foreground">Cubacel</p>
                  </div>
                </div>
                <Badge variant="gradient">NUEVO</Badge>
              </div>

              {/* Amount Selector */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-3">Selecciona monto:</p>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15, 20, 25, 30].map((amount) => (
                    <motion.button
                      key={amount}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`py-3 rounded-xl font-bold text-sm transition-all ${
                        amount === 20 
                          ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/30" 
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      }`}
                    >
                      ${amount}
                      {amount === 20 && (
                        <span className="block text-[10px] font-normal opacity-90">+$3 bonus</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Bonus Display */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-success/10 border border-success/20 rounded-2xl p-4 mb-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-success" />
                    <span className="font-medium text-success">Bonus incluido</span>
                  </div>
                  <span className="text-2xl font-bold text-success">+$3</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Tu familiar recibe $23 en total
                </p>
              </motion.div>

              {/* Phone Input */}
              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Número de teléfono:
                </label>
                <div className="flex gap-2">
                  <div className="bg-muted px-4 py-3 rounded-xl font-mono text-sm flex items-center gap-2">
                    <span className="text-lg">🇨🇺</span>
                    +53
                  </div>
                  <input
                    type="tel"
                    placeholder="5X XXX XXXX"
                    className="flex-1 bg-muted px-4 py-3 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* CTA Button */}
              <Button variant="hero" size="xl" className="w-full gap-2 text-lg">
                Recargar $20
                <ArrowRight className="h-5 w-5" />
              </Button>

              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Transacción 100% segura y encriptada</span>
              </div>
            </div>

            {/* Floating Success Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute -right-4 top-20 bg-card border border-border rounded-2xl p-4 shadow-xl hidden lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="bg-success/10 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-sm">Recarga exitosa</p>
                  <p className="text-xs text-muted-foreground">Hace 2 minutos</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Stats Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -left-4 bottom-20 bg-card border border-border rounded-2xl p-4 shadow-xl hidden lg:block"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">+1,234</p>
                <p className="text-xs text-muted-foreground">Recargas hoy</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
