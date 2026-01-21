import React, { useState, useCallback } from 'react';
import { Plus, ChefHat } from 'lucide-react';
import { MenuItem, PizzaSize } from '../types';
import ItemModal from './ItemModal';
import OrderConfirmationModal from './modal/OrderConfirmationModal';
import PriceDisplay from './menu/PriceDisplay';
import MenuItemBadges from './menu/MenuItemBadges';
import { needsConfiguration, isRippchenSpecial, isSchnitzelSpecial, isAlcoholicItem } from '../utils/itemChecks';
import { formatPriceWithCurrency } from '../utils/priceCalculations';

interface MenuSectionProps {
  title: string;
  description?: string;
  subTitle?: string;
  items: MenuItem[];
  bgColor?: string;
  onAddToOrder: (
    menuItem: MenuItem,
    selectedSize?: PizzaSize,
    selectedIngredients?: string[],
    selectedExtras?: string[],
    selectedPastaType?: string,
    selectedSauce?: string,
    selectedExclusions?: string[],
    selectedSideDish?: string,
    selectedPizzaSauces?: string[],
    selectedCalzoneSauces?: string[]
  ) => void;
  onModalStateChange?: (isOpen: boolean) => void;
}


const MenuSection: React.FC<MenuSectionProps> = ({ title, description, subTitle, items, bgColor = 'bg-light-blue-400', onAddToOrder, onModalStateChange }) => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showSimpleItemConfirmation, setShowSimpleItemConfirmation] = useState(false);
  const [simpleItemForConfirmation, setSimpleItemForConfirmation] = useState<MenuItem | null>(null);
  const today = new Date().getDay();

  const handleItemClick = useCallback((item: MenuItem) => {
    if (needsConfiguration(item)) {
      setSelectedItem(item);
      onModalStateChange?.(true);
    } else {
      setSimpleItemForConfirmation(item);
      setShowSimpleItemConfirmation(true);
    }
  }, [onModalStateChange]);

  const closeModal = useCallback(() => {
    setSelectedItem(null);
    onModalStateChange?.(false);
  }, [onModalStateChange]);

  if (!items.length) return null;

  return (
    <section className={`mb-3 ${title === 'Fleischgerichte' ? 'mt-8' : ''}`}>
      <header className="mb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <span className="text-lg text-gray-600">{items.length} Artikel</span>
        </div>
        {description && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{description}</p>}
        {subTitle && <p className="text-xs text-gray-500 mt-1 italic">{subTitle}</p>}
      </header>

      <div className="space-y-3">
        {items.map((item, i) => {
          const rippchenSpecial = isRippchenSpecial(item.id, today);
          const schnitzelSpecial = isSchnitzelSpecial(item.id, today);
          const hasSizes = item.sizes?.length > 0;
          const minPrice = hasSizes ? Math.min(...item.sizes!.map(s => s.price)) : item.price;

          return (
            <div
              key={`${item.id}-${i}`}
              className="menu-card-animated rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-all p-4 relative"
              style={{ zIndex: 1 }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    {item.number && String(item.number).trim() !== '' && (
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-700 flex-shrink-0">
                        {item.number}
                      </span>
                    )}
                    <h3 className={`text-base font-bold ${rippchenSpecial || schnitzelSpecial ? 'text-red-600' : 'text-gray-900'}`}>
                      {item.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className="text-xs text-gray-700 underline hover:text-gray-900 transition-colors z-10 relative cursor-pointer"
                      aria-label="Produktinfo"
                      title="Produktinfo"
                    >
                      Produktinfo
                    </button>
                    {isAlcoholicItem(item.id) && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-900 text-white flex-shrink-0">
                        18+
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className="flex items-center justify-center text-gray-900 hover:text-gray-600 hover:bg-gray-200 rounded-lg p-1.5 transition-all flex-shrink-0 z-10 relative cursor-pointer active:scale-95"
                  aria-label="Hinzufügen"
                  title="Hinzufügen"
                >
                  <Plus className="w-5 h-5 pointer-events-none" strokeWidth={2} />
                </button>
              </div>

              <div className="mb-3">
                {hasSizes ? (
                  <div className="text-base font-bold text-gray-900">{formatPriceWithCurrency(minPrice)}</div>
                ) : (
                  <div className="text-base font-bold text-gray-900">
                    {rippchenSpecial || schnitzelSpecial ? (
                      <PriceDisplay item={item} specialRippchen={rippchenSpecial} specialSchnitzel={schnitzelSpecial} />
                    ) : (
                      formatPriceWithCurrency(item.price)
                    )}
                  </div>
                )}
              </div>

              {item.description && <p className="text-xs text-gray-600 leading-relaxed mb-3">{item.description}</p>}
              {item.pfand && item.pfand > 0 && (
                <p className="text-xs text-gray-500 font-medium mb-2">
                  zzgl. {formatPriceWithCurrency(item.pfand)} Pfand
                </p>
              )}

              <MenuItemBadges
                item={item}
                isRippchenSpecial={rippchenSpecial}
                isSchnitzelSpecial={schnitzelSpecial}
                hasSizes={hasSizes}
              />
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={closeModal}
          onAddToOrder={onAddToOrder}
        />
      )}

      {simpleItemForConfirmation && (
        <OrderConfirmationModal
          item={simpleItemForConfirmation}
          isOpen={showSimpleItemConfirmation}
          totalPrice={simpleItemForConfirmation.price}
          onConfirm={(quantity) => {
            for (let i = 0; i < quantity; i++) {
              onAddToOrder(simpleItemForConfirmation);
            }
            setShowSimpleItemConfirmation(false);
            setSimpleItemForConfirmation(null);
          }}
          onCancel={() => {
            setShowSimpleItemConfirmation(false);
          }}
        />
      )}
    </section>
  );
};

export default React.memo(MenuSection);
