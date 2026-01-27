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
  selectedSize: { name: string; description?: string; price: number } | undefined;
  selectedIngredients: string[] | undefined;
  selectedExtras: string[] | undefined;
  selectedPastaType: string | undefined;
  selectedSauce: string | undefined;
  selectedExclusions: string[] | undefined;
  selectedSideDish: string | undefined;
  totalPrice: number;
}

export class OrderTransformer {
  static transformCartItemToFirebaseItem(item: CartItem): FirebaseOrderItem {
    const basePrice = item.selectedSize ? item.selectedSize.price : item.menuItem.price;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      } : undefined,
      selectedIngredients: item.selectedIngredients || undefined,
      selectedExtras: item.selectedExtras || undefined,
      selectedPastaType: item.selectedPastaType || undefined,
      selectedSauce: item.selectedSauce || undefined,
      selectedExclusions: item.selectedExclusions || undefined,
      selectedSideDish: item.selectedSideDish || undefined,
      totalPrice
    };
  }

  static transformCartItems(items: CartItem[]): FirebaseOrderItem[] {
    return items.map(item => this.transformCartItemToFirebaseItem(item));
  }
}
