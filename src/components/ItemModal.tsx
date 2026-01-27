import React from 'react';
import { X } from 'lucide-react';
import { MenuItem, OrderItem } from '../types';
import { useItemModal } from '../hooks/useItemModal';
import { getItemFlow } from '../constants/itemFlows';
import GenericStepIndicator from './modal/GenericStepIndicator';
import { SizeStep, SauceStep, ExtrasStep } from './modal/steps';
import {
  pizzaExtras,
  calzoneExtras,
  donerExtras,
  burgerExtras,
  sauceTypes,
  drehspiessaSauceTypes,
  saladExclusionOptions,
  sideDishOptions
} from '../data/menuItems';
import { calculateExtraPrice } from '../constants/pricing';

interface ItemModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToOrder: (item: Omit<OrderItem, 'cartItemId' | 'quantity'>) => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ item, isOpen, onClose, onAddToOrder }) => {
  const {
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
  } = useItemModal(item, isOpen);

  if (!isOpen) return null;

  const flow = getItemFlow(item);
  const currentStepConfig = flow.steps.find(s => s.id === currentStep);
  const isLastStep = !currentStepConfig?.nextButtonText.startsWith('Weiter');

  const handleAction = () => {
    if (isLastStep) {
      // Add to order
      onAddToOrder({
        menuItem: item,
        selectedSize: selections.size,
        selectedIngredients: [], // Ingredients not implemented in new flow yet? or removed?
        selectedExtras: selectedExtras,
        selectedPastaType: selections.pasta,
        selectedSauce: selectedSauces[0], // Legacy specific field
        selectedExclusions: selectedExclusions,
        selectedSideDish: selections.sideDish,
        selectedPizzaSauces: selectedSauces, // New field
        selectedCalzoneSauces: [] // Add if needed
      });
      onClose();
    } else {
      goToNextStep();
    }
  };

  const getSauceOptions = () => {
    if (item.isPizza || item.isCalzone) return [...sauceTypes];
    if (item.isMeatSelection || item.isFalafel) return [...drehspiessaSauceTypes];
    return [...sauceTypes];
  };

  const getExtrasOptions = () => {
    if (item.isPizza) return [...pizzaExtras];
    if (item.isCalzone) return [...calzoneExtras];
    if (item.isBurger) return burgerExtras.map(e => e.name); // Using simple strings for now
    if (item.isMeatSelection) return [...donerExtras];
    return [];
  };

  // Determine current content to render based on step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'pizzaSize':
      case 'calzoneSize':
        return (
          <SizeStep
            sizes={item.sizes || []}
            selectedSize={selections.size}
            onSelectSize={(size) => updateSelection('size', size)}
            itemName={item.name}
            itemNumber={item.number}
          />
        );

      case 'pizzaSauce':
      case 'calzoneSauce':
      case 'sauce':
      case 'saucetype':
      case 'burgerSauce':
        return (
          <SauceStep
            sauces={getSauceOptions()}
            selectedSauces={selectedSauces}
            onToggleSauce={toggleSauce}
            showPricing={item.isPizza || item.isCalzone} // Only charge for pizza sauces? Check logic.
          />
        );

      case 'pizzaExtras':
      case 'calzoneExtras':
      case 'extras':
      case 'burgerExtras':
        return (
          <ExtrasStep
            extras={getExtrasOptions()}
            selectedExtras={selectedExtras}
            onToggleExtra={toggleExtra}
            pricePerExtra={item.isPizza ? undefined : 1.00} // Pizza uses dynamic pricing
            // Need a way to pass dynamic pricing function for pizza
            getPriceForExtra={(extraName) => calculateExtraPrice(
              item.isPizza ? 'pizza' : item.isCalzone ? 'calzone' : 'standard',
              selections.size?.name,
              extraName
            )}
          />
        );

      case 'exclusions':
      case 'burgerSalad':
        return (
          <ExtrasStep
            title="Salat anpassen"
            description="Wählen Sie Zutaten ab, die Sie NICHT möchten"
            extras={[...saladExclusionOptions]}
            selectedExtras={selectedExclusions}
            onToggleExtra={toggleExclusion}
            pricePerExtra={0} // Free to remove
          />
        );

      case 'meat':
        return (
          <div className="p-4 space-y-4">
            <h3 className="font-medium">Fleisch wählen</h3>
            <div className="space-y-2">
              {['Kalbfleisch', 'Hähnchen', 'Gemischt'].map(meat => (
                <button
                  key={meat}
                  onClick={() => updateSelection('meat', meat)}
                  className={`w-full p-4 rounded-xl border-2 text-left ${selections.meat === meat ? 'border-light-blue-400 bg-light-blue-50' : 'border-gray-200'
                    }`}
                >
                  {meat}
                </button>
              ))}
            </div>
          </div>
        );

      case 'sidedish':
        return (
          <div className="p-4 space-y-4">
            <h3 className="font-medium">Beilage wählen</h3>
            <div className="space-y-2">
              {sideDishOptions.map(dish => (
                <button
                  key={dish}
                  onClick={() => updateSelection('sideDish', dish)}
                  className={`w-full p-4 rounded-xl border-2 text-left ${selections.sideDish === dish ? 'border-light-blue-400 bg-light-blue-50' : 'border-gray-200'
                    }`}
                >
                  {dish}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        // Fallback or 'complete' step for simple items
        return (
          <div className="p-6 text-center">
            <p className="text-lg font-medium text-gray-900">
              {item.name} hinzufügen?
            </p>
            {item.description && <p className="text-gray-500 mt-2">{item.description}</p>}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-light-blue-400 text-white p-3 rounded-t-3xl flex justify-between items-center z-10">
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              {currentStepConfig?.label || item.name}
            </h2>
            <p className="text-xs sm:text-sm opacity-90 mt-0.5">
              Nr. {item.number} {item.name} {selections.size ? `- ${selections.size.name}` : ''}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-light-blue-500 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Progress Indicator */}
          <div className="pt-4 px-4">
            <GenericStepIndicator item={item} currentStep={currentStep} />
          </div>

          {/* Main Content Render */}
          {renderStepContent()}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-white rounded-b-3xl">
          <button
            onClick={handleAction}
            className="w-full bg-light-blue-400 hover:bg-light-blue-500 text-white py-3.5 px-4 rounded-xl font-bold text-lg shadow-lg shadow-light-blue-200 transition-all flex items-center justify-center gap-2"
          >
            <span>{currentStepConfig?.nextButtonText || 'Hinzufügen'}</span>
            {isLastStep && (
              <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
                {totalPrice.toFixed(2).replace('.', ',')} €
              </span>
            )}
          </button>

          {/* Back button if applicable */}
          {currentStepConfig?.backStep && (
            <button
              onClick={goToPreviousStep}
              className="w-full mt-2 text-gray-500 text-sm font-medium py-2 hover:text-gray-700"
            >
              Zurück
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemModal;