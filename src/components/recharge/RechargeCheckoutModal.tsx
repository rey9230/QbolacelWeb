import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Wifi,
  Gift,
  Shield,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  PaymentMethodSelector,
  type PaymentSelection,
  type PaymentMethodType,
} from "@/components/payment/PaymentMethodSelector";
import { useCheckout, type PaymentProvider } from "@/hooks/useCheckout";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type RechargeType = "mobile" | "nauta";

interface RechargeOption {
  amount: number;
  bonus?: number;
  hours?: number;
}

interface RechargeCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rechargeType: RechargeType;
  selectedOption: RechargeOption;
  phoneNumber: string;
  /** ID de la orden de recarga (generado previamente) */
  rechargeOrderId?: string;
}

// Mapeo de tipos de método de pago a proveedores del backend
const mapPaymentMethodToProvider = (type: PaymentMethodType): PaymentProvider | undefined => {
  const mapping: Record<PaymentMethodType, PaymentProvider | undefined> = {
    tropipay: "TROPIPAY",
    paypal: "PAYPAL",
    card: "STRIPE",
    saved: undefined, // Las tarjetas guardadas no necesitan provider
  };
  return mapping[type];
};

export const RechargeCheckoutModal = ({
  open,
  onOpenChange,
  rechargeType,
  selectedOption,
  phoneNumber,
  rechargeOrderId,
}: RechargeCheckoutModalProps) => {
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const [paymentSelection, setPaymentSelection] = useState<PaymentSelection | null>(null);
  const [acceptedNoRefund, setAcceptedNoRefund] = useState(false);

  const {
    isLoading,
    error,
    initiateRechargeCheckout,
    processQuickRecharge,
    reset,
  } = useCheckout({
    onSuccess: (response) => {
      if (response.isDirectCharge && response.status === "COMPLETED") {
        // Pago directo exitoso
        onOpenChange(false);
        toast.success("¡Recarga exitosa!", {
          description: `Tu recarga de $${selectedOption.amount} ha sido procesada.`,
        });
      }
      // Si no es directo, la redirección se maneja automáticamente
    },
    onError: () => {
      // El error ya se muestra en el hook
    },
  });

  // Resetear estado al cerrar el modal
  useEffect(() => {
    if (!open) {
      setPaymentSelection(null);
      setAcceptedNoRefund(false);
      reset();
    }
  }, [open, reset]);

  const totalReceived = rechargeType === "mobile"
    ? `$${selectedOption.amount + (selectedOption.bonus || 0)} saldo`
    : `${selectedOption.hours}h navegación`;

  const handleConfirmPayment = async () => {
    if (!paymentSelection || !acceptedNoRefund) return;

    // Verificar autenticación
    if (!isAuthenticated) {
      openAuthModal("login");
      toast.info("Inicia sesión para continuar con el pago");
      return;
    }

    // TODO: En producción, el rechargeOrderId debe obtenerse de una llamada
    // previa para crear la orden de recarga
    const orderId = rechargeOrderId || `rch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      if (paymentSelection.type === "saved" && paymentSelection.savedPaymentMethodId) {
        // Pago rápido con tarjeta guardada (1-click)
        await processQuickRecharge(orderId, paymentSelection.savedPaymentMethodId);
      } else {
        // Checkout con redirección al proveedor
        const provider = mapPaymentMethodToProvider(paymentSelection.type);

        await initiateRechargeCheckout({
          rechargeOrderId: orderId,
          customer: user ? {
            firstName: user.name.split(" ")[0],
            lastName: user.name.split(" ").slice(1).join(" ") || user.name,
            email: user.email,
          } : undefined,
          saveCard: paymentSelection.saveCard,
          provider,
        });
      }
    } catch (err) {
      // Error manejado por el hook
      console.error("Error en el checkout:", err);
    }
  };

  const canProceed = paymentSelection && acceptedNoRefund && phoneNumber.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {rechargeType === "mobile" ? (
              <Smartphone className="h-5 w-5 text-primary" />
            ) : (
              <Wifi className="h-5 w-5 text-indigo-500" />
            )}
            Confirmar Recarga
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Order Summary */}
          <div className={cn(
            "rounded-xl p-4 border",
            rechargeType === "mobile"
              ? "bg-primary/5 border-primary/20"
              : "bg-indigo-500/5 border-indigo-500/20"
          )}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Tipo de recarga</span>
              <Badge variant="secondary">
                {rechargeType === "mobile" ? "Cubacel Móvil" : "Nauta Internet"}
              </Badge>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                {rechargeType === "mobile" ? "Número destino" : "Cuenta Nauta"}
              </span>
              <span className="font-mono font-medium">
                {rechargeType === "mobile" ? `+53 ${phoneNumber}` : phoneNumber}
              </span>
            </div>

            <div className="border-t border-border/50 pt-3 mt-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">${selectedOption.amount}</p>
                  <p className="text-xs text-muted-foreground">Total a pagar</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg flex items-center gap-1">
                    {totalReceived}
                    {selectedOption.bonus && (
                      <span className="text-success text-sm">
                        (+${selectedOption.bonus})
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">Recibe en Cuba</p>
                </div>
              </div>
            </div>

            {selectedOption.bonus && (
              <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-success/10 text-success text-sm">
                <Gift className="h-4 w-4" />
                <span>¡Incluye ${selectedOption.bonus} de bonus gratis!</span>
              </div>
            )}
          </div>

          {/* Payment Methods - Usando componente compartido */}
          <PaymentMethodSelector
            value={paymentSelection ?? undefined}
            onSelect={setPaymentSelection}
            showSaveCardOption={true}
            variant={rechargeType === "nauta" ? "indigo" : "primary"}
            disabled={isLoading}
          />

          {/* Error message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* No Refund Warning */}
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-warning-foreground mb-2">
                  Política de No Reembolso
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Las recargas son procesadas inmediatamente y no pueden ser canceladas ni reembolsadas una vez confirmado el pago. Por favor, verifica que el número/cuenta de destino sea correcto.
                </p>
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="no-refund"
                    checked={acceptedNoRefund}
                    onCheckedChange={(checked) => setAcceptedNoRefund(checked === true)}
                  />
                  <Label
                    htmlFor="no-refund"
                    className="text-sm font-medium cursor-pointer leading-tight"
                  >
                    Entiendo y acepto que esta recarga no tiene reembolso una vez procesada
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Transacción 100% segura y encriptada</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              className={cn(
                "flex-1",
                rechargeType === "nauta" && "bg-indigo-500 hover:bg-indigo-600"
              )}
              disabled={!canProceed || isLoading}
              onClick={handleConfirmPayment}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : paymentSelection?.type === "saved" ? (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pagar ${selectedOption.amount} (1-clic)
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pagar ${selectedOption.amount}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
