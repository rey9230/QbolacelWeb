import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  paymentMethodsApi,
  type SavedPaymentMethod
} from "@/lib/api";
import { toast } from "sonner";

/**
 * Hook para obtener los métodos de pago (tarjetas) guardados del usuario
 */
export function usePaymentMethods() {
  return useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => paymentMethodsApi.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para eliminar un método de pago guardado
 */
export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (methodId: string) => paymentMethodsApi.delete(methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Tarjeta eliminada correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al eliminar la tarjeta", {
        description: error.message,
      });
    },
  });
}

/**
 * Hook para establecer un método de pago como predeterminado
 */
export function useSetDefaultPaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (methodId: string) => paymentMethodsApi.setDefault(methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Tarjeta establecida como predeterminada");
    },
    onError: (error: Error) => {
      toast.error("Error al establecer la tarjeta predeterminada", {
        description: error.message,
      });
    },
  });
}

/**
 * Helper para obtener el icono de la marca de tarjeta
 */
export function getCardBrandIcon(brand: string): string {
  const icons: Record<string, string> = {
    VISA: "💳",
    MASTERCARD: "💳",
    AMEX: "💳",
    DISCOVER: "💳",
    OTHER: "💳",
  };
  return icons[brand] || "💳";
}

/**
 * Helper para formatear la fecha de expiración
 */
export function formatCardExpiry(month: number, year: number): string {
  const monthStr = month.toString().padStart(2, "0");
  const yearStr = year.toString().slice(-2);
  return `${monthStr}/${yearStr}`;
}

/**
 * Helper para verificar si una tarjeta está próxima a expirar (3 meses)
 */
export function isCardExpiringSoon(expMonth: number, expYear: number): boolean {
  const now = new Date();
  const expiryDate = new Date(expYear, expMonth - 1);
  const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3);
  return expiryDate <= threeMonthsFromNow && expiryDate > now;
}

export type { SavedPaymentMethod };
