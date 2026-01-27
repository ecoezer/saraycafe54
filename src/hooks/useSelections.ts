import { useState, useCallback } from 'react';

interface UseSauceSelectionOptions {
    maxSauces?: number;
    noSauceLabel?: string;
}

interface UseSauceSelectionReturn {
    selectedSauces: string[];
    toggleSauce: (sauce: string) => void;
    clearSauces: () => void;
    setSauces: (sauces: string[]) => void;
}

/**
 * Generic hook for sauce selection logic.
 * Handles toggle behavior, "ohne Soße" exclusivity, and max sauce limits.
 * 
 * Used by: pizza, calzone, doner, and other items with sauce selection.
 */
export function useSauceSelection(
    options: UseSauceSelectionOptions = {}
): UseSauceSelectionReturn {
    const { maxSauces = 3, noSauceLabel = 'ohne Soße' } = options;
    const [selectedSauces, setSelectedSauces] = useState<string[]>([]);

    const toggleSauce = useCallback((sauce: string) => {
        setSelectedSauces(prev => {
            // Handle "no sauce" option - exclusive selection
            if (sauce === noSauceLabel) {
                return prev.includes(sauce) ? [] : [noSauceLabel];
            }

            // Remove "no sauce" if selecting a specific sauce
            const withoutNoSauce = prev.filter(s => s !== noSauceLabel);

            // Toggle the sauce
            if (withoutNoSauce.includes(sauce)) {
                return withoutNoSauce.filter(s => s !== sauce);
            }

            // Check max limit
            if (withoutNoSauce.length >= maxSauces) {
                return withoutNoSauce;
            }

            return [...withoutNoSauce, sauce];
        });
    }, [maxSauces, noSauceLabel]);

    const clearSauces = useCallback(() => {
        setSelectedSauces([]);
    }, []);

    const setSauces = useCallback((sauces: string[]) => {
        setSelectedSauces(sauces);
    }, []);

    return {
        selectedSauces,
        toggleSauce,
        clearSauces,
        setSauces
    };
}

/**
 * Generic hook for extras/toppings toggle.
 * Simple add/remove behavior without limits.
 */
export function useExtrasSelection(initialExtras: string[] = []) {
    const [selectedExtras, setSelectedExtras] = useState<string[]>(initialExtras);

    const toggleExtra = useCallback((extra: string) => {
        setSelectedExtras(prev =>
            prev.includes(extra)
                ? prev.filter(e => e !== extra)
                : [...prev, extra]
        );
    }, []);

    const clearExtras = useCallback(() => {
        setSelectedExtras([]);
    }, []);

    return {
        selectedExtras,
        toggleExtra,
        clearExtras,
        setExtras: setSelectedExtras
    };
}

/**
 * Hook for exclusion selection with special "Ohne Beilagen" behavior.
 */
export function useExclusionSelection() {
    const [selectedExclusions, setSelectedExclusions] = useState<string[]>([]);
    const OHNE_BEILAGEN = 'Ohne Beilagen bzw. Salate';

    const toggleExclusion = useCallback((exclusion: string) => {
        setSelectedExclusions(prev => {
            // If selecting "Ohne Beilagen", clear all other selections
            if (exclusion === OHNE_BEILAGEN) {
                return prev.includes(exclusion) ? [] : [exclusion];
            }

            // Remove "Ohne Beilagen" when selecting specific exclusions
            const filtered = prev.filter(e => e !== OHNE_BEILAGEN);

            if (filtered.includes(exclusion)) {
                return filtered.filter(e => e !== exclusion);
            }

            return [...filtered, exclusion];
        });
    }, []);

    const clearExclusions = useCallback(() => {
        setSelectedExclusions([]);
    }, []);

    return {
        selectedExclusions,
        toggleExclusion,
        clearExclusions,
        setExclusions: setSelectedExclusions
    };
}
