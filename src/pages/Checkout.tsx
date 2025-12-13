import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Truck, 
  CreditCard, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  Phone,
  Mail,
  Package,
  Shield,
  Minus,
  Plus,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const provinces = [
  "La Habana", "Pinar del Río", "Artemisa", "Mayabeque", "Matanzas",
  "Cienfuegos", "Villa Clara", "Sancti Spíritus", "Ciego de Ávila",
  "Camagüey", "Las Tunas", "Holguín", "Granma", "Santiago de Cuba",
  "Guantánamo", "Isla de la Juventud"
];

const paymentMethods = [
  { 
    id: "paypal", 
    name: "PayPal", 
    description: "Paga de forma segura con tu cuenta PayPal",
    icon: "💳",
    recommended: true
  },
  { 
    id: "card", 
    name: "Tarjeta de Crédito/Débito", 
    description: "Visa, Mastercard, American Express",
    icon: "💳"
  },
  { 
    id: "tropipay", 
    name: "TropiPay", 
    description: "Billetera digital para Cuba",
    icon: "🌴"
  },
];

type Step = "cart" | "shipping" | "payment" | "confirmation";

const steps: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: "cart", label: "Carrito", icon: ShoppingCart },
  { id: "shipping", label: "Envío", icon: Truck },
  { id: "payment", label: "Pago", icon: CreditCard },
  { id: "confirmation", label: "Confirmación", icon: CheckCircle },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, getSubtotal, clearCart } = useCartStore();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<Step>("cart");
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingData, setShippingData] = useState({
    fullName: "",
    phone: "",
    email: "",
    province: "",
    municipality: "",
    address: "",
    notes: "",
    shippingMethod: "standard",
  });

  const [paymentMethod, setPaymentMethod] = useState("paypal");

  const subtotal = getSubtotal();
  const shippingCost = shippingData.shippingMethod === "express" ? 5 : 0;
  const total = subtotal + shippingCost;

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const goToStep = (step: Step) => {
    if (step === "shipping" && !isAuthenticated) {
      openAuthModal("login");
      toast.info("Inicia sesión para continuar con tu compra");
      return;
    }
    setCurrentStep(step);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCurrentStep("confirmation");
    clearCart();
    setIsProcessing(false);
  };

  if (items.length === 0 && currentStep !== "confirmation") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex p-4 rounded-full bg-muted mb-6">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-8">
              Añade productos a tu carrito para continuar con la compra
            </p>
            <Button asChild>
              <Link to="/marketplace">Explorar Marketplace</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        {currentStep !== "confirmation" && (
          <div className="max-w-3xl mx-auto mb-10">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                        index < currentStepIndex
                          ? "bg-primary border-primary text-primary-foreground"
                          : index === currentStepIndex
                            ? "border-primary text-primary"
                            : "border-muted text-muted-foreground"
                      )}
                    >
                      {index < currentStepIndex ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={cn(
                      "text-sm mt-2 font-medium",
                      index <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.label}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-16 md:w-24 h-0.5 mx-2",
                      index < currentStepIndex ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Cart Review */}
          {currentStep === "cart" && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-2xl font-bold mb-6">Revisa tu pedido</h1>
              
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item) => (
                    <div key={item.product_id} className="flex gap-4 p-4 bg-card rounded-xl border border-border">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.vendor_name}</p>
                        <p className="font-bold text-primary mt-1">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.product_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQty(item.product_id, item.qty - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.qty}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQty(item.product_id, item.qty + 1)}
                            disabled={item.qty >= item.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
                  <h2 className="font-bold mb-4">Resumen del pedido</h2>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({items.length} productos)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="text-muted-foreground">Calculado después</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-6 gap-2"
                    onClick={() => goToStep("shipping")}
                  >
                    Continuar al envío
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Shipping */}
          {currentStep === "shipping" && (
            <motion.div
              key="shipping"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Button
                variant="ghost"
                className="mb-4 gap-2"
                onClick={() => setCurrentStep("cart")}
              >
                <ChevronLeft className="h-4 w-4" />
                Volver al carrito
              </Button>

              <h1 className="text-2xl font-bold mb-6">Información de envío</h1>
              
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="font-bold mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Dirección de entrega en Cuba
                    </h2>

                    <div className="grid gap-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Nombre completo del destinatario</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="fullName"
                              className="pl-10"
                              placeholder="Nombre y apellidos"
                              value={shippingData.fullName}
                              onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono de contacto</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              className="pl-10"
                              placeholder="+53 5X XXX XXXX"
                              value={shippingData.phone}
                              onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            className="pl-10"
                            placeholder="tu@email.com"
                            value={shippingData.email}
                            onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Provincia</Label>
                          <Select
                            value={shippingData.province}
                            onValueChange={(value) => setShippingData({ ...shippingData, province: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar provincia" />
                            </SelectTrigger>
                            <SelectContent>
                              {provinces.map((province) => (
                                <SelectItem key={province} value={province}>
                                  {province}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="municipality">Municipio</Label>
                          <Input
                            id="municipality"
                            placeholder="Municipio"
                            value={shippingData.municipality}
                            onChange={(e) => setShippingData({ ...shippingData, municipality: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Dirección completa</Label>
                        <Textarea
                          id="address"
                          placeholder="Calle, número, entre calles, reparto..."
                          value={shippingData.address}
                          onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notas de entrega (opcional)</Label>
                        <Textarea
                          id="notes"
                          placeholder="Indicaciones especiales para la entrega..."
                          value={shippingData.notes}
                          onChange={(e) => setShippingData({ ...shippingData, notes: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Shipping Method */}
                    <div className="mt-6 pt-6 border-t border-border">
                      <h2 className="font-bold mb-4 flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" />
                        Método de envío
                      </h2>

                      <RadioGroup
                        value={shippingData.shippingMethod}
                        onValueChange={(value) => setShippingData({ ...shippingData, shippingMethod: value })}
                        className="space-y-3"
                      >
                        <label className={cn(
                          "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors",
                          shippingData.shippingMethod === "standard"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/50"
                        )}>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="standard" />
                            <div>
                              <p className="font-medium">Envío Estándar</p>
                              <p className="text-sm text-muted-foreground">3-5 días hábiles</p>
                            </div>
                          </div>
                          <span className="font-bold text-success">Gratis</span>
                        </label>

                        <label className={cn(
                          "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors",
                          shippingData.shippingMethod === "express"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/50"
                        )}>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="express" />
                            <div>
                              <p className="font-medium">Envío Express ⚡</p>
                              <p className="text-sm text-muted-foreground">1-2 días hábiles</p>
                            </div>
                          </div>
                          <span className="font-bold">+$5.00</span>
                        </label>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
                  <h2 className="font-bold mb-4">Resumen</h2>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Envío</span>
                      <span>{shippingCost === 0 ? "Gratis" : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-6 gap-2"
                    onClick={() => setCurrentStep("payment")}
                  >
                    Continuar al pago
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {currentStep === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Button
                variant="ghost"
                className="mb-4 gap-2"
                onClick={() => setCurrentStep("shipping")}
              >
                <ChevronLeft className="h-4 w-4" />
                Volver al envío
              </Button>

              <h1 className="text-2xl font-bold mb-6">Método de pago</h1>
              
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="font-bold mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Selecciona cómo deseas pagar
                    </h2>

                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-3"
                    >
                      {paymentMethods.map((method) => (
                        <label
                          key={method.id}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors",
                            paymentMethod === method.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-muted-foreground/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={method.id} />
                            <div className="text-2xl">{method.icon}</div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{method.name}</p>
                                {method.recommended && (
                                  <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                    RECOMENDADO
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>

                    <div className="mt-6 p-4 bg-muted rounded-lg flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Tu información de pago está protegida con encriptación de 256 bits
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
                  <h2 className="font-bold mb-4">Resumen del pedido</h2>
                  
                  {/* Mini cart preview */}
                  <div className="space-y-3 mb-4">
                    {items.slice(0, 3).map((item) => (
                      <div key={item.product_id} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">x{item.qty}</p>
                        </div>
                        <p className="text-sm font-medium">${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{items.length - 3} productos más
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 text-sm border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Envío</span>
                      <span>{shippingCost === 0 ? "Gratis" : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-6 gap-2"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      "Procesando..."
                    ) : (
                      <>
                        🔒 Pagar ${total.toFixed(2)}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === "confirmation" && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex p-4 rounded-full bg-success/10 mb-6"
              >
                <CheckCircle className="h-16 w-16 text-success" />
              </motion.div>

              <h1 className="text-3xl font-bold mb-4">
                ¡Pedido Confirmado!
              </h1>
              
              <p className="text-xl text-muted-foreground mb-2">
                Orden #QBC-{Math.random().toString(36).substr(2, 8).toUpperCase()}
              </p>

              <p className="text-muted-foreground mb-8">
                Hemos enviado los detalles de tu pedido a tu correo electrónico.
              </p>

              <div className="bg-card border border-border rounded-xl p-6 text-left mb-8">
                <h2 className="font-bold mb-4">Próximos pasos</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Confirmación por email</p>
                      <p className="text-sm text-muted-foreground">
                        Recibirás un email con los detalles de tu pedido
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Preparación del pedido</p>
                      <p className="text-sm text-muted-foreground">
                        El vendedor preparará tu pedido en las próximas 24-48 horas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Truck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Envío a Cuba</p>
                      <p className="text-sm text-muted-foreground">
                        Tiempo estimado de entrega: 3-5 días hábiles
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link to="/marketplace">Seguir Comprando</Link>
                </Button>
                <Button asChild>
                  <Link to="/">Volver al Inicio</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {currentStep !== "confirmation" && <Footer />}
    </div>
  );
}
