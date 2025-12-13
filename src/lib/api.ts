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
  province_id?: string;
  municipality_id?: string;
  address?: string;
  created_at?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  province_id?: string;
  municipality_id?: string;
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
export interface Contact {
  id: string;
  name: string;
  phone: string;
  province_id: string;
  province_name?: string;
  municipality_id: string;
  municipality_name?: string;
  address: string;
  notes?: string;
  is_default?: boolean;
  created_at?: string;
}

export interface CreateContactRequest {
  name: string;
  phone: string;
  province_id: string;
  municipality_id: string;
  address: string;
  notes?: string;
  is_default?: boolean;
}

export interface UpdateContactRequest extends Partial<CreateContactRequest> {}

export const contactsApi = {
  getAll: () =>
    apiFetch<{ data: Contact[] }>('/contacts', {}, true),

  getById: (id: string) =>
    apiFetch<{ data: Contact }>(`/contacts/${id}`, {}, true),

  create: (data: CreateContactRequest) =>
    apiFetch<{ data: Contact }>('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true),

  update: (id: string, data: UpdateContactRequest) =>
    apiFetch<{ data: Contact }>(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, true),

  delete: (id: string) =>
    apiFetch<{ message: string }>(`/contacts/${id}`, {
      method: 'DELETE',
    }, true),

  setDefault: (id: string) =>
    apiFetch<{ data: Contact }>(`/contacts/${id}/default`, {
      method: 'POST',
    }, true),
};

// ============ PRODUCTS API ============
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  images: string[];
  category_id: string;
  category_name: string;
  vendor_id: string;
  vendor_name: string;
  rating: number;
  reviews_count: number;
  created_at: string;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ProductFilters {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}

export const productsApi = {
  getAll: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    return apiFetch<ProductsResponse>(`/products?${params.toString()}`);
  },

  getById: (id: string) =>
    apiFetch<{ data: Product }>(`/products/${id}`),

  getBySlug: (slug: string) =>
    apiFetch<{ data: Product }>(`/products/slug/${slug}`),
};

// ============ CATEGORIES API ============
export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  products_count: number;
}

export const categoriesApi = {
  getAll: () =>
    apiFetch<{ data: Category[] }>('/categories'),
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
export interface ShippingAddress {
  name: string;
  phone: string;
  province: string;
  municipality: string;
  address: string;
  notes?: string;
}

export interface CreateOrderRequest {
  shipping_address: ShippingAddress;
  shipping_method: 'standard' | 'express';
  payment_method: 'paypal' | 'card' | 'tropipay';
  idempotency_key: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  items: {
    product_id: string;
    product_name: string;
    product_image: string;
    quantity: number;
    price: number;
  }[];
  shipping_address: ShippingAddress;
  shipping_method: string;
  payment_method: string;
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  created_at: string;
  updated_at: string;
}

export const ordersApi = {
  create: (data: CreateOrderRequest) =>
    apiFetch<{ data: Order; payment_url?: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true),

  getAll: (page: number = 1) =>
    apiFetch<{ data: Order[]; meta: ProductsResponse['meta'] }>(`/orders?page=${page}`, {}, true),

  getById: (id: string) =>
    apiFetch<{ data: Order }>(`/orders/${id}`, {}, true),
};

// ============ PROVINCES API ============
export interface Province {
  id: string;
  name: string;
}

export interface Municipality {
  id: string;
  name: string;
  province_id: string;
}

export const locationsApi = {
  getProvinces: () =>
    apiFetch<{ data: Province[] }>('/locations/provinces'),

  getMunicipalities: (province_id: string) =>
    apiFetch<{ data: Municipality[] }>(`/locations/provinces/${province_id}/municipalities`),
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
