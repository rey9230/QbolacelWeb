import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSlider, SliderItem } from "@/hooks/useSlider";

// Color contrast mapping based on background colors
const colorContrastMap: Record<string, { text: string; textMuted: string; cta: string; ctaText: string }> = {
  '#e3f2fd': { text: '#1B2631', textMuted: '#1B2631B3', cta: '#1565C0', ctaText: '#FFFFFF' }, // Blue pastel
  '#E3F2FD': { text: '#1B2631', textMuted: '#1B2631B3', cta: '#1565C0', ctaText: '#FFFFFF' },
  '#fef5e7': { text: '#3E2723', textMuted: '#3E2723B3', cta: '#8D6E63', ctaText: '#FFFFFF' }, // Cream
  '#FEF5E7': { text: '#3E2723', textMuted: '#3E2723B3', cta: '#8D6E63', ctaText: '#FFFFFF' },
  '#f3e5f5': { text: '#2C1A32', textMuted: '#2C1A32B3', cta: '#7B1FA2', ctaText: '#FFFFFF' }, // Lavender
  '#F3E5F5': { text: '#2C1A32', textMuted: '#2C1A32B3', cta: '#7B1FA2', ctaText: '#FFFFFF' },
  '#e8f6f3': { text: '#0E2F29', textMuted: '#0E2F29B3', cta: '#00897B', ctaText: '#FFFFFF' }, // Mint green
  '#E8F6F3': { text: '#0E2F29', textMuted: '#0E2F29B3', cta: '#00897B', ctaText: '#FFFFFF' },
};

const defaultColors = { text: '#1A1A1A', textMuted: '#4A4A4A', cta: 'hsl(var(--primary))', ctaText: '#FFFFFF' };

function getContrastColors(bgColor: string) {
  return colorContrastMap[bgColor] || defaultColors;
}

function getSlideLink(item: SliderItem): string | null {
  if (!item.link) return null;
  
  if (item.link.action === 'external' || item.link.action === 'internal') {
    return item.link.url || null;
  }
  
  if (item.link.action === 'whatsapp' && item.link.phoneNumber) {
    const message = encodeURIComponent(item.link.message || '');
    return `https://wa.me/${item.link.phoneNumber}?text=${message}`;
  }
  
  return null;
}

function getSlideData(item: SliderItem) {
  const visual = item.config.visual || item.preset?.payload;
  const bgColor = item.config.backgroundColor || '#f5f5f5';
  const colors = getContrastColors(bgColor);
  
  return {
    id: item.id,
    title: visual?.title || '',
    subtitle: visual?.subtitle || '',
    imageUrl: visual?.url || '',
    backgroundColor: bgColor,
    ctaText: item.config.visual?.ctaText || 'Ver más',
    link: getSlideLink(item),
    colors,
  };
}

function SliderSkeleton() {
  return (
    <section className="relative h-[400px] md:h-[450px] lg:h-[500px] bg-muted overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 h-full flex items-center">
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
          <div className="flex-1 max-w-lg space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-12 w-40 mt-4" />
          </div>
          <div className="flex-1 flex justify-end">
            <Skeleton className="w-[300px] h-[300px] md:w-[400px] md:h-[350px] rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroSlider() {
  const { data, isLoading, isError } = useSlider();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = data?.version?.sections?.[0]?.items || [];

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);
  const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);

  if (isLoading) {
    return <SliderSkeleton />;
  }

  if (isError || slides.length === 0) {
    return null;
  }

  const currentItem = slides[currentSlide];
  const slideData = getSlideData(currentItem);

  const handleCtaClick = () => {
    if (slideData.link) {
      if (slideData.link.startsWith('https://wa.me')) {
        window.open(slideData.link, '_blank', 'noopener,noreferrer');
      } else if (slideData.link.startsWith('http')) {
        window.location.href = slideData.link;
      } else {
        window.location.href = slideData.link;
      }
    }
  };

  return (
    <section className="relative h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden">
      {/* Background Color */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slideData.id + '-bg'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          style={{ backgroundColor: slideData.backgroundColor }}
        />
      </AnimatePresence>

      {/* Content - 50/50 Layout */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16 h-full">
        <div className="flex flex-col md:flex-row items-center justify-between h-full py-8 md:py-0">
          {/* Left Side - Text Content (50%) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slideData.id + '-text'}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className="flex-1 max-w-lg order-2 md:order-1 text-center md:text-left"
            >
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                style={{ color: slideData.colors.text, lineHeight: 1.2 }}
              >
                {slideData.title}
              </h2>

              <p 
                className="text-base md:text-lg lg:text-xl mb-8 leading-relaxed"
                style={{ color: slideData.colors.textMuted, lineHeight: 1.5 }}
              >
                {slideData.subtitle}
              </p>

              {slideData.link && (
                <Button
                  onClick={handleCtaClick}
                  size="lg"
                  className="font-semibold px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all hover:opacity-90"
                  style={{ 
                    backgroundColor: slideData.colors.cta, 
                    color: slideData.colors.ctaText 
                  }}
                >
                  {slideData.ctaText}
                </Button>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Right Side - Image (50%) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slideData.id + '-image'}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex justify-center md:justify-end order-1 md:order-2"
            >
              <img
                src={slideData.imageUrl}
                alt={slideData.title}
                className="max-w-[280px] md:max-w-[380px] lg:max-w-[450px] h-auto object-contain"
                style={{
                  filter: 'drop-shadow(0px 25px 50px rgba(0, 0, 0, 0.15)) drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.1))',
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/60 backdrop-blur-sm text-foreground hover:bg-white/80 transition-colors shadow-md"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/60 backdrop-blur-sm text-foreground hover:bg-white/80 transition-colors shadow-md"
            aria-label="Siguiente slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "bg-primary w-6" 
                  : "bg-gray-300 hover:bg-gray-400 w-2"
              }`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
            key={currentSlide}
          />
        </div>
      )}
    </section>
  );
}
