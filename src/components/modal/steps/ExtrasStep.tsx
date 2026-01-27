import React, { memo } from 'react';

interface Extra {
    name: string;
    price: number;
}

interface ExtrasStepProps {
    extras: string[] | Extra[];
    selectedExtras: string[];
    onToggleExtra: (extra: string) => void;
    pricePerExtra?: number; // For simple pricing
    getPriceForExtra?: (extra: string) => number; // For dynamic pricing
    title?: string;
    description?: string;
}

/**
 * Extras selection step - reusable for pizza, calzone, burger, etc.
 * Supports both simple pricing (fixed per extra) and dynamic pricing.
 */
const ExtrasStep: React.FC<ExtrasStepProps> = memo(({
    extras,
    selectedExtras,
    onToggleExtra,
    pricePerExtra,
    getPriceForExtra,
    title = 'Extras wählen',
    description = 'Optional - Extras hinzufügen'
}) => {
    const getExtraName = (extra: string | Extra): string => {
        return typeof extra === 'string' ? extra : extra.name;
    };

    const getExtraPrice = (extra: string | Extra): number => {
        if (typeof extra !== 'string') return extra.price;
        if (getPriceForExtra) return getPriceForExtra(extra);
        return pricePerExtra || 1.00;
    };

    const totalExtrasPrice = selectedExtras.reduce((sum, extraName) => {
        const extra = extras.find(e => getExtraName(e) === extraName);
        return sum + (extra ? getExtraPrice(extra) : pricePerExtra || 1.00);
    }, 0);

    return (
        <div className="p-4 space-y-4">
            <div className="text-sm text-gray-600 mb-2">
                {description}
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto">
                {extras.map((extra) => {
                    const name = getExtraName(extra);
                    const price = getExtraPrice(extra);
                    const isSelected = selectedExtras.includes(name);

                    return (
                        <button
                            key={name}
                            onClick={() => onToggleExtra(name)}
                            className={`p-3 rounded-lg border-2 text-sm transition-all text-left ${isSelected
                                    ? 'border-light-blue-400 bg-light-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-900">{name}</span>
                                <span className="text-gray-600">
                                    +{price.toFixed(2).replace('.', ',')}€
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {selectedExtras.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg flex justify-between">
                    <span className="text-sm text-gray-600">
                        {selectedExtras.length} Extra{selectedExtras.length > 1 ? 's' : ''} ausgewählt
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                        +{totalExtrasPrice.toFixed(2).replace('.', ',')} €
                    </span>
                </div>
            )}
        </div>
    );
});

ExtrasStep.displayName = 'ExtrasStep';

export default ExtrasStep;
