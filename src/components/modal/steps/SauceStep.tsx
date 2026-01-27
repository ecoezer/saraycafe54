import React, { memo } from 'react';

interface SauceStepProps {
    sauces: string[];
    selectedSauces: string[];
    onToggleSauce: (sauce: string) => void;
    maxSauces?: number;
    showPricing?: boolean; // Show (kostenlos) for first sauce, (+1,00€) for additional
    title?: string;
}

/**
 * Sauce selection step - reusable for pizza, calzone, doner, etc.
 * Supports multiple sauce selection with pricing display.
 */
const SauceStep: React.FC<SauceStepProps> = memo(({
    sauces,
    selectedSauces,
    onToggleSauce,
    maxSauces = 3,
    showPricing = true,
    title = 'Soße wählen'
}) => {
    const getSauceLabel = (sauce: string, index: number) => {
        if (!showPricing) return sauce;

        const selectedIndex = selectedSauces.indexOf(sauce);
        if (selectedIndex === 0) {
            return `${sauce} (kostenlos)`;
        } else if (selectedIndex > 0) {
            return `${sauce} (+1,00€)`;
        }
        return sauce;
    };

    return (
        <div className="p-4 space-y-4">
            <div className="text-sm text-gray-600 mb-2">
                Wählen Sie bis zu {maxSauces} Soßen (erste kostenlos)
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto">
                {sauces.map((sauce, index) => {
                    const isSelected = selectedSauces.includes(sauce);
                    const isDisabled = !isSelected && selectedSauces.length >= maxSauces && sauce !== 'ohne Soße';

                    return (
                        <button
                            key={sauce}
                            onClick={() => onToggleSauce(sauce)}
                            disabled={isDisabled}
                            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${isSelected
                                    ? 'border-light-blue-400 bg-light-blue-50 text-light-blue-700'
                                    : isDisabled
                                        ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                }`}
                        >
                            {showPricing && isSelected ? getSauceLabel(sauce, index) : sauce}
                        </button>
                    );
                })}
            </div>

            {selectedSauces.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Ausgewählt: </span>
                    <span className="text-sm font-medium text-gray-900">
                        {selectedSauces.join(', ')}
                    </span>
                </div>
            )}
        </div>
    );
});

SauceStep.displayName = 'SauceStep';

export default SauceStep;
