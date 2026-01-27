import React, { memo } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { PriceService } from '../../services/PriceService';

import { OrderItem } from '../../types';

interface CartItemProps {
    item: OrderItem;
    onQuantityChange: (item: OrderItem, newQuantity: number) => void;
    onRemove: (item: OrderItem) => void;
    calculateItemPrice: (item: OrderItem) => number;
}

/**
 * Displays a single item in the cart with quantity controls and customization details.
 */
const CartItem: React.FC<CartItemProps> = memo(({
    item,
    onQuantityChange,
    onRemove,
    calculateItemPrice
}) => {
    const totalPrice = calculateItemPrice(item) * item.quantity;

    // Calculate extras price for display
    const getExtrasPrice = () => {
        if (!item.selectedExtras || item.selectedExtras.length === 0) return 0;
        const priceServiceItem = {
            menuItem: item.menuItem,
            quantity: item.quantity,
            selectedSize: item.selectedSize ? {
                name: item.selectedSize.name,
                price: item.selectedSize.price
            } : undefined,
            selectedExtras: item.selectedExtras
        };
        return PriceService.calculateExtrasPrice(priceServiceItem);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="space-y-3">
                {/* Item Name */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm leading-tight">
                        Nr. {item.menuItem.number} {item.menuItem.name}
                    </h4>
                </div>

                {/* Customization Details */}
                <div className="space-y-1.5">
                    {item.selectedSize && (
                        <div className="text-xs text-gray-600">
                            {item.selectedSize.name}
                        </div>
                    )}

                    {item.selectedPastaType && (
                        <div className="text-xs text-gray-600">
                            Pasta: {item.selectedPastaType}
                        </div>
                    )}

                    {item.selectedSauce && (
                        <div className="text-xs text-gray-600">
                            Sauce: {item.selectedSauce}
                        </div>
                    )}

                    {/* Pizza Sauces */}
                    {item.selectedPizzaSauces && item.selectedPizzaSauces.length > 0 && (
                        <div className="text-xs text-gray-600">
                            Soße: {item.selectedPizzaSauces.map((sauce, idx) => (
                                <span key={idx}>
                                    {sauce}
                                    {idx === 0 && item.selectedPizzaSauces!.length > 1 && (
                                        <span className="text-green-600"> (kostenlos)</span>
                                    )}
                                    {idx > 0 && <span className="text-gray-500"> (+1,00€)</span>}
                                    {idx < item.selectedPizzaSauces!.length - 1 && ', '}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Calzone Sauces */}
                    {item.selectedCalzoneSauces && item.selectedCalzoneSauces.length > 0 && (
                        <div className="text-xs text-gray-600">
                            Soße: {item.selectedCalzoneSauces.map((sauce, idx) => (
                                <span key={idx}>
                                    {sauce}
                                    {idx === 0 && item.selectedCalzoneSauces!.length > 1 && (
                                        <span className="text-green-600"> (kostenlos)</span>
                                    )}
                                    {idx > 0 && <span className="text-gray-500"> (+1,00€)</span>}
                                    {idx < item.selectedCalzoneSauces!.length - 1 && ', '}
                                </span>
                            ))}
                        </div>
                    )}

                    {item.selectedExclusions && item.selectedExclusions.length > 0 && (
                        <div className="text-xs text-gray-600">
                            Salat: {item.selectedExclusions.join(', ')}
                        </div>
                    )}

                    {item.selectedSideDish && (
                        <div className="text-xs text-gray-600">
                            Beilage: {item.selectedSideDish}
                        </div>
                    )}

                    {item.selectedIngredients && item.selectedIngredients.length > 0 && (
                        <div className="text-xs text-gray-600">
                            Zutaten: {item.selectedIngredients.join(', ')}
                        </div>
                    )}

                    {item.selectedExtras && item.selectedExtras.length > 0 && (
                        <div className="text-xs text-gray-600">
                            Extras: {item.selectedExtras.join(', ')} (+{getExtrasPrice().toFixed(2).replace('.', ',')}€)
                        </div>
                    )}
                </div>

                {/* Price and Quantity Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="text-base font-semibold text-gray-900">
                        {totalPrice.toFixed(2).replace('.', ',')} €
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                                onClick={() => onQuantityChange(item, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                aria-label="Menge verringern"
                            >
                                <Minus className="w-4 h-4 text-gray-600" />
                            </button>

                            <span className="w-8 text-center text-sm font-medium text-gray-900">
                                {item.quantity}
                            </span>

                            <button
                                onClick={() => onQuantityChange(item, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                aria-label="Menge erhöhen"
                            >
                                <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>

                        {/* Remove Button */}
                        <button
                            onClick={() => onRemove(item)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Artikel entfernen"
                        >
                            <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

CartItem.displayName = 'CartItem';

export default CartItem;
