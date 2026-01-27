import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './cart.store';
import { OrderItem } from '../types';

describe('Cart Store', () => {
    beforeEach(() => {
        useCartStore.getState().clearCart();
    });

    const mockItem: Omit<OrderItem, 'cartItemId' | 'quantity'> = {
        menuItem: {
            id: 1,
            name: 'Test Pizza',
            price: 10,
            number: '1'
        },
        basePrice: 10,
        totalPrice: 10
    };

    it('should start with an empty cart', () => {
        const state = useCartStore.getState();
        expect(state.items).toHaveLength(0);
    });

    it('should add an item to the cart', () => {
        useCartStore.getState().addItem(mockItem);

        const state = useCartStore.getState();
        expect(state.items).toHaveLength(1);
        expect(state.items[0].menuItem.name).toBe('Test Pizza');
        expect(state.items[0].quantity).toBe(1);
    });

    it('should increment quantity when adding the same item provided it has same customizations', () => {
        useCartStore.getState().addItem(mockItem);
        useCartStore.getState().addItem(mockItem); // Same item

        const state = useCartStore.getState();
        expect(state.items).toHaveLength(1);
        expect(state.items[0].quantity).toBe(2);
    });

    it('should remove an item from the cart', () => {
        useCartStore.getState().addItem(mockItem);
        const cartItemId = useCartStore.getState().items[0].cartItemId;

        useCartStore.getState().removeItem(cartItemId);

        const state = useCartStore.getState();
        expect(state.items).toHaveLength(0);
    });

    it('should update item quantity', () => {
        useCartStore.getState().addItem(mockItem);
        const cartItemId = useCartStore.getState().items[0].cartItemId;

        useCartStore.getState().updateQuantity(cartItemId, 5);

        const state = useCartStore.getState();
        expect(state.items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is updated to 0', () => {
        useCartStore.getState().addItem(mockItem);
        const cartItemId = useCartStore.getState().items[0].cartItemId;

        useCartStore.getState().updateQuantity(cartItemId, 0);

        const state = useCartStore.getState();
        expect(state.items).toHaveLength(0);
    });

    it('should clear the cart', () => {
        useCartStore.getState().addItem(mockItem);
        useCartStore.getState().clearCart();

        const state = useCartStore.getState();
        expect(state.items).toHaveLength(0);
    });
});
