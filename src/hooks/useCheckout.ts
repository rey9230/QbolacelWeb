import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  unifiedCheckoutApi,
  type MarketplaceCheckoutRequest,
  type RechargeCheckoutRequest,
  type QuickRechargeRequest,
  type QuickMarketplaceRequest,
  type CheckoutResponse,
  type TransactionStatus,
  type CustomerInfo,
  type PaymentProvider,
} from "@/lib/api";
import { toast } from "sonner";

export type CheckoutType = "marketplace" | "recharge";

interface CheckoutState {
  isLoading: boolean;
  error: string | null;
  transactionId: string | null;
  status: TransactionStatus | null;
}

interface UseCheckoutOptions {
  onSuccess?: (response: CheckoutResponse) => void;
  onError?: (error: Error) => void;
  onRedirect?: (url: string) => void;
}

/**
 * Hook unificado para el proceso de checkout
 * Maneja tanto el checkout de marketplace como de recargas
 */
export function useCheckout(options: UseCheckoutOptions = {}) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<CheckoutState>({
    isLoading: false,
    error: null,
    transactionId: null,
    status: null,
  });

  // Mutación para checkout de marketplace
  const marketplaceCheckoutMutation = useMutation({
    mutationFn: (request: MarketplaceCheckoutRequest) =>
      unifiedCheckoutApi.marketplaceCheckout(request),
    onSuccess: handleCheckoutSuccess,
    onError: handleCheckoutError,
  });

  // Mutación para checkout de recarga
  const rechargeCheckoutMutation = useMutation({
    mutationFn: (request: RechargeCheckoutRequest) =>
      unifiedCheckoutApi.rechargeCheckout(request),
    onSuccess: handleCheckoutSuccess,
    onError: handleCheckoutError,
  });

  // Mutación para pago rápido de recarga (1-click)
  const quickRechargeMutation = useMutation({
    mutationFn: (request: QuickRechargeRequest) =>
      unifiedCheckoutApi.quickRecharge(request),
    onSuccess: handleQuickPaymentSuccess,
    onError: handleCheckoutError,
  });

  // Mutación para pago rápido de marketplace (1-click)
  const quickMarketplaceMutation = useMutation({
    mutationFn: (request: QuickMarketplaceRequest) =>
      unifiedCheckoutApi.quickMarketplace(request),
    onSuccess: handleQuickPaymentSuccess,
    onError: handleCheckoutError,
  });

  // Mutación para consultar estado
  const statusMutation = useMutation({
    mutationFn: (transactionId: string) =>
      unifiedCheckoutApi.getStatus(transactionId),
  });

  function handleCheckoutSuccess(response: CheckoutResponse) {
    setState({
      isLoading: false,
      error: null,
      transactionId: response.transactionId,
      status: response.status,
    });

    if (response.paymentUrl) {
      // Redireccionar al proveedor de pago
      if (options.onRedirect) {
        options.onRedirect(response.paymentUrl);
      } else {
        window.location.href = response.paymentUrl;
      }
    }

    options.onSuccess?.(response);
  }

  function handleQuickPaymentSuccess(response: CheckoutResponse) {
    setState({
      isLoading: false,
      error: null,
      transactionId: response.transactionId,
      status: response.status,
    });

    if (response.status === "COMPLETED") {
      toast.success("¡Pago exitoso!", {
        description: `Transacción ${response.transactionSku}`,
      });
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["recharge-history"] });
    } else if (response.status === "FAILED") {
      toast.error("El pago falló", {
        description: "Intenta con otro método de pago",
      });
    }

    options.onSuccess?.(response);
  }

  function handleCheckoutError(error: Error) {
    setState((prev) => ({
      ...prev,
      isLoading: false,
      error: error.message,
    }));

    toast.error("Error al procesar el pago", {
      description: error.message,
    });

    options.onError?.(error);
  }

  /**
   * Inicia el checkout para marketplace
   */
  const initiateMarketplaceCheckout = useCallback(
    async (params: {
      orderId: string;
      customer?: CustomerInfo;
      saveCard?: boolean;
      savedPaymentMethodId?: string;
      provider?: PaymentProvider;
    }) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const request: MarketplaceCheckoutRequest = {
        orderId: params.orderId,
        customer: params.customer,
        successUrl: `${window.location.origin}/checkout/success?order=${params.orderId}`,
        cancelUrl: `${window.location.origin}/checkout/cancel?order=${params.orderId}`,
        saveCardForFuture: params.saveCard,
        savedPaymentMethodId: params.savedPaymentMethodId,
        provider: params.provider,
      };

      return marketplaceCheckoutMutation.mutateAsync(request);
    },
    [marketplaceCheckoutMutation]
  );

  /**
   * Inicia el checkout para recarga
   */
  const initiateRechargeCheckout = useCallback(
    async (params: {
      rechargeOrderId: string;
      customer?: CustomerInfo;
      saveCard?: boolean;
      savedPaymentMethodId?: string;
      provider?: PaymentProvider;
    }) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const request: RechargeCheckoutRequest = {
        rechargeOrderId: params.rechargeOrderId,
        customer: params.customer,
        successUrl: `${window.location.origin}/recargas/success?recharge=${params.rechargeOrderId}`,
        cancelUrl: `${window.location.origin}/recargas/cancel?recharge=${params.rechargeOrderId}`,
        saveCardForFuture: params.saveCard,
        savedPaymentMethodId: params.savedPaymentMethodId,
        provider: params.provider,
      };

      return rechargeCheckoutMutation.mutateAsync(request);
    },
    [rechargeCheckoutMutation]
  );

  /**
   * Procesa un pago rápido de recarga (1-click con tarjeta guardada)
   */
  const processQuickRecharge = useCallback(
    async (rechargeOrderId: string, savedPaymentMethodId: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      return quickRechargeMutation.mutateAsync({
        rechargeOrderId,
        savedPaymentMethodId,
      });
    },
    [quickRechargeMutation]
  );

  /**
   * Procesa un pago rápido de marketplace (1-click con tarjeta guardada)
   */
  const processQuickMarketplace = useCallback(
    async (orderId: string, savedPaymentMethodId: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      return quickMarketplaceMutation.mutateAsync({
        orderId,
        savedPaymentMethodId,
      });
    },
    [quickMarketplaceMutation]
  );

  /**
   * Consulta el estado de una transacción
   */
  const checkTransactionStatus = useCallback(
    async (transactionId: string) => {
      return statusMutation.mutateAsync(transactionId);
    },
    [statusMutation]
  );

  /**
   * Limpia el estado del checkout
   */
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      transactionId: null,
      status: null,
    });
  }, []);

  return {
    // Estado
    ...state,
    isLoading:
      state.isLoading ||
      marketplaceCheckoutMutation.isPending ||
      rechargeCheckoutMutation.isPending ||
      quickRechargeMutation.isPending ||
      quickMarketplaceMutation.isPending,

    // Acciones para marketplace
    initiateMarketplaceCheckout,
    processQuickMarketplace,

    // Acciones para recargas
    initiateRechargeCheckout,
    processQuickRecharge,

    // Utilidades
    checkTransactionStatus,
    reset,
  };
}

// Re-exportar tipos
export type {
  CheckoutResponse,
  TransactionStatus,
  CustomerInfo,
  PaymentProvider,
  MarketplaceCheckoutRequest,
  RechargeCheckoutRequest,
};
