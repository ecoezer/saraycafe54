import { useState, useCallback, useMemo } from 'react';
import { MenuItem, PizzaSize } from '../types';
import { ItemModalMachine, ModalStep, StepConfig } from '../machines/itemModalMachine';
import { pastaTypes, sideDishOptions } from '../data/menuItems';

export const useItemModal = (item: MenuItem) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>('meat');
  const [selectedSize, setSelectedSize] = useState<PizzaSize | undefined>(
    item.sizes ? item.sizes[0] : undefined
  );
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedPastaType, setSelectedPastaType] = useState<string>(
    item.isPasta ? pastaTypes[0] : ''
  );
  const [selectedSauce, setSelectedSauce] = useState<string>('');
  const [selectedMeatType, setSelectedMeatType] = useState<string>(
    item.isMeatSelection ? 'Kalbfleisch' : ''
  );
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
  const [selectedExclusions, setSelectedExclusions] = useState<string[]>([]);
  const [selectedSideDish, setSelectedSideDish] = useState<string>(
    (item.number === 9 || item.number === 10) ? sideDishOptions[0] : ''
  );
  const [showAllSauces, setShowAllSauces] = useState(false);
  const [showAllExclusions, setShowAllExclusions] = useState(false);

  const stepConfig: StepConfig = useMemo(() => ({
    requiresMeatSelection: !!item.isMeatSelection,
    requiresSauceSelection: !!item.isMeatSelection,
    requiresExclusionSelection: !!item.isMeatSelection,
    requiresSideDishSelection: (item.number === 9 || item.number === 10) && !!item.isMeatSelection
  }), [item.isMeatSelection, item.number]);

  const modalState = useMemo(() => ({
    currentStep,
    selectedMeatType,
    selectedSauces,
    selectedExclusions,
    selectedSideDish
  }), [currentStep, selectedMeatType, selectedSauces, selectedExclusions, selectedSideDish]);

  const canProceed = useMemo(() => {
    return ItemModalMachine.canProceed(currentStep, modalState, stepConfig);
  }, [currentStep, modalState, stepConfig]);

  const nextStep = useCallback(() => {
    const next = ItemModalMachine.getNextStep(currentStep, stepConfig);
    if (next && next !== 'complete') {
      setCurrentStep(next);
    }
    return next;
  }, [currentStep, stepConfig]);

  const previousStep = useCallback(() => {
    const prev = ItemModalMachine.getPreviousStep(currentStep, stepConfig);
    if (prev) {
      setCurrentStep(prev);
    }
  }, [currentStep, stepConfig]);

  const resetState = useCallback(() => {
    const initialStep = ItemModalMachine.getInitialStep(stepConfig);
    setCurrentStep(initialStep);
    setSelectedIngredients([]);
    setSelectedExtras([]);
    setSelectedSauces([]);
    setSelectedExclusions([]);
    setShowAllSauces(false);
    setShowAllExclusions(false);
  }, [stepConfig]);

  const getStepTitle = useCallback(() => {
    return ItemModalMachine.getStepTitle(currentStep, item.number as number);
  }, [currentStep, item.number]);

  const getButtonText = useCallback((price: number) => {
    return ItemModalMachine.getButtonText(currentStep, stepConfig, price);
  }, [currentStep, stepConfig]);

  return {
    currentStep,
    selectedSize,
    setSelectedSize,
    selectedIngredients,
    setSelectedIngredients,
    selectedExtras,
    setSelectedExtras,
    selectedPastaType,
    setSelectedPastaType,
    selectedSauce,
    setSelectedSauce,
    selectedMeatType,
    setSelectedMeatType,
    selectedSauces,
    setSelectedSauces,
    selectedExclusions,
    setSelectedExclusions,
    selectedSideDish,
    setSelectedSideDish,
    showAllSauces,
    setShowAllSauces,
    showAllExclusions,
    setShowAllExclusions,
    canProceed,
    nextStep,
    previousStep,
    resetState,
    getStepTitle,
    getButtonText,
    stepConfig
  };
};
