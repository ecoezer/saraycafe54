/**
 * Item flow configuration - defines the step sequence and behavior for each item type.
 * This replaces the scattered if/else logic in ItemModal.tsx.
 */

export type ModalStep =
    | 'meat' | 'sauce' | 'extras' | 'exclusions' | 'sidedish' | 'saucetype'
    | 'burgerSalad' | 'burgerSauce' | 'burgerExtras'
    | 'pizzaSize' | 'pizzaExtras' | 'pizzaSauce'
    | 'calzoneSize' | 'calzoneExtras' | 'calzoneSauce'
    | 'complete';

export interface StepConfig {
    id: ModalStep;
    label: string;
    shortLabel: string;
    nextButtonText: string;
    backStep?: ModalStep;
}

export interface ItemFlow {
    steps: StepConfig[];
    getInitialStep: () => ModalStep;
}

// Pizza flow: Size -> Extras -> Sauce
export const PIZZA_FLOW: ItemFlow = {
    steps: [
        { id: 'pizzaSize', label: 'Größe', shortLabel: 'G', nextButtonText: 'Weiter zur Extra-Auswahl' },
        { id: 'pizzaExtras', label: 'Extras', shortLabel: 'E', nextButtonText: 'Weiter zur Soßenauswahl', backStep: 'pizzaSize' },
        { id: 'pizzaSauce', label: 'Soße', shortLabel: 'S', nextButtonText: 'Hinzufügen', backStep: 'pizzaExtras' }
    ],
    getInitialStep: () => 'pizzaSize'
};

// Calzone flow: Size -> Extras -> Sauce
export const CALZONE_FLOW: ItemFlow = {
    steps: [
        { id: 'calzoneSize', label: 'Größe', shortLabel: 'G', nextButtonText: 'Weiter zur Extra-Auswahl' },
        { id: 'calzoneExtras', label: 'Extras', shortLabel: 'E', nextButtonText: 'Weiter zur Soßenauswahl', backStep: 'calzoneSize' },
        { id: 'calzoneSauce', label: 'Soße', shortLabel: 'S', nextButtonText: 'Hinzufügen', backStep: 'calzoneExtras' }
    ],
    getInitialStep: () => 'calzoneSize'
};

// Doner flow: Meat -> Sauce -> Exclusions -> Extras
export const DONER_FLOW: ItemFlow = {
    steps: [
        { id: 'meat', label: 'Fleisch', shortLabel: 'F', nextButtonText: 'Weiter zur Soßenauswahl' },
        { id: 'sauce', label: 'Soße', shortLabel: 'S', nextButtonText: 'Weiter zur Salat-Anpassung', backStep: 'meat' },
        { id: 'exclusions', label: 'Salat', shortLabel: 'L', nextButtonText: 'Weiter zur Extra-Auswahl', backStep: 'sauce' },
        { id: 'extras', label: 'Extras', shortLabel: 'E', nextButtonText: 'Hinzufügen', backStep: 'exclusions' }
    ],
    getInitialStep: () => 'meat'
};

// Doner teller flow: Adds side dish step
export const DONER_TELLER_FLOW: ItemFlow = {
    steps: [
        ...DONER_FLOW.steps.slice(0, -1),
        { id: 'extras', label: 'Extras', shortLabel: 'E', nextButtonText: 'Weiter zur Beilagenauswahl', backStep: 'exclusions' },
        { id: 'sidedish', label: 'Beilage', shortLabel: 'B', nextButtonText: 'Hinzufügen', backStep: 'extras' }
    ],
    getInitialStep: () => 'meat'
};

// Burger flow: Salad -> Sauce -> Extras
export const BURGER_FLOW: ItemFlow = {
    steps: [
        { id: 'burgerSalad', label: 'Salat', shortLabel: 'L', nextButtonText: 'Weiter zur Soßenauswahl' },
        { id: 'burgerSauce', label: 'Soße', shortLabel: 'S', nextButtonText: 'Weiter zur Extra-Auswahl', backStep: 'burgerSalad' },
        { id: 'burgerExtras', label: 'Extras', shortLabel: 'E', nextButtonText: 'Hinzufügen', backStep: 'burgerSauce' }
    ],
    getInitialStep: () => 'burgerSalad'
};

// Sauce bottle flow: Just sauce type selection
export const SAUCE_BOTTLE_FLOW: ItemFlow = {
    steps: [
        { id: 'saucetype', label: 'Soße', shortLabel: 'S', nextButtonText: 'Weiter zur Größenauswahl' },
        { id: 'complete', label: 'Größe', shortLabel: 'G', nextButtonText: 'Hinzufügen', backStep: 'saucetype' }
    ],
    getInitialStep: () => 'saucetype'
};

// Item 88 special flow: Sauce -> Exclusions (no meat, no extras)
export const ITEM_88_FLOW: ItemFlow = {
    steps: [
        { id: 'sauce', label: 'Soße', shortLabel: 'S', nextButtonText: 'Weiter zur Salat-Anpassung' },
        { id: 'exclusions', label: 'Salat', shortLabel: 'L', nextButtonText: 'Hinzufügen', backStep: 'sauce' }
    ],
    getInitialStep: () => 'sauce'
};

// Simple item flow: Direct add
export const SIMPLE_FLOW: ItemFlow = {
    steps: [
        { id: 'complete', label: 'Fertig', shortLabel: 'F', nextButtonText: 'Hinzufügen' }
    ],
    getInitialStep: () => 'complete'
};

/**
 * Get the appropriate flow for an item based on its properties.
 */
export function getItemFlow(item: {
    isPizza?: boolean;
    isCalzone?: boolean;
    isBurger?: boolean;
    isMeatSelection?: boolean;
    isSauceSelection?: boolean;
    number?: number | string;
}): ItemFlow {
    if (item.isPizza) return PIZZA_FLOW;
    if (item.isCalzone) return CALZONE_FLOW;
    if (item.isBurger) return BURGER_FLOW;
    if (item.isSauceSelection) return SAUCE_BOTTLE_FLOW;

    if (item.isMeatSelection) {
        // Item 88 has special flow
        if (item.number === 88) return ITEM_88_FLOW;
        // Items 9 and 10 have side dish selection
        if (item.number === 9 || item.number === 10) return DONER_TELLER_FLOW;
        return DONER_FLOW;
    }

    return SIMPLE_FLOW;
}

/**
 * Get the next step in the flow.
 */
export function getNextStep(flow: ItemFlow, currentStep: ModalStep): ModalStep | null {
    const currentIndex = flow.steps.findIndex(s => s.id === currentStep);
    if (currentIndex < 0 || currentIndex >= flow.steps.length - 1) return null;
    return flow.steps[currentIndex + 1].id;
}

/**
 * Get the previous step in the flow.
 */
export function getPreviousStep(flow: ItemFlow, currentStep: ModalStep): ModalStep | null {
    const current = flow.steps.find(s => s.id === currentStep);
    return current?.backStep || null;
}
