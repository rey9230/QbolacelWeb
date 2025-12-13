import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  Wifi, 
  Zap,
  Shield,
  Clock,
  Gift,
  CheckCircle,
  ArrowRight,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

type RechargeType = "mobile" | "nauta";

interface RechargeOption {
  amount: number;
  bonus?: number;
  hours?: number;
  popular?: boolean;
  bestValue?: boolean;
}

const mobileOptions: RechargeOption[] = [
  { amount: 5 },
  { amount: 10, bonus: 1 },
  { amount: 15, bonus: 2, popular: true },
  { amount: 20, bonus: 3 },
  { amount: 25, bonus: 4, bestValue: true },
  { amount: 30, bonus: 5 },
];

const nautaOptions: RechargeOption[] = [
  { amount: 3, hours: 1 },
  { amount: 12, hours: 5, popular: true },
  { amount: 20, hours: 10 },
  { amount: 50, hours: 30, bestValue: true },
];

const benefits = [
  { icon: Zap, title: "Entrega Instantánea", description: "El saldo llega en segundos" },
  { icon: Shield, title: "100% Seguro", description: "Pagos encriptados" },
  { icon: Clock, title: "24/7 Disponible", description: "Recarga cualquier hora" },
  { icon: Gift, title: "Bonos Exclusivos", description: "Saldo extra gratis" },
];

const Recargas = () => {
  const [rechargeType, setRechargeType] = useState<RechargeType>("mobile");
  const [selectedAmount, setSelectedAmount] = useState<number>(15);

  const options = rechargeType === "mobile" ? mobileOptions : nautaOptions;
  const selectedOption = options.find(o => o.amount === selectedAmount);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Clean */}
      <section className={cn(
        "py-16 md:py-20 relative overflow-hidden",
        rechargeType === "mobile" 
          ? "bg-gradient-to-br from-primary via-primary/90 to-accent"
          : "bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-500"
      )}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              Servicio #1 en recargas a Cuba
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {rechargeType === "mobile" ? "Recargas Cubacel" : "Recargas Nauta"}
            </h1>

            <p className="text-xl text-white/90 mb-8">
              {rechargeType === "mobile" 
                ? "Envía saldo móvil a Cuba al instante. Bonos exclusivos incluidos."
                : "Internet para Cuba. Planes de navegación desde 1 hora."
              }
            </p>

            <div className="flex flex-wrap gap-4 justify-center text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Sin comisiones ocultas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Entrega inmediata</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Recharge Section */}
      <section className="py-12 -mt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Card Container */}
            <div className="bg-card border border-border rounded-3xl shadow-xl p-6 md:p-8">
              {/* Type Selector */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex p-1 rounded-2xl bg-muted">
                  <button
                    onClick={() => {
                      setRechargeType("mobile");
                      setSelectedAmount(15);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
                      rechargeType === "mobile"
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Smartphone className="h-5 w-5" />
                    Móvil Cubacel
                  </button>
                  <button
                    onClick={() => {
                      setRechargeType("nauta");
                      setSelectedAmount(12);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
                      rechargeType === "nauta"
                        ? "bg-indigo-500 text-white shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Wifi className="h-5 w-5" />
                    Nauta Internet
                  </button>
                </div>
              </div>

              {/* Options Grid */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Selecciona el monto
                </h3>
                <div className={cn(
                  "grid gap-3",
                  rechargeType === "mobile" ? "grid-cols-3 md:grid-cols-6" : "grid-cols-2 md:grid-cols-4"
                )}>
                  {options.map((option, i) => (
                    <motion.button
                      key={option.amount}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedAmount(option.amount)}
                      className={cn(
                        "relative p-4 rounded-2xl border-2 transition-all text-center",
                        selectedAmount === option.amount
                          ? rechargeType === "mobile"
                            ? "border-primary bg-primary/5 shadow-lg"
                            : "border-indigo-500 bg-indigo-500/5 shadow-lg"
                          : "border-border bg-card hover:border-muted-foreground/50"
                      )}
                    >
                      {option.popular && (
                        <Badge 
                          className={cn(
                            "absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] px-2",
                            rechargeType === "mobile" ? "bg-primary" : "bg-indigo-500"
                          )}
                        >
                          POPULAR
                        </Badge>
                      )}
                      {option.bestValue && (
                        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] px-2 bg-warning text-warning-foreground">
                          MEJOR VALOR
                        </Badge>
                      )}

                      <div className="text-2xl font-bold text-foreground">
                        ${option.amount}
                      </div>
                      
                      {option.hours && (
                        <div className="text-sm text-muted-foreground">
                          {option.hours}h navegación
                        </div>
                      )}

                      {option.bonus && (
                        <div className="flex items-center justify-center gap-1 mt-1 text-xs font-medium text-success">
                          <Gift className="h-3 w-3" />
                          +${option.bonus} bonus
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Phone Input */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">
                  {rechargeType === "mobile" ? "Número de teléfono" : "Cuenta Nauta"}
                </label>
                <div className="flex gap-2">
                  {rechargeType === "mobile" && (
                    <div className="bg-muted px-4 py-3 rounded-xl font-mono text-sm flex items-center gap-2">
                      <span className="text-lg">🇨🇺</span>
                      +53
                    </div>
                  )}
                  <input
                    type={rechargeType === "mobile" ? "tel" : "email"}
                    placeholder={rechargeType === "mobile" ? "5X XXX XXXX" : "usuario@nauta.com.cu"}
                    className="flex-1 bg-muted px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Summary */}
              {selectedOption && (
                <div className={cn(
                  "rounded-2xl p-4 mb-6",
                  rechargeType === "mobile" 
                    ? "bg-primary/5 border border-primary/20" 
                    : "bg-indigo-500/5 border border-indigo-500/20"
                )}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total a pagar</p>
                      <p className="text-2xl font-bold">
                        ${selectedOption.amount}
                        {selectedOption.bonus && (
                          <span className="text-success ml-2 text-lg">
                            +${selectedOption.bonus} bonus
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Recibe en Cuba</p>
                      <p className="text-lg font-bold">
                        {rechargeType === "mobile" 
                          ? `$${selectedOption.amount + (selectedOption.bonus || 0)} saldo`
                          : `${selectedOption.hours}h navegación`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA */}
              <Button 
                size="xl" 
                className={cn(
                  "w-full gap-2 text-lg",
                  rechargeType === "nauta" && "bg-indigo-500 hover:bg-indigo-600"
                )}
              >
                <Zap className="h-5 w-5" />
                Recargar Ahora
                <ArrowRight className="h-5 w-5" />
              </Button>

              {/* Trust */}
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Transacción 100% segura y encriptada</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            ¿Por qué elegir Qbolacel?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-3">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-1">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-muted rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-2">
              Descarga la App Qbolacel
            </h3>
            <p className="text-muted-foreground mb-6">
              Recargas más rápidas, notificaciones y ofertas exclusivas
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                App Store
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Google Play
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Recargas;
