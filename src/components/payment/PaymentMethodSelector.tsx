import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle,
  Trash2,
  Star,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  usePaymentMethods,
  useDeletePaymentMethod,
  useSetDefaultPaymentMethod,
  formatCardExpiry,
  isCardExpiringSoon,
  type SavedPaymentMethod,
} from "@/hooks/usePaymentMethods";
import { cn } from "@/lib/utils";

// Proveedores de pago disponibles
export type PaymentMethodType = "saved" | "tropipay" | "paypal" | "card";

export interface PaymentOption {
  id: PaymentMethodType;
  name: string;
  description: string;
  icon: string;
  recommended?: boolean;
}

const PAYMENT_PROVIDERS: PaymentOption[] = [
  {
    id: "tropipay",
    name: "TropiPay",
    description: "Pago rápido y seguro para Cuba",
    icon: "🌴",
    recommended: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Paga con tu cuenta PayPal",
    icon: "💳",
  },
  {
    id: "card",
    name: "Tarjeta de Crédito/Débito",
    description: "Visa, Mastercard, Amex",
    icon: "💳",
  },
];

interface PaymentMethodSelectorProps {
  /** Callback cuando se selecciona un método */
  onSelect: (selection: PaymentSelection) => void;
  /** Selección actual */
  value?: PaymentSelection;
  /** Si se muestra la opción de guardar tarjeta */
  showSaveCardOption?: boolean;
  /** Variante de color para recargas */
  variant?: "primary" | "indigo";
  /** Deshabilitado */
  disabled?: boolean;
  /** Clase CSS adicional */
  className?: string;
}

export interface PaymentSelection {
  type: PaymentMethodType;
  savedPaymentMethodId?: string;
  saveCard: boolean;
}

/**
 * Componente compartido para seleccionar método de pago
 * Usado tanto en checkout de marketplace como en recargas
 */
export function PaymentMethodSelector({
  onSelect,
  value,
  showSaveCardOption = true,
  variant = "primary",
  disabled = false,
  className,
}: PaymentMethodSelectorProps) {
  const { data: savedMethods, isLoading: isLoadingMethods } = usePaymentMethods();
  const deleteMethod = useDeletePaymentMethod();
  const setDefault = useSetDefaultPaymentMethod();

  const [saveCard, setSaveCard] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<string | null>(null);

  const hasSavedMethods = savedMethods && savedMethods.length > 0;

  const handleSelect = (type: PaymentMethodType, savedMethodId?: string) => {
    if (disabled) return;

    onSelect({
      type,
      savedPaymentMethodId: savedMethodId,
      saveCard: type !== "saved" && saveCard,
    });
  };

  const handleSaveCardChange = (checked: boolean) => {
    setSaveCard(checked);
    if (value && value.type !== "saved") {
      onSelect({
        ...value,
        saveCard: checked,
      });
    }
  };

  const handleDeleteMethod = async (methodId: string) => {
    await deleteMethod.mutateAsync(methodId);
    setMethodToDelete(null);
    // Si el método eliminado era el seleccionado, limpiar selección
    if (value?.savedPaymentMethodId === methodId) {
      onSelect({ type: "tropipay", saveCard: false });
    }
  };

  const handleSetDefault = (methodId: string) => {
    setDefault.mutate(methodId);
  };

  const accentColor = variant === "indigo" ? "indigo-500" : "primary";

  return (
    <div className={cn("space-y-4", className)}>
      {/* Tarjetas guardadas */}
      {isLoadingMethods ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Cargando tarjetas guardadas...
          </span>
        </div>
      ) : hasSavedMethods ? (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Tarjetas guardadas
          </h4>
          <div className="space-y-2">
            {savedMethods.map((method) => (
              <SavedMethodCard
                key={method.id}
                method={method}
                isSelected={
                  value?.type === "saved" &&
                  value?.savedPaymentMethodId === method.id
                }
                onSelect={() => handleSelect("saved", method.id)}
                onDelete={() => setMethodToDelete(method.id)}
                onSetDefault={() => handleSetDefault(method.id)}
                accentColor={accentColor}
                disabled={disabled}
                isDeleting={deleteMethod.isPending}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Separador si hay tarjetas guardadas */}
      {hasSavedMethods && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              o paga con
            </span>
          </div>
        </div>
      )}

      {/* Métodos de pago */}
      <div className="space-y-2">
        {!hasSavedMethods && (
          <h4 className="text-sm font-medium">Método de pago</h4>
        )}
        {PAYMENT_PROVIDERS.map((provider) => (
          <PaymentProviderCard
            key={provider.id}
            provider={provider}
            isSelected={value?.type === provider.id}
            onSelect={() => handleSelect(provider.id)}
            accentColor={accentColor}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Opción de guardar tarjeta */}
      {showSaveCardOption && value?.type !== "saved" && (
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="save-card"
            checked={saveCard}
            onCheckedChange={(checked) => handleSaveCardChange(checked === true)}
            disabled={disabled}
          />
          <Label
            htmlFor="save-card"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Guardar tarjeta para pagos futuros
          </Label>
        </div>
      )}

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog
        open={!!methodToDelete}
        onOpenChange={(open) => !open && setMethodToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar tarjeta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La tarjeta se eliminará de tus
              métodos de pago guardados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => methodToDelete && handleDeleteMethod(methodToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMethod.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Componente para tarjeta guardada
interface SavedMethodCardProps {
  method: SavedPaymentMethod;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
  accentColor: string;
  disabled?: boolean;
  isDeleting?: boolean;
}

function SavedMethodCard({
  method,
  isSelected,
  onSelect,
  onDelete,
  onSetDefault,
  accentColor,
  disabled,
  isDeleting,
}: SavedMethodCardProps) {
  const isExpiringSoon = isCardExpiringSoon(method.expMonth, method.expYear);

  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      onClick={onSelect}
      disabled={disabled || method.isExpired}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
        isSelected
          ? `border-${accentColor} bg-${accentColor}/5`
          : "border-border hover:border-muted-foreground/50",
        (disabled || method.isExpired) && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
        <CreditCard className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{method.displayName}</p>
          {method.isDefault && (
            <Badge variant="secondary" className="text-xs">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Principal
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Expira {formatCardExpiry(method.expMonth, method.expYear)}</span>
          {method.isExpired && (
            <Badge variant="destructive" className="text-xs">
              Expirada
            </Badge>
          )}
          {isExpiringSoon && !method.isExpired && (
            <Badge variant="outline" className="text-xs text-warning border-warning">
              <AlertCircle className="h-3 w-3 mr-1" />
              Expira pronto
            </Badge>
          )}
        </div>
      </div>

      {isSelected && (
        <CheckCircle className={`h-5 w-5 text-${accentColor} flex-shrink-0`} />
      )}

      {/* Acciones */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {!method.isDefault && !method.isExpired && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onSetDefault();
            }}
            title="Establecer como principal"
          >
            <Star className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          disabled={isDeleting}
          title="Eliminar tarjeta"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </motion.button>
  );
}

// Componente para proveedor de pago
interface PaymentProviderCardProps {
  provider: PaymentOption;
  isSelected: boolean;
  onSelect: () => void;
  accentColor: string;
  disabled?: boolean;
}

function PaymentProviderCard({
  provider,
  isSelected,
  onSelect,
  accentColor,
  disabled,
}: PaymentProviderCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
        isSelected
          ? `border-${accentColor} bg-${accentColor}/5`
          : "border-border hover:border-muted-foreground/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span className="text-2xl">{provider.icon}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">{provider.name}</p>
          {provider.recommended && (
            <Badge className={`bg-${accentColor} text-xs`}>RECOMENDADO</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{provider.description}</p>
      </div>
      {isSelected && (
        <CheckCircle className={`h-5 w-5 text-${accentColor}`} />
      )}
    </motion.button>
  );
}

export default PaymentMethodSelector;
