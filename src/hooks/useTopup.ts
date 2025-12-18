import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  topupApi,
  type TopupProduct,
  type TopupTransaction,
  type PurchaseTopupRequest,
  type PurchaseTopupResponse,
  type TopupProductFilters,
} from "@/lib/api";
import { toast } from "sonner";

// ============ PRODUCTS ============

export function useTopupProducts(filters: TopupProductFilters = {}) {
  return useQuery({
    queryKey: ["topup-products", filters],
    queryFn: () => topupApi.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useFeaturedTopupProducts() {
  return useQuery({
    queryKey: ["topup-products", "featured"],
    queryFn: () => topupApi.getFeatured(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTopupProductBySlug(slug: string) {
  return useQuery({
    queryKey: ["topup-product", slug],
    queryFn: () => topupApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

// ============ PURCHASE ============

interface UsePurchaseTopupOptions {
  onSuccess?: (response: PurchaseTopupResponse) => void;
  onError?: (error: Error) => void;
}

export function usePurchaseTopup(options: UsePurchaseTopupOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      idempotencyKey,
    }: {
      data: PurchaseTopupRequest;
      idempotencyKey: string;
    }) => {
      return topupApi.purchase(data, idempotencyKey);
    },
    onSuccess: (response) => {
      // Invalidate transaction history
      queryClient.invalidateQueries({ queryKey: ["topup-transactions"] });

      if (response.status === "SUCCESS") {
        toast.success("¡Recarga exitosa!", {
          description: `Tu recarga de $${response.salePrice} ha sido procesada.`,
        });
      } else if (response.status === "PROCESSING") {
        toast.info("Procesando recarga...", {
          description: response.message || "Tu recarga está siendo procesada.",
        });
      } else if (response.status === "FAILED") {
        toast.error("Error en la recarga", {
          description: response.message || "No se pudo procesar la recarga.",
        });
      }

      options.onSuccess?.(response);
    },
    onError: (error: Error) => {
      toast.error("Error al procesar la recarga", {
        description: error.message,
      });
      options.onError?.(error);
    },
  });
}

// ============ TRANSACTIONS ============

export function useTopupTransactions(page: number = 0, size: number = 20) {
  return useQuery({
    queryKey: ["topup-transactions", page, size],
    queryFn: () => topupApi.getTransactions(page, size),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useTopupTransaction(id: string) {
  return useQuery({
    queryKey: ["topup-transaction", id],
    queryFn: () => topupApi.getTransaction(id),
    enabled: !!id,
  });
}

// ============ HELPERS ============

/**
 * Determina el tipo de recarga basado en el operador
 */
export function getRechargeType(operator: string): "mobile" | "nauta" {
  return operator.toUpperCase() === "NAUTA" ? "nauta" : "mobile";
}

/**
 * Genera un Idempotency Key único para prevenir compras duplicadas
 */
export function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}

// Re-export types
export type {
  TopupProduct,
  TopupTransaction,
  PurchaseTopupRequest,
  PurchaseTopupResponse,
  TopupProductFilters,
};
