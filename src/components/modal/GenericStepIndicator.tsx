import React, { memo, useMemo } from 'react';
import { MenuItem } from '../../types';
import { getItemFlow, ModalStep } from '../../constants/itemFlows';

interface GenericStepIndicatorProps {
    item: MenuItem;
    currentStep: ModalStep;
}

/**
 * Generic step indicator that automatically determines steps based on item type.
 * Uses itemFlows.ts configuration to avoid duplicate step indicator code.
 */
const GenericStepIndicator: React.FC<GenericStepIndicatorProps> = memo(({
    item,
    currentStep
}) => {
    const flow = useMemo(() => getItemFlow(item), [item]);
    const steps = flow.steps;

    // Don't show indicator for simple items with only one step
    if (steps.length <= 1) return null;

    const currentIndex = steps.findIndex(s => s.id === currentStep);

    return (
        <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
            {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isPast = index < currentIndex;
                const isActiveOrPast = isActive || isPast;

                return (
                    <React.Fragment key={step.id}>
                        {index > 0 && (
                            <div className={`w-4 h-px ${isActiveOrPast ? 'bg-light-blue-400' : 'bg-gray-300'}`} />
                        )}
                        <div className={`flex items-center space-x-1 ${isActive ? 'text-light-blue-600' : 'text-gray-400'}`}>
                            <div
                                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${isActiveOrPast ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                                    }`}
                            >
                                {index + 1}
                            </div>
                            <span className="text-xs sm:text-sm font-medium hidden sm:inline">{step.label}</span>
                            <span className="text-xs font-medium sm:hidden">{step.shortLabel}</span>
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
});

GenericStepIndicator.displayName = 'GenericStepIndicator';

export default GenericStepIndicator;
