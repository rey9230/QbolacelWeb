import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/lib/api";
import { useCartStore } from "@/stores/cart.store";
import { motion } from "framer-motion";
import { Loader2, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
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

    console.log('🛍️ [ProductCard] Add to cart clicked for:', product.name);
    console.log('🛍️ [ProductCard] Product data:', {
      id: product.id,
      name: product.name,
      price: product.price.amount,
      stock: product.stock,
    });

    setIsAdding(true);
    try {
      const itemToAdd = {
        productId: product.id,
        name: product.name,
        image: imageUrl,
        price: product.price.amount,
        currency: product.price.currency,
        stock: product.stock,
        vendorId: product.agencyId || '',
        vendorName: '', // Agency name not available in Product, will be enriched by cart
      };

      console.log('🛍️ [ProductCard] Calling addItem with:', itemToAdd);
      await addItem(itemToAdd);

      console.log('✅ [ProductCard] Item added successfully');
      toast({
        title: "¡Añadido al carrito!",
        description: product.name,
      });
    } catch (error) {
      console.error('❌ [ProductCard] Error adding to cart:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo añadir al carrito",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  // List View
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group"
      >
        <Link to={`/productos/${product.slug}`}>
          <div className="card-elevated hover-lift overflow-hidden flex flex-row gap-4 p-3">
            {/* Image - Fixed size */}
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-white">
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-contain"
              />
              {/* Badges */}
              {discountPercent && (
                <Badge variant="destructive" className="absolute top-1 left-1 text-[9px] px-1 py-0">
                  -{discountPercent}%
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              {/* Name and Description */}
              <div>
                <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Price and Stock */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-primary">
                    ${product.price.amount.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {product.price.currency}
                  </span>
                </div>
                <Badge variant={isOutOfStock ? "destructive" : "secondary"} className="text-[10px]">
                  {isOutOfStock ? "Agotado" : "En stock"}
                </Badge>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid View (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative"
    >
      <Link to={`/productos/${product.slug}`}>
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

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
          </div>

          {/* Content */}
          <div className="p-3 flex flex-col flex-1">
            {/* Name - Fixed 2 lines */}
            <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 min-h-[2.25rem] group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* 5 Stars Rating */}
            <div className="flex items-center gap-0.5 mt-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-3 w-3 text-warning fill-warning" />
              ))}
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
