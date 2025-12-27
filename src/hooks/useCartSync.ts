import { useEffect, useRef } from 'react';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Hook to sync cart with server when auth state changes
 * Add this to your App.tsx or a top-level component
 */
export function useCartSync() {
  const { syncWithServer, resetCart, isSynced } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Initial sync on mount if already authenticated
    if (isAuthenticated && !hasInitialized.current) {
      console.log('[CartSync] Initial sync - user already authenticated');
      syncWithServer();
      hasInitialized.current = true;
    } else if (isAuthenticated && !isSynced) {
      // User just logged in, sync cart with server
      console.log('[CartSync] User logged in - syncing cart');
      syncWithServer();
    } else if (!isAuthenticated && isSynced) {
      // User logged out, reset sync state
      console.log('[CartSync] User logged out - resetting cart');
      resetCart();
      hasInitialized.current = false;
    }
  }, [isAuthenticated, isSynced, syncWithServer, resetCart]);
}
