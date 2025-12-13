import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi, type CreateOrderRequest, type Order } from "@/lib/api";
import { useCartStore } from "@/stores/cart.store";
import { toast } from "sonner";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersApi.create(data),
    onSuccess: (response) => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      
      // If payment URL is returned, redirect to payment
      if (response.payment_url) {
        window.location.href = response.payment_url;
      }
    },
    onError: (error: Error) => {
      toast.error("Error al crear la orden", {
        description: error.message,
      });
    },
  });
}

export function useOrders(page: number = 1) {
  return useQuery({
    queryKey: ["orders", page],
    queryFn: () => ordersApi.getAll(page),
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

export type { Order, CreateOrderRequest };
