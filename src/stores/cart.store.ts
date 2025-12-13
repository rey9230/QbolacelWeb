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
    if (authState) {
      const parsed = JSON.parse(authState);
      return !!parsed.state?.token;
    }
  } catch {
    return false;
  }
  return false;
};

// Convert server cart item to local cart item
const mapServerItemToLocal = (item: CartItemDto): CartItem => ({
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
});

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,
      isSynced: false,
      
      addItem: async (item, qty = 1) => {
        if (isAuthenticated()) {
          // Add via API
          set({ isLoading: true });
          try {
            const cart = await cartApi.addItem(item.productId, qty);
            get().setFromServerCart(cart);
            set({ isOpen: true, isLoading: false });
          } catch (error) {
            console.error('Error adding item to cart:', error);
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
        
        set({ isLoading: true });
        try {
          const cart = await cartApi.get();
          get().setFromServerCart(cart);
          set({ isLoading: false, isSynced: true });
        } catch (error) {
          console.error('Error syncing cart with server:', error);
          set({ isLoading: false });
        }
      },
      
      setFromServerCart: (cart: CartDto) => {
        const mappedItems = cart.items.map(mapServerItemToLocal);
        set({ items: mappedItems, isSynced: true });
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
