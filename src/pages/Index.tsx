import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ServicesSection } from "@/components/home/ServicesSection";
import { UnifiedRechargeSection } from "@/components/home/UnifiedRechargeSection";
import { SpecialOffers } from "@/components/promo/SpecialOffers";
import { MarketplacePreview } from "@/components/home/MarketplacePreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { SocialProofBar } from "@/components/home/SocialProofBar";
import { AppDownloadSection } from "@/components/home/AppDownloadSection";
import { FAQEducationSection } from "@/components/home/FAQEducationSection";
import { AgencyServicesSection } from "@/components/home/AgencyServicesSection";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { OrganizationSchema, WebsiteSchema, FAQSchema, HowToSchema } from "@/components/seo/JsonLd";

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
      <FAQSchema items={[
        { question: '¿Cómo recargar Cubacel con Qbolacel?', answer: 'Elige Recargas, selecciona Cubacel, escribe el número y el monto, y paga con TropiPay/PayPal/Stripe. Entrega inmediata.' },
        { question: '¿Puedo comprar y enviar productos a Cuba?', answer: 'Sí, selecciona provincia y municipio, añade productos al carrito y usa el checkout unificado. Entrega a domicilio en Cuba.' },
        { question: '¿Puedo guardar mi tarjeta para pagos 1‑clic?', answer: 'Sí, guarda métodos de pago y usa pagos rápidos sin volver a introducir datos.' },
      ]} />
      <HowToSchema
        name="Recarga Cubacel en 30 segundos"
        description="Proceso paso a paso para enviar recargas móviles a Cuba con Qbolacel."
        image="https://qbolacel.com/og-image.png"
        steps={[
          { name: 'Selecciona Cubacel', text: 'Entra a Recargas y elige la opción Cubacel o Nauta.' },
          { name: 'Ingresa número y monto', text: 'Escribe el número cubano y elige el monto o bono destacado.' },
          { name: 'Paga y confirma', text: 'Completa el pago con TropiPay, PayPal o tarjeta. Recarga entregada al instante.' },
        ]}
      />
      
      <Navbar />
      <SocialProofBar />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Services Section */}
      <ServicesSection />

      {/* Unified Recharge Section (Mobile + Nauta) */}
      <UnifiedRechargeSection />

      {/* App Download */}
      <AppDownloadSection />

      {/* Servicios vía WhatsApp */}
      <AgencyServicesSection />

      {/* Special Offers */}
      <SpecialOffers />

      {/* Marketplace Preview */}
      <MarketplacePreview />

      {/* Education + FAQ */}
      <FAQEducationSection />

      {/* Testimonials */}
      <TestimonialsSection />

      <Footer />
    </div>
  );
};

export default Index;
