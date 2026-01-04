import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, Home, ShoppingBag, User, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/recargas", label: "Recargas", icon: Zap, highlight: true },
  { to: "/marketplace", label: "Tienda", icon: ShoppingBag },
  { to: "/servicios", label: "Servicios", icon: Briefcase },
];

export function BottomNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Build items array based on auth state
  const items = isAuthenticated
    ? [...navItems, { to: "/cuenta", label: "Perfil", icon: User }]
    : navItems;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          {/* Gradient fade effect at top */}
          <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" />

          {/* Bottom bar */}
          <div className="bg-background/95 backdrop-blur-lg border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)] safe-bottom">
            <div className="flex items-center justify-around px-2 py-2">
              {items.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all",
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="relative">
                      <item.icon
                        className={cn(
                          "h-5 w-5 transition-transform",
                          active && "scale-110"
                        )}
                      />
                      {/* HOT badge for Recargas */}
                      {item.highlight && (
                        <span className="absolute -top-1 -right-2 bg-gradient-to-r from-primary to-accent text-[8px] text-white font-bold px-1 rounded-full">
                          HOT
                        </span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[10px] mt-1 font-medium transition-all",
                        active && "font-semibold"
                      )}
                    >
                      {item.label}
                    </span>
                    {/* Active indicator dot */}
                    {active && (
                      <motion.div
                        layoutId="bottomNavIndicator"
                        className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
