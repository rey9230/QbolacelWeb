import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SliderItem, useSlider } from "@/hooks/useSlider";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

// Color contrast mapping based on background colors (keys normalized to lowercase)
const colorContrastMap: Record<string, { text: string; textMuted: string; cta: string; ctaText: string }> = {
  '#e3f2fd': { text: '#1B2631', textMuted: 'rgba(27, 38, 49, 0.7)', cta: '#1565C0', ctaText: '#FFFFFF' }, // Blue pastel
  '#fef5e7': { text: '#3E2723', textMuted: 'rgba(62, 39, 35, 0.7)', cta: '#8D6E63', ctaText: '#FFFFFF' }, // Cream
  '#f3e5f5': { text: '#2C1A32', textMuted: 'rgba(44, 26, 50, 0.7)', cta: '#7B1FA2', ctaText: '#FFFFFF' }, // Lavender
  '#e8f6f3': { text: '#0E2F29', textMuted: 'rgba(14, 47, 41, 0.7)', cta: '#00897B', ctaText: '#FFFFFF' }, // Mint green
};

const defaultColors = { text: '#1A1A1A', textMuted: 'rgba(26, 26, 26, 0.7)', cta: '#2563eb', ctaText: '#FFFFFF' };

// Function to calculate luminance and derive text color from any background
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#1A1A1A';
  const factor = 1 - percent;
  const r = Math.round(rgb.r * factor);
  const g = Math.round(rgb.g * factor);
  const b = Math.round(rgb.b * factor);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function saturateColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#2563eb';

  let r = rgb.r, g = rgb.g, b = rgb.b;
  // Darken and saturate based on dominant channel
  if (rgb.r >= rgb.g && rgb.r >= rgb.b) {
    r = Math.min(255, Math.round(rgb.r * 0.6));
    g = Math.round(rgb.g * 0.4);
    b = Math.round(rgb.b * 0.4);
  } else if (rgb.g >= rgb.r && rgb.g >= rgb.b) {
    r = Math.round(rgb.r * 0.4);
    g = Math.min(255, Math.round(rgb.g * 0.6));
    b = Math.round(rgb.b * 0.4);
  } else {
    r = Math.round(rgb.r * 0.4);
    g = Math.round(rgb.g * 0.4);
    b = Math.min(255, Math.round(rgb.b * 0.6));
  }

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getContrastColors(bgColor: string) {
  const normalizedBg = bgColor.toLowerCase();

  // Check if we have a predefined mapping
  if (colorContrastMap[normalizedBg]) {
    return colorContrastMap[normalizedBg];
  }

  // Calculate colors dynamically based on background
  const rgb = hexToRgb(normalizedBg);
  if (!rgb) return defaultColors;

  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);

  // For light backgrounds (pastels), use dark text derived from the background
  if (luminance > 0.5) {
    const textColor = darkenColor(normalizedBg, 0.85);
    const ctaColor = saturateColor(normalizedBg);
    return {
      text: textColor,
      textMuted: `${textColor}B3`,
      cta: ctaColor,
      ctaText: '#FFFFFF'
    };
  }

  // For dark backgrounds, use light text
  return {
    text: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.7)',
    cta: '#FFFFFF',
    ctaText: '#1A1A1A'
  };
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
    ctaText: visual?.ctaText || 'Ver más',
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
    <section className="relative min-h-[520px] md:h-[450px] lg:h-[500px] overflow-hidden">
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

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16 h-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between h-full py-8 md:py-0">

          {/* Text Block */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slideData.id + '-text'}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className="flex-1 max-w-lg order-1 text-left md:text-left mb-6 md:mb-0"
            >
              <h2
                className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight"
                style={{ color: slideData.colors.text, lineHeight: 1.2 }}
              >
                {slideData.title}
              </h2>

              <p
                className="text-sm md:text-lg lg:text-xl mb-0 md:mb-8 leading-relaxed"
                style={{ color: slideData.colors.textMuted, lineHeight: 1.5 }}
              >
                {slideData.subtitle}
              </p>

              {/* Desktop CTA - inside text block */}
              {slideData.link && (
                <Button
                  onClick={handleCtaClick}
                  size="lg"
                  className="hidden md:inline-flex font-semibold px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all hover:opacity-90"
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

          {/* Image Block */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slideData.id + '-image'}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex justify-center self-center order-2 w-[80%] mx-auto md:w-auto md:justify-end my-6 md:my-0"
            >
              <img
                src={slideData.imageUrl}
                alt={slideData.title}
                className="max-w-full max-h-[160px] md:max-w-[380px] lg:max-w-[450px] md:max-h-none h-auto object-contain"
                style={{
                  filter: 'drop-shadow(0px 25px 50px rgba(0, 0, 0, 0.15)) drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.1))',
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Mobile CTA Button - order-3 full width */}
          {slideData.link && (
            <motion.div
              key={slideData.id + '-cta-mobile'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="order-3 w-full md:hidden mt-8"
            >
              <Button
                onClick={handleCtaClick}
                size="lg"
                className="font-semibold w-full py-4 text-base shadow-lg hover:shadow-xl transition-all hover:opacity-90"
                style={{
                  backgroundColor: slideData.colors.cta,
                  color: slideData.colors.ctaText
                }}
              >
                {slideData.ctaText}
              </Button>
            </motion.div>
          )}
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
