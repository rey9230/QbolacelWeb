import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { cartApi, CartDto, CartItemDto } from '@/lib/api';

export interface CartItem {
  itemId: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  currency: string;
  qty: number;
  stock: number;
  vendorId: string;
  vendorName: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  isSynced: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'qty' | 'itemId'>, qty?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQty: (itemId: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Server sync
  syncWithServer: () => Promise<void>;
  setFromServerCart: (cart: CartDto) => void;
  resetCart: () => void;
  
  // Computed
  getTotalItems: () => number;
  getSubtotal: () => number;
}

// Helper to check if user is authenticated
const isAuthenticated = (): boolean => {
  try {
    const authState = localStorage.getItem('qbolacel-auth');
    console.log('🔐 [Auth Check] Raw auth state:', authState);

    if (authState) {
      const parsed = JSON.parse(authState);
      console.log('🔐 [Auth Check] Parsed state:', parsed);
      const hasToken = !!parsed.state?.token;
      console.log('🔐 [Auth Check] Has token:', hasToken);
      return hasToken;
    }

    console.log('🔐 [Auth Check] No auth state found');
  } catch (error) {
    console.error('🔐 [Auth Check] Error parsing auth state:', error);
    return false;
  }
  return false;
};

// Convert server cart item to local cart item
const mapServerItemToLocal = (item: CartItemDto): CartItem => {
  console.log('📦 [Cart Mapper] Input item:', {
    itemId: item.itemId,
    productId: item.productId,
    qty: item.qty,
    unitPrice: item.unitPrice,
    hasProduct: !!item.product,
    productName: item.product?.name,
  });

  const mapped = {
    itemId: item.itemId,
    productId: item.productId,
    name: item.product?.name || 'Producto',
    image: item.product?.primaryImage || '/placeholder.svg',
    price: item.unitPrice,
    currency: item.currency,
    qty: item.qty,
    stock: item.product?.stock || 99,
    vendorId: item.product?.agencyId || '',
    vendorName: item.product?.agencyName || 'Vendedor',
  };

  console.log('✅ [Cart Mapper] Output item:', mapped);
  return mapped;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,
      isSynced: false,
      
      addItem: async (item, qty = 1) => {
        console.log('🔵 [Cart Store] addItem called with:', { item, qty });
        const isAuth = isAuthenticated();
        console.log('🔵 [Cart Store] isAuthenticated:', isAuth);

        if (isAuth) {
          // Add via API
          set({ isLoading: true });
          try {
            console.log('🚀 [Cart Store] Adding item to server cart:', { productId: item.productId, qty });
            const cart = await cartApi.addItem(item.productId, qty);
            console.log('✅ [Cart Store] Server response received:', cart);
            console.log('✅ [Cart Store] Response items count:', cart.items?.length || 0);

            get().setFromServerCart(cart);
            set({ isOpen: true, isLoading: false });

            console.log('✅ [Cart Store] Final store state after addItem:', {
              itemsCount: get().items.length,
              items: get().items,
            });
          } catch (error) {
            console.error('❌ [Cart Store] Error adding item to cart:', error);
            set({ isLoading: false });
            throw error;
          }
        } else {
          // Local only for unauthenticated users
          set((state) => {
            const existingItem = state.items.find(i => i.productId === item.productId);
            
            if (existingItem) {
              const newQty = Math.min(existingItem.qty + qty, item.stock);
              return {
                items: state.items.map(i =>
                  i.productId === item.productId
                    ? { ...i, qty: newQty }
                    : i
                ),
                isOpen: true,
              };
            }
            
            // Generate a temporary itemId for local items
            const tempItemId = `temp_${item.productId}_${Date.now()}`;
            return {
              items: [...state.items, { ...item, itemId: tempItemId, qty: Math.min(qty, item.stock) }],
              isOpen: true,
            };
          });
        }
      },
      
      removeItem: async (itemId) => {
        if (isAuthenticated()) {
          set({ isLoading: true });
          try {
            const cart = await cartApi.removeItem(itemId);
            get().setFromServerCart(cart);
            set({ isLoading: false });
          } catch (error) {
            console.error('Error removing item from cart:', error);
            set({ isLoading: false });
            throw error;
          }
        } else {
          set((state) => ({
            items: state.items.filter(i => i.itemId !== itemId),
          }));
        }
      },
      
      updateQty: async (itemId, qty) => {
        if (qty <= 0) {
          return get().removeItem(itemId);
        }
        
        if (isAuthenticated()) {
          set({ isLoading: true });
          try {
            const cart = await cartApi.updateItem(itemId, qty);
            get().setFromServerCart(cart);
            set({ isLoading: false });
          } catch (error) {
            console.error('Error updating cart item:', error);
            set({ isLoading: false });
            throw error;
          }
        } else {
          set((state) => ({
            items: state.items.map(i =>
              i.itemId === itemId
                ? { ...i, qty: Math.min(qty, i.stock) }
                : i
            ),
          }));
        }
      },
      
      clearCart: async () => {
        if (isAuthenticated()) {
          set({ isLoading: true });
          try {
            await cartApi.clear();
            set({ items: [], isLoading: false });
          } catch (error) {
            console.error('Error clearing cart:', error);
            set({ isLoading: false });
            throw error;
          }
        } else {
          set({ items: [] });
        }
      },
      
      openCart: () => {
        set({ isOpen: true });
      },
      
      closeCart: () => {
        set({ isOpen: false });
      },
      
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
      
      syncWithServer: async () => {
        if (!isAuthenticated()) {
          return;
        }
        
        const localItems = get().items;
        set({ isLoading: true });
        
        try {
          // First, get the server cart
          const serverCart = await cartApi.get();
          const serverProductIds = new Set(serverCart.items.map(item => item.productId));
          
          // Find local items that are NOT on the server (by productId)
          const itemsToAdd = localItems.filter(item => !serverProductIds.has(item.productId));
          
          // Add local items to server sequentially to avoid race conditions
          let finalCart = serverCart;
          for (const item of itemsToAdd) {
            try {
              finalCart = await cartApi.addItem(item.productId, item.qty);
            } catch (error) {
              console.warn(`Could not add item ${item.productId} to server cart:`, error);
            }
          }
          
          // Set the final merged cart from server
          get().setFromServerCart(finalCart);
          set({ isLoading: false, isSynced: true });
        } catch (error) {
          console.error('Error syncing cart with server:', error);
          set({ isLoading: false });
        }
      },
      
      setFromServerCart: (cart: CartDto) => {
        console.log('🔍 [Cart Store] setFromServerCart called with:', cart);
        console.log('🔍 [Cart Store] Cart items count:', cart.items?.length || 0);
        console.log('🔍 [Cart Store] Cart items:', cart.items);

        const mappedItems = cart.items.map(mapServerItemToLocal);
        console.log('🔍 [Cart Store] Mapped items count:', mappedItems.length);
        console.log('🔍 [Cart Store] Mapped items:', mappedItems);

        set({ items: mappedItems, isSynced: true });

        console.log('🔍 [Cart Store] Store updated. Current items:', get().items);
      },
      
      resetCart: () => {
        set({ items: [], isSynced: false });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.qty, 0);
      },
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.qty), 0);
      },
    }),
    {
      name: 'qbolacel-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
