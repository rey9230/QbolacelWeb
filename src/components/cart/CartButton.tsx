import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart.store";
import { cn } from "@/lib/utils";

interface CartButtonProps {
  className?: string;
}

export function CartButton({ className }: CartButtonProps) {
  const { openCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={openCart}
      className={cn("relative", className)}
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full gradient-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center badge-pulse">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Button>
  );
}
