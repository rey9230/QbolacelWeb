import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ServicesSection } from "@/components/home/ServicesSection";
import { UnifiedRechargeSection } from "@/components/home/UnifiedRechargeSection";
import { SpecialOffers } from "@/components/promo/SpecialOffers";
import { MarketplacePreview } from "@/components/home/MarketplacePreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
