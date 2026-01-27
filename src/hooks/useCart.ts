import { useCallback } from 'react';
import { useCartStore } from '../store/cart.store';
import { OrderItem } from '../types';

export const useCart = () => {
  const items = useCartStore(state => state.items);
  const addItemToStore = useCartStore(state => state.addItem);
  const removeItemFromStore = useCartStore(state => state.removeItem);
  const updateQuantityInStore = useCartStore(state => state.updateQuantity);
  const clearCartInStore = useCartStore(state => state.clearCart);

  const addItem = useCallback((item: Omit<OrderItem, 'cartItemId' | 'quantity'>) => {
    addItemToStore(item);
  }, [addItemToStore]);

  const removeItem = useCallback((cartItemId: string) => {
    removeItemFromStore(cartItemId);
  }, [removeItemFromStore]);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    updateQuantityInStore(cartItemId, quantity);
  }, [updateQuantityInStore]);

  const clearCart = useCallback(() => {
    clearCartInStore();
  }, [clearCartInStore]);

  const getTotalItemsCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItemsCount
  };
};
