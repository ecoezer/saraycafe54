import React, { memo } from 'react';
import { DELIVERY_ZONES } from '../../constants/deliveryZones';

interface CartSummaryProps {
    subtotal: number;
    pfand: number;
    deliveryFee: number;
    total: number;
    orderType: 'pickup' | 'delivery';
    deliveryZone?: string;
    canOrder: boolean;
    minOrderMessage: string;
}

/**
 * Displays cart totals including subtotal, pfand, delivery fee, and total.
 * Shows minimum order progress bar for delivery orders.
 */
const CartSummary: React.FC<CartSummaryProps> = memo(({
    subtotal,
    pfand,
    deliveryFee,
    total,
    orderType,
    deliveryZone,
    canOrder,
    minOrderMessage
}) => {
    // Get zone info for progress bar
    const zone = deliveryZone ? DELIVERY_ZONES[deliveryZone as keyof typeof DELIVERY_ZONES] : null;
    const remaining = zone ? zone.minOrder - subtotal : 0;
    const progress = zone ? Math.min((subtotal / zone.minOrder) * 100, 100) : 0;

    return (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            {/* Minimum Order Progress Bar (for delivery) */}
            {orderType === 'delivery' && zone && (
                <div className="mb-3 space-y-2">
                    <div className="text-sm text-gray-700">
                        {remaining > 0 ? (
                            <>
                                Noch <span className="font-semibold">{remaining.toFixed(2).replace('.', ',')} €</span> bis der Mindestbestellwert erreicht ist
                            </>
                        ) : (
                            <span className="font-semibold text-green-700">✓ Mindestbestellwert erreicht</span>
                        )}
                    </div>
                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
                            style={{
                                width: `${progress}%`,
                                background: progress >= 100
                                    ? 'linear-gradient(90deg, #15803d 0%, #22c55e 100%)'
                                    : 'linear-gradient(90deg, #ea580c 0%, #f59e0b 50%, #eab308 100%)'
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Subtotal */}
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Zwischensumme</span>
                <span className="font-medium text-gray-900">
                    {subtotal.toFixed(2).replace('.', ',')} €
                </span>
            </div>

            {/* Pfand (deposit) */}
            {pfand > 0 && (
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Pfand kosten</span>
                    <span className="font-medium text-gray-900">
                        {pfand.toFixed(2).replace('.', ',')} €
                    </span>
                </div>
            )}

            {/* Delivery Fee */}
            {deliveryFee > 0 && (
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Liefergebühr</span>
                    <span className="font-medium text-gray-900">
                        {deliveryFee.toFixed(2).replace('.', ',')} €
                    </span>
                </div>
            )}

            {/* Total */}
            <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Gesamt</span>
                    <span className="text-lg font-semibold text-gray-900">
                        {total.toFixed(2).replace('.', ',')} €
                    </span>
                </div>
            </div>

            {/* Minimum Order Warning */}
            {!canOrder && minOrderMessage && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {minOrderMessage}
                </div>
            )}
        </div>
    );
});

CartSummary.displayName = 'CartSummary';

export default CartSummary;
