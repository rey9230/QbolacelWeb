import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  product_id: string;
  name: string;
  image: string;
  price: number;
  currency: string;
  qty: number;
  stock: number;
  vendor_id: string;
  vendor_name: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  removeItem: (product_id: string) => void;
  updateQty: (product_id: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Computed
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item, qty = 1) => {
        set((state) => {
          const existingItem = state.items.find(i => i.product_id === item.product_id);
          
          if (existingItem) {
            const newQty = Math.min(existingItem.qty + qty, item.stock);
            return {
              items: state.items.map(i =>
                i.product_id === item.product_id
                  ? { ...i, qty: newQty }
                  : i
              ),
              isOpen: true,
            };
          }
          
          return {
            items: [...state.items, { ...item, qty: Math.min(qty, item.stock) }],
            isOpen: true,
          };
        });
      },
      
      removeItem: (product_id) => {
        set((state) => ({
          items: state.items.filter(i => i.product_id !== product_id),
        }));
      },
      
      updateQty: (product_id, qty) => {
        set((state) => {
          if (qty <= 0) {
            return {
              items: state.items.filter(i => i.product_id !== product_id),
            };
          }
          
          return {
            items: state.items.map(i =>
              i.product_id === product_id
                ? { ...i, qty: Math.min(qty, i.stock) }
                : i
            ),
          };
        });
      },
      
      clearCart: () => {
        set({ items: [] });
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
