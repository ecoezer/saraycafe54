import React, { useCallback } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { MenuItem, PizzaSize } from '../../types';

interface OrderConfirmationModalProps {
  item: MenuItem;
  isOpen: boolean;
  selectedSize?: PizzaSize;
  selectedIngredients?: string[];
  selectedExtras?: string[];
  selectedPastaType?: string;
  selectedSauce?: string;
  selectedPizzaSauces?: string[];
  selectedExclusions?: string[];
  selectedSideDish?: string;
  totalPrice: number;
  onConfirm: (quantity: number) => void;
  onCancel: () => void;
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  item,
  isOpen,
  selectedSize,
  selectedIngredients,
  selectedExtras,
  selectedPastaType,
  selectedSauce,
  selectedPizzaSauces,
  selectedExclusions,
  selectedSideDish,
  totalPrice,
  onConfirm,
  onCancel,
}) => {
  const handleConfirm = useCallback(() => {
    onConfirm(1);
  }, [onConfirm]);

  if (!isOpen) return null;

  const formatSauceDisplay = (sauce: string | undefined): string => {
    if (!sauce) return 'ohne Soße';
    return sauce;
  };

  const formatExclusionsDisplay = (exclusions: string[] | undefined): string => {
    if (!exclusions || exclusions.length === 0) return 'Keine Änderungen';
    return exclusions.join(', ');
  };

  const formatExtrasDisplay = (extras: string[] | undefined): string => {
    if (!extras || extras.length === 0) return 'Keine';
    return extras.join(', ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[55] flex items-center justify-center p-2 sm:p-4" style={{ pointerEvents: 'auto' }}>
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.3)]" style={{ pointerEvents: 'auto' }}>
        {/* Header */}
        <div className="sticky top-0 bg-light-blue-400 text-white p-3 rounded-t-3xl flex justify-between items-center">
          <div>
            <h2 className="text-base sm:text-lg font-bold">Bestellbestätigung</h2>
            <p className="text-xs sm:text-sm opacity-90 mt-0.5">
              Nr. {item.number} {item.name}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-light-blue-500 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Item Summary Section */}
          <div className="bg-light-blue-50 border-2 border-light-blue-200 rounded-lg p-3">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Zusammenfassung</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Artikel:</span>
                <span className="ml-2 font-medium text-gray-900">{item.name}</span>
              </div>

              {selectedSize && (
                <div>
                  <span className="text-gray-600">Größe:</span>
                  <span className="ml-2 font-medium text-gray-900">{selectedSize.name}</span>
                </div>
              )}

              {selectedPastaType && (
                <div>
                  <span className="text-gray-600">Nudelsorte:</span>
                  <span className="ml-2 font-medium text-gray-900">{selectedPastaType}</span>
                </div>
              )}

              {selectedIngredients && selectedIngredients.length > 0 && (
                <div>
                  <span className="text-gray-600">Zutaten:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {selectedIngredients.join(', ')}
                  </span>
                </div>
              )}

              {selectedSauce && (
                <div>
                  <span className="text-gray-600">Soße:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {formatSauceDisplay(selectedSauce)}
                  </span>
                </div>
              )}

              {selectedPizzaSauces && selectedPizzaSauces.length > 0 && (
                <div>
                  <span className="text-gray-600">Soße:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {selectedPizzaSauces.map((sauce, idx) => (
                      <span key={idx}>
                        {sauce}
                        {idx === 0 && selectedPizzaSauces.length > 1 && <span className="text-green-600 text-xs ml-1">(kostenlos)</span>}
                        {idx > 0 && <span className="text-gray-600 text-xs ml-1">(+1,00€)</span>}
                        {idx < selectedPizzaSauces.length - 1 && ', '}
                      </span>
                    ))}
                  </span>
                </div>
              )}

              {selectedExclusions && selectedExclusions.length > 0 && (
                <div>
                  <span className="text-gray-600">Salat-Anpassungen:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {formatExclusionsDisplay(selectedExclusions)}
                  </span>
                </div>
              )}

              {selectedExtras && selectedExtras.length > 0 && (
                <div>
                  <span className="text-gray-600">Extras:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {formatExtrasDisplay(selectedExtras)}
                  </span>
                </div>
              )}

              {selectedSideDish && (
                <div>
                  <span className="text-gray-600">Beilage:</span>
                  <span className="ml-2 font-medium text-gray-900">{selectedSideDish}</span>
                </div>
              )}
            </div>
          </div>

          {/* Price Section */}
          <div className="border-2 border-gray-200 rounded-lg p-3">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-gray-900">Preis:</span>
              <span className="text-light-blue-600">
                {totalPrice.toFixed(2).replace('.', ',')} €
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors border border-gray-300"
            >
              Abbrechen
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-light-blue-400 hover:bg-light-blue-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Bestätigen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OrderConfirmationModal);
