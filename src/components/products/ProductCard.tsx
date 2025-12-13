import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart.store";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  stock: number;
  vendor_id: string;
  vendor_name: string;
  category?: string;
  isNew?: boolean;
  isPopular?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        currency: product.currency,
        stock: product.stock,
        vendorId: product.vendor_id,
        vendorName: product.vendor_name,
      });

      toast({
        title: "¡Añadido al carrito!",
        description: product.name,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo añadir al carrito",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative"
    >
      <Link to={`/productos/${product.id}`}>
        <div className="card-elevated hover-lift overflow-hidden">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && <Badge variant="new">Nuevo</Badge>}
              {product.isPopular && <Badge variant="popular">Popular</Badge>}
            </div>

            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button 
                variant="secondary" 
                size="icon"
                className="m-1"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category */}
            {product.category && (
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {product.category}
              </span>
            )}

            {/* Name */}
            <h3 className="font-semibold text-foreground mt-1 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Vendor */}
            <p className="text-sm text-muted-foreground mt-1">
              {product.vendor_name}
            </p>

            {/* Price and Cart */}
            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="text-lg font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  {product.currency}
                </span>
              </div>

              <Button
                variant="gradient"
                size="icon-sm"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
              >
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Stock Status */}
            {product.stock <= 5 && product.stock > 0 && (
              <p className="text-xs text-warning mt-2">
                ¡Solo quedan {product.stock}!
              </p>
            )}
            {product.stock === 0 && (
              <p className="text-xs text-destructive mt-2">
                Agotado
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
