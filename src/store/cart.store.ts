import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem, OrderItem } from '../types';

interface CartState {
  items: OrderItem[];
  addItem: (item: Omit<OrderItem, 'cartItemId' | 'quantity'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
}

// Helper: Generate a unique signature for the item options to group identical items
const generateItemSignature = (item: Omit<OrderItem, 'cartItemId' | 'quantity'>): string => {
  const parts = [
    item.menuItem.id,
    item.selectedSize?.name || 'default',
    (item.selectedIngredients || []).sort().join(','),
    (item.selectedExtras || []).sort().join(','),
    item.selectedPastaType || 'none',
    item.selectedSauce || 'none',
    (item.selectedExclusions || []).sort().join(','),
    item.selectedSideDish || 'none',
    (item.selectedPizzaSauces || []).sort().join(','),
    (item.selectedCalzoneSauces || []).sort().join(',')
  ];
  return parts.join('|');
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (newItemProps) =>
        set((state) => {
          const signature = generateItemSignature(newItemProps);

          // Check if identical item already exists
          const existingItemIndex = state.items.findIndex(
            (item) => generateItemSignature(item) === signature
          );

          if (existingItemIndex >= 0) {
            // Increment quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + 1,
            };
            return { items: updatedItems };
          }

          // Add new item
          const newItem: OrderItem = {
            ...newItemProps,
            cartItemId: crypto.randomUUID(), // Modern random ID
            quantity: 1,
          };

          return { items: [...state.items, newItem] };
        }),

      removeItem: (cartItemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        })),

      updateQuantity: (cartItemId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.cartItemId !== cartItemId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.cartItemId === cartItemId ? { ...item, quantity } : item
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'cart-storage' }
  )
);