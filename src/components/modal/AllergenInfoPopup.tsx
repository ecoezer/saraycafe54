import React from 'react';
import { X, Info } from 'lucide-react';
import { MenuItem } from '../../types';
import { parseAllergens } from '../../data/allergenData';

interface AllergenInfoPopupProps {
  item: MenuItem;
  onClose: () => void;
}

const AllergenInfoPopup: React.FC<AllergenInfoPopupProps> = ({ item, onClose }) => {
  const allergenList = parseAllergens(item.allergens);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-light-blue-400 text-white p-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Info className="w-6 h-6" />
            Allergene & Zusatzstoffe
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-light-blue-500 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 text-lg mb-2">{item.name}</h3>
            {item.description && (
              <p className="text-gray-600 text-sm">{item.description}</p>
            )}
          </div>

          {allergenList.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Dieses Produkt enthält:</h4>
              <div className="space-y-2">
                {allergenList.map((allergen, index) => (
                  <div
                    key={index}
                    className="bg-light-blue-50 border border-light-blue-200 rounded-lg p-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-light-blue-600 flex-shrink-0">
                        ({allergen.code})
                      </span>
                      <span className="text-gray-800 text-sm leading-relaxed">
                        {allergen.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-gray-600">Keine Allergeninformationen verfügbar</p>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full bg-light-blue-400 hover:bg-light-blue-500 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AllergenInfoPopup);
