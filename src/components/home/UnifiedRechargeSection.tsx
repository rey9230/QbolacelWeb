import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Smartphone, Wifi, Zap, Shield, Clock, ArrowRight, Loader2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTopupProducts, type TopupProduct } from "@/hooks/useTopup";
import { cn } from "@/lib/utils";

type RechargeType = "mobile" | "nauta";

export function UnifiedRechargeSection() {
  const navigate = useNavigate();
  const [rechargeType, setRechargeType] = useState<RechargeType>("mobile");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Fetch products from API
  const { data: allProducts, isLoading } = useTopupProducts({ country: "CU" });

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

  // Auto-select featured product when products load or type changes
  useMemo(() => {
    if (products.length > 0 && !selectedProductId) {
      const featured = products.find(p => p.isFeatured);
      setSelectedProductId(featured?.id || products[0].id);
    }
  }, [products]);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleRechargeClick = () => {
    navigate("/recargas", {
      state: {
        type: rechargeType,
        productId: selectedProductId,
      },
    });
  };

  const handleTypeChange = (type: RechargeType) => {
    setRechargeType(type);
    setSelectedProductId(null);
  };


  return (
    <section className="py-16 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Recarga Rápida
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Selecciona el tipo de recarga y el monto. Tu familia lo recibe al instante.
          </p>
        </motion.div>

        {/* Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
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
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && products.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className={cn(
                "grid gap-3 mb-8",
                products.length <= 4 ? "grid-cols-2 md:grid-cols-4" 
                  : products.length <= 6 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
                  : "grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
              )}
            >
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
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedProductId(product.id)}
                    className={cn(
                      "relative p-3 rounded-2xl border-2 transition-all text-left",
                      isSelected
                        ? rechargeType === "mobile"
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                          : "border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/20"
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
            </motion.div>
          )}

          {/* Selected Product Summary */}
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-2xl p-6 mb-6 border",
                rechargeType === "mobile"
                  ? "bg-primary/5 border-primary/20"
                  : "bg-indigo-500/5 border-indigo-500/20"
              )}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl",
                    rechargeType === "mobile" ? "bg-primary" : "bg-indigo-500"
                  )}>
                    {rechargeType === "mobile" ? (
                      <Smartphone className="h-6 w-6 text-white" />
                    ) : (
                      <Wifi className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {rechargeType === "mobile" ? "Recarga Cubacel" : "Recarga Nauta"}
                    </p>
                    <p className="text-2xl font-bold">
                      ${selectedProduct.salePrice}
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
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant={rechargeType === "mobile" ? "hero" : "default"}
                    size="lg" 
                    className={cn(
                      "gap-2",
                      rechargeType === "nauta" && "bg-indigo-500 hover:bg-indigo-600"
                    )}
                    onClick={handleRechargeClick}
                  >
                    <Zap className="h-5 w-5" />
                    Recargar Ahora
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-success" />
              <span>Entrega instantánea</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>100% seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-warning" />
              <span>Bonos en cada recarga</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}