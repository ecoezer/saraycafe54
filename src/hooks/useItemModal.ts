import { useState, useCallback, useMemo, useEffect } from 'react';
import { MenuItem, PizzaSize } from '../types';
import { getItemFlow, getNextStep, getPreviousStep, ModalStep } from '../constants/itemFlows';
import { useSauceSelection, useExtrasSelection, useExclusionSelection } from './useSelections';
import { calculateExtraPrice, calculateSaucePrice } from '../constants/pricing';
import { pastaTypes, sideDishOptions, granatapfelOptions } from '../data/menuItems';

interface Selections {
  size?: PizzaSize;
  pasta: string;
  meat: string;
  sideDish: string;
  granatapfel: string;
}

export const useItemModal = (item: MenuItem, isOpen: boolean) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>('complete');

  // Consolidated selection state
  const [selections, setSelections] = useState<Selections>({
    size: undefined,
    pasta: pastaTypes[0],
    meat: 'Kalbfleisch',
    sideDish: '',
    granatapfel: granatapfelOptions[1]
  });

  // Collection hooks
  const { selectedSauces, toggleSauce, clearSauces } = useSauceSelection({ maxSauces: 3 });
  const { selectedExtras, toggleExtra, clearExtras } = useExtrasSelection();
  const { selectedExclusions, toggleExclusion, clearExclusions } = useExclusionSelection();

  // Initialization
  useEffect(() => {
    if (isOpen) {
      const flow = getItemFlow(item);
      setCurrentStep(flow.getInitialStep());
      setSelections({
        size: item.sizes ? item.sizes[0] : undefined,
        pasta: item.isPasta ? pastaTypes[0] : '',
        meat: item.isMeatSelection ? 'Kalbfleisch' : '',
        sideDish: (item.number === 9 || item.number === 10) ? sideDishOptions[0] : '',
        granatapfel: granatapfelOptions[1]
      });
      clearSauces();
      clearExtras();
      clearExclusions();
    }
  }, [isOpen, item, clearSauces, clearExtras, clearExclusions]);

  // Price Calculation
  const totalPrice = useMemo(() => {
    let price = selections.size ? selections.size.price : item.price;

    selectedExtras.forEach(extra => {
      const type = item.isPizza ? 'pizza' : item.isCalzone ? 'calzone' : item.isBurger ? 'burger' : item.isMeatSelection ? 'doner' : 'standard';
      price += calculateExtraPrice(type, selections.size?.name, extra);
    });

    if ([78, 79, 564, 565, 566, 567, 568].includes(Number(item.number)) || item.isPizza || item.isCalzone || item.id === 88) {
      price += calculateSaucePrice(selectedSauces);
    }

    return price;
  }, [item, selections.size, selectedExtras, selectedSauces]);

  // Navigation
  const goToNextStep = useCallback(() => {
    const next = getNextStep(getItemFlow(item), currentStep);

    // Validation
    if (currentStep === 'meat' && !selections.meat) return;
    if ((currentStep === 'pizzaSize' || currentStep === 'calzoneSize') && !selections.size) return;

    if (next) setCurrentStep(next);
    return next;
  }, [item, currentStep, selections.meat, selections.size]);

  const goToPreviousStep = useCallback(() => {
    const prev = getPreviousStep(getItemFlow(item), currentStep);
    if (prev) setCurrentStep(prev);
  }, [item, currentStep]);

  // Generic update helper
  const updateSelection = useCallback((key: keyof Selections, value: any) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    currentStep,
    selections,
    updateSelection,
    selectedSauces,
    toggleSauce,
    selectedExtras,
    toggleExtra,
    selectedExclusions,
    toggleExclusion,
    totalPrice,
    goToNextStep,
    goToPreviousStep
  };
};
