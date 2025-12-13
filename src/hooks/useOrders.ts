import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi, type CreateOrderRequest, type Order, type OrderSummary } from "@/lib/api";
import { useCartStore } from "@/stores/cart.store";
import { toast } from "sonner";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: ({ data, idempotencyKey }: { data: CreateOrderRequest; idempotencyKey: string }) => 
      ordersApi.create(data, idempotencyKey),
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: Error) => {
      toast.error("Error al crear la orden", {
        description: error.message,
      });
    },
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => ordersApi.getAll(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
}

// Generate idempotency key for orders
export function generateIdempotencyKey(): string {
  return `order_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export type { Order, OrderSummary, CreateOrderRequest };
