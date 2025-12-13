import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartSheet } from "@/components/cart/CartSheet";
import { AuthModal } from "@/components/auth/AuthModal";
import { HelmetProvider } from "react-helmet-async";

// Pages
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Recargas from "./pages/Recargas";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Index />} />
            <Route path="/recargas" element={<Recargas />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/productos/:id" element={<ProductDetail />} />
            
            {/* Info Pages */}
            <Route path="/contacto" element={<Contact />} />
            <Route path="/preguntas-frecuentes" element={<FAQ />} />
            <Route path="/terminos" element={<Terms />} />
            <Route path="/privacidad" element={<Privacy />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CartSheet />
          <AuthModal />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
