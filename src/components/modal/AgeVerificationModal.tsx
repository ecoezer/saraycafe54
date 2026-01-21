import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { MenuItem, PizzaSize } from '../../types';
import { formatPriceWithCurrency, formatPrice } from '../../utils/priceCalculations';

interface AgeVerificationModalProps {
  item: MenuItem;
  selectedSize?: PizzaSize;
  selectedIngredients: string[];
  selectedExtras: string[];
  selectedPastaType: string;
  selectedSauce: string;
  selectedSauces: string[];
  selectedMeatType: string;
  selectedExclusions: string[];
  selectedSideDish: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({
  item,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                {item.name}
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-900 text-white">
                  18+
                </span>
              </h2>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-gray-800 font-medium">
              Dies ist ein Artikel mit Altersbeschränkung.
            </p>
            <p className="text-gray-700 mt-2">
              Dein/e Fahrer:in wird deinen gültigen Lichtbildausweis überprüfen.
            </p>
          </div>

          <div className="text-2xl font-bold text-gray-900 mb-4">
            {formatPriceWithCurrency(item.price)}
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-900 mb-1">Produktinfo</p>
            <p className="text-sm text-gray-600">
              {item.description ? item.description : `4,8% vol, 0,33l, ${formatPrice(item.price / 0.33)} €/1l`}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors border border-gray-300"
            >
              Abbrechen
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-light-blue-400 hover:bg-light-blue-500 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Hinzufügen
              <span className="font-bold">{formatPriceWithCurrency(item.price)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AgeVerificationModal);
