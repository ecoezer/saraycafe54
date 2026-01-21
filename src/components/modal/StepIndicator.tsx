import React from 'react';

interface StepIndicatorProps {
  currentStep: 'meat' | 'sauce' | 'exclusions' | 'sidedish' | 'complete';
  showSideDish: boolean;
}

interface StepConfig {
  number: number;
  label: string;
  labelShort: string;
  key: 'meat' | 'sauce' | 'exclusions' | 'sidedish';
}

const STEPS: StepConfig[] = [
  { number: 1, label: 'Fleisch', labelShort: 'F', key: 'meat' },
  { number: 2, label: 'Soße', labelShort: 'S', key: 'sauce' },
  { number: 3, label: 'Salat', labelShort: 'Sa', key: 'exclusions' }
];

const SIDE_DISH_STEP: StepConfig = { number: 4, label: 'Beilage', labelShort: 'B', key: 'sidedish' };

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, showSideDish }) => {
  const steps = showSideDish ? [...STEPS, SIDE_DISH_STEP] : STEPS;

  const isStepActive = (stepKey: string): boolean => currentStep === stepKey;

  const isStepCompleted = (index: number): boolean => {
    const currentIndex = steps.findIndex(s => s.key === currentStep);
    return index < currentIndex;
  };

  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
      {steps.map((step, index) => (
        <React.Fragment key={step.key}>
          {index > 0 && (
            <div className={`w-4 h-px ${isStepCompleted(index) || isStepActive(step.key) ? 'bg-light-blue-400' : 'bg-gray-300'}`} />
          )}
          <div className={`flex items-center space-x-1 ${isStepActive(step.key) ? 'text-light-blue-600' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
              isStepActive(step.key) ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
            }`}>
              {step.number}
            </div>
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">{step.label}</span>
            <span className="text-xs font-medium sm:hidden">{step.labelShort}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default React.memo(StepIndicator);
