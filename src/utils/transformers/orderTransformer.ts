import { MenuItem, PizzaSize } from '../../types';
import { PriceService } from '../../services/PriceService';

interface CartItem {
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

interface FirebaseOrderItem {
  menuItemId: number;
  menuItemNumber: string | number;
  name: string;
  quantity: number;
  basePrice: number;
  selectedSize: { name: string; description?: string; price: number } | null;
  selectedIngredients: string[] | null;
  selectedExtras: string[] | null;
  selectedPastaType: string | null;
  selectedSauce: string | null;
  selectedExclusions: string[] | null;
  selectedSideDish: string | null;
  totalPrice: number;
}

export class OrderTransformer {
  static transformCartItemToFirebaseItem(item: CartItem): FirebaseOrderItem {
    const basePrice = item.selectedSize ? item.selectedSize.price : item.menuItem.price;
    const totalPrice = PriceService.calculateItemTotal(item as any);

    return {
      menuItemId: item.menuItem.id,
      menuItemNumber: item.menuItem.number,
      name: item.menuItem.name,
      quantity: item.quantity,
      basePrice,
      selectedSize: item.selectedSize ? {
        name: item.selectedSize.name,
        description: item.selectedSize.description,
        price: item.selectedSize.price
      } : null,
      selectedIngredients: item.selectedIngredients || null,
      selectedExtras: item.selectedExtras || null,
      selectedPastaType: item.selectedPastaType || null,
      selectedSauce: item.selectedSauce || null,
      selectedExclusions: item.selectedExclusions || null,
      selectedSideDish: item.selectedSideDish || null,
      totalPrice
    };
  }

  static transformCartItems(items: CartItem[]): FirebaseOrderItem[] {
    return items.map(item => this.transformCartItemToFirebaseItem(item));
  }
}
