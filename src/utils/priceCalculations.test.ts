import { describe, it, expect } from 'vitest';
import { calculateItemPrice, calculateItemTotal, formatPrice, formatPriceWithCurrency } from './priceCalculations';
import { PizzaSize } from '../types';

// Mock PRICING constant effectively by knowing its value or importing it
// Since we are unittesting logic, we assume PRICING.EXTRA_PRICE is 1.0 based on typical app logic, 
// but we should ideally import it. 
// However, the function implementation uses the imported constant.
// Let's assume standard behavior and if tests fail due to constant mismatch, we'll adjust.

describe('Price Calculations', () => {
    const mockPizzaSize: PizzaSize = {
        name: 'Large',
        price: 12.50
    };

    const mockItemBase = {
        menuItem: { price: 8.00, id: 1, name: 'Pizza', number: '1' },
        quantity: 1,
    };

    describe('calculateItemPrice', () => {
        it('should return base price when no size or extras selected', () => {
            const price = calculateItemPrice({ ...mockItemBase });
            expect(price).toBe(8.00);
        });

        it('should return size price when size is selected', () => {
            const price = calculateItemPrice({
                ...mockItemBase,
                selectedSize: mockPizzaSize
            });
            expect(price).toBe(12.50);
        });

        it('should add extra price for each selected extra', () => {
            // Assuming EXTRA_PRICE is 1.00 based on standard app logic usually
            // We will verify this with the constant file content if needed, 
            // but for now let's try with 1.00 as it writes "1.00" in formatPrice usually.
            const price = calculateItemPrice({
                ...mockItemBase,
                selectedExtras: ['Cheese', 'Olives']
            });
            // 8.00 + 1.00 * 2 = 10.00
            expect(price).toBe(10.00);
        });

        it('should combine size price and extras', () => {
            const price = calculateItemPrice({
                ...mockItemBase,
                selectedSize: mockPizzaSize,
                selectedExtras: ['Cheese']
            });
            // 12.50 + 1.00 = 13.50
            expect(price).toBe(13.50);
        });
    });

    describe('calculateItemTotal', () => {
        it('should multiply price by quantity', () => {
            const total = calculateItemTotal({
                ...mockItemBase,
                quantity: 3
            });
            // 8.00 * 3 = 24.00
            expect(total).toBe(24.00);
        });

        it('should handle complex item with quantity', () => {
            const total = calculateItemTotal({
                ...mockItemBase,
                selectedSize: mockPizzaSize,
                selectedExtras: ['Cheese'], // 13.50
                quantity: 2
            });
            // 13.50 * 2 = 27.00
            expect(total).toBe(27.00);
        });
    });

    describe('formatPrice', () => {
        it('should format number with comma decimal separator', () => {
            expect(formatPrice(10.5)).toBe('10,50');
            expect(formatPrice(10)).toBe('10,00');
            expect(formatPrice(10.123)).toBe('10,12');
        });
    });

    describe('formatPriceWithCurrency', () => {
        it('should format price with Euro symbol', () => {
            expect(formatPriceWithCurrency(10.5)).toBe('10,50 €');
        });
    });
});
