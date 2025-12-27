import { useEffect } from "react";
import { useCartStore } from "@/stores/cart.store";

/**
 * Componente de debug para el carrito
 * Muestra logs en la consola cada vez que el carrito cambia
 */
export function CartDebugger() {
  const { items, isOpen, isLoading, isSynced } = useCartStore();

  useEffect(() => {
    console.group('🛒 [Cart State Changed]');
    console.log('Items:', items);
    console.log('Total items:', items.reduce((sum, item) => sum + item.qty, 0));
    console.log('isOpen:', isOpen);
    console.log('isLoading:', isLoading);
    console.log('isSynced:', isSynced);
    console.groupEnd();
  }, [items, isOpen, isLoading, isSynced]);

  // Este componente no renderiza nada
  return null;
}

