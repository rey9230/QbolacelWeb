import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ServicesSection } from "@/components/home/ServicesSection";
import { UnifiedRechargeSection } from "@/components/home/UnifiedRechargeSection";
import { SpecialOffers } from "@/components/promo/SpecialOffers";
import { MarketplacePreview } from "@/components/home/MarketplacePreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { OrganizationSchema, WebsiteSchema } from "@/components/seo/JsonLd";

const Index = () => {
  useDocumentMeta({
    title: 'Recargas a Cuba y Marketplace',
    description: 'Envía recargas Cubacel y Nauta a Cuba al instante. Compra productos con entrega a domicilio en toda Cuba. Servicio rápido, seguro y confiable.',
    ogType: 'website',
  });

  return (
    <div className="min-h-screen bg-background">
      <OrganizationSchema />
      <WebsiteSchema />
      
      <Navbar />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Services Section */}
      <ServicesSection />

      {/* Unified Recharge Section (Mobile + Nauta) */}
      <UnifiedRechargeSection />

      {/* Special Offers */}
      <SpecialOffers />

      {/* Marketplace Preview */}
      <MarketplacePreview />

      {/* Testimonials */}
      <TestimonialsSection />

      <Footer />
    </div>
  );
};

export default Index;
