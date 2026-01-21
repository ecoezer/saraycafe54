import { useCallback } from 'react';
import { MenuItem, PizzaSize } from '../types';

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  selectedSize?: PizzaSize;
  selectedIngredients?: string[];
  selectedExtras?: string[];
  selectedPastaType?: string;
  selectedSauce?: string;
  selectedExclusions?: string[];
  selectedSideDish?: string;
}

export const usePriceCalculation = () => {
  const calculateItemPrice = useCallback((item: OrderItem): number => {
    const basePrice = item.selectedSize ? item.selectedSize.price : item.menuItem.price;
    const extrasPrice = (item.selectedExtras?.length || 0) * 1.00;
    return basePrice + extrasPrice;
  }, []);

  const calculateItemTotal = useCallback((item: OrderItem): number => {
    return calculateItemPrice(item) * item.quantity;
  }, [calculateItemPrice]);

  const calculateCartSubtotal = useCallback((items: OrderItem[]): number => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  }, [calculateItemTotal]);

  const formatPrice = useCallback((price: number): string => {
    return price.toFixed(2).replace('.', ',') + ' €';
  }, []);

  return {
    calculateItemPrice,
    calculateItemTotal,
    calculateCartSubtotal,
    formatPrice
  };
};
