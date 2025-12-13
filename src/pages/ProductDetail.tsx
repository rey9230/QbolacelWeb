import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  Star,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Store,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCartStore } from "@/stores/cart.store";
import { toast } from "sonner";
import { useProduct } from "@/hooks/useProducts";
import { ProductCard } from "@/components/products/ProductCard";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();

  const { data, isLoading, error } = useProduct(id || '');
  
  const product = data?.product;
  const similarProducts = data?.similar || [];

  const handleAddToCart = async () => {
    if (!product) return;
    
    const imageUrl = product.primaryImage || product.pictures[0] || '/placeholder.svg';
    
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        image: imageUrl,
        price: product.price.amount,
        currency: product.price.currency,
        stock: product.stock,
        vendorId: product.agencyId || '',
        vendorName: '',
      }, quantity);
      toast.success(`${product.name} añadido al carrito`);
      openCart();
    } catch {
      toast.error('Error al añadir al carrito');
    }
  };

  const nextImage = () => {
    if (!product) return;
    setSelectedImage((prev) => (prev + 1) % product.pictures.length);
  };

  const prevImage = () => {
    if (!product) return;
    setSelectedImage((prev) => (prev - 1 + product.pictures.length) % product.pictures.length);
  };

  // Calculate discount from promotions
  const activePromotion = product?.promotions.find(p => {
    if (!p.startsAt && !p.endsAt) return true;
    const now = new Date();
    const starts = p.startsAt ? new Date(p.startsAt) : null;
    const ends = p.endsAt ? new Date(p.endsAt) : null;
    if (starts && now < starts) return false;
    if (ends && now > ends) return false;
    return true;
  });

  const discountPercent = activePromotion?.type === 'percentage' ? activePromotion.amount : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center py-40">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <p className="text-muted-foreground mb-6">El producto que buscas no existe o ha sido eliminado.</p>
          <Button asChild>
            <Link to="/marketplace">Volver al Marketplace</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.pictures.length > 0 ? product.pictures : [product.primaryImage || '/placeholder.svg'];
  const currentImage = images[selectedImage] || images[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Inicio</Link>
          <span>/</span>
          <Link to="/marketplace" className="hover:text-primary">Marketplace</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Discount Badge */}
                {discountPercent && (
                  <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                    -{discountPercent}%
                  </Badge>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Tags & Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
                {product.isFeatured && <Badge variant="gradient">Destacado</Badge>}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-warning fill-warning" />
                    <span className="font-bold">{product.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({product.reviewsCount} reviews)</span>
                  </div>
                  {product.salesCount > 0 && (
                    <span className="text-muted-foreground">• {product.salesCount} vendidos</span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  ${product.price.amount.toFixed(2)}
                </span>
                <span className="text-muted-foreground">{product.price.currency}</span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-muted-foreground text-lg">
                  {product.description}
                </p>
              )}

              {/* Vendor/Agency */}
              {product.agencyId && (
                <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Vendedor verificado</p>
                    <p className="text-sm text-muted-foreground">
                      ID: {product.agencyId}
                    </p>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-medium">Cantidad:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-bold text-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stock} disponibles
                </span>
              </div>

              {/* Stock Status */}
              {product.stockStatus === 'OUT_OF_STOCK' && (
                <p className="text-destructive font-medium">Producto agotado</p>
              )}
              {product.stockStatus === 'BACKORDER' && (
                <p className="text-warning font-medium">Disponible bajo pedido</p>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  size="xl" 
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                  disabled={product.stockStatus === 'OUT_OF_STOCK'}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Añadir al Carrito
                </Button>
                <Button variant="outline" size="xl">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="xl">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Truck className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">Envío a Cuba</p>
                    <p className="text-sm text-muted-foreground">3-5 días</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Compra Segura</p>
                    <p className="text-sm text-muted-foreground">Garantía de entrega</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Attributes */}
      {Object.keys(product.attributes).length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Características del Producto</h2>
            <div className="bg-card border border-border rounded-2xl p-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <dt className="font-medium text-muted-foreground">{key}:</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      )}

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Productos Similares</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <ProductCard key={similarProduct.id} product={similarProduct} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
