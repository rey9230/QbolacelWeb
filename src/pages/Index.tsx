import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Smartphone, 
  Wifi, 
  ShoppingBag, 
  Shield, 
  Clock, 
  DollarSign,
  Headphones,
  Download,
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard, Product } from "@/components/products/ProductCard";

// Sample featured products
const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Combo Familiar Premium",
    description: "Arroz, aceite, pasta y más productos esenciales",
    price: 89.99,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1543168256-418811576931?w=400&h=400&fit=crop",
    stock: 15,
    vendor_id: "v1",
    vendor_name: "Tienda Cuba",
    category: "Alimentos",
    isPopular: true,
  },
  {
    id: "2",
    name: "Kit de Aseo Personal",
    description: "Jabón, champú, pasta dental y más",
    price: 45.50,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    stock: 23,
    vendor_id: "v2",
    vendor_name: "Productos Cubanos",
    category: "Higiene",
    isNew: true,
  },
  {
    id: "3",
    name: "Electrodoméstico Multifunción",
    description: "Licuadora, procesador y batidora en uno",
    price: 159.00,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop",
    stock: 8,
    vendor_id: "v3",
    vendor_name: "ElectroCuba",
    category: "Electrodomésticos",
  },
  {
    id: "4",
    name: "Pack Medicamentos Básicos",
    description: "Analgésicos, vitaminas y suplementos",
    price: 65.00,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    stock: 50,
    vendor_id: "v4",
    vendor_name: "FarmaCuba",
    category: "Salud",
    isPopular: true,
  },
];

const services = [
  {
    icon: Smartphone,
    title: "Recargas Móvil",
    description: "Cubacel - Entrega instantánea - Desde $5",
    badge: "Más Popular",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Wifi,
    title: "Recarga Nauta",
    description: "Navegación en Cuba - 1h hasta 30h disponibles",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description: "Envía productos a Cuba desde nuestra tienda",
    badge: "¡Nuevo!",
    color: "from-purple-500 to-purple-600",
  },
];

const features = [
  { icon: Clock, label: "Entrega en segundos" },
  { icon: Shield, label: "100% seguro y encriptado" },
  { icon: DollarSign, label: "Sin comisiones ocultas" },
  { icon: Headphones, label: "Soporte 24/7 en español" },
];

const steps = [
  { number: "1", icon: Download, label: "Descarga la app gratis" },
  { number: "2", icon: CheckCircle, label: "Regístrate en 30 segundos" },
  { number: "3", icon: Smartphone, label: "Elige recarga o producto" },
  { number: "4", icon: DollarSign, label: "Paga seguro" },
  { number: "5", icon: Zap, label: "¡Entrega instantánea!" },
];

const testimonials = [
  {
    name: "María García",
    location: "Miami, FL",
    rating: 5,
    text: "Increíble servicio. Mi familia recibe las recargas en segundos. Lo uso cada semana.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Carlos Rodríguez",
    location: "Madrid, España",
    rating: 5,
    text: "El marketplace es fantástico. Pude enviar un combo de alimentos a mi madre sin problemas.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Ana Martínez",
    location: "Houston, TX",
    rating: 5,
    text: "Uso Qbolacel desde hace 2 años. Nunca he tenido un problema. 100% recomendado.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <Badge variant="gradient" className="mb-6">
                Servicio #1 en Recargas a Cuba
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Recarga móviles y Nauta
                <span className="gradient-text block">en segundos</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                Envía saldo a Cuba de forma rápida, segura y confiable. 
                Descarga la app gratis y comienza ahora.
              </p>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button variant="hero" size="xl" className="gap-2">
                  <Download className="h-5 w-5" />
                  App Store
                </Button>
                <Button variant="hero" size="xl" className="gap-2">
                  <Download className="h-5 w-5" />
                  Google Play
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="trust-badge">
                  <Star className="h-4 w-4 text-warning fill-warning" />
                  <span>4.8/5 en reviews</span>
                </div>
                <div className="trust-badge">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <span>+50K descargas</span>
                </div>
                <div className="trust-badge">
                  <Shield className="h-4 w-4 text-success" />
                  <span>100% seguro</span>
                </div>
              </div>
            </motion.div>

            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 gradient-hero rounded-[3rem] blur-3xl opacity-30 scale-110" />
                
                {/* Phone Frame */}
                <div className="relative bg-foreground rounded-[3rem] p-3 shadow-2xl">
                  <div className="bg-background rounded-[2.5rem] overflow-hidden w-[280px] h-[580px]">
                    <img 
                      src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=280&h=580&fit=crop"
                      alt="Qbolacel App"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-success text-success-foreground rounded-2xl p-4 shadow-lg"
                >
                  <Zap className="h-6 w-6" />
                </motion.div>
                
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl p-4 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-sm font-medium">Recarga exitosa</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Todo lo que necesitas en una sola app
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Recargas, productos y más. Envía lo que tu familia necesita en Cuba.
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
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="card-elevated hover-lift p-6"
              >
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${service.color} mb-4`}>
                  <service.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  {service.badge && (
                    <Badge variant={service.badge === "¡Nuevo!" ? "new" : "popular"}>
                      {service.badge}
                    </Badge>
                  )}
                </div>
                
                <p className="text-muted-foreground mb-4">{service.description}</p>
                
                <Button variant="ghost" className="gap-2 p-0 h-auto text-primary">
                  Ver más <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cómo funciona
            </h2>
            <p className="text-muted-foreground text-lg">
              En 5 simples pasos, envía recargas a Cuba
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="flex items-center"
              >
                <div className="flex flex-col items-center text-center w-32">
                  <div className="relative mb-3">
                    <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
                      <step.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{step.label}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-muted-foreground mx-2 hidden md:block" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.label}
                variants={itemVariants}
                className="text-center text-primary-foreground"
              >
                <div className="inline-flex p-4 rounded-2xl bg-primary-foreground/10 mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <p className="font-semibold">{feature.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Marketplace Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Marketplace
                </h2>
                <Badge variant="new">Nuevo</Badge>
              </div>
              <p className="text-muted-foreground text-lg">
                Envía productos a tu familia en Cuba
              </p>
            </div>
            
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/marketplace">
                Ver todo el catálogo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-muted-foreground text-lg">
              Miles de familias confían en Qbolacel
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                variants={itemVariants}
                className="card-elevated p-6"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-warning fill-warning" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-foreground mb-6">"{testimonial.text}"</p>
                
                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2 mb-6">
              <Gift className="h-5 w-5 text-primary-foreground" />
              <span className="text-primary-foreground font-medium">
                $2 de bonificación en tu primera recarga
              </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              ¿Listo para empezar?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-md mx-auto">
              Únete a miles de personas que confían en Qbolacel
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button variant="hero-outline" size="xl" className="gap-2">
                <Download className="h-5 w-5" />
                App Store
              </Button>
              <Button variant="hero-outline" size="xl" className="gap-2">
                <Download className="h-5 w-5" />
                Google Play
              </Button>
            </div>
            
            <p className="text-sm text-primary-foreground/60">
              Gratis • Sin permanencia • Cancela cuando quieras
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
