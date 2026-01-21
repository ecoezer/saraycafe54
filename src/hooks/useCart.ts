import { useCallback } from 'react';
import { useCartStore } from '../store/cart.store';
import { MenuItem, PizzaSize } from '../types';

export const useCart = () => {
  const items = useCartStore(state => state.items);
  const addItemToStore = useCartStore(state => state.addItem);
  const removeItemFromStore = useCartStore(state => state.removeItem);
  const updateQuantityInStore = useCartStore(state => state.updateQuantity);
  const clearCartInStore = useCartStore(state => state.clearCart);

  const addItem = useCallback((
    menuItem: MenuItem,
    selectedSize?: PizzaSize,
    selectedIngredients?: string[],
    selectedExtras?: string[],
    selectedPastaType?: string,
    selectedSauce?: string,
    selectedExclusions?: string[],
    selectedSideDish?: string,
    selectedPizzaSauces?: string[],
    selectedCalzoneSauces?: string[]
  ) => {
    addItemToStore(
      menuItem,
      selectedSize,
      selectedIngredients,
      selectedExtras,
      selectedPastaType,
      selectedSauce,
      selectedExclusions,
      selectedSideDish,
      selectedPizzaSauces,
      selectedCalzoneSauces
    );
  }, [addItemToStore]);

  const removeItem = useCallback((
    id: number,
    selectedSize?: PizzaSize,
    selectedIngredients?: string[],
    selectedExtras?: string[],
    selectedPastaType?: string,
    selectedSauce?: string,
    selectedExclusions?: string[],
    selectedSideDish?: string,
    selectedPizzaSauces?: string[],
    selectedCalzoneSauces?: string[]
  ) => {
    removeItemFromStore(
      id,
      selectedSize,
      selectedIngredients,
      selectedExtras,
      selectedPastaType,
      selectedSauce,
      selectedExclusions,
      selectedSideDish,
      selectedPizzaSauces,
      selectedCalzoneSauces
    );
  }, [removeItemFromStore]);

  const updateQuantity = useCallback((
    id: number,
    quantity: number,
    selectedSize?: PizzaSize,
    selectedIngredients?: string[],
    selectedExtras?: string[],
    selectedPastaType?: string,
    selectedSauce?: string,
    selectedExclusions?: string[],
    selectedSideDish?: string,
    selectedPizzaSauces?: string[],
    selectedCalzoneSauces?: string[]
  ) => {
    updateQuantityInStore(
      id,
      quantity,
      selectedSize,
      selectedIngredients,
      selectedExtras,
      selectedPastaType,
      selectedSauce,
      selectedExclusions,
      selectedSideDish,
      selectedPizzaSauces,
      selectedCalzoneSauces
    );
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
