// Utilidad de debug para el carrito
// Usa esto en la consola del navegador para inspeccionar el estado

import { cartApi } from '@/lib/api';

export const debugCart = {
  // Ver el estado del carrito en localStorage
  getLocalCart: () => {
    const cart = localStorage.getItem('qbolacel-cart');
    if (cart) {
      console.log('Local cart:', JSON.parse(cart));
      return JSON.parse(cart);
    }
    console.log('No local cart found');
    return null;
  },

  // Ver el token de autenticación
  getAuth: () => {
    const auth = localStorage.getItem('qbolacel-auth');
    if (auth) {
      const parsed = JSON.parse(auth);
      console.log('Auth state:', {
        isAuthenticated: parsed.state?.isAuthenticated,
        hasToken: !!parsed.state?.token,
        user: parsed.state?.user,
      });
      return parsed;
    }
    console.log('No auth found');
    return null;
  },

  // Limpiar el carrito local
  clearLocal: () => {
    localStorage.removeItem('qbolacel-cart');
    console.log('Local cart cleared');
  },

  // Limpiar toda la data del carrito y recargar
  reset: () => {
    localStorage.removeItem('qbolacel-cart');
    console.log('Cart reset. Reloading page...');
    window.location.reload();
  },

  // Obtener el carrito desde el servidor
  getServerCart: async () => {
    try {
      console.log('Fetching cart from server...');
      const cart = await cartApi.get();
      console.log('Server cart:', cart);
      return cart;
    } catch (error) {
      console.error('Error fetching server cart:', error);
      throw error;
    }
  },

  // Limpiar el carrito en el servidor
  clearServerCart: async () => {
    try {
      console.log('Clearing server cart...');
      const cart = await cartApi.clear();
      console.log('Server cart cleared:', cart);
      return cart;
    } catch (error) {
      console.error('Error clearing server cart:', error);
      throw error;
    }
  },

  // Agregar un item de prueba al carrito
  testAddItem: async (productId: string, qty: number = 1) => {
    try {
      console.log(`Adding item to cart: ${productId} x ${qty}`);
      const cart = await cartApi.addItem(productId, qty);
      console.log('Cart after adding item:', cart);
      return cart;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  },

  // Ver todo el estado del carrito (local + servidor)
  fullStatus: async () => {
    console.group('🛒 Full Cart Status');

    console.group('Local Storage');
    debugCart.getLocalCart();
    debugCart.getAuth();
    console.groupEnd();

    console.group('Server Cart');
    try {
      await debugCart.getServerCart();
    } catch (error) {
      console.error('Failed to fetch server cart:', error);
    }
    console.groupEnd();

    console.groupEnd();
  },
};

// Exponer en window para acceso desde la consola
if (typeof window !== 'undefined') {
  (window as any).debugCart = debugCart;
  console.log('🛒 Debug utilities loaded. Use window.debugCart to access cart debugging tools.');
  console.log('Available methods:', Object.keys(debugCart));
}

