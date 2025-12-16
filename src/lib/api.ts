const API_BASE_URL = 'https://api.qbolacel.com/api/v1';

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // Refresh failed, clear auth state
      clearAuthState();
      return null;
    }

    const data: AuthTokenResponse = await response.json();
    updateAuthTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
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

// Public fetch wrapper without authentication
async function apiFetchPublic<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error de conexión' }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
}

// Base fetch wrapper with auth handling and automatic token refresh
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // TODO: Re-enable when backend CORS allows X-Municipality header
  // const isMarketplaceEndpoint = endpoint.startsWith('/products') || 
  //                                endpoint.startsWith('/categories') || 
  //                                endpoint.startsWith('/carts');
  // if (isMarketplaceEndpoint) {
  //   const { municipality } = getLocationState();
  //   if (municipality) {
  //     (headers as Record<string, string>)['X-Municipality'] = municipality;
  //   }
  // }

  let { token } = getAuthState();
  if (requiresAuth || token) {
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
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
      (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
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

  return response.json();
}

// ============ AUTH API ============
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

// ============ USER PROFILE ============
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  province?: string;
  municipality?: string;
  address?: string;
  created_at?: string;
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
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error de conexión' }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
}

export const authApi = {
  login: async (data: LoginRequest): Promise<{ user: UserProfile; token: string; refreshToken: string }> => {
    const tokenResponse = await apiFetch<AuthTokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Fetch user profile with the new token
    const userResponse = await apiFetchWithToken<UserProfile>('/auth/me', tokenResponse.accessToken);
    
    return {
      user: userResponse,
      token: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
    };
  },

  register: async (data: RegisterRequest): Promise<{ user: UserProfile; token: string; refreshToken: string }> => {
    const tokenResponse = await apiFetch<AuthTokenResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Fetch user profile with the new token
    const userResponse = await apiFetchWithToken<UserProfile>('/auth/me', tokenResponse.accessToken);
    
    return {
      user: userResponse,
      token: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
    };
  },

  logout: () =>
    apiFetch<{ message: string }>('/auth/logout', {
      method: 'POST',
    }, true),

  me: () =>
    apiFetch<UserProfile>('/auth/me', {}, true),

  updateProfile: (data: UpdateProfileRequest) =>
    apiFetch<UserProfile>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, true),
};

// ============ CONTACTS API ============
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
    apiFetch<ContactListResponse>('/contacts', {}, true),

  getById: (id: string) =>
    apiFetch<ContactDto>(`/contacts/${id}`, {}, true),

  create: (data: CreateContactRequest) =>
    apiFetch<ContactDto>('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true),

  update: (id: string, data: UpdateContactRequest) =>
    apiFetch<ContactDto>(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, true),

  delete: (id: string) =>
    apiFetch<void>(`/contacts/${id}`, {
      method: 'DELETE',
    }, true),

  setDefault: (id: string) =>
    apiFetch<ContactDto>(`/contacts/${id}/set-default`, {
      method: 'PUT',
    }, true),
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
    
    return apiFetch<CursorPageResponse<Product>>(`/products/cursor?${params.toString()}`);
  },

  getById: (id: string, similarLimit = 4) =>
    apiFetch<ProductDetailResponse>(`/products/${id}?similarLimit=${similarLimit}`),
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
    apiFetch<Category[]>('/categories'),
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
  meta?: Record<string, string>;
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
    apiFetch<CartDto>('/carts/me', {}, true),

  addItem: (productId: string, qty: number = 1) =>
    apiFetch<CartDto>('/carts/me/items', {
      method: 'POST',
      body: JSON.stringify({ productId, qty }),
    }, true),

  updateItem: (itemId: string, qty: number) =>
    apiFetch<CartDto>(`/carts/me/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ qty }),
    }, true),

  removeItem: (itemId: string) =>
    apiFetch<CartDto>(`/carts/me/items/${itemId}`, {
      method: 'DELETE',
    }, true),

  clear: () =>
    apiFetch<CartDto>('/carts/me/clear', {
      method: 'DELETE',
    }, true),

  applyCoupon: (code: string) =>
    apiFetch<CartDto>('/carts/me/apply-coupon', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }, true),

  removeCoupon: () =>
    apiFetch<CartDto>('/carts/me/coupon', {
      method: 'DELETE',
    }, true),
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
  contactId: string;
  shippingMethod?: string;
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

// ============ RECHARGES API ============
export interface RechargeProduct {
  id: string;
  name: string;
  type: 'cubacel' | 'nauta';
  amount: number;
  price: number;
  currency: string;
  bonus?: number;
  bonus_type?: 'percentage' | 'fixed';
  promo_expires_at?: string;
}

export interface RechargeRequest {
  product_id: string;
  phone_number?: string;
  nauta_account?: string;
  payment_method: 'paypal' | 'card' | 'tropipay';
}

export const rechargesApi = {
  getProducts: () =>
    apiFetch<{ data: RechargeProduct[] }>('/recharges/products'),

  create: (data: RechargeRequest) =>
    apiFetch<{ data: { id: string; status: string }; payment_url?: string }>('/recharges', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true),

  getHistory: (page: number = 1) =>
    apiFetch<{ data: { id: string; product: RechargeProduct; phone: string; status: string; created_at: string }[] }>(`/recharges/history?page=${page}`, {}, true),
};

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
