export type ModalStep = 'meat' | 'sauce' | 'exclusions' | 'sidedish' | 'complete';

export interface ModalState {
  currentStep: ModalStep;
  selectedMeatType: string;
  selectedSauces: string[];
  selectedExclusions: string[];
  selectedSideDish: string;
}

export interface StepConfig {
  requiresMeatSelection: boolean;
  requiresSauceSelection: boolean;
  requiresExclusionSelection: boolean;
  requiresSideDishSelection: boolean;
}

export class ItemModalMachine {
  static getInitialStep(config: StepConfig): ModalStep {
    if (config.requiresMeatSelection) return 'meat';
    if (config.requiresSauceSelection) return 'sauce';
    if (config.requiresExclusionSelection) return 'exclusions';
    if (config.requiresSideDishSelection) return 'sidedish';
    return 'complete';
  }

  static getNextStep(currentStep: ModalStep, config: StepConfig): ModalStep | null {
    switch (currentStep) {
      case 'meat':
        if (config.requiresSauceSelection) return 'sauce';
        if (config.requiresExclusionSelection) return 'exclusions';
        if (config.requiresSideDishSelection) return 'sidedish';
        return 'complete';

      case 'sauce':
        if (config.requiresExclusionSelection) return 'exclusions';
        if (config.requiresSideDishSelection) return 'sidedish';
        return 'complete';

      case 'exclusions':
        if (config.requiresSideDishSelection) return 'sidedish';
        return 'complete';

      case 'sidedish':
        return 'complete';

      default:
        return null;
    }
  }

  static getPreviousStep(currentStep: ModalStep, config: StepConfig): ModalStep | null {
    switch (currentStep) {
      case 'sauce':
        if (config.requiresMeatSelection) return 'meat';
        return null;

      case 'exclusions':
        if (config.requiresSauceSelection) return 'sauce';
        if (config.requiresMeatSelection) return 'meat';
        return null;

      case 'sidedish':
        if (config.requiresExclusionSelection) return 'exclusions';
        if (config.requiresSauceSelection) return 'sauce';
        if (config.requiresMeatSelection) return 'meat';
        return null;

      default:
        return null;
    }
  }

  static canProceed(currentStep: ModalStep, state: ModalState, config: StepConfig): boolean {
    switch (currentStep) {
      case 'meat':
        return config.requiresMeatSelection ? !!state.selectedMeatType : true;

      case 'sauce':
        return true;

      case 'exclusions':
        return true;

      case 'sidedish':
        return config.requiresSideDishSelection ? !!state.selectedSideDish : true;

      default:
        return true;
    }
  }

  static getStepTitle(step: ModalStep, itemNumber: number): string {
    const stepTitles: Record<ModalStep, string> = {
      meat: 'Schritt 1: Fleischauswahl',
      sauce: 'Schritt 2: Soßen wählen (mehrere möglich)',
      exclusions: 'Schritt 3: Salat anpassen (mehrere möglich)',
      sidedish: 'Schritt 4: Beilage wählen',
      complete: 'Auswahl abgeschlossen'
    };
    return stepTitles[step];
  }

  static getButtonText(currentStep: ModalStep, config: StepConfig, price: number): string {
    const nextStep = this.getNextStep(currentStep, config);

    if (nextStep === 'complete' || nextStep === null) {
      return `Hinzufügen - ${price.toFixed(2).replace('.', ',')} €`;
    }

    switch (nextStep) {
      case 'sauce':
        return 'Weiter zur Soßenauswahl';
      case 'exclusions':
        return 'Weiter zur Salat-Anpassung';
      case 'sidedish':
        return 'Weiter zur Beilagenauswahl';
      default:
        return `Hinzufügen - ${price.toFixed(2).replace('.', ',')} €`;
    }
  }
}
