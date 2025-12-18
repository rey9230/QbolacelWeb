import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Loader2, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart.store";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const imageUrl = product.primaryImage || product.pictures[0] || '/placeholder.svg';
  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK';
  const isLowStock = product.stock <= 5 && product.stock > 0;

  // Calculate discount from promotions
  const activePromotion = product.promotions.find(p => {
    if (!p.startsAt && !p.endsAt) return true;
    const now = new Date();
    const starts = p.startsAt ? new Date(p.startsAt) : null;
    const ends = p.endsAt ? new Date(p.endsAt) : null;
    if (starts && now < starts) return false;
    if (ends && now > ends) return false;
    return true;
  });

  const discountPercent = activePromotion?.type === 'percentage' ? activePromotion.amount : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        image: imageUrl,
        price: product.price.amount,
        currency: product.price.currency,
        stock: product.stock,
        vendorId: product.agencyId || '',
        vendorName: '', // Agency name not available in Product, will be enriched by cart
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
          <div className="relative aspect-square overflow-hidden bg-white">
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isFeatured && <Badge variant="popular">Destacado</Badge>}
              {discountPercent && (
                <Badge variant="destructive">-{discountPercent}%</Badge>
              )}
            </div>

            {/* Rating badge */}
            {product.rating > 0 && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                <Star className="h-3 w-3 text-warning fill-warning" />
                <span className="font-medium">{product.rating.toFixed(1)}</span>
              </div>
            )}

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
            {/* Tags as category */}
            {product.tags.length > 0 && (
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {product.tags[0]}
              </span>
            )}

            {/* Name */}
            <h3 className="font-semibold text-foreground mt-1 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Sales count */}
            {product.salesCount > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {product.salesCount} vendidos
              </p>
            )}

            {/* Price and Cart */}
            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="text-lg font-bold text-primary">
                  ${product.price.amount.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  {product.price.currency}
                </span>
              </div>

              <Button
                variant="gradient"
                size="icon-sm"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
              >
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Stock Status */}
            {isLowStock && (
              <p className="text-xs text-warning mt-2">
                ¡Solo quedan {product.stock}!
              </p>
            )}
            {isOutOfStock && (
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
