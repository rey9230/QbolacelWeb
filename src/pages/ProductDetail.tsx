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
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCartStore } from "@/stores/cart.store";
import { toast } from "sonner";

// Mock product data - in real app, fetch from API
const mockProduct = {
  id: "1",
  name: "Combo Familiar Premium",
  description: "El combo perfecto para tu familia en Cuba. Incluye productos esenciales de alta calidad seleccionados cuidadosamente para satisfacer las necesidades básicas del hogar.",
  longDescription: `
    Este combo familiar premium incluye una selección de productos esenciales:
    
    • Arroz de primera calidad (5 kg)
    • Aceite vegetal (1 L)
    • Pasta de diferentes variedades (2 paquetes)
    • Azúcar refina (2 kg)
    • Café molido premium (250g)
    • Leche en polvo (1 kg)
    • Jabón de tocador (pack de 3)
    • Pasta dental
    
    Todos los productos son de marcas reconocidas y alta calidad. Entrega garantizada a cualquier provincia de Cuba.
  `,
  price: 89.99,
  originalPrice: 110.00,
  currency: "USD",
  images: [
    "https://images.unsplash.com/photo-1543168256-418811576931?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=800&h=800&fit=crop",
  ],
  stock: 15,
  vendor_id: "v1",
  vendor_name: "Tienda Cuba",
  vendor_rating: 4.8,
  vendor_sales: 1234,
  category: "Alimentos",
  isPopular: true,
  rating: 4.9,
  reviews: 127,
  deliveryTime: "3-5 días",
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();

  // In real app, fetch product by id
  const product = mockProduct;

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      currency: product.currency,
      stock: product.stock,
      vendor_id: product.vendor_id,
      vendor_name: product.vendor_name,
    }, quantity);
    toast.success(`${product.name} añadido al carrito`);
    openCart();
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

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
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
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

                {/* Discount Badge */}
                {discount > 0 && (
                  <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                    -{discount}%
                  </Badge>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2">
                {product.images.map((image, index) => (
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
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Category & Badges */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.isPopular && <Badge variant="gradient">Popular</Badge>}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-warning fill-warning" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews} reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  ${product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="text-muted-foreground">{product.currency}</span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-lg">
                {product.description}
              </p>

              {/* Vendor */}
              <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{product.vendor_name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-warning fill-warning" />
                    <span>{product.vendor_rating}</span>
                    <span>•</span>
                    <span>{product.vendor_sales} ventas</span>
                  </div>
                </div>
              </div>

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

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  size="xl" 
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
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
                    <p className="text-sm text-muted-foreground">{product.deliveryTime}</p>
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

      {/* Product Details */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Detalles del Producto</h2>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-foreground">
                {product.longDescription}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
