import React, { memo } from 'react';

interface OrderTypeSelectorProps {
    value: 'pickup' | 'delivery';
    onChange: (value: 'pickup' | 'delivery') => void;
}

/**
 * Selector for order type (pickup or delivery).
 * Uses semantic radio button styling with visual feedback.
 */
const OrderTypeSelector: React.FC<OrderTypeSelectorProps> = memo(({
    value,
    onChange
}) => {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
                Bestellart
            </label>
            <div className="grid grid-cols-2 gap-2">
                <label
                    className={`flex items-center justify-center cursor-pointer p-3 rounded-lg border-2 transition-all ${value === 'pickup'
                            ? 'border-light-blue-400 bg-light-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                >
                    <input
                        type="radio"
                        value="pickup"
                        checked={value === 'pickup'}
                        onChange={() => onChange('pickup')}
                        className="sr-only"
                    />
                    <span className="text-sm font-medium text-gray-900">Abholung</span>
                </label>
                <label
                    className={`flex items-center justify-center cursor-pointer p-3 rounded-lg border-2 transition-all ${value === 'delivery'
                            ? 'border-light-blue-400 bg-light-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                >
                    <input
                        type="radio"
                        value="delivery"
                        checked={value === 'delivery'}
                        onChange={() => onChange('delivery')}
                        className="sr-only"
                    />
                    <span className="text-sm font-medium text-gray-900">Lieferung</span>
                </label>
            </div>
        </div>
    );
});

OrderTypeSelector.displayName = 'OrderTypeSelector';

export default OrderTypeSelector;
