import { useMutation, useQuery } from "@tanstack/react-query";
import { rechargesApi, type RechargeProduct, type RechargeRequest } from "@/lib/api";
import { toast } from "sonner";

export function useRechargeProducts() {
  return useQuery({
    queryKey: ["recharge-products"],
    queryFn: () => rechargesApi.getProducts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateRecharge() {
  return useMutation({
    mutationFn: (data: RechargeRequest) => rechargesApi.create(data),
    onSuccess: (response) => {
      if (response.payment_url) {
        window.location.href = response.payment_url;
      }
    },
    onError: (error: Error) => {
      toast.error("Error al procesar la recarga", {
        description: error.message,
      });
    },
  });
}

export function useRechargeHistory(page: number = 1) {
  return useQuery({
    queryKey: ["recharge-history", page],
    queryFn: () => rechargesApi.getHistory(page),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export type { RechargeProduct, RechargeRequest };
