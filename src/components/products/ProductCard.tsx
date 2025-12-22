import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Loader2, Star, MessageSquare, Truck } from "lucide-react";
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
        <div className="card-elevated hover-lift overflow-hidden h-full flex flex-col">
          {/* Image Container - Fixed height */}
          <div className="relative aspect-square overflow-hidden bg-white flex-shrink-0">
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

            {/* Stock badge on image */}
            {isOutOfStock && (
              <div className="absolute top-3 right-3 bg-destructive/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <span className="text-[10px] font-medium text-destructive-foreground">Agotado</span>
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
          <div className="p-4 flex flex-col flex-1">
            {/* Tags row */}
            <div className="flex flex-wrap gap-1 mb-2 min-h-[1.25rem]">
              {product.tags.slice(0, 2).map((tag, i) => (
                <span 
                  key={i} 
                  className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground uppercase tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Name - Fixed 2 lines */}
            <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Description snippet */}
            {product.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 min-h-[2rem]">
                {product.description}
              </p>
            )}
            {!product.description && <div className="min-h-[2rem] mt-1.5" />}

            {/* Rating & Reviews row */}
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              {product.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-warning fill-warning" />
                  <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
                </div>
              )}
              {product.reviewsCount > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{product.reviewsCount}</span>
                </div>
              )}
              {product.salesCount > 0 && (
                <span>{product.salesCount} vendidos</span>
              )}
            </div>

            {/* Shipping indicator */}
            <div className="flex items-center gap-1 mt-2 text-[10px] text-success">
              <Truck className="h-3 w-3" />
              <span>Envío a Cuba</span>
            </div>

            {/* Price and Cart */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-primary leading-none">
                  ${product.price.amount.toFixed(2)}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {product.price.currency}
                </span>
              </div>

              <Button
                variant="gradient"
                size="icon-sm"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className="shrink-0"
              >
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Stock Status */}
            <div className="h-4 mt-1.5">
              {isLowStock && (
                <p className="text-[10px] text-warning font-medium">
                  ¡Últimas {product.stock} unidades!
                </p>
              )}
              {isOutOfStock && (
                <p className="text-[10px] text-destructive font-medium">
                  Agotado
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
