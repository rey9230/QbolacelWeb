import { motion } from "framer-motion";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, CartItem as CartItemType } from "@/stores/cart.store";
import { useState } from "react";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQty, removeItem } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateQty = async (newQty: number) => {
    setIsUpdating(true);
    try {
      await updateQty(item.itemId, newQty);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeItem(item.itemId);
    } finally {
      setIsUpdating(false);
    }
  };

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
          {item.vendorName}
        </p>
        
        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => handleUpdateQty(item.qty - 1)}
              disabled={item.qty <= 1 || isUpdating}
              className="h-7 w-7"
            >
              {isUpdating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {item.qty}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => handleUpdateQty(item.qty + 1)}
              disabled={item.qty >= item.stock || isUpdating}
              className="h-7 w-7"
            >
              {isUpdating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
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
        onClick={handleRemove}
        disabled={isUpdating}
        className="text-muted-foreground hover:text-destructive self-start"
      >
        {isUpdating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </motion.div>
  );
}
