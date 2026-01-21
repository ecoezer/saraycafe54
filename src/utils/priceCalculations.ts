import { PRICING } from '../constants/pricing';
import { PizzaSize } from '../types';

export interface OrderItem {
  menuItem: {
    price: number;
  };
  quantity: number;
  selectedSize?: PizzaSize;
  selectedExtras?: string[];
}

export const calculateItemPrice = (item: OrderItem): number => {
  const basePrice = item.selectedSize ? item.selectedSize.price : item.menuItem.price;
  const extrasPrice = (item.selectedExtras?.length || 0) * PRICING.EXTRA_PRICE;
  return basePrice + extrasPrice;
};

export const calculateItemTotal = (item: OrderItem): number => {
  return calculateItemPrice(item) * item.quantity;
};

export const formatPrice = (price: number): string => {
  return price.toFixed(2).replace('.', ',');
};

export const formatPriceWithCurrency = (price: number): string => {
  return `${formatPrice(price)} €`;
};
