import { ScrollToTop } from "@/components/ScrollToTop";
import { CartSheet } from "@/components/cart/CartSheet";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
// import { CartDebugger } from "@/components/cart/CartDebugger";
import { AuthModal } from "@/components/auth/AuthModal";
import { BottomNav } from "@/components/layout/BottomNav";
import { useCartSync } from "@/hooks/useCartSync";
import { initPixel, trackPageView } from "@/lib/pixel";
import { queryClient } from "@/lib/queryClient";
import "@/utils/debugCart"; // Debug utilities for cart

// Pages
import About from "./pages/About";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import CheckoutCancel from "./pages/CheckoutCancel";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import ProductDetail from "./pages/ProductDetail";
import Recargas from "./pages/Recargas";
import RechargeCancel from "./pages/RechargeCancel";
import RechargeSuccess from "./pages/RechargeSuccess";
import ResetPassword from "./pages/ResetPassword";
import Services from "./pages/Services";
import Terms from "./pages/Terms";
import VerifyEmail from "./pages/VerifyEmail";

// Meta Pixel route change tracker
const PixelPageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Meta Pixel on first load
    initPixel();
    trackPageView();
  }, []);

  useEffect(() => {
    // Track page view on every route change
    trackPageView();
  }, [location.pathname]);

  return null;
};

const App = () => {
  useCartSync();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* <CartDebugger /> */}
        <BrowserRouter>
          <PixelPageTracker />
          <ScrollToTop />
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Index />} />
            <Route path="/recargas" element={<Recargas />} />
            <Route path="/recargas/success" element={<RechargeSuccess />} />
            <Route path="/recargas/cancel" element={<RechargeCancel />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/productos/:slug" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/cancel" element={<CheckoutCancel />} />
            <Route path="/cuenta" element={<Account />} />

            {/* Info Pages */}
            <Route path="/contacto" element={<Contact />} />
            <Route path="/preguntas-frecuentes" element={<FAQ />} />
            <Route path="/sobre-nosotros" element={<About />} />
            <Route path="/terminos" element={<Terms />} />
            <Route path="/privacidad" element={<Privacy />} />
            <Route path="/servicios" element={<Services />} />

            {/* Auth Pages */}
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CartSheet />
          <AuthModal />
          <BottomNav />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
