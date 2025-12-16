import { useState, useEffect } from "react";
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
  Phone,
  Mail,
  Package,
  Shield,
  Minus,
  Plus,
  Trash2,
  Edit2,
  Star,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LocationContactSelector } from "@/components/checkout/LocationContactSelector";
import { 
  PaymentMethodSelector, 
  type PaymentSelection,
  type PaymentMethodType 
} from "@/components/payment/PaymentMethodSelector";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { type ContactDto } from "@/hooks/useContacts";
import { useCreateOrder, generateIdempotencyKey } from "@/hooks/useOrders";
import { useCheckout, type PaymentProvider } from "@/hooks/useCheckout";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mapeo de tipos de método de pago a proveedores del backend
const mapPaymentMethodToProvider = (type: PaymentMethodType): PaymentProvider | undefined => {
  const mapping: Record<PaymentMethodType, PaymentProvider | undefined> = {
    tropipay: "TROPIPAY",
    paypal: "PAYPAL",
    card: "STRIPE",
    saved: undefined,
  };
  return mapping[type];
};

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
  const { isAuthenticated, openAuthModal, user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<Step>("cart");
  const [isContactSelectorOpen, setIsContactSelectorOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactDto | null>(null);
  const [paymentSelection, setPaymentSelection] = useState<PaymentSelection | null>(null);
  const [orderSku, setOrderSku] = useState<string | null>(null);

  const [shippingData, setShippingData] = useState({
    fullName: "",
    phone: "",
    email: "",
    province: "",
    municipality: "",
    address: "",
    betweenStreets: "",
    notes: "",
    shippingMethod: "standard",
  });

  // Hook para crear orden
  const createOrderMutation = useCreateOrder();
  
  // Hook para checkout/pago
  const {
    isLoading: isCheckoutLoading,
    error: checkoutError,
    initiateMarketplaceCheckout,
    processQuickMarketplace,
    reset: resetCheckout,
  } = useCheckout({
    onSuccess: (response) => {
      if (response.isDirectCharge && response.status === "COMPLETED") {
        // Pago directo exitoso (1-click)
        setOrderSku(response.transactionSku);
        clearCart();
        setCurrentStep("confirmation");
        toast.success("¡Pedido procesado exitosamente!");
      }
      // Si no es directo, la redirección se maneja automáticamente en el hook
    },
  });

  const isProcessing = createOrderMutation.isPending || isCheckoutLoading;

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

  const handleContactSelect = (contact: ContactDto) => {
    setSelectedContact(contact);
    setShippingData({
      ...shippingData,
      fullName: contact.fullName,
      phone: contact.phone,
      province: contact.province,
      municipality: contact.municipality,
      address: contact.street,
      betweenStreets: contact.betweenStreets || "",
    });
  };

  const handlePlaceOrder = async () => {
    if (!paymentSelection) {
      toast.error("Selecciona un método de pago");
      return;
    }

    if (!selectedContact) {
      toast.error("Selecciona una dirección de entrega");
      return;
    }

    try {
      // Paso 1: Crear la orden física en el backend
      const idempotencyKey = generateIdempotencyKey();
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          qty: item.qty,
        })),
        currency: "USD",
        shipping: {
          method: shippingData.shippingMethod,
          address: {
            fullName: shippingData.fullName,
            phone: shippingData.phone,
            email: shippingData.email,
            province: shippingData.province,
            municipality: shippingData.municipality,
            street: shippingData.address,
            betweenStreets: shippingData.betweenStreets,
            notes: shippingData.notes,
          },
        },
      };

      const order = await createOrderMutation.mutateAsync({ data: orderData, idempotencyKey });
      
      // Guardar el SKU de la orden
      if (order.orderSku) {
        setOrderSku(order.orderSku);
      }

      // Paso 2: Iniciar el checkout de pago
      if (paymentSelection.type === "saved" && paymentSelection.savedPaymentMethodId) {
        // Pago rápido con tarjeta guardada (1-click)
        await processQuickMarketplace(order.id, paymentSelection.savedPaymentMethodId);
      } else {
        // Checkout con redirección al proveedor
        const provider = mapPaymentMethodToProvider(paymentSelection.type);

        await initiateMarketplaceCheckout({
          orderId: order.id,
          customer: user ? {
            firstName: user.name?.split(" ")[0] || "Cliente",
            lastName: user.name?.split(" ").slice(1).join(" ") || "",
            email: user.email,
          } : {
            firstName: shippingData.fullName.split(" ")[0],
            lastName: shippingData.fullName.split(" ").slice(1).join(" ") || shippingData.fullName,
            email: shippingData.email,
          },
          saveCard: paymentSelection.saveCard,
          provider,
        });
      }
    } catch (error) {
      console.error("Error al procesar la orden:", error);
      // Los errores se manejan en los hooks con toasts
    }
  };

  // Resetear el checkout cuando se vuelve al paso anterior
  useEffect(() => {
    if (currentStep !== "payment") {
      resetCheckout();
    }
  }, [currentStep, resetCheckout]);

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
                    <div key={item.itemId} className="flex gap-4 p-4 bg-card rounded-xl border border-border">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.vendorName}</p>
                        <p className="font-bold text-primary mt-1">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.itemId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQty(item.itemId, item.qty - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.qty}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQty(item.itemId, item.qty + 1)}
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
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Dirección de entrega en Cuba
                      </h2>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setIsContactSelectorOpen(true)}
                      >
                        {selectedContact ? (
                          <>
                            <Edit2 className="h-4 w-4" />
                            Cambiar
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4" />
                            Seleccionar
                          </>
                        )}
                      </Button>
                    </div>

                    {selectedContact ? (
                      <div className="p-4 bg-muted/50 rounded-xl border border-border mb-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{selectedContact.fullName}</h4>
                              {selectedContact.isDefault && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                                  <Star className="h-3 w-3 fill-current" />
                                  Principal
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedContact.street}
                              {selectedContact.betweenStreets && `, ${selectedContact.betweenStreets}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {selectedContact.municipality}, {selectedContact.province}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Phone className="h-3 w-3" />
                              {selectedContact.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="p-6 border-2 border-dashed border-border rounded-xl text-center cursor-pointer hover:border-primary/50 transition-colors mb-4"
                        onClick={() => setIsContactSelectorOpen(true)}
                      >
                        <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          Selecciona o crea una dirección de entrega
                        </p>
                      </div>
                    )}

                    <div className="space-y-4">
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
                        <p className="text-xs text-muted-foreground">
                          Para enviarte confirmación y actualizaciones del pedido
                        </p>
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

                    <PaymentMethodSelector
                      value={paymentSelection ?? undefined}
                      onSelect={setPaymentSelection}
                      showSaveCardOption={true}
                      variant="primary"
                      disabled={isProcessing}
                    />

                    {/* Error message */}
                    {checkoutError && (
                      <div className="mt-4 bg-destructive/10 border border-destructive/30 rounded-xl p-3 flex items-center gap-2 text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        {checkoutError}
                      </div>
                    )}

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
                      <div key={item.itemId} className="flex items-center gap-3">
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
                    disabled={isProcessing || !paymentSelection}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : paymentSelection?.type === "saved" ? (
                      <>🔒 Pagar ${total.toFixed(2)} (1-clic)</>
                    ) : (
                      <>🔒 Pagar ${total.toFixed(2)}</>
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
                Orden #{orderSku || `QBC-${Math.random().toString(36).substr(2, 8).toUpperCase()}`}
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

      {/* Location Contact Selector Dialog */}
      <LocationContactSelector
        open={isContactSelectorOpen}
        onOpenChange={setIsContactSelectorOpen}
        onSelect={handleContactSelect}
        selectedContactId={selectedContact?.id}
      />
    </div>
  );
}
