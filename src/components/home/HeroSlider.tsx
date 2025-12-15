import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Smartphone, Gift, Percent, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Desktop images
import slide1Desktop from "@/assets/hero/slide1-desktop.jpg";
import slide2Desktop from "@/assets/hero/slide2-desktop.jpg";
import slide3Desktop from "@/assets/hero/slide3-desktop.jpg";
import slide4Desktop from "@/assets/hero/slide4-desktop.jpg";

// Mobile images
import slide1Mobile from "@/assets/hero/slide1-mobile.jpg";
import slide2Mobile from "@/assets/hero/slide2-mobile.jpg";
import slide3Mobile from "@/assets/hero/slide3-mobile.jpg";
import slide4Mobile from "@/assets/hero/slide4-mobile.jpg";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  badge?: string;
  icon: React.ElementType;
  imageDesktop: string;
  imageMobile: string;
  overlayColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Recarga Cubacel al instante",
    subtitle: "Hasta $5 de BONUS en recargas +$20. Tu familia lo recibe en segundos.",
    cta: "Recargar Ahora",
    ctaLink: "/recargas",
    badge: "OFERTA ESPECIAL",
    icon: Smartphone,
    imageDesktop: slide1Desktop,
    imageMobile: slide1Mobile,
    overlayColor: "from-primary/80 via-primary/50 to-transparent",
  },
  {
    id: 2,
    title: "Envía productos a Cuba",
    subtitle: "Marketplace con miles de artículos. Entrega garantizada en toda la isla.",
    cta: "Ver Catálogo",
    ctaLink: "/marketplace",
    badge: "MARKETPLACE",
    icon: Percent,
    imageDesktop: slide4Desktop,
    imageMobile: slide4Mobile,
    overlayColor: "from-warning/80 via-warning/50 to-transparent",
  },
  {
    id: 3,
    title: "Internet para Cuba",
    subtitle: "Recargas Nauta desde $3. Mantén conectada a tu familia.",
    cta: "Ver Planes Nauta",
    ctaLink: "/recargas",
    badge: "NAUTA",
    icon: Wifi,
    imageDesktop: slide2Desktop,
    imageMobile: slide2Mobile,
    overlayColor: "from-indigo-900/80 via-indigo-900/50 to-transparent",
  },
  {
    id: 4,
    title: "Primera Recarga: 10% Extra",
    subtitle: "Usa código BIENVENIDO10 y recibe más saldo en tu primera recarga.",
    cta: "Obtener Bonus",
    ctaLink: "/recargas",
    badge: "NUEVO USUARIO",
    icon: Gift,
    imageDesktop: slide3Desktop,
    imageMobile: slide3Mobile,
    overlayColor: "from-success/80 via-success/50 to-transparent",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);
  const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <section className="relative h-[500px] md:h-[550px] overflow-hidden">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Desktop Image */}
          <img
            src={slide.imageDesktop}
            alt={slide.title}
            className="hidden md:block absolute inset-0 w-full h-full object-cover"
          />
          {/* Mobile Image */}
          <img
            src={slide.imageMobile}
            alt={slide.title}
            className="block md:hidden absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient Overlay for text readability */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlayColor}`} />

          {/* Additional dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            {slide.badge && (
              <Badge className="bg-white/20 text-white border-white/30 mb-4 backdrop-blur-sm">{slide.badge}</Badge>
            )}

            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                <Icon className="h-10 w-10 text-white" />
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              {slide.title}
            </h2>

            <p className="text-xl text-white/90 mb-8 max-w-lg drop-shadow-md">{slide.subtitle}</p>

            <Button asChild size="xl" className="bg-white text-foreground hover:bg-white/90 font-bold gap-2 shadow-lg">
              <Link to={slide.ctaLink}>{slide.cta}</Link>
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <motion.div
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          key={currentSlide}
        />
      </div>
    </section>
  );
}
