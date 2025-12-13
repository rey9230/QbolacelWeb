import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, CartItem as CartItemType } from "@/stores/cart.store";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQty, removeItem } = useCartStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-3 p-3 bg-card rounded-xl border border-border"
    >
      {/* Product Image */}
      <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-foreground truncate">
          {item.name}
        </h4>
        <p className="text-xs text-muted-foreground mb-2">
          {item.vendor_name}
        </p>
        
        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => updateQty(item.product_id, item.qty - 1)}
              disabled={item.qty <= 1}
              className="h-7 w-7"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {item.qty}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => updateQty(item.product_id, item.qty + 1)}
              disabled={item.qty >= item.stock}
              className="h-7 w-7"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Price */}
          <span className="font-semibold text-primary">
            ${(item.price * item.qty).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => removeItem(item.product_id)}
        className="text-muted-foreground hover:text-destructive self-start"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
