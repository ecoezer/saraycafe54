import React, { memo } from 'react';
import { PizzaSize } from '../../types';

interface SizeStepProps {
    sizes: PizzaSize[];
    selectedSize?: PizzaSize;
    onSelectSize: (size: PizzaSize) => void;
    itemName: string;
    itemNumber: string | number;
}

/**
 * Size selection step for pizza and calzone items.
 * Displays available sizes with prices.
 */
const SizeStep: React.FC<SizeStepProps> = memo(({
    sizes,
    selectedSize,
    onSelectSize,
    itemName,
    itemNumber
}) => {
    return (
        <div className="p-4 space-y-4">
            <div className="text-sm text-gray-600 mb-4">
                Nr. {itemNumber} {itemName}
            </div>

            <div className="space-y-2">
                {sizes.map((size) => (
                    <button
                        key={size.name}
                        onClick={() => onSelectSize(size)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${selectedSize?.name === size.name
                                ? 'border-light-blue-400 bg-light-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="font-medium text-gray-900">{size.name}</span>
                                {size.description && (
                                    <span className="text-sm text-gray-500 ml-2">({size.description})</span>
                                )}
                            </div>
                            <span className="font-bold text-gray-900">
                                {size.price.toFixed(2).replace('.', ',')} €
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
});

SizeStep.displayName = 'SizeStep';

export default SizeStep;
