import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Smartphone, 
  ShoppingBag, 
  User, 
  LogIn,
  Download,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartButton } from "@/components/cart/CartButton";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/recargas", label: "Recargas", icon: Zap, highlight: true },
  { to: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { to: "/como-funciona", label: "Cómo Funciona" },
  { to: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Promo Banner */}
      <div className="gradient-hero py-2 px-4">
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm text-primary-foreground">
          <Smartphone className="h-4 w-4" />
          <span className="font-medium">¡Nuevo! Recarga móviles desde $5</span>
          <span className="hidden sm:inline">- Descarga la app →</span>
          <Badge variant="new" className="ml-2 text-[10px]">
            GRATIS
          </Badge>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="gradient-primary rounded-xl p-2">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Qbolacel
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive(link.to)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    link.highlight && "text-primary"
                  )}
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.label}
                  {link.highlight && (
                    <Badge variant="gradient" className="text-[10px] px-1.5 py-0">
                      HOT
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Button variant="gradient" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Descargar App
              </Button>

              <CartButton />

              {isAuthenticated ? (
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openAuthModal('login')}
                  className="gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Ingresar
                </Button>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <CartButton />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border bg-background"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                      isActive(link.to)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {link.icon && <link.icon className="h-5 w-5" />}
                    {link.label}
                    {link.highlight && (
                      <Badge variant="gradient" className="ml-auto">
                        HOT
                      </Badge>
                    )}
                  </Link>
                ))}

                <div className="pt-4 border-t border-border space-y-2">
                  <Button variant="gradient" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Descargar App
                  </Button>

                  {!isAuthenticated && (
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={() => {
                        openAuthModal('login');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogIn className="h-4 w-4" />
                      Ingresar
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
