import { useEffect } from 'react';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Hook to sync cart with server when auth state changes
 * Add this to your App.tsx or a top-level component
 */
export function useCartSync() {
  const { syncWithServer, resetCart, isSynced } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !isSynced) {
      // User just logged in, sync cart with server
      syncWithServer();
    } else if (!isAuthenticated && isSynced) {
      // User logged out, reset sync state
      resetCart();
    }
  }, [isAuthenticated, isSynced, syncWithServer, resetCart]);
}
