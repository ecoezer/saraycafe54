import { MenuItem, PizzaSize } from '../types';
import { pizzaExtrasPricing, calzoneExtrasPricing } from '../data/menuItems';
import { getSizePrice } from '../utils/sizeNormalization';

interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  selectedSize?: PizzaSize;
  selectedExtras?: string[];
  selectedPizzaSauces?: string[];
  selectedCalzoneSauces?: string[];
}

export class PriceService {
  private static readonly EXTRA_PRICE = 1.00;

  static calculateItemBasePrice(item: OrderItem): number {
    return item.selectedSize ? item.selectedSize.price : item.menuItem.price;
  }

  static calculateExtrasPrice(item: OrderItem): number {
    if (!item.selectedExtras || item.selectedExtras.length === 0) {
      return 0;
    }

    if (!item.selectedSize) {
      return (item.selectedExtras.length) * this.EXTRA_PRICE;
    }

    let totalExtrasPrice = 0;

    if (item.menuItem.isCalzone) {
      const calzoneSizeName = item.selectedSize.name as 'Normal' | 'Groß';
      item.selectedExtras.forEach(extra => {
        const extraPricing = calzoneExtrasPricing[extra as keyof typeof calzoneExtrasPricing];
        if (extraPricing) {
          totalExtrasPrice += extraPricing[calzoneSizeName] || 0.75;
        } else {
          totalExtrasPrice += 0.75;
        }
      });
    } else {
      const normalizedSizeName = getSizePrice(item.selectedSize.name);
      item.selectedExtras.forEach(extra => {
        const extraPricing = pizzaExtrasPricing[extra as keyof typeof pizzaExtrasPricing];
        if (extraPricing) {
          totalExtrasPrice += extraPricing[normalizedSizeName] || this.EXTRA_PRICE;
        } else {
          totalExtrasPrice += this.EXTRA_PRICE;
        }
      });
    }

    return totalExtrasPrice;
  }

  static calculateSaucePrice(item: OrderItem): number {
    let saucePrice = 0;

    if (item.menuItem.isPizza && item.selectedPizzaSauces && item.selectedPizzaSauces.length > 1) {
      saucePrice = (item.selectedPizzaSauces.length - 1) * 1.00;
    }

    if (item.menuItem.isCalzone && item.selectedCalzoneSauces && item.selectedCalzoneSauces.length > 1) {
      saucePrice = (item.selectedCalzoneSauces.length - 1) * 1.00;
    }

    return saucePrice;
  }

  static calculateItemPrice(item: OrderItem): number {
    return this.calculateItemBasePrice(item) + this.calculateExtrasPrice(item) + this.calculateSaucePrice(item);
  }

  static calculateItemTotal(item: OrderItem): number {
    return this.calculateItemPrice(item) * item.quantity;
  }

  static calculateCartSubtotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + this.calculateItemTotal(item), 0);
  }

  static calculatePfand(items: OrderItem[]): number {
    return items.reduce((sum, item) => {
      if (item.menuItem.pfand) {
        return sum + (item.menuItem.pfand * item.quantity);
      }
      return sum;
    }, 0);
  }

  static formatPrice(price: number): string {
    return price.toFixed(2).replace('.', ',') + ' €';
  }

  static formatPriceWithoutSymbol(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }
}
