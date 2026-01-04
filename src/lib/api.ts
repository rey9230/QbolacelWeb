import { z } from 'zod';
import {
  AuthTokenResponseSchema,
  UserProfileSchema,
  ContactDtoSchema,
  ContactListResponseSchema,
  ProductSchema,
  ProductDetailResponseSchema,
  CursorPageResponseSchema,
  CategorySchema,
  CartDtoSchema,
  OrderSummarySchema,
  OrderSchema,
  ProvinceListResponseSchema,
  MunicipalityListResponseSchema,
  ProvinceOfMunicipalityResponseSchema,
  TopupProductSchema,
  TopupTransactionSchema,
  PurchaseTopupResponseSchema,
  CheckoutResponseSchema,
  TransactionStatusResponseSchema,
  SavedPaymentMethodSchema,
  MessageResponseSchema,
  validateApiResponse,
} from './api-schemas';
import { getAuditHeaders } from './client-metadata';

// const API_BASE_URL = 'https://api.qbolacel.com/api/v1';
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const buildHeaders = (provided?: HeadersInit) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...getAuditHeaders(),
  });

  if (provided) {
    const extra = new Headers(provided);
    extra.forEach((value, key) => headers.set(key, value));
  }

  return headers;
};

// Helper to get auth tokens from localStorage
const getAuthState = (): { token: string | null; refreshToken: string | null } => {
  try {
    const authState = localStorage.getItem('qbolacel-auth');
    if (authState) {
      const parsed = JSON.parse(authState);
      return {
        token: parsed.state?.token || null,
        refreshToken: parsed.state?.refreshToken || null,
      };
    }
  } catch {
    return { token: null, refreshToken: null };
  }
  return { token: null, refreshToken: null };
};

// Helper to update tokens in localStorage
const updateAuthTokens = (token: string, refreshToken: string) => {
  try {
    const authState = localStorage.getItem('qbolacel-auth');
    if (authState) {
      const parsed = JSON.parse(authState);
      parsed.state.token = token;
      parsed.state.refreshToken = refreshToken;
      localStorage.setItem('qbolacel-auth', JSON.stringify(parsed));
    }
  } catch (e) {
    console.error('Failed to update auth tokens:', e);
  }
};

// Helper to clear auth state (logout)
const clearAuthState = () => {
  try {
    const authState = localStorage.getItem('qbolacel-auth');
    if (authState) {
      const parsed = JSON.parse(authState);
      parsed.state.token = null;
      parsed.state.refreshToken = null;
      parsed.state.user = null;
      parsed.state.isAuthenticated = false;
      localStorage.setItem('qbolacel-auth', JSON.stringify(parsed));
      // Dispatch event to notify app of logout
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  } catch (e) {
    console.error('Failed to clear auth state:', e);
  }
};

// Refresh the access token using the refresh token
async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken } = getAuthState();
  
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // Refresh failed, clear auth state
      clearAuthState();
      return null;
    }

    const data = await response.json();
    const validated = validateApiResponse(AuthTokenResponseSchema, data, 'refreshAccessToken');
    updateAuthTokens(validated.accessToken, validated.refreshToken);
    return validated.accessToken;
  } catch {
    clearAuthState();
    return null;
  }
}

// Get a valid token, refreshing if necessary
async function getValidToken(): Promise<string | null> {
  const { token } = getAuthState();
  return token;
}

// Helper to get location from localStorage
const getLocationState = (): { municipality: string | null } => {
  try {
    const locationState = localStorage.getItem('qbolacel-location');
    if (locationState) {
      const parsed = JSON.parse(locationState);
      return {
        municipality: parsed.state?.municipality || null,
      };
    }
  } catch {
    return { municipality: null };
  }
  return { municipality: null };
};

// Generic fetch wrapper with optional schema validation
async function apiFetchWithValidation<T>(
  endpoint: string,
  schema: z.ZodSchema<T> | null,
  options: RequestInit = {},
  requiresAuth = false
): Promise<T> {
  const headers = buildHeaders(options.headers);

  let { token } = getAuthState();
  if (requiresAuth || token) {
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If 401 Unauthorized, try to refresh the token and retry
  if (response.status === 401 && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login')) {
    // Prevent multiple simultaneous refresh attempts
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken();
    }

    const newToken = await refreshPromise;
    isRefreshing = false;
    refreshPromise = null;

    if (newToken) {
      // Retry the original request with new token
      headers.set('Authorization', `Bearer ${newToken}`);
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } else {
      throw new Error('Sesión expirada. Por favor, inicia sesión de nuevo.');
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error de conexión' }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  const data = await response.json();
  
  // Validate response if schema provided
  if (schema) {
    return validateApiResponse(schema, data, endpoint);
  }
  
  return data as T;
}

// Public fetch wrapper without authentication
async function apiFetchPublic<T>(
  endpoint: string,
  options: RequestInit = {},
  schema?: z.ZodSchema<T>
): Promise<T> {
  const headers = buildHeaders(options.headers);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error de conexión' }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  const data = await response.json();
  
  // Validate response if schema provided
  if (schema) {
    return validateApiResponse(schema, data, endpoint);
  }
  
  return data as T;
}

// Base fetch wrapper with auth handling and automatic token refresh (legacy, for backwards compatibility)
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false
): Promise<T> {
  return apiFetchWithValidation<T>(endpoint, null, options, requiresAuth);
}


// ============ AUTH API ============
export interface LoginRequest {
  email: string;
  password: string;
  turnstileToken: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  turnstileToken: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

// ============ USER PROFILE ============
export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  phone?: string;
  avatar?: string;
  province?: string;
  municipality?: string;
  address?: string;
  roles?: string[];
  location?: string | null;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  municipality?: string;
  address?: string;
}

async function apiFetchWithToken<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {},
  schema?: z.ZodSchema<T>
): Promise<T> {
  const headers = buildHeaders(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error de conexión' }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  const data = await response.json();
  
  if (schema) {
    return validateApiResponse(schema, data, endpoint);
  }
  
  return data as T;
}

// Password recovery and email verification interfaces
export interface ForgotPasswordRequest {
  email: string;
  turnstileToken: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  turnstileToken: string;
}

export interface ResendVerificationRequest {
  email: string;
  turnstileToken: string;
}

export interface SimpleStatusResponse {
  status: 'OK' | 'INVALID';
}

export const authApi = {
  login: async (data: LoginRequest): Promise<{ user: UserProfile; token: string; refreshToken: string }> => {
    const tokenResponse = await apiFetchWithValidation('/auth/web/login', AuthTokenResponseSchema, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Fetch user profile with the new token
    const userResponse = await apiFetchWithToken('/auth/me', tokenResponse.accessToken, {}, UserProfileSchema);
    
    return {
      user: userResponse as UserProfile,
      token: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
    };
  },

  register: async (data: RegisterRequest): Promise<{ user: UserProfile; token: string; refreshToken: string }> => {
    const tokenResponse = await apiFetchWithValidation('/auth/web/signup', AuthTokenResponseSchema, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Fetch user profile with the new token
    const userResponse = await apiFetchWithToken('/auth/me', tokenResponse.accessToken, {}, UserProfileSchema);
    
    return {
      user: userResponse as UserProfile,
      token: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
    };
  },

  logout: () =>
    apiFetchWithValidation('/auth/logout', MessageResponseSchema, {
      method: 'POST',
    }, true),

  me: () =>
    apiFetchWithValidation('/auth/me', UserProfileSchema, {}, true) as Promise<UserProfile>,

  updateProfile: (data: UpdateProfileRequest) =>
    apiFetchWithValidation('/auth/profile', UserProfileSchema, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, true) as Promise<UserProfile>,

  forgotPassword: (data: ForgotPasswordRequest): Promise<SimpleStatusResponse> =>
    apiFetchPublic('/auth/web/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetPassword: (data: ResetPasswordRequest): Promise<SimpleStatusResponse> =>
    apiFetchPublic('/auth/web/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyEmail: (token: string): Promise<SimpleStatusResponse> =>
    apiFetchPublic(`/auth/web/verify-email?token=${encodeURIComponent(token)}`),

  resendVerification: (data: ResendVerificationRequest): Promise<SimpleStatusResponse> =>
    apiFetchPublic('/auth/web/resend-verification', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
export interface ContactDto {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  betweenStreets?: string;
  municipality: string;
  province: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactRequest {
  fullName: string;
  phone: string;
  street: string;
  betweenStreets?: string;
  municipality: string;
  isDefault?: boolean;
}

export interface UpdateContactRequest {
  fullName?: string;
  phone?: string;
  street?: string;
  betweenStreets?: string;
  municipality?: string;
}

export interface ContactListResponse {
  contacts: ContactDto[];
  total: number;
  defaultContactId?: string;
}

export const contactsApi = {
  getAll: () =>
    apiFetchWithValidation('/contacts', ContactListResponseSchema, {}, true) as Promise<ContactListResponse>,

  getById: (id: string) =>
    apiFetchWithValidation(`/contacts/${id}`, ContactDtoSchema, {}, true) as Promise<ContactDto>,

  create: (data: CreateContactRequest) =>
    apiFetchWithValidation('/contacts', ContactDtoSchema, {
      method: 'POST',
      body: JSON.stringify(data),
    }, true) as Promise<ContactDto>,

  update: (id: string, data: UpdateContactRequest) =>
    apiFetchWithValidation(`/contacts/${id}`, ContactDtoSchema, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, true) as Promise<ContactDto>,

  delete: (id: string) =>
    apiFetch<void>(`/contacts/${id}`, {
      method: 'DELETE',
    }, true),

  setDefault: (id: string) =>
    apiFetchWithValidation(`/contacts/${id}/set-default`, ContactDtoSchema, {
      method: 'PUT',
    }, true) as Promise<ContactDto>,
};

// ============ PRODUCTS API ============
export interface Money {
  amount: number;
  currency: string;
}

export interface Promotion {
  type: string;
  amount: number;
  startsAt?: string;
  endsAt?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  price: Money;
  stock: number;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'BACKORDER';
  categoryIds: string[];
  pictures: string[];
  primaryImage?: string;
  attributes: Record<string, string>;
  isPublished: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  tags: string[];
  promotions: Promotion[];
  relatedProductIds: string[];
  upsellProductIds: string[];
  agencyId?: string;
  salesCount: number;
  rating: number;
  reviewsCount: number;
}

export interface ProductDetailResponse {
  product: Product;
  similar: Product[];
}

// Cursor-based pagination response (semantic search)
export interface CursorPageResponse<T> {
  success: boolean;
  limit: number;
  nextCursor: string | null;
  data: T[];
}

// Keep PageResponse for backwards compatibility if needed
export interface PageResponse<T> {
  success: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  data: T[];
}

export interface ProductFilters {
  limit?: number;
  cursor?: string;
  q?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  tag?: string;
  sort?: string;
}

export const productsApi = {
  // Cursor-based pagination (semantic search) - preferred for e-commerce
  getAll: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.cursor) params.append('cursor', filters.cursor);
    if (filters.q) params.append('query', filters.q); // backend uses 'query' not 'q' for cursor
    if (filters.category) params.append('category', filters.category);
    if (filters.priceMin !== undefined) params.append('priceMin', String(filters.priceMin));
    if (filters.priceMax !== undefined) params.append('priceMax', String(filters.priceMax));
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.sort) params.append('sort', filters.sort);
    
    return apiFetchWithValidation(
      `/products/cursor?${params.toString()}`,
      CursorPageResponseSchema(ProductSchema),
      {}
    ) as Promise<CursorPageResponse<Product>>;
  },

  // Get product by ID (for internal use)
  getById: (id: string, similarLimit = 4) =>
    apiFetchWithValidation(
      `/products/${id}?similarLimit=${similarLimit}`,
      ProductDetailResponseSchema,
      {}
    ) as Promise<ProductDetailResponse>,

  // Get product by slug (for SEO-friendly URLs)
  getBySlug: (slug: string, similarLimit = 4) =>
    apiFetchWithValidation(
      `/products/slug/${slug}?similarLimit=${similarLimit}`,
      ProductDetailResponseSchema,
      {}
    ) as Promise<ProductDetailResponse>,
};

// ============ CATEGORIES API ============
export interface Category {
  id: string;
  code?: string;
  name: string;
  slug: string;
  description?: string;
  hasChild: boolean;
  iconUrl?: string;
  pictures: string[];
  parentId?: string;
  order: number;
  isActive: boolean;
}

export const categoriesApi = {
  getAll: () =>
    apiFetchPublic('/categories', {}, z.array(CategorySchema)) as Promise<Category[]>,
};

// ============ CART API ============
export interface CartProductInfo {
  name: string;
  slug: string;
  sku: string;
  description?: string;
  primaryImage?: string;
  pictures: string[];
  stock: number;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'BACKORDER';
  isPublished: boolean;
  agencyId?: string;
  agencyName?: string;
  categoryIds: string[];
  tags: string[];
  attributes: Record<string, string>;
  salesCount: number;
  rating: number;
  reviewsCount: number;
}

export interface CartItemDto {
  itemId: string;
  productId: string;
  qty: number;
  unitPrice: number;
  currency: string;
  meta?: Record<string, string> | null;
  product?: CartProductInfo;
}

export interface CartTotals {
  subtotal: number;
  currency: string;
  totalItems: number;
  uniqueProducts: number;
}

export interface CartDto {
  id: string;
  items: CartItemDto[];
  totals: CartTotals;
  updatedAt: string;
}

export const cartApi = {
  get: () =>
    apiFetchWithValidation('/carts/me', CartDtoSchema, {}, true) as Promise<CartDto>,

  addItem: (productId: string, qty: number = 1) => {
    console.log('[API] Adding item to cart:', { productId, qty });
    return apiFetchWithValidation('/carts/me/items', CartDtoSchema, {
      method: 'POST',
      body: JSON.stringify({ productId, qty }),
    }, true) as Promise<CartDto>;
  },

  updateItem: (itemId: string, qty: number) =>
    apiFetchWithValidation(`/carts/me/items/${itemId}`, CartDtoSchema, {
      method: 'PUT',
      body: JSON.stringify({ qty }),
    }, true) as Promise<CartDto>,

  removeItem: (itemId: string) =>
    apiFetchWithValidation(`/carts/me/items/${itemId}`, CartDtoSchema, {
      method: 'DELETE',
    }, true) as Promise<CartDto>,

  clear: () =>
    apiFetchWithValidation('/carts/me/clear', CartDtoSchema, {
      method: 'DELETE',
    }, true) as Promise<CartDto>,

  applyCoupon: (code: string) =>
    apiFetchWithValidation('/carts/me/apply-coupon', CartDtoSchema, {
      method: 'POST',
      body: JSON.stringify({ code }),
    }, true) as Promise<CartDto>,

  removeCoupon: () =>
    apiFetchWithValidation('/carts/me/coupon', CartDtoSchema, {
      method: 'DELETE',
    }, true) as Promise<CartDto>,
};

// ============ ORDERS API ============
// OrderSummary - para listado de órdenes
export interface OrderSummary {
  id: string;
  orderSku: string | null;
  status: string;
  grandTotal: number | null;
  currency: string | null;
  createdAt: string;
  createdAtFormatted: string;
}

// Order - para detalle de orden
export interface Order {
  id: string;
  orderSku: string | null;
  status: string;
  items: {
    productId: string;
    qty: number;
    unitPrice: number;
    currency: string;
  }[];
  totals: {
    subtotal: number;
    shipping?: number;
    fees?: number;
    discount?: number;
    grandTotal: number;
    currency: string;
  } | null;
  createdAt: string;
  createdAtFormatted: string;
}

// CreatePhysicalOrderRequest
export interface CreateOrderRequest {
  items: {
    productId: string;
    qty: number;
  }[];
  currency: string;
  shipping?: {
    method?: string;
    address?: Record<string, string>;
  };
}

export const ordersApi = {
  create: (data: CreateOrderRequest, idempotencyKey: string) =>
    apiFetch<Order>('/orders/physical', {
      method: 'POST',
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(data),
    }, true),

  getAll: () =>
    apiFetch<OrderSummary[]>('/orders/physical/me', {}, true),

  getById: (id: string) =>
    apiFetch<Order>(`/orders/physical/${id}`, {}, true),
};

// ============ GEOGRAPHY API ============
export interface ProvinceListResponse {
  provinces: string[];
  total: number;
}

export interface MunicipalityListResponse {
  municipalities: string[];
  province: string | null;
  total: number;
}

export const geoApi = {
  getProvinces: () =>
    apiFetchPublic<ProvinceListResponse>('/geo/provinces'),

  getMunicipalities: (province?: string) => {
    const params = province ? `?province=${encodeURIComponent(province)}` : '';
    return apiFetchPublic<MunicipalityListResponse>(`/geo/municipalities${params}`);
  },

  getProvinceOfMunicipality: (municipality: string) =>
    apiFetchPublic<{ municipality: string; province: string | null; found: boolean }>(
      `/geo/municipalities/${encodeURIComponent(municipality)}/province`
    ),
};

// ============ TOPUP API ============
// Nuevo sistema de productos de recarga (multi-proveedor)

export interface TopupProduct {
  id: string;
  sku: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  
  // Clasificación
  country: string;
  operator: string;  // "CUBACEL", "NAUTA"
  productType: string;  // "MOBILE_TOPUP", "NAUTA", "DATA_PACK", etc.
  
  // Precios
  salePrice: number;
  saleCurrency: string;
  originalPrice?: number;
  receiveValue?: number;
  receiveCurrency?: string;
  
  // Montos variables
  isVariableAmount: boolean;
  minAmount?: number;
  maxAmount?: number;
  amountStep?: number;
  suggestedAmounts?: number[];
  
  // Visibilidad
  isFeatured: boolean;
  isPromotion: boolean;
  promotionLabel?: string;
  promotionEndsAt?: string;
  
  // Media
  imageUrl?: string;
  iconUrl?: string;
  
  // Otros
  validity?: string;
  tags: string[];
}

export type TopupTransactionStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export interface TopupTransaction {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  
  accountNumber: string;
  accountType: string;  // "MSISDN", "EMAIL"
  country: string;
  operator: string;
  
  salePrice: number;
  saleCurrency: string;
  receiveValue?: number;
  receiveCurrency?: string;
  
  status: TopupTransactionStatus;
  statusMessage?: string;
  
  providerId: string;
  providerTransactionId?: string;
  
  deliveredValue?: number;
  deliveredCurrency?: string;
  deliveredAt?: string;
  
  createdAt: string;
  completedAt?: string;
}

export interface PurchaseTopupRequest {
  productId: string;
  accountNumber: string;
  amount?: number;  // Solo para productos de monto variable
  currency?: string;
  metadata?: Record<string, string>;
}

export interface PurchaseTopupResponse {
  transactionId: string;
  status: TopupTransactionStatus;
  productId: string;
  productName: string;
  accountNumber: string;
  salePrice: number;
  saleCurrency: string;
  receiveValue?: number;
  receiveCurrency?: string;
  providerId: string;
  providerTransactionId?: string;
  message?: string;
  createdAt: string;
}

export interface TopupProductFilters {
  country?: string;
  operator?: string;
  productType?: string;
}

export const topupApi = {
  // Listar productos activos
  getProducts: (filters: TopupProductFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.country) params.append('country', filters.country);
    if (filters.operator) params.append('operator', filters.operator);
    if (filters.productType) params.append('productType', filters.productType);
    const query = params.toString();
    return apiFetchPublic<TopupProduct[]>(`/topup/products${query ? `?${query}` : ''}`);
  },

  // Productos destacados
  getFeatured: () =>
    apiFetchPublic<TopupProduct[]>('/topup/products/featured'),

  // Detalle por slug
  getBySlug: (slug: string) =>
    apiFetchPublic<TopupProduct>(`/topup/products/${slug}`),

  // Comprar recarga (requiere auth + Idempotency-Key)
  purchase: (data: PurchaseTopupRequest, idempotencyKey: string) =>
    apiFetch<PurchaseTopupResponse>('/topup/purchase', {
      method: 'POST',
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(data),
    }, true),

  // Historial de transacciones
  getTransactions: (page: number = 0, size: number = 20) =>
    apiFetch<TopupTransaction[]>(`/topup/transactions?page=${page}&size=${size}`, {}, true),

  // Detalle de transacción
  getTransaction: (id: string) =>
    apiFetch<TopupTransaction>(`/topup/transactions/${id}`, {}, true),
};

// Legacy alias for backward compatibility
export const rechargesApi = topupApi;

// ============ UNIFIED CHECKOUT API ============
// Basado en PAYMENT_IMPLEMENTATION.md

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

export const unifiedCheckoutApi = {
  // Checkout de Marketplace (genera link de pago)
  marketplaceCheckout: (request: MarketplaceCheckoutRequest) =>
    apiFetch<CheckoutResponse>('/unified-checkout/marketplace', {
      method: 'POST',
      body: JSON.stringify(request),
    }, true),

  // Checkout de Recarga (genera link de pago)
  rechargeCheckout: (request: RechargeCheckoutRequest) =>
    apiFetch<CheckoutResponse>('/unified-checkout/recharge', {
      method: 'POST',
      body: JSON.stringify(request),
    }, true),

  // Pago rápido de recarga (1-click con tarjeta guardada)
  quickRecharge: (request: QuickRechargeRequest) =>
    apiFetch<CheckoutResponse>('/unified-checkout/quick-recharge', {
      method: 'POST',
      body: JSON.stringify(request),
    }, true),

  // Pago rápido de marketplace (1-click con tarjeta guardada)
  quickMarketplace: (request: QuickMarketplaceRequest) =>
    apiFetch<CheckoutResponse>('/unified-checkout/quick-marketplace', {
      method: 'POST',
      body: JSON.stringify(request),
    }, true),

  // Consultar estado de transacción
  getStatus: (transactionId: string) =>
    apiFetch<TransactionStatusResponse>(`/unified-checkout/status/${transactionId}`, {}, true),
};

// ============ PAYMENT METHODS API ============

export const paymentMethodsApi = {
  // Listar todas las tarjetas guardadas
  getAll: () =>
    apiFetch<SavedPaymentMethod[]>('/payment-methods', {}, true),

  // Eliminar una tarjeta guardada
  delete: (methodId: string) =>
    apiFetch<void>(`/payment-methods/${methodId}`, {
      method: 'DELETE',
    }, true),

  // Establecer tarjeta como predeterminada
  setDefault: (methodId: string) =>
    apiFetch<SavedPaymentMethod>(`/payment-methods/${methodId}/default`, {
      method: 'PUT',
    }, true),
};
