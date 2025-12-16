// types/payment.ts - Tipos del sistema de pagos unificado

// ============ TIPOS BASE ============

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  countryCode?: string;
}

export type TransactionStatus =
  | 'CREATED'
  | 'PENDING_PAYMENT'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED';

export type PaymentProvider = 'TROPIPAY' | 'PAYPAL' | 'STRIPE';

// ============ CHECKOUT REQUESTS ============

export interface MarketplaceCheckoutRequest {
  orderId: string;
  customer?: CustomerInfo;
  successUrl: string;
  cancelUrl: string;
  provider?: PaymentProvider;
  savedPaymentMethodId?: string;
  saveCardForFuture?: boolean;
  expirationMinutes?: number;
}

export interface RechargeCheckoutRequest {
  rechargeOrderId: string;
  customer?: CustomerInfo;
  successUrl: string;
  cancelUrl: string;
  provider?: PaymentProvider;
  savedPaymentMethodId?: string;
  saveCardForFuture?: boolean;
}

export interface QuickRechargeRequest {
  rechargeOrderId: string;
  savedPaymentMethodId: string;
}

export interface QuickMarketplaceRequest {
  orderId: string;
  savedPaymentMethodId: string;
}

// ============ CHECKOUT RESPONSES ============

export interface CheckoutResponse {
  transactionId: string;
  transactionSku: string;
  status: TransactionStatus;
  paymentUrl: string | null;
  shortUrl: string | null;
  expiresAt: string | null;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  isDirectCharge: boolean;
}

export interface TransactionStatusResponse {
  transactionId: string;
  transactionSku: string;
  status: TransactionStatus;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  failureReason?: string;
}

// ============ MÉTODOS DE PAGO GUARDADOS ============

export type CardBrand = 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER' | 'OTHER';

export interface SavedPaymentMethod {
  id: string;
  displayName: string;
  last4: string;
  brand: CardBrand;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  isExpired: boolean;
}

// ============ TIPOS AUXILIARES ============

export type CheckoutType = 'marketplace' | 'recharge';

export interface UnifiedCheckoutParams {
  type: CheckoutType;
  orderId: string; // orderId para marketplace, rechargeOrderId para recarga
  customer?: CustomerInfo;
  saveCard?: boolean;
  savedPaymentMethodId?: string;
  provider?: PaymentProvider;
}

// Estado del checkout
export interface CheckoutState {
  isLoading: boolean;
  error: string | null;
  transactionId: string | null;
  status: TransactionStatus | null;
}

// Evento de checkout
export type CheckoutEvent =
  | { type: 'REDIRECT'; url: string }
  | { type: 'SUCCESS'; transactionId: string }
  | { type: 'FAILED'; error: string };

