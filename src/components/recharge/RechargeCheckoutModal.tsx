import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Wifi,
  Gift,
  Shield,
  AlertTriangle,
  CheckCircle,
  X,
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
import { cn } from "@/lib/utils";

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
}

type PaymentMethod = "paypal" | "card" | "tropipay";

const paymentMethods = [
  {
    id: "paypal" as PaymentMethod,
    name: "PayPal",
    icon: "💳",
    description: "Pago rápido y seguro",
  },
  {
    id: "card" as PaymentMethod,
    name: "Tarjeta de Crédito/Débito",
    icon: "💳",
    description: "Visa, Mastercard, Amex",
  },
  {
    id: "tropipay" as PaymentMethod,
    name: "TropiPay",
    icon: "🌴",
    description: "Pago con saldo TropiPay",
  },
];

export const RechargeCheckoutModal = ({
  open,
  onOpenChange,
  rechargeType,
  selectedOption,
  phoneNumber,
}: RechargeCheckoutModalProps) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [acceptedNoRefund, setAcceptedNoRefund] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalReceived = rechargeType === "mobile"
    ? `$${selectedOption.amount + (selectedOption.bonus || 0)} saldo`
    : `${selectedOption.hours}h navegación`;

  const handleConfirmPayment = async () => {
    if (!selectedPayment || !acceptedNoRefund) return;
    
    setIsProcessing(true);
    // TODO: Integrate with actual payment API
    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
    }, 2000);
  };

  const canProceed = selectedPayment && acceptedNoRefund && phoneNumber.trim().length > 0;

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

          {/* Payment Methods */}
          <div>
            <h4 className="font-medium mb-3">Método de pago</h4>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <motion.button
                  key={method.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedPayment(method.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                    selectedPayment === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/50"
                  )}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium">{method.name}</p>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </div>
                  {selectedPayment === method.id && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

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
            >
              Cancelar
            </Button>
            <Button
              className={cn(
                "flex-1",
                rechargeType === "nauta" && "bg-indigo-500 hover:bg-indigo-600"
              )}
              disabled={!canProceed || isProcessing}
              onClick={handleConfirmPayment}
            >
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                />
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
