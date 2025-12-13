import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Smartphone, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/components/cart/CartItem";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";

export function CartSheet() {
  const navigate = useNavigate();
  const { items, isOpen, isLoading, isSynced, closeCart, getSubtotal, getTotalItems, syncWithServer } = useCartStore();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  
  const subtotal = getSubtotal();
  const totalItems = getTotalItems();

  // Sync cart with server when opening and authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated && !isSynced) {
      syncWithServer();
    }
  }, [isOpen, isAuthenticated, isSynced, syncWithServer]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    closeCart();
    navigate('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="gradient-primary rounded-lg p-2">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <SheetTitle className="text-left">Tu Carrito</SheetTitle>
              <SheetDescription className="text-left">
                {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {isLoading && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground mt-4">Cargando carrito...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="bg-muted rounded-full p-6 mb-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Tu carrito está vacío</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-[200px]">
                Explora nuestro marketplace y encuentra productos increíbles
              </p>
              <Button 
                variant="gradient" 
                onClick={() => {
                  closeCart();
                  navigate('/marketplace');
                }}
              >
                Explorar Productos
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CartItem key={item.itemId} item={item} />
              ))}
            </AnimatePresence>
          )}

          {/* Promo Banner */}
          {items.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <Smartphone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    ¿También necesitas recargar?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Descarga la app y envía saldo a Cuba
                  </p>
                  <Badge variant="promo" className="mt-2">
                    $2 de bonificación
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4 bg-card">
            {/* Subtotals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className="text-muted-foreground italic">Calculado en checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${subtotal.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button 
                variant="gradient" 
                size="lg" 
                className="w-full gap-2"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Proceder al Checkout
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => {
                  closeCart();
                  navigate('/marketplace');
                }}
              >
                Continuar Comprando
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
