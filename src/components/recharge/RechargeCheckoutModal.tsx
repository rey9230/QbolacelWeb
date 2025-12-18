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
  CheckCircle,
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
} from "@/components/payment/PaymentMethodSelector";
import { usePurchaseTopup, generateIdempotencyKey, type TopupProduct } from "@/hooks/useTopup";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type RechargeType = "mobile" | "nauta";

interface RechargeCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: TopupProduct;
  accountNumber: string;
  rechargeType: RechargeType;
}

export const RechargeCheckoutModal = ({
  open,
  onOpenChange,
  product,
  accountNumber,
  rechargeType,
}: RechargeCheckoutModalProps) => {
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const [paymentSelection, setPaymentSelection] = useState<PaymentSelection | null>(null);
  const [acceptedNoRefund, setAcceptedNoRefund] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const { mutate: purchaseTopup, isPending: isLoading, error } = usePurchaseTopup({
    onSuccess: (response) => {
      if (response.status === "SUCCESS") {
        setPurchaseSuccess(true);
      } else if (response.status === "PROCESSING") {
        toast.info("Procesando...", {
          description: "Tu recarga está siendo procesada. Recibirás una confirmación pronto.",
        });
        onOpenChange(false);
      }
    },
    onError: () => {
      // Error handled by hook
    },
  });

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setPaymentSelection(null);
      setAcceptedNoRefund(false);
      setPurchaseSuccess(false);
    }
  }, [open]);

  // Calculate bonus
  const bonus = product.receiveValue && product.salePrice && product.receiveValue > product.salePrice
    ? product.receiveValue - product.salePrice
    : null;

  const totalReceived = product.receiveValue
    ? `${product.receiveValue} ${product.receiveCurrency || 'CUP'}`
    : `$${product.salePrice} saldo`;

  const handleConfirmPayment = async () => {
    if (!paymentSelection || !acceptedNoRefund) return;

    // Verify authentication
    if (!isAuthenticated) {
      openAuthModal("login");
      toast.info("Inicia sesión para continuar con el pago");
      return;
    }

    // Generate idempotency key
    const idempotencyKey = generateIdempotencyKey();

    // Execute purchase
    purchaseTopup({
      data: {
        productId: product.id,
        accountNumber: rechargeType === "mobile" ? `+53${accountNumber}` : accountNumber,
        currency: product.saleCurrency || "USD",
      },
      idempotencyKey,
    });
  };

  const canProceed = paymentSelection && acceptedNoRefund && accountNumber.trim().length > 0;

  // Success screen
  if (purchaseSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex p-4 rounded-full bg-success/10 mb-4"
            >
              <CheckCircle className="h-12 w-12 text-success" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">¡Recarga Exitosa!</h2>
            <p className="text-muted-foreground mb-6">
              Tu recarga de ${product.salePrice} ha sido procesada correctamente.
            </p>
            <div className="bg-muted rounded-xl p-4 mb-6 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Destino:</span>
                <span className="font-mono">
                  {rechargeType === "mobile" ? `+53 ${accountNumber}` : accountNumber}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Monto:</span>
                <span className="font-semibold">${product.salePrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recibido:</span>
                <span className="font-semibold text-success">{totalReceived}</span>
              </div>
            </div>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
                {rechargeType === "mobile" ? `+53 ${accountNumber}` : accountNumber}
              </span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Producto</span>
              <span className="font-medium text-sm">{product.name}</span>
            </div>

            <div className="border-t border-border/50 pt-3 mt-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">${product.salePrice}</p>
                  <p className="text-xs text-muted-foreground">Total a pagar</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg flex items-center gap-1">
                    {totalReceived}
                    {bonus && (
                      <span className="text-success text-sm">
                        (+${bonus})
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">Recibe en Cuba</p>
                </div>
              </div>
            </div>

            {bonus && (
              <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-success/10 text-success text-sm">
                <Gift className="h-4 w-4" />
                <span>¡Incluye ${bonus} de bonus gratis!</span>
              </div>
            )}
          </div>

          {/* Payment Methods */}
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
              {error.message}
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
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pagar ${product.salePrice}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};