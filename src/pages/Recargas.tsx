import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Smartphone, 
  Wifi, 
  Download, 
  CheckCircle, 
  Zap,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const rechargeOptions = [
  { amount: 5, bonus: 0, popular: false },
  { amount: 10, bonus: 2, popular: false },
  { amount: 15, bonus: 3, popular: true },
  { amount: 20, bonus: 5, popular: false },
  { amount: 25, bonus: 7, popular: false },
  { amount: 30, bonus: 10, popular: true },
];

const nautaOptions = [
  { hours: 1, price: 1.50 },
  { hours: 5, price: 6.00 },
  { hours: 10, price: 10.00 },
  { hours: 20, price: 18.00 },
  { hours: 30, price: 25.00 },
];

const benefits = [
  { icon: Zap, title: "Entrega Instantánea", description: "Tu recarga llega en segundos" },
  { icon: Shield, title: "100% Seguro", description: "Transacciones encriptadas" },
  { icon: Clock, title: "24/7 Disponible", description: "Recarga cuando quieras" },
  { icon: Gift, title: "Bonificaciones", description: "Obtén saldo extra gratis" },
];

const Recargas = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-hero py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="info" className="mb-6">
              Servicio #1 en recargas a Cuba
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Recarga móviles y Nauta
              <span className="block text-primary-foreground/80">al instante</span>
            </h1>

            <p className="text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Envía saldo a cualquier número Cubacel o cuenta Nauta en segundos. 
              Descarga nuestra app y comienza ahora.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button variant="hero-outline" size="xl" className="gap-2">
                <Download className="h-5 w-5" />
                App Store
              </Button>
              <Button variant="hero-outline" size="xl" className="gap-2">
                <Download className="h-5 w-5" />
                Google Play
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <CheckCircle className="h-5 w-5 text-success" />
                <span>Sin comisiones ocultas</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <CheckCircle className="h-5 w-5 text-success" />
                <span>Bonificaciones incluidas</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <CheckCircle className="h-5 w-5 text-success" />
                <span>Soporte 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cubacel Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="gradient-primary rounded-2xl p-3">
              <Smartphone className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Recargas Cubacel</h2>
              <p className="text-muted-foreground">Entrega instantánea a cualquier número</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {rechargeOptions.map((option) => (
              <motion.div
                key={option.amount}
                whileHover={{ scale: 1.05 }}
                className={`card-elevated p-6 text-center cursor-pointer border-2 transition-colors ${
                  option.popular 
                    ? "border-primary bg-primary/5" 
                    : "border-transparent hover:border-primary/50"
                }`}
              >
                {option.popular && (
                  <Badge variant="popular" className="mb-2">Popular</Badge>
                )}
                <p className="text-3xl font-bold text-foreground mb-1">
                  ${option.amount}
                </p>
                {option.bonus > 0 && (
                  <p className="text-sm text-success font-medium">
                    +${option.bonus} bonus
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="gradient" size="lg" className="gap-2">
              <Download className="h-5 w-5" />
              Descargar App para Recargar
            </Button>
          </div>
        </div>
      </section>

      {/* Nauta Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-3">
              <Wifi className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Recargas Nauta</h2>
              <p className="text-muted-foreground">Navegación en Cuba desde cualquier lugar</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {nautaOptions.map((option) => (
              <motion.div
                key={option.hours}
                whileHover={{ scale: 1.05 }}
                className="card-elevated p-6 text-center cursor-pointer border-2 border-transparent hover:border-primary/50 transition-colors"
              >
                <p className="text-3xl font-bold text-foreground mb-1">
                  {option.hours}h
                </p>
                <p className="text-lg font-semibold text-primary">
                  ${option.price.toFixed(2)}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="gradient" size="lg" className="gap-2">
              <Download className="h-5 w-5" />
              Descargar App para Recargar
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            ¿Por qué elegir Qbolacel?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card-elevated p-6 text-center"
              >
                <div className="gradient-primary rounded-2xl p-4 inline-flex mb-4">
                  <benefit.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            ¿Listo para recargar?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Descarga la app y envía tu primera recarga en menos de 2 minutos
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero-outline" size="xl" className="gap-2">
              <Download className="h-5 w-5" />
              App Store
            </Button>
            <Button variant="hero-outline" size="xl" className="gap-2">
              <Download className="h-5 w-5" />
              Google Play
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Recargas;
