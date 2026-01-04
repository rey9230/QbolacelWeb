import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { RechargeCheckoutModal } from "@/components/recharge/RechargeCheckoutModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useTopupProducts } from "@/hooks/useTopup";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    ArrowRight,
    CheckCircle,
    Clock,
    Download,
    Gift,
    Loader2,
    Shield,
    Smartphone,
    Wifi,
    Zap
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

type RechargeType = "mobile" | "nauta";

const benefits = [
  { icon: Zap, title: "Entrega Instantánea", description: "El saldo llega en segundos" },
  { icon: Shield, title: "100% Seguro", description: "Pagos encriptados" },
  { icon: Clock, title: "24/7 Disponible", description: "Recarga cualquier hora" },
  { icon: Gift, title: "Bonos Exclusivos", description: "Saldo extra gratis" },
];

interface LocationState {
  type?: RechargeType;
  productId?: string;
  amount?: number;
}

const Recargas = () => {
  useDocumentMeta({
    title: 'Recargas Cubacel y Nauta',
    description: 'Envía recargas a Cuba al instante. Saldo Cubacel y Nauta con bonos exclusivos. Entrega inmediata, 24/7 disponible y 100% seguro.',
    ogType: 'website',
  });
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [rechargeType, setRechargeType] = useState<RechargeType>(state?.type || "mobile");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(state?.productId || null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Fetch products from API
  const { data: allProducts, isLoading, error } = useTopupProducts({ country: "CU" });

  // Filter products by type
  const mobileProducts = useMemo(() =>
    allProducts?.filter(p => p.operator === "CUBACEL" || p.productType === "MOBILE_TOPUP") || [],
    [allProducts]
  );

  const nautaProducts = useMemo(() =>
    allProducts?.filter(p => p.operator === "NAUTA" || p.productType === "NAUTA") || [],
    [allProducts]
  );

  const products = rechargeType === "mobile" ? mobileProducts : nautaProducts;

  // Auto-select first product if none selected
  useEffect(() => {
    if (products.length > 0 && !selectedProductId) {
      // Try to select popular/featured product first
      const featured = products.find(p => p.isFeatured);
      setSelectedProductId(featured?.id || products[0].id);
    }
  }, [products, selectedProductId]);

  // Update selection if navigated with state
  useEffect(() => {
    if (state?.type) {
      setRechargeType(state.type);
    }
    if (state?.productId) {
      setSelectedProductId(state.productId);
    }
  }, [state]);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleRechargeClick = () => {
    if (phoneNumber.trim().length > 0 && selectedProduct) {
      setCheckoutOpen(true);
    }
  };

  const handleTypeChange = (type: RechargeType) => {
    setRechargeType(type);
    setSelectedProductId(null); // Reset selection when switching type
  };


  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Clean */}
      <section className={cn(
        "py-6 md:py-16 relative overflow-hidden",
        rechargeType === "mobile"
          ? "bg-gradient-to-br from-primary via-primary/90 to-accent"
          : "bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-500"
      )}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-2 md:mb-4">
              Servicio #1 en recargas a Cuba
            </Badge>

            <h1 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4">
              {rechargeType === "mobile" ? "Recargas Cubacel" : "Recargas Nauta"}
            </h1>

            <p className="text-sm md:text-xl text-white/90 mb-4 md:mb-8">
              {rechargeType === "mobile"
                ? "Envía saldo móvil a Cuba al instante. Bonos exclusivos incluidos."
                : "Internet para Cuba. Planes de navegación desde 1 hora."
              }
            </p>

            <div className="hidden md:flex flex-wrap gap-4 justify-center text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Sin comisiones ocultas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Entrega inmediata</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Recharge Section */}
      <section className="py-12 -mt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Card Container */}
            <div className="bg-card border border-border rounded-3xl shadow-xl p-6 md:p-8">
              {/* Type Selector */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex p-1 rounded-2xl bg-muted">
                  <button
                    onClick={() => handleTypeChange("mobile")}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
                      rechargeType === "mobile"
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Smartphone className="h-5 w-5" />
                    Móvil Cubacel
                  </button>
                  <button
                    onClick={() => handleTypeChange("nauta")}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
                      rechargeType === "nauta"
                        ? "bg-indigo-500 text-white shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Wifi className="h-5 w-5" />
                    Nauta Internet
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Cargando productos...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-8 text-destructive">
                  <p>Error al cargar los productos. Por favor, intenta de nuevo.</p>
                </div>
              )}

              {/* Products Grid */}
              {!isLoading && !error && products.length > 0 && (
                <>
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-center">
                      Selecciona el monto
                    </h3>
                    <div className={cn(
                      "grid gap-3",
                      products.length <= 4 ? "grid-cols-2 md:grid-cols-4"
                        : products.length <= 6 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
                        : "grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
                    )}>
                      {products.map((product, i) => {
                        const hasDiscount = product.originalPrice && product.originalPrice > product.salePrice;
                        const discountPercent = hasDiscount
                          ? Math.round(((product.originalPrice! - product.salePrice) / product.originalPrice!) * 100)
                          : null;
                        const isSelected = selectedProductId === product.id;

                        return (
                          <motion.button
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedProductId(product.id)}
                            className={cn(
                              "relative p-3 rounded-2xl border-2 transition-all text-left",
                              isSelected
                                ? rechargeType === "mobile"
                                  ? "border-primary bg-primary/5 shadow-lg"
                                  : "border-indigo-500 bg-indigo-500/5 shadow-lg"
                                : "border-border bg-card hover:border-muted-foreground/50"
                            )}
                          >
                            {/* Badges */}
                            <div className="absolute -top-2.5 left-2 right-2 flex justify-center gap-1">
                              {product.isFeatured && (
                                <Badge
                                  className={cn(
                                    "text-[9px] px-1.5",
                                    rechargeType === "mobile" ? "bg-primary" : "bg-indigo-500"
                                  )}
                                >
                                  POPULAR
                                </Badge>
                              )}
                              {discountPercent && (
                                <Badge className="text-[9px] px-1.5 bg-success">
                                  -{discountPercent}%
                                </Badge>
                              )}
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-xl font-bold text-foreground">
                                ${product.salePrice}
                              </span>
                              {hasDiscount && (
                                <span className="text-xs text-muted-foreground line-through">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>

                            {/* Short Description */}
                            {product.shortDescription && (
                              <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-tight">
                                {product.shortDescription}
                              </p>
                            )}

                            {/* Receive Value */}
                            {product.receiveValue && (
                              <div className="text-[10px] font-medium text-success mt-1.5">
                                Recibe: {product.receiveValue} {product.receiveCurrency}
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">
                      {rechargeType === "mobile" ? "Número de teléfono" : "Cuenta Nauta"}
                    </label>
                    <div className="flex gap-2">
                      {rechargeType === "mobile" && (
                        <div className="bg-muted px-4 py-3 rounded-xl font-mono text-sm flex items-center gap-2">
                          <span className="text-lg">🇨🇺</span>
                          +53
                        </div>
                      )}
                      <input
                        type={rechargeType === "mobile" ? "tel" : "email"}
                        placeholder={rechargeType === "mobile" ? "5X XXX XXXX" : "usuario@nauta.com.cu"}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 bg-muted px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  {selectedProduct && (
                    <div className={cn(
                      "rounded-2xl p-4 mb-6",
                      rechargeType === "mobile"
                        ? "bg-primary/5 border border-primary/20"
                        : "bg-indigo-500/5 border border-indigo-500/20"
                    )}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total a pagar</p>
                          <p className="text-2xl font-bold">
                            ${selectedProduct.salePrice} {selectedProduct.saleCurrency}
                            {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.salePrice && (
                              <span className="text-success ml-2 text-sm">
                                Ahorras ${(selectedProduct.originalPrice - selectedProduct.salePrice).toFixed(2)}
                              </span>
                            )}
                          </p>
                          {selectedProduct.shortDescription && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedProduct.shortDescription}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Recibe en Cuba</p>
                          <p className="text-lg font-bold">
                            {selectedProduct.receiveValue
                              ? `${selectedProduct.receiveValue} ${selectedProduct.receiveCurrency || 'CUP'}`
                              : `$${selectedProduct.salePrice} saldo`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <Button
                    size="xl"
                    className={cn(
                      "w-full gap-2 text-lg",
                      rechargeType === "nauta" && "bg-indigo-500 hover:bg-indigo-600"
                    )}
                    onClick={handleRechargeClick}
                    disabled={!phoneNumber.trim() || !selectedProduct}
                  >
                    <Zap className="h-5 w-5" />
                    Recargar Ahora
                    <ArrowRight className="h-5 w-5" />
                  </Button>

                  {/* Trust */}
                  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Transacción 100% segura y encriptada</span>
                  </div>
                </>
              )}

              {/* No products */}
              {!isLoading && !error && products.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No hay productos disponibles en este momento.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            ¿Por qué elegir Qbolacel?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-3">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-1">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-muted rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-2">
              Descarga la App Qbolacel
            </h3>
            <p className="text-muted-foreground mb-6">
              Recargas más rápidas, notificaciones y ofertas exclusivas
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                App Store
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Google Play
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Checkout Modal */}
      {selectedProduct && (
        <RechargeCheckoutModal
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          product={selectedProduct}
          accountNumber={phoneNumber}
          rechargeType={rechargeType}
        />
      )}
    </div>
  );
};

export default Recargas;
