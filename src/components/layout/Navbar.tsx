import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  ShoppingBag,
  User, 
  LogIn,
  LogOut,
  Download,
  Zap,
  HelpCircle,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartButton } from "@/components/cart/CartButton";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/lib/utils";
import logoLarge from "@/assets/logo-large.svg";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/recargas", label: "Recargas", icon: Zap, highlight: true },
  { to: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { to: "/preguntas-frecuentes", label: "FAQ", icon: HelpCircle },
  { to: "/contacto", label: "Contacto", icon: Mail },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, openAuthModal } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logoLarge} 
              alt="Qbolacel" 
              className="h-10"
            />
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
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              App
            </Button>

            <CartButton />

            {isAuthenticated ? (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/cuenta">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button 
                variant="default" 
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
                <Button variant="outline" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Descargar App
                </Button>

                {isAuthenticated ? (
                  <>
                    <Link
                      to="/cuenta"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                        isActive("/cuenta")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <User className="h-5 w-5" />
                      {user?.name || "Mi Cuenta"}
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full gap-2 text-destructive hover:text-destructive"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <Button
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
  );
}
