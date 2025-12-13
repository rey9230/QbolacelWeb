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
import { HeroRecharge } from "@/components/promo/HeroRecharge";
import { 
  PromoBanner, 
  QuickRechargeSection, 
  NautaRechargeSection,
  FlashOfferBanner,
  FloatingPromoWidget
} from "@/components/promo/PromoBanner";
import { 
  SpecialOffers, 
  CountdownBanner,
  TrustIndicators 
} from "@/components/promo/SpecialOffers";

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

      {/* Promo Banner - Urgent Offer */}
      <PromoBanner variant="urgent" />

      {/* Hero Section - Recharge Focused */}
      <HeroRecharge />

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Quick Recharge Section - Cubacel */}
      <QuickRechargeSection />

      {/* Flash Offer Banner */}
      <FlashOfferBanner />

      {/* Nauta Recharge Section */}
      <NautaRechargeSection />

      {/* Special Offers Grid */}
      <SpecialOffers />

      {/* Countdown Banner */}
      <CountdownBanner />

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

      {/* Floating Promo Widget */}
      <FloatingPromoWidget />

      <Footer />
    </div>
  );
};

export default Index;
