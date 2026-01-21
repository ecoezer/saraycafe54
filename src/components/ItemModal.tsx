import React, { useState, useCallback } from 'react';
import { X, Plus, ShoppingCart, AlertTriangle, Info } from 'lucide-react';
import { MenuItem, PizzaSize } from '../types';
import {
  wunschPizzaIngredients, pizzaExtras, pastaTypes,
  sauceTypes, saladSauceTypes, saladExclusionOptions, sideDishOptions, drehspiessaSauceTypes, snackSauceTypes, pizzabroetchenSauceTypes, sauceBottleTypes, pizzaExtrasPricing, donerExtras, baguetteSauceTypes, granatapfelOptions, burgerSaladExclusions, burgerSauceTypes, burgerExtras, calzoneExtras, calzoneExtrasPricing
} from '../data/menuItems';
import { parseAllergens } from '../data/allergenData';
import { getSizePrice } from '../utils/sizeNormalization';
import OrderConfirmationModal from './modal/OrderConfirmationModal';

interface ItemModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToOrder: (
    menuItem: MenuItem,
    selectedSize?: PizzaSize,
    selectedIngredients?: string[],
    selectedExtras?: string[],
    selectedPastaType?: string,
    selectedSauce?: string,
    selectedExclusions?: string[],
    selectedSideDish?: string,
    selectedPizzaSauces?: string[]
  ) => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ item, isOpen, onClose, onAddToOrder }) => {
  const [selectedSize, setSelectedSize] = useState<PizzaSize | undefined>(
    item.sizes ? item.sizes[0] : undefined
  );
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedDonerExtras, setSelectedDonerExtras] = useState<string[]>([]);
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
  const [currentStep, setCurrentStep] = useState<'meat' | 'sauce' | 'extras' | 'exclusions' | 'sidedish' | 'saucetype' | 'burgerSalad' | 'burgerSauce' | 'burgerExtras' | 'pizzaSize' | 'pizzaExtras' | 'pizzaSauce' | 'calzoneSize' | 'calzoneExtras' | 'calzoneSauce' | 'complete'>(
    item.isPizza ? 'pizzaSize' : item.isCalzone ? 'calzoneSize' : item.isSauceSelection ? 'saucetype' : item.isBurger ? 'burgerSalad' : item.number === 88 ? 'sauce' : 'meat'
  );
  const [showAllSauces, setShowAllSauces] = useState(false);
  const [showAllExclusions, setShowAllExclusions] = useState(false);
  const [showAgeWarning, setShowAgeWarning] = useState(false);
  const [showAllergenPopup, setShowAllergenPopup] = useState(false);
  const [selectedGranatapfel, setSelectedGranatapfel] = useState<string>(granatapfelOptions[1]);
  const [selectedPideExtras, setSelectedPideExtras] = useState<string[]>([]);
  const [selectedBurgerSaladExclusions, setSelectedBurgerSaladExclusions] = useState<string[]>([]);
  const [selectedBurgerSauce, setSelectedBurgerSauce] = useState<string>('');
  const [selectedBurgerExtras, setSelectedBurgerExtras] = useState<string[]>([]);
  const [selectedPizzaSauces, setSelectedPizzaSauces] = useState<string[]>([]);
  const [selectedCalzoneExtras, setSelectedCalzoneExtras] = useState<string[]>([]);
  const [selectedCalzoneSauces, setSelectedCalzoneSauces] = useState<string[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationPrice, setConfirmationPrice] = useState(0);
  const [showAllCalzoneExtras, setShowAllCalzoneExtras] = useState(false);

  const handleIngredientToggle = useCallback((ingredient: string) => {
    setSelectedIngredients(prev => {
      if (prev.includes(ingredient)) {
        return prev.filter(i => i !== ingredient);
      } else if (prev.length < 4) {
        return [...prev, ingredient];
      }
      return prev;
    });
  }, []);

  const handleExtraToggle = useCallback((extra: string) => {
    setSelectedExtras(prev =>
      prev.includes(extra)
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    );
  }, []);

  const handleDonerExtraToggle = useCallback((extra: string) => {
    setSelectedDonerExtras(prev =>
      prev.includes(extra)
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    );
  }, []);

  const handleExclusionToggle = useCallback((exclusion: string) => {
    setSelectedExclusions(prev => {
      // If selecting "Ohne Beilagen bzw. Salate", clear all other selections
      if (exclusion === 'Ohne Beilagen bzw. Salate') {
        return prev.includes(exclusion) ? [] : [exclusion];
      }

      // If any other option is selected, remove "Ohne Beilagen bzw. Salate"
      const withoutOhneBeilagen = prev.filter(e => e !== 'Ohne Beilagen bzw. Salate');

      if (withoutOhneBeilagen.includes(exclusion)) {
        return withoutOhneBeilagen.filter(e => e !== exclusion);
      }

      return [...withoutOhneBeilagen, exclusion];
    });
  }, []);

  const handlePideExtraToggle = useCallback((extra: string) => {
    setSelectedPideExtras(prev =>
      prev.includes(extra)
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    );
  }, []);

  const handleBurgerSaladExclusionToggle = useCallback((exclusion: string) => {
    setSelectedBurgerSaladExclusions(prev =>
      prev.includes(exclusion)
        ? prev.filter(e => e !== exclusion)
        : [...prev, exclusion]
    );
  }, []);

  const handleBurgerExtraToggle = useCallback((extraName: string) => {
    setSelectedBurgerExtras(prev =>
      prev.includes(extraName)
        ? prev.filter(e => e !== extraName)
        : [...prev, extraName]
    );
  }, []);

  const handleSauceToggle = useCallback((sauce: string) => {
    setSelectedSauces(prev => {
      if (sauce === 'ohne Soße') {
        return prev.includes(sauce) ? [] : ['ohne Soße'];
      }

      const withoutOhneSose = prev.filter(s => s !== 'ohne Soße');

      if (withoutOhneSose.includes(sauce)) {
        return withoutOhneSose.filter(s => s !== sauce);
      }

      // For Drehspieß items, limit to 3 sauces
      if (item.isMeatSelection && withoutOhneSose.length >= 3) {
        return withoutOhneSose;
      }

      return [...withoutOhneSose, sauce];
    });
  }, [item.isMeatSelection]);

  const handlePizzaSauceToggle = useCallback((sauce: string) => {
    setSelectedPizzaSauces(prev => {
      if (sauce === 'ohne Soße') {
        return prev.includes(sauce) ? [] : ['ohne Soße'];
      }

      const withoutOhneSose = prev.filter(s => s !== 'ohne Soße');

      if (withoutOhneSose.includes(sauce)) {
        return withoutOhneSose.filter(s => s !== sauce);
      }

      // Limit to 3 sauces for pizza
      if (withoutOhneSose.length >= 3) {
        return withoutOhneSose;
      }

      return [...withoutOhneSose, sauce];
    });
  }, []);

  const handleCalzoneExtraToggle = useCallback((extra: string) => {
    setSelectedCalzoneExtras(prev =>
      prev.includes(extra)
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    );
  }, []);

  const handleCalzoneSauceToggle = useCallback((sauce: string) => {
    setSelectedCalzoneSauces(prev => {
      if (sauce === 'ohne Soße') {
        return prev.includes(sauce) ? [] : ['ohne Soße'];
      }

      const withoutOhneSose = prev.filter(s => s !== 'ohne Soße');

      if (withoutOhneSose.includes(sauce)) {
        return withoutOhneSose.filter(s => s !== sauce);
      }

      // Limit to 3 sauces for calzone
      if (withoutOhneSose.length >= 3) {
        return withoutOhneSose;
      }

      return [...withoutOhneSose, sauce];
    });
  }, []);

  const getExtraPricePerItem = useCallback(() => {
    if (!selectedSize) return 1.00;
    const normalizedSizeName = getSizePrice(selectedSize.name);
    const sizeExtraPricing: { [key: string]: number } = {
      '24cm': 1.00,
      '28cm': 1.50,
      '40cm': 2.50
    };
    return sizeExtraPricing[normalizedSizeName] || 1.00;
  }, [selectedSize]);

  const getExtrasPriceBreakdown = useCallback(() => {
    if (selectedExtras.length === 0 && selectedPizzaSauces.length === 0) {
      return { basePrice: selectedSize?.price || item.price, extrasTotal: 0, breakdown: [] };
    }

    const basePrice = selectedSize ? selectedSize.price : item.price;
    let extrasTotal = 0;
    const breakdown: Array<{ name: string; price: number; isSauce?: boolean }> = [];

    // Add extras breakdown
    if (selectedExtras.length > 0 && selectedSize) {
      const normalizedSizeName = getSizePrice(selectedSize.name);
      selectedExtras.forEach(extra => {
        const extraPricing = pizzaExtrasPricing[extra as keyof typeof pizzaExtrasPricing];
        const price = extraPricing ? (extraPricing[normalizedSizeName] || 1.00) : 1.00;
        extrasTotal += price;
        breakdown.push({ name: extra, price });
      });
    }

    // Add sauces breakdown (first free, additional 1.00€)
    if (selectedPizzaSauces.length > 0) {
      selectedPizzaSauces.forEach((sauce, index) => {
        const price = index === 0 ? 0 : 1.00;
        extrasTotal += price;
        breakdown.push({ name: sauce, price, isSauce: true });
      });
    }

    return { basePrice, extrasTotal, breakdown };
  }, [selectedSize, selectedExtras, selectedPizzaSauces, item.price]);

  const calculatePrice = useCallback(() => {
    let basePrice = selectedSize ? selectedSize.price : item.price;
    let extrasPrice = 0;

    // Pizza extras
    if (selectedExtras.length > 0 && selectedSize) {
      const normalizedSizeName = getSizePrice(selectedSize.name);
      selectedExtras.forEach(extra => {
        const extraPricing = pizzaExtrasPricing[extra as keyof typeof pizzaExtrasPricing];
        if (extraPricing) {
          extrasPrice += extraPricing[normalizedSizeName] || 1.00;
        } else {
          extrasPrice += 1.00;
        }
      });
    } else {
      extrasPrice = selectedExtras.length * 1.00;
    }

    // Calzone extras pricing
    let calzoneExtrasPrice = 0;
    if (item.isCalzone && selectedCalzoneExtras.length > 0 && selectedSize) {
      selectedCalzoneExtras.forEach(extra => {
        const extraPricing = calzoneExtrasPricing[extra as keyof typeof calzoneExtrasPricing];
        if (extraPricing) {
          calzoneExtrasPrice += extraPricing[selectedSize.name as 'Normal' | 'Groß'] || 0.75;
        } else {
          calzoneExtrasPrice += 0.75;
        }
      });
    }

    // Add döner extras pricing (1.00€ each)
    const donerExtrasPrice = selectedDonerExtras.length * 1.00;

    // Add pide extras pricing (1.50€ each)
    const pideExtrasPrice = selectedPideExtras.length * 1.50;

    // Add sauce pricing for salad items: first sauce is free, additional sauces cost 1 euro
    let saucePricing = 0;
    if ((item.id >= 564 && item.id <= 568) && selectedSauces.length > 1) {
      saucePricing = (selectedSauces.length - 1) * 1.00;
    }

    // Add sauce pricing for items 78 and 79 (Chicken Nuggets): first sauce is free, additional sauces cost 1 euro
    if ([78, 79].includes(item.number) && selectedSauces.length > 1) {
      saucePricing = (selectedSauces.length - 1) * 1.00;
    }

    // Add burger extras pricing
    let burgerExtrasPrice = 0;
    if (item.isBurger && selectedBurgerExtras.length > 0) {
      selectedBurgerExtras.forEach(extraName => {
        const extra = burgerExtras.find(e => e.name === extraName);
        if (extra) {
          burgerExtrasPrice += extra.price;
        }
      });
    }

    // Add pizza sauce pricing: first sauce is free, additional sauces cost 1 euro
    let pizzaSaucePricing = 0;
    if (item.isPizza && selectedPizzaSauces.length > 1) {
      pizzaSaucePricing = (selectedPizzaSauces.length - 1) * 1.00;
    }

    // Add calzone sauce pricing: first sauce is free, additional sauces cost 1 euro
    let calzoneSaucePricing = 0;
    if (item.isCalzone && selectedCalzoneSauces.length > 1) {
      calzoneSaucePricing = (selectedCalzoneSauces.length - 1) * 1.00;
    }

    return basePrice + extrasPrice + calzoneExtrasPrice + donerExtrasPrice + pideExtrasPrice + saucePricing + burgerExtrasPrice + pizzaSaucePricing + calzoneSaucePricing;
  }, [item.price, item.id, item.number, item.isBurger, item.isPizza, item.isCalzone, selectedSize, selectedExtras, selectedCalzoneExtras, selectedDonerExtras, selectedPideExtras, selectedSauces, selectedBurgerExtras, selectedPizzaSauces, selectedCalzoneSauces]);

  const handleAddToCart = useCallback(() => {
    // For pizza items, handle multi-step flow
    if (item.isPizza && currentStep === 'pizzaSize') {
      if (!selectedSize) return;
      setCurrentStep('pizzaExtras');
      return;
    }

    if (item.isPizza && currentStep === 'pizzaExtras') {
      setCurrentStep('pizzaSauce');
      return;
    }

    // For calzone items, handle multi-step flow
    if (item.isCalzone && currentStep === 'calzoneSize') {
      if (!selectedSize) return;
      setCurrentStep('calzoneExtras');
      setShowAllCalzoneExtras(false);
      return;
    }

    if (item.isCalzone && currentStep === 'calzoneExtras') {
      setCurrentStep('calzoneSauce');
      return;
    }

    // For sauce selection items (item #89), first select sauce type, then size
    if (item.isSauceSelection && currentStep === 'saucetype') {
      if (!selectedSauce) return;
      setCurrentStep('complete');
      return;
    }

    // For burger items, handle multi-step flow
    if (item.isBurger && currentStep === 'burgerSalad') {
      setCurrentStep('burgerSauce');
      return;
    }

    if (item.isBurger && currentStep === 'burgerSauce') {
      if (!selectedBurgerSauce) return;
      setCurrentStep('burgerExtras');
      return;
    }

    // For meat selection items, check if we need to go to sauce selection step
    if (item.isMeatSelection && currentStep === 'meat') {
      setCurrentStep('sauce');
      return;
    }

    // For meat selection items, check if we need to go to exclusions (salat) step
    if (item.isMeatSelection && currentStep === 'sauce') {
      setCurrentStep('exclusions');
      return;
    }

    // For meat selection items, check if we need to go to extras step
    if (item.isMeatSelection && currentStep === 'exclusions') {
      // Item 88 doesn't have extras, so add directly
      if (item.number === 88) {
        // Will show confirmation
      } else {
        setCurrentStep('extras');
        return;
      }
    }

    // For items #9 (Döner Teller) and #10 (Hähnchen-Döner Teller), check if we need to go to side dish selection step
    if ((item.number === 9 || item.number === 10) && item.isMeatSelection && currentStep === 'extras') {
      setCurrentStep('sidedish');
      return;
    }

    // Show age warning popup for alcoholic items
    if ([593, 594].includes(item.id) && !showAgeWarning) {
      setShowAgeWarning(true);
      return;
    }

    // Store price and show confirmation modal
    const price = calculatePrice();
    setConfirmationPrice(price);
    setShowConfirmationModal(true);
  }, [item, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce, selectedSauces, selectedMeatType, selectedExclusions, selectedSideDish, selectedBurgerSauce, selectedBurgerSaladExclusions, selectedBurgerExtras, selectedCalzoneExtras, selectedCalzoneSauces, currentStep, showAgeWarning, calculatePrice]);

  const getSauceOptions = useCallback(() => {
    // Calzone items use same sauce types as pizza
    if (item.isCalzone) {
      return sauceTypes;
    }
    // Drehspieß items use special sauce types
    if (item.isMeatSelection) {
      return drehspiessaSauceTypes;
    }
    // Falafel items use döner sauces
    if (item.isFalafel) {
      return drehspiessaSauceTypes;
    }
    // Baguette items use baguette sauce types
    if (item.isBaguette) {
      return baguetteSauceTypes;
    }
    // Vegetarian dishes (74-79) and item 88 use same sauce types as Drehspieß
    if ([74, 75, 76, 77, 78, 79, 88].includes(item.number)) {
      return drehspiessaSauceTypes;
    }
    // Pizzabrötchen items (50-57) use pizzabrötchen sauce types
    if ([50, 51, 52, 53, 54, 55, 56, 57].includes(item.number)) {
      return pizzabroetchenSauceTypes;
    }
    // Snack items (16-20) use snack sauce types
    if ([16, 17, 18, 19, 20].includes(item.number)) {
      return snackSauceTypes;
    }
    // Salad items use salad sauce types (same as döner sauces)
    if (item.id >= 564 && item.id <= 568 && item.isSpezialitaet) {
      return saladSauceTypes;
    }
    if ([8, 9, 10, 11, 12, 13, 14, 15].includes(item.number)) {
      return sauceTypes.filter(sauce => !['Tzatziki', 'Kräutersoße', 'Curry Sauce'].includes(sauce)).concat('Burger Sauce').sort();
    }
    return sauceTypes;
  }, [item.id, item.number, item.isSpezialitaet, item.isMeatSelection, item.isFalafel, item.isBaguette, item.isCalzone]);

  const getVisibleSauceOptions = useCallback(() => {
    const allSauces = getSauceOptions();
    if ((item.isMeatSelection && currentStep === 'sauce') || item.isFalafel || [6, 7, 8, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 50, 51, 52, 53, 54, 55, 56, 57, 74, 75, 76, 77, 78, 79, 88].includes(item.number)) {
      return showAllSauces ? allSauces : allSauces.slice(0, 3);
    }
    return allSauces;
  }, [getSauceOptions, item.isMeatSelection, item.isFalafel, item.number, currentStep, showAllSauces]);

  const getVisibleExclusionOptions = useCallback(() => {
    if (item.isMeatSelection && currentStep === 'exclusions') {
      return showAllExclusions ? saladExclusionOptions : saladExclusionOptions.slice(0, 3);
    }
    return saladExclusionOptions;
  }, [item.isMeatSelection, currentStep, showAllExclusions]);
  const handleBackToMeat = useCallback(() => {
    setCurrentStep('meat');
    setSelectedSauce(''); // Reset sauce selection when going back
  }, []);

  const handleBackToSauce = useCallback(() => {
    setCurrentStep('sauce');
    setSelectedExclusions([]); // Reset exclusions when going back
  }, []);

  const handleBackToExclusions = useCallback(() => {
    setCurrentStep('exclusions');
    setSelectedDonerExtras([]); // Reset döner extras when going back
  }, []);

  const handleBackToExtras = useCallback(() => {
    setCurrentStep('extras');
    setSelectedSideDish(sideDishOptions[0]); // Reset side dish when going back
  }, []);

  const handleBackToBurgerSalad = useCallback(() => {
    setCurrentStep('burgerSalad');
  }, []);

  const handleBackToBurgerSauce = useCallback(() => {
    setCurrentStep('burgerSauce');
  }, []);

  const handleBackToPizzaSize = useCallback(() => {
    setCurrentStep('pizzaSize');
  }, []);

  const handleBackToPizzaExtras = useCallback(() => {
    setCurrentStep('pizzaExtras');
    setSelectedPizzaSauce('');
  }, []);

  const handleBackToCalzoneSize = useCallback(() => {
    setCurrentStep('calzoneSize');
  }, []);

  const handleBackToCalzoneExtras = useCallback(() => {
    setCurrentStep('calzoneExtras');
    setSelectedCalzoneSauces([]);
    setShowAllCalzoneExtras(false);
  }, []);

  const getModalTitle = useCallback(() => {
    if (item.isPizza) {
      if (currentStep === 'pizzaSize') {
        return 'Schritt 1: Größe wählen';
      } else if (currentStep === 'pizzaExtras') {
        return 'Schritt 2: Extras wählen (optional)';
      } else if (currentStep === 'pizzaSauce') {
        return 'Schritt 3: Soße wählen';
      }
    }
    if (item.isCalzone) {
      if (currentStep === 'calzoneSize') {
        return 'Schritt 1: Größe wählen';
      } else if (currentStep === 'calzoneExtras') {
        return 'Schritt 2: Extras wählen (optional)';
      } else if (currentStep === 'calzoneSauce') {
        return 'Schritt 3: Soße wählen';
      }
    }
    if (item.isSauceSelection) {
      if (currentStep === 'saucetype') {
        return 'Schritt 1: Soße wählen';
      } else if (currentStep === 'complete') {
        return 'Schritt 2: Größe wählen';
      }
    }
    if (item.isBurger) {
      if (currentStep === 'burgerSalad') {
        return 'Schritt 1: Salat anpassen (mehrere möglich)';
      } else if (currentStep === 'burgerSauce') {
        return 'Schritt 2: Soße wählen';
      } else if (currentStep === 'burgerExtras') {
        return 'Schritt 3: Extras wählen (optional)';
      }
    }
    if (item.isMeatSelection) {
      // Item 88 (Sigara Börek Menü) special handling
      if (item.number === 88) {
        if (currentStep === 'sauce') {
          return 'Schritt 1: Soßen wählen (mehrere möglich)';
        } else if (currentStep === 'exclusions') {
          return 'Schritt 2: Salat anpassen (mehrere möglich)';
        }
      }
      if (currentStep === 'meat') {
        return 'Schritt 1: Fleischauswahl';
      } else if (currentStep === 'sauce') {
        return 'Schritt 2: Soßen wählen (mehrere möglich)';
      } else if (currentStep === 'exclusions') {
        return 'Schritt 3: Salat anpassen (mehrere möglich)';
      } else if (currentStep === 'extras') {
        return 'Schritt 4: Extras wählen (optional)';
      } else if (currentStep === 'sidedish') {
        return 'Schritt 5: Beilage wählen';
      }
    }
    return item.name;
  }, [item, currentStep]);

  const getButtonText = useCallback(() => {
    if (item.isPizza) {
      if (currentStep === 'pizzaSize') {
        return 'Weiter zur Extra-Auswahl';
      } else if (currentStep === 'pizzaExtras') {
        return 'Weiter zur Soßenauswahl';
      }
    }
    if (item.isCalzone) {
      if (currentStep === 'calzoneSize') {
        return 'Weiter zur Extra-Auswahl';
      } else if (currentStep === 'calzoneExtras') {
        return 'Weiter zur Soßenauswahl';
      }
    }
    if (item.isSauceSelection && currentStep === 'saucetype') {
      return 'Weiter zur Größenauswahl';
    }
    if (item.isBurger && currentStep === 'burgerSalad') {
      return 'Weiter zur Soßenauswahl';
    } else if (item.isBurger && currentStep === 'burgerSauce') {
      return 'Weiter zur Extra-Auswahl';
    }
    if (item.isMeatSelection && currentStep === 'meat') {
      return 'Weiter zur Soßenauswahl';
    } else if (item.isMeatSelection && currentStep === 'sauce') {
      return 'Weiter zur Salat-Anpassung';
    } else if (item.isMeatSelection && currentStep === 'exclusions') {
      // Item 88 doesn't have extras, so add directly
      if (item.number === 88) {
        return `Hinzufügen - ${calculatePrice().toFixed(2).replace('.', ',')} €`;
      }
      return 'Weiter zur Extra-Auswahl';
    } else if ((item.number === 9 || item.number === 10) && item.isMeatSelection && currentStep === 'extras') {
      return 'Weiter zur Beilagenauswahl';
    }
    return `Hinzufügen - ${calculatePrice().toFixed(2).replace('.', ',')} €`;
  }, [item, currentStep, calculatePrice]);

  if (!isOpen) return null;

  const allergenList = parseAllergens(item.allergens);

  // Allergen Info Popup
  if (showAllergenPopup) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-[70] flex items-center justify-center p-4" style={{ pointerEvents: 'auto' }}>
        <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.4)]" style={{ pointerEvents: 'auto' }}>
          <div className="sticky top-0 bg-light-blue-400 text-white p-4 rounded-t-3xl flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Info className="w-6 h-6" />
              Allergene & Zusatzstoffe
            </h2>
            <button
              onClick={() => setShowAllergenPopup(false)}
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
                onClick={() => setShowAllergenPopup(false)}
                className="w-full bg-light-blue-400 hover:bg-light-blue-500 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Age verification warning modal
  if (showAgeWarning) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex items-center justify-center p-4" style={{ pointerEvents: 'auto' }}>
        <div className="bg-white rounded-3xl max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.4)]" style={{ pointerEvents: 'auto' }}>
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
              {item.price.toFixed(2).replace('.', ',')} €
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-900 mb-1">Produktinfo</p>
              <p className="text-sm text-gray-600">
                {item.description ? item.description : `4,8% vol, 0,33l, ${(item.price / 0.33).toFixed(2).replace('.', ',')} €/1l`}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAgeWarning(false);
                  onClose();
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors border border-gray-300"
              >
                Abbrechen
              </button>
              <button
                onClick={() => {
                  setShowAgeWarning(false);
                  const price = calculatePrice();
                  setConfirmationPrice(price);
                  setShowConfirmationModal(true);
                }}
                className="flex-1 bg-light-blue-400 hover:bg-light-blue-500 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Hinzufügen
                <span className="font-bold">{item.price.toFixed(2).replace('.', ',')} €</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-2 sm:p-4" style={{ pointerEvents: 'auto' }}>
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.3)]" style={{ pointerEvents: 'auto' }}>
        {/* Header */}
        <div className="sticky top-0 bg-light-blue-400 text-white p-3 rounded-t-3xl flex justify-between items-center">
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              {getModalTitle()}
              {[593, 594].includes(item.id) && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-white text-gray-900">
                  18+
                </span>
              )}
            </h2>
            {currentStep === 'meat' && item.description && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">{item.description}</p>
            )}
            {currentStep === 'pizzaSize' && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                Nr. {item.number} {item.name}
              </p>
            )}
            {currentStep === 'pizzaExtras' && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                Nr. {item.number} {item.name} - {selectedSize?.name}
              </p>
            )}
            {currentStep === 'pizzaSauce' && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                Nr. {item.number} {item.name} - {selectedSize?.name}
              </p>
            )}
            {currentStep === 'saucetype' && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                Nr. {item.number} {item.name}
              </p>
            )}
            {currentStep === 'burgerSalad' && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                Nr. {item.number} {item.name}
              </p>
            )}
            {currentStep === 'burgerSauce' && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                Nr. {item.number} {item.name}
              </p>
            )}
            {currentStep === 'burgerExtras' && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                Nr. {item.number} {item.name}
              </p>
            )}
            {currentStep === 'sauce' && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                Nr. {item.number} {item.name}
              </p>
            )}
            {currentStep === 'exclusions' && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                mit {selectedSauces.length > 0 ? selectedSauces.join(', ') : 'ohne Soße'} - Nr. {item.number} {item.name}
              </p>
            )}
            {currentStep === 'extras' && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                mit {selectedSauces.length > 0 ? selectedSauces.join(', ') : 'ohne Soße'} - Nr. {item.number} {item.name}
              </p>
            )}
            {currentStep === 'sidedish' && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                mit {selectedSauces.length > 0 ? selectedSauces.join(', ') : 'ohne Soße'} - Nr. {item.number} {item.name}
              </p>
            )}
            {currentStep === 'calzoneSize' && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                Nr. {item.number} {item.name}
              </p>
            )}
            {currentStep === 'calzoneExtras' && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                Nr. {item.number} {item.name} - {selectedSize?.name}
              </p>
            )}
            {currentStep === 'calzoneSauce' && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                Nr. {item.number} {item.name} - {selectedSize?.name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {item.isPizza && (currentStep === 'pizzaExtras' || currentStep === 'pizzaSauce') && (
              <button
                onClick={currentStep === 'pizzaExtras' ? handleBackToPizzaSize : handleBackToPizzaExtras}
                className="p-2 hover:bg-light-blue-500 rounded-full transition-colors"
                title={currentStep === 'pizzaExtras' ? "Zurück zur Größenauswahl" : "Zurück zur Extra-Auswahl"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {item.isCalzone && (currentStep === 'calzoneExtras' || currentStep === 'calzoneSauce') && (
              <button
                onClick={currentStep === 'calzoneExtras' ? handleBackToCalzoneSize : handleBackToCalzoneExtras}
                className="p-2 hover:bg-light-blue-500 rounded-full transition-colors"
                title={currentStep === 'calzoneExtras' ? "Zurück zur Größenauswahl" : "Zurück zur Extra-Auswahl"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {item.isMeatSelection && (currentStep === 'sauce' || currentStep === 'exclusions' || currentStep === 'extras' || currentStep === 'sidedish') && (
              <button
                onClick={
                  currentStep === 'sauce' ? handleBackToMeat :
                  currentStep === 'exclusions' ? handleBackToSauce :
                  currentStep === 'extras' ? handleBackToExclusions :
                  handleBackToExtras
                }
                className="p-2 hover:bg-light-blue-500 rounded-full transition-colors"
                title={
                  currentStep === 'sauce' ? "Zurück zur Fleischauswahl" :
                  currentStep === 'exclusions' ? "Zurück zur Soßenauswahl" :
                  currentStep === 'extras' ? "Zurück zur Salat-Anpassung" :
                  "Zurück zur Extra-Auswahl"
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {item.isBurger && (currentStep === 'burgerSauce' || currentStep === 'burgerExtras') && (
              <button
                onClick={currentStep === 'burgerSauce' ? handleBackToBurgerSalad : handleBackToBurgerSauce}
                className="p-2 hover:bg-light-blue-500 rounded-full transition-colors"
                title={currentStep === 'burgerSauce' ? "Zurück zur Salat-Anpassung" : "Zurück zur Soßenauswahl"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <button
            onClick={onClose}
            className="p-2 hover:bg-orange-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          </div>
        </div>

        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Allergen Information Banner */}
          {item.allergens && allergenList.length > 0 && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-2">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium mb-0.5 text-sm">
                    Allergene: {item.allergens}
                  </p>
                  <button
                    onClick={() => setShowAllergenPopup(true)}
                    className="text-blue-600 hover:text-blue-700 font-semibold underline text-sm"
                  >
                    Hier klicken für Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pfand Information */}
          {item.pfand && item.pfand > 0 && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-gray-800 font-medium text-sm">
                  zzgl. {item.pfand.toFixed(2).replace('.', ',')} € Pfand
                </p>
              </div>
            </div>
          )}

          {/* Age Restriction Warning for Alcoholic Drinks */}
          {[593, 594].includes(item.id) && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-800 font-medium">
                    Dies ist ein Artikel mit Altersbeschränkung.
                  </p>
                  <p className="text-gray-700 mt-1">
                    Dein/e Fahrer:in wird deinen gültigen Lichtbildausweis überprüfen.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Price Display for Alcoholic Items */}
          {[593, 594].includes(item.id) && (
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {item.price.toFixed(2).replace('.', ',')} €
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900 mb-1">Produktinfo</p>
                <p>4,8% vol, 0,33l, {(item.price / 0.33).toFixed(2).replace('.', ',')} €/1l</p>
              </div>
            </div>
          )}

          {/* Step indicator for pizza items */}
          {item.isPizza && (
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
              <div className={`flex items-center space-x-1 ${currentStep === 'pizzaSize' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  currentStep === 'pizzaSize' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Größe</span>
                <span className="text-xs font-medium sm:hidden">G</span>
              </div>
              <div className={`w-4 h-px ${currentStep === 'pizzaExtras' || currentStep === 'pizzaSauce' ? 'bg-light-blue-400' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center space-x-1 ${currentStep === 'pizzaExtras' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  currentStep === 'pizzaExtras' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Extras</span>
                <span className="text-xs font-medium sm:hidden">E</span>
              </div>
              <div className={`w-4 h-px ${currentStep === 'pizzaSauce' ? 'bg-light-blue-400' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center space-x-1 ${currentStep === 'pizzaSauce' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  currentStep === 'pizzaSauce' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                }`}>
                  3
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Soße</span>
                <span className="text-xs font-medium sm:hidden">S</span>
              </div>
            </div>
          )}

          {/* Step indicator for calzone items */}
          {item.isCalzone && (
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
              <div className={`flex items-center space-x-1 ${currentStep === 'calzoneSize' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  currentStep === 'calzoneSize' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Größe</span>
                <span className="text-xs font-medium sm:hidden">G</span>
              </div>
              <div className={`w-4 h-px ${currentStep === 'calzoneExtras' || currentStep === 'calzoneSauce' ? 'bg-light-blue-400' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center space-x-1 ${currentStep === 'calzoneExtras' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  currentStep === 'calzoneExtras' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Extras</span>
                <span className="text-xs font-medium sm:hidden">E</span>
              </div>
              <div className={`w-4 h-px ${currentStep === 'calzoneSauce' ? 'bg-light-blue-400' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center space-x-1 ${currentStep === 'calzoneSauce' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  currentStep === 'calzoneSauce' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                }`}>
                  3
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Soße</span>
                <span className="text-xs font-medium sm:hidden">S</span>
              </div>
            </div>
          )}

          {/* Step indicator for sauce selection items */}
          {item.isSauceSelection && (
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
              <div className={`flex items-center space-x-1 ${currentStep === 'saucetype' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  currentStep === 'saucetype' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Soße</span>
                <span className="text-xs font-medium sm:hidden">S</span>
              </div>
              <div className={`w-4 h-px ${currentStep === 'complete' ? 'bg-light-blue-400' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center space-x-1 ${currentStep === 'complete' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  currentStep === 'complete' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Größe</span>
                <span className="text-xs font-medium sm:hidden">G</span>
              </div>
            </div>
          )}

          {/* Step indicator for burger items */}
          {item.isBurger && (
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
              <div className={`flex items-center space-x-1 ${currentStep === 'burgerSalad' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  currentStep === 'burgerSalad' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Salat</span>
                <span className="text-xs font-medium sm:hidden">Sa</span>
              </div>
              <div className={`w-4 h-px ${currentStep === 'burgerSauce' || currentStep === 'burgerExtras' ? 'bg-light-blue-400' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center space-x-1 ${currentStep === 'burgerSauce' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  currentStep === 'burgerSauce' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Soße</span>
                <span className="text-xs font-medium sm:hidden">S</span>
              </div>
              <div className={`w-4 h-px ${currentStep === 'burgerExtras' ? 'bg-light-blue-400' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center space-x-1 ${currentStep === 'burgerExtras' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  currentStep === 'burgerExtras' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                }`}>
                  3
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Extras</span>
                <span className="text-xs font-medium sm:hidden">E</span>
              </div>
            </div>
          )}

          {/* Step indicator for meat selection items */}
          {item.isMeatSelection && (
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
              {/* Special handling for item 88 - only 2 steps: Soße and Salat */}
              {item.number === 88 ? (
                <>
                  <div className={`flex items-center space-x-1 ${currentStep === 'sauce' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                      currentStep === 'sauce' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                    }`}>
                      1
                    </div>
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Soße</span>
                    <span className="text-xs font-medium sm:hidden">S</span>
                  </div>
                  <div className={`w-4 h-px ${currentStep === 'exclusions' ? 'bg-light-blue-400' : 'bg-gray-300'}`}></div>
                  <div className={`flex items-center space-x-1 ${currentStep === 'exclusions' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                      currentStep === 'exclusions' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                    }`}>
                      2
                    </div>
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Salat</span>
                    <span className="text-xs font-medium sm:hidden">Sa</span>
                  </div>
                </>
              ) : (
                <>
                  <div className={`flex items-center space-x-1 ${currentStep === 'meat' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                      currentStep === 'meat' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                    }`}>
                      1
                    </div>
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Fleisch</span>
                    <span className="text-xs font-medium sm:hidden">F</span>
                  </div>
                  <div className={`w-4 h-px ${currentStep === 'sauce' || currentStep === 'exclusions' || currentStep === 'extras' || currentStep === 'sidedish' ? 'bg-light-blue-400' : 'bg-gray-300'}`}></div>
                  <div className={`flex items-center space-x-1 ${currentStep === 'sauce' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                      currentStep === 'sauce' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                    }`}>
                      2
                    </div>
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Soße</span>
                    <span className="text-xs font-medium sm:hidden">S</span>
                  </div>
                  <div className={`w-4 h-px ${currentStep === 'exclusions' || currentStep === 'extras' || currentStep === 'sidedish' ? 'bg-light-blue-400' : 'bg-gray-300'}`}></div>
                  <div className={`flex items-center space-x-1 ${currentStep === 'exclusions' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                      currentStep === 'exclusions' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                    }`}>
                      3
                    </div>
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Salat</span>
                    <span className="text-xs font-medium sm:hidden">Sa</span>
                  </div>
                  <div className={`w-4 h-px ${currentStep === 'extras' || currentStep === 'sidedish' ? 'bg-light-blue-400' : 'bg-gray-300'}`}></div>
                  <div className={`flex items-center space-x-1 ${currentStep === 'extras' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                      currentStep === 'extras' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                    }`}>
                      4
                    </div>
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Extras</span>
                    <span className="text-xs font-medium sm:hidden">E</span>
                  </div>
                  {(item.number === 9 || item.number === 10) && (
                    <>
                      <div className={`w-4 h-px ${currentStep === 'sidedish' ? 'bg-light-blue-400' : 'bg-gray-300'}`}></div>
                      <div className={`flex items-center space-x-1 ${currentStep === 'sidedish' ? 'text-light-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                          currentStep === 'sidedish' ? 'bg-light-blue-400 text-white' : 'bg-gray-200'
                        }`}>
                          5
                        </div>
                        <span className="text-xs sm:text-sm font-medium hidden sm:inline">Beilage</span>
                        <span className="text-xs font-medium sm:hidden">B</span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* Sauce Type Selection for item #89 */}
          {item.isSauceSelection && currentStep === 'saucetype' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Soße wählen *</h3>
              <div className="space-y-2">
                {sauceBottleTypes.map((sauce) => (
                  <label
                    key={sauce}
                    className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSauce === sauce
                        ? 'border-light-blue-400 bg-light-blue-50'
                        : 'border-gray-200 hover:border-light-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="saucetype"
                      value={sauce}
                      checked={selectedSauce === sauce}
                      onChange={(e) => setSelectedSauce(e.target.value)}
                      className="text-light-blue-400 focus:ring-light-blue-400 w-4 h-4"
                    />
                    <span className="font-medium">{sauce}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {item.sizes && (!item.isMeatSelection || (currentStep !== 'sauce' && currentStep !== 'exclusions')) && (!item.isSauceSelection || currentStep === 'complete') && (!item.isPizza || currentStep === 'pizzaSize') && (!item.isCalzone || currentStep === 'calzoneSize') && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Größe wählen *</h3>
              <div className="space-y-2">
                {item.sizes.map((size) => (
                  <label
                    key={size.name}
                    className={`flex items-center justify-between p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSize?.name === size.name
                        ? 'border-light-blue-400 bg-light-blue-50'
                        : 'border-gray-200 hover:border-light-blue-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="size"
                        value={size.name}
                        checked={selectedSize?.name === size.name}
                        onChange={() => setSelectedSize(size)}
                        className="text-light-blue-400 focus:ring-light-blue-400 w-4 h-4"
                      />
                      <div>
                        <div className="font-medium">{size.name}</div>
                        {size.description && (
                          <div className="text-sm text-gray-600">{size.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="font-bold text-light-blue-600">
                      {size.price.toFixed(2).replace('.', ',')} €
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Wunsch Pizza Ingredients */}
          {item.isWunschPizza && (!item.isMeatSelection || (currentStep !== 'sauce' && currentStep !== 'exclusions')) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                Zutaten wählen ({selectedIngredients.length}/4) *
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto ingredients-scroll">
                {wunschPizzaIngredients.map((ingredient) => (
                  <label
                    key={ingredient}
                    className={`flex items-center space-x-2 p-1.5 rounded-lg border cursor-pointer transition-all text-sm ${
                      selectedIngredients.includes(ingredient)
                        ? 'border-light-blue-400 bg-light-blue-50'
                        : 'border-gray-200 hover:border-light-blue-300'
                    } ${
                      !selectedIngredients.includes(ingredient) && selectedIngredients.length >= 4
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIngredients.includes(ingredient)}
                      onChange={() => handleIngredientToggle(ingredient)}
                      disabled={!selectedIngredients.includes(ingredient) && selectedIngredients.length >= 4}
                      className="text-light-blue-400 focus:ring-light-blue-400 w-4 h-4"
                    />
                    <span>{ingredient}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Pizza Extras */}
          {(item.isPizza || item.isWunschPizza) && (!item.isMeatSelection || (currentStep !== 'sauce' && currentStep !== 'exclusions')) && (!item.isPizza || currentStep === 'pizzaExtras') && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                Extras (+{getExtraPricePerItem().toFixed(2).replace('.', ',')}€ pro Extra)
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {pizzaExtras.map((extra) => (
                  <label
                    key={extra}
                    className={`flex items-center space-x-2 p-1.5 rounded-lg border cursor-pointer transition-all text-sm ${
                      selectedExtras.includes(extra)
                        ? 'border-light-blue-400 bg-light-blue-50'
                        : 'border-gray-200 hover:border-light-blue-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedExtras.includes(extra)}
                      onChange={() => handleExtraToggle(extra)}
                      className="text-light-blue-400 focus:ring-light-blue-400 w-4 h-4"
                    />
                    <span>{extra}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Calzone Extras */}
          {item.isCalzone && currentStep === 'calzoneExtras' && (() => {
            const INITIAL_ITEMS = 8;
            const isExpandable = calzoneExtras.length > INITIAL_ITEMS;
            const displayedExtras = showAllCalzoneExtras ? calzoneExtras : calzoneExtras.slice(0, INITIAL_ITEMS);

            return (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  Extras {selectedSize ? `(+${(1.00).toFixed(2).replace('.', ',')}€ pro Extra)` : ''}
                </h3>
                <div className="mb-3 text-sm text-gray-600">
                  {selectedCalzoneExtras.length} ausgewählt
                </div>
                <div className={`grid grid-cols-2 gap-2 ${showAllCalzoneExtras ? 'max-h-80 overflow-y-auto pr-2' : ''}`}>
                  {displayedExtras.map((extra) => (
                    <label
                      key={extra}
                      className={`flex items-center space-x-2 p-1.5 rounded-lg border cursor-pointer transition-all text-sm ${
                        selectedCalzoneExtras.includes(extra)
                          ? 'border-light-blue-400 bg-light-blue-50'
                          : 'border-gray-200 hover:border-light-blue-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCalzoneExtras.includes(extra)}
                        onChange={() => handleCalzoneExtraToggle(extra)}
                        className="text-light-blue-400 focus:ring-light-blue-400 w-4 h-4"
                      />
                      <span>{extra}</span>
                    </label>
                  ))}
                </div>
                {isExpandable && !showAllCalzoneExtras && (
                  <button
                    onClick={() => setShowAllCalzoneExtras(true)}
                    className="mt-3 text-light-blue-600 hover:text-light-blue-700 font-medium text-sm underline"
                  >
                    Mehr anzeigen ({calzoneExtras.length - INITIAL_ITEMS} weitere)
                  </button>
                )}
                {showAllCalzoneExtras && isExpandable && (
                  <button
                    onClick={() => setShowAllCalzoneExtras(false)}
                    className="mt-3 text-light-blue-600 hover:text-light-blue-700 font-medium text-sm underline"
                  >
                    Weniger anzeigen
                  </button>
                )}
              </div>
            );
          })()}

          {/* Pide Extras */}
          {item.isPide && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                Extras (+1,50€ pro Extra)
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {pizzaExtras.map((extra) => (
                  <label
                    key={extra}
                    className={`flex items-center space-x-2 p-1.5 rounded-lg border cursor-pointer transition-all text-sm ${
                      selectedPideExtras.includes(extra)
                        ? 'border-light-blue-400 bg-light-blue-50'
                        : 'border-gray-200 hover:border-light-blue-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPideExtras.includes(extra)}
                      onChange={() => handlePideExtraToggle(extra)}
                      className="text-light-blue-400 focus:ring-light-blue-400 w-4 h-4"
                    />
                    <span>{extra}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Pasta Type Selection */}
          {item.isPasta && (!item.isMeatSelection || (currentStep !== 'sauce' && currentStep !== 'exclusions')) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Nudelsorte wählen *</h3>
              <div className="space-y-2">
                {pastaTypes.map((pastaType) => (
                  <label
                    key={pastaType}
                    className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPastaType === pastaType
                        ? 'border-light-blue-400 bg-light-blue-50'
                        : 'border-gray-200 hover:border-light-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pastaType"
                      value={pastaType}
                      checked={selectedPastaType === pastaType}
                      onChange={(e) => setSelectedPastaType(e.target.value)}
                      className="text-light-blue-400 focus:ring-light-blue-400 w-4 h-4"
                    />
                    <span className="font-medium">{pastaType}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Meat Selection - Only show in step 1 - Now only Kalb */}
          {item.isMeatSelection && currentStep === 'meat' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Fleischauswahl</h3>
              <div className="p-4 rounded-lg border-2 border-light-blue-400 bg-light-blue-50">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-light-blue-400 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Kalbfleisch</span>
                </div>
              </div>
            </div>
          )}

          {/* Granatapfel Syrup Selection for Salads */}
          {item.id >= 564 && item.id <= 568 && item.isSpezialitaet && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Granatapfel-Sirup</h3>
              <div className="space-y-2">
                {granatapfelOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedGranatapfel === option
                        ? 'border-light-blue-400 bg-light-blue-50'
                        : 'border-gray-200 hover:border-light-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="granatapfel"
                      value={option}
                      checked={selectedGranatapfel === option}
                      onChange={(e) => setSelectedGranatapfel(e.target.value)}
                      className="text-light-blue-400 focus:ring-light-blue-400 w-4 h-4"
                    />
                    <span className="font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Sauce Selection */}
          {((item.isSpezialitaet && ![81, 82, 564, 565, 566, 567, 568].includes(item.id) && !item.isMeatSelection) ||
            (item.id >= 564 && item.id <= 568 && item.isSpezialitaet) ||
            (item.isMeatSelection && currentStep === 'sauce') ||
            item.isFalafel ||
            item.isBaguette ||
            ((!item.isPizza && [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 50, 51, 52, 53, 54, 55, 56, 57, 61, 62, 74, 75, 76, 77, 78, 79].includes(item.number)) || (item.number === 88 && currentStep === 'sauce'))) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                {item.id >= 564 && item.id <= 568 ? 'Dressing wählen (1. kostenlos, weitere +1,00€)' : [78, 79].includes(item.number) ? 'Soßen wählen (1. kostenlos, weitere +1,00€ / max. 3)' : ((item.isMeatSelection && currentStep === 'sauce') || [74, 75, 76, 77, 88].includes(item.number) ? 'Soßen wählen (max. 3)' : item.isFalafel ? 'Soßen wählen (max. 3)' : [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 50, 51, 52, 53, 54, 55, 56, 57].includes(item.number) ? 'Soße wählen' : item.isBaguette ? 'Soße wählen' : 'Soße wählen')}
                {!item.isMeatSelection && !item.isFalafel && !item.isBaguette && ![8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 50, 51, 52, 53, 54, 55, 56, 57, 74, 75, 76, 77, 78, 79, 88].includes(item.number) && ((item.isSpezialitaet && ![81, 82].includes(item.id)) || (item.id >= 564 && item.id <= 568)) ? ' *' : ''}
              </h3>

              {(item.isMeatSelection && currentStep === 'sauce') || item.isFalafel || (item.id >= 564 && item.id <= 568) || (!item.isPizza && [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 50, 51, 52, 53, 54, 55, 56, 57, 61, 62, 74, 75, 76, 77, 78, 79, 88].includes(item.number)) ? (
                // Multiple selection for meat selection items in step 2, falafel items, salad items, and snack items
                <div className="space-y-2">
                  {getVisibleSauceOptions().map((sauce) => {
                    const isDisabled = ((item.isMeatSelection || item.isFalafel || [74, 75, 76, 77, 78, 79, 88].includes(item.number)) && !selectedSauces.includes(sauce) && selectedSauces.length >= 3);
                    return (
                      <label
                        key={sauce}
                        className={`flex items-center justify-between p-2 rounded-lg border-2 transition-all ${
                          selectedSauces.includes(sauce)
                            ? 'border-orange-500 bg-orange-50'
                            : isDisabled
                            ? 'border-gray-200 opacity-50 cursor-not-allowed'
                            : 'border-gray-200 hover:border-orange-300 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedSauces.includes(sauce)}
                            onChange={() => handleSauceToggle(sauce)}
                            disabled={isDisabled}
                            className="text-light-blue-400 focus:ring-light-blue-400 w-4 h-4"
                          />
                          <span className="font-medium">{sauce}</span>
                        </div>
                        {(item.id >= 564 && item.id <= 568) && selectedSauces.indexOf(sauce) >= 1 && selectedSauces.includes(sauce) && (
                          <span className="text-sm text-gray-600 font-semibold">+1,00 €</span>
                        )}
                        {[78, 79].includes(item.number) && selectedSauces.indexOf(sauce) >= 1 && selectedSauces.includes(sauce) && (
                          <span className="text-sm text-gray-600 font-semibold">+1,00 €</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              ) : (
                // Single selection for other items
                <div className="space-y-2">
                  {getVisibleSauceOptions().map((sauce) => (
                    <label
                      key={sauce}
                      className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedSauce === sauce
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sauce"
                        value={sauce}
                        checked={selectedSauce === sauce}
                        onChange={(e) => setSelectedSauce(e.target.value)}
                        className="text-light-blue-400 focus:ring-light-blue-400 w-4 h-4"
                      />
                      <span className="font-medium">{sauce}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Show More/Less Button for Sauce Selection in Step 2, falafel items, and Sucuk items */}
              {((item.isMeatSelection && currentStep === 'sauce') || item.isFalafel || (!item.isPizza && [6, 7, 8, 10, 11, 12, 14, 15, 16, 17, 18, 19, 50, 51, 52, 53, 54, 55, 56, 57, 61, 62, 74, 75, 76, 77, 78, 79, 88].includes(item.number))) && getSauceOptions().length > 3 && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setShowAllSauces(!showAllSauces)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-light-blue-600 hover:text-light-blue-700 hover:bg-light-blue-50 rounded-lg transition-colors"
                  >
                    {showAllSauces ? (
                      <>
                        <span>Weniger anzeigen</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Mehr anzeigen ({getSauceOptions().length - 3} weitere)</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Pizza Sauce Selection - Only show in step 3 for pizza items */}
          {item.isPizza && currentStep === 'pizzaSauce' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Soße wählen (1. kostenlos, weitere +1,00€ / max. 3)</h3>
              <div className="space-y-2">
                {sauceTypes.map((sauce, index) => {
                  const isDisabled = !selectedPizzaSauces.includes(sauce) && selectedPizzaSauces.length >= 3 && selectedPizzaSauces[0] !== 'ohne Soße';
                  const isPriced = selectedPizzaSauces.includes(sauce) && selectedPizzaSauces.indexOf(sauce) > 0;
                  const isFree = selectedPizzaSauces.includes(sauce) && selectedPizzaSauces.indexOf(sauce) === 0;

                  return (
                    <label
                      key={sauce}
                      className={`flex items-center justify-between p-2 rounded-lg border-2 transition-all ${
                        selectedPizzaSauces.includes(sauce)
                          ? 'border-orange-500 bg-orange-50'
                          : isDisabled
                          ? 'border-gray-200 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-orange-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedPizzaSauces.includes(sauce)}
                          onChange={() => handlePizzaSauceToggle(sauce)}
                          disabled={isDisabled}
                          className="text-light-blue-400 focus:ring-light-blue-400 w-4 h-4"
                        />
                        <span className="font-medium">{sauce}</span>
                      </div>
                      {isFree && selectedPizzaSauces.length > 0 && (
                        <span className="text-sm text-green-600 font-semibold">kostenlos</span>
                      )}
                      {isPriced && (
                        <span className="text-sm text-gray-600 font-semibold">+1,00 €</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {item.isCalzone && currentStep === 'calzoneSauce' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Soße wählen (1. kostenlos, weitere +1,00€ / max. 3)</h3>
              <div className="space-y-2">
                {sauceTypes.map((sauce, index) => {
                  const isDisabled = !selectedCalzoneSauces.includes(sauce) && selectedCalzoneSauces.length >= 3 && selectedCalzoneSauces[0] !== 'ohne Soße';
                  const isPriced = selectedCalzoneSauces.includes(sauce) && selectedCalzoneSauces.indexOf(sauce) > 0;
                  const isFree = selectedCalzoneSauces.includes(sauce) && selectedCalzoneSauces.indexOf(sauce) === 0;

                  return (
                    <label
                      key={sauce}
                      className={`flex items-center justify-between p-2 rounded-lg border-2 transition-all ${
                        selectedCalzoneSauces.includes(sauce)
                          ? 'border-orange-500 bg-orange-50'
                          : isDisabled
                          ? 'border-gray-200 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-orange-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedCalzoneSauces.includes(sauce)}
                          onChange={() => handleCalzoneSauceToggle(sauce)}
                          disabled={isDisabled}
                          className="text-light-blue-400 focus:ring-light-blue-400 w-4 h-4"
                        />
                        <span className="font-medium">{sauce}</span>
                      </div>
                      {isFree && selectedCalzoneSauces.length > 0 && (
                        <span className="text-sm text-green-600 font-semibold">kostenlos</span>
                      )}
                      {isPriced && (
                        <span className="text-sm text-gray-600 font-semibold">+1,00 €</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Salad Exclusions - Only show in step 3 for meat selection items, or step 2 for item 88 */}
          {item.isMeatSelection && currentStep === 'exclusions' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Salat anpassen (mehrere möglich, optional)</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Wählen Sie aus, was Sie nicht in Ihrem Salat möchten:</p>
              <div className="space-y-1.5">
                {getVisibleExclusionOptions().map((exclusion) => {
                  const isOhneBeilagen = exclusion === 'Ohne Beilagen bzw. Salate';
                  const isOhneBeilagenSelected = selectedExclusions.includes('Ohne Beilagen bzw. Salate');
                  const isDisabled = !isOhneBeilagen && isOhneBeilagenSelected;

                  return (
                    <label
                      key={exclusion}
                      className={`flex items-center space-x-2 p-1.5 rounded-lg border-2 transition-all ${
                        selectedExclusions.includes(exclusion)
                          ? 'border-light-blue-400 bg-light-blue-50'
                          : isDisabled
                          ? 'border-gray-200 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-light-blue-300 cursor-pointer'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedExclusions.includes(exclusion)}
                        onChange={() => handleExclusionToggle(exclusion)}
                        disabled={isDisabled}
                        className="text-light-blue-400 focus:ring-light-blue-400 w-3.5 h-3.5"
                      />
                      <span className={`text-sm ${isOhneBeilagen ? 'text-red-600 font-medium' : ''}`}>{exclusion}</span>
                    </label>
                  );
                })}
              </div>
              
              {/* Show More/Less Button for Exclusions in Step 3 */}
              {item.isMeatSelection && currentStep === 'exclusions' && saladExclusionOptions.length > 3 && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setShowAllExclusions(!showAllExclusions)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-light-blue-600 hover:text-light-blue-700 hover:bg-light-blue-50 rounded-lg transition-colors"
                  >
                    {showAllExclusions ? (
                      <>
                        <span>Weniger anzeigen</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Mehr anzeigen ({saladExclusionOptions.length - 3} weitere)</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Döner Extras - Only show in extras step (step 4) for meat selection items */}
          {item.isMeatSelection && currentStep === 'extras' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Extras wählen (optional, +1,00€ pro Extra)</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Wählen Sie zusätzliche Extras für Ihr Gericht:</p>
              <div className="space-y-2">
                {donerExtras.map((extra) => (
                  <label
                    key={extra}
                    className={`flex items-center justify-between p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedDonerExtras.includes(extra)
                        ? 'border-light-blue-400 bg-light-blue-50'
                        : 'border-gray-200 hover:border-light-blue-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedDonerExtras.includes(extra)}
                        onChange={() => handleDonerExtraToggle(extra)}
                        className="text-light-blue-400 focus:ring-light-blue-400 w-4 h-4"
                      />
                      <span className="font-medium">{extra}</span>
                    </div>
                    <span className="text-sm text-gray-600 font-semibold">+1,00 €</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Side Dish Selection - Only show in step 5 for items #9 (Döner Teller) and #10 (Hähnchen-Döner Teller) */}
          {(item.number === 9 || item.number === 10) && item.isMeatSelection && currentStep === 'sidedish' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Beilage wählen *</h3>
              <div className="space-y-2">
                {sideDishOptions.map((sideDish) => (
                  <label
                    key={sideDish}
                    className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSideDish === sideDish
                        ? 'border-light-blue-400 bg-light-blue-50'
                        : 'border-gray-200 hover:border-light-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sideDish"
                      value={sideDish}
                      checked={selectedSideDish === sideDish}
                      onChange={(e) => setSelectedSideDish(e.target.value)}
                      className="text-light-blue-400 focus:ring-light-blue-400 w-4 h-4"
                    />
                    <span className="font-medium">{sideDish}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Burger Salad Exclusions - Step 1 for burgers */}
          {item.isBurger && currentStep === 'burgerSalad' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Salat anpassen (mehrere möglich, optional)</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Wählen Sie aus, was Sie nicht in Ihrem Burger möchten:</p>
              <div className="space-y-1.5">
                {burgerSaladExclusions.map((exclusion) => (
                  <label
                    key={exclusion}
                    className={`flex items-center space-x-2 p-1.5 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedBurgerSaladExclusions.includes(exclusion)
                        ? 'border-light-blue-400 bg-light-blue-50'
                        : 'border-gray-200 hover:border-light-blue-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBurgerSaladExclusions.includes(exclusion)}
                      onChange={() => handleBurgerSaladExclusionToggle(exclusion)}
                      className="text-light-blue-400 focus:ring-light-blue-400 w-3.5 h-3.5"
                    />
                    <span className="text-sm">{exclusion}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Burger Sauce Selection - Step 2 for burgers */}
          {item.isBurger && currentStep === 'burgerSauce' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Soße wählen *</h3>
              <div className="space-y-2">
                {burgerSauceTypes.map((sauce) => (
                  <label
                    key={sauce}
                    className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedBurgerSauce === sauce
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="burgerSauce"
                      value={sauce}
                      checked={selectedBurgerSauce === sauce}
                      onChange={(e) => setSelectedBurgerSauce(e.target.value)}
                      className="text-light-blue-400 focus:ring-light-blue-400 w-4 h-4"
                    />
                    <span className="font-medium">{sauce}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Burger Extras - Step 3 for burgers */}
          {item.isBurger && currentStep === 'burgerExtras' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Extras wählen (optional)</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Wählen Sie zusätzliche Extras für Ihren Burger:</p>
              <div className="space-y-2">
                {burgerExtras.map((extra) => (
                  <label
                    key={extra.name}
                    className={`flex items-center justify-between p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedBurgerExtras.includes(extra.name)
                        ? 'border-light-blue-400 bg-light-blue-50'
                        : 'border-gray-200 hover:border-light-blue-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedBurgerExtras.includes(extra.name)}
                        onChange={() => handleBurgerExtraToggle(extra.name)}
                        className="text-light-blue-400 focus:ring-light-blue-400 w-4 h-4"
                      />
                      <span className="font-medium">{extra.name}</span>
                    </div>
                    <span className="text-sm text-gray-600 font-semibold">+{extra.price.toFixed(2).replace('.', ',')} €</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="sticky bottom-0 bg-white pt-3 pb-1 border-t">
            {/* Price Display at Bottom with Breakdown for Pizza */}
            <div className="mb-3 bg-light-blue-50 p-3 rounded-lg">
              {item.isPizza && (selectedExtras.length > 0 || selectedPizzaSauces.length > 0) ? (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">Pizzagröße:</span>
                    <span className="font-medium text-gray-900">{getExtrasPriceBreakdown().basePrice.toFixed(2).replace('.', ',')} €</span>
                  </div>
                  {getExtrasPriceBreakdown().breakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{item.isSauce ? '→ ' : '+ '}{item.name}:</span>
                      <span className="font-medium text-gray-900">
                        {item.price === 0 ? 'kostenlos' : `+${item.price.toFixed(2).replace('.', ',')} €`}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-1.5 mt-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-900">Aktueller Preis:</span>
                      <span className="text-xl font-bold text-light-blue-600">{calculatePrice().toFixed(2).replace('.', ',')} €</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Aktueller Preis</div>
                  <div className="text-2xl font-bold text-light-blue-600">
                    {calculatePrice().toFixed(2).replace('.', ',')} €
                  </div>
                </div>
              )}
            </div>

            {/* Buttons for Pizza Steps */}
            {item.isPizza && (currentStep === 'pizzaExtras' || currentStep === 'pizzaSauce') ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={currentStep === 'pizzaExtras' ? handleBackToPizzaSize : handleBackToPizzaExtras}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors border border-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Zurück
                </button>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-light-blue-400 hover:bg-light-blue-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {currentStep === 'pizzaExtras' ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Weiter
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Hinzufügen
                    </>
                  )}
                </button>
              </div>
            ) : item.isMeatSelection && (currentStep === 'sauce' || currentStep === 'exclusions' || currentStep === 'extras' || currentStep === 'sidedish') ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={
                    currentStep === 'sauce' ? handleBackToMeat :
                    currentStep === 'exclusions' ? handleBackToSauce :
                    currentStep === 'extras' ? handleBackToExclusions :
                    handleBackToExtras
                  }
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors border border-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Zurück
                </button>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-light-blue-400 hover:bg-light-blue-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {currentStep === 'sauce' || currentStep === 'exclusions' || (currentStep === 'extras' && (item.number === 9 || item.number === 10)) ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Weiter
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Hinzufügen
                    </>
                  )}
                </button>
              </div>
            ) : item.isBurger && (currentStep === 'burgerSauce' || currentStep === 'burgerExtras') ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={currentStep === 'burgerSauce' ? handleBackToBurgerSalad : handleBackToBurgerSauce}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors border border-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Zurück
                </button>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-light-blue-400 hover:bg-light-blue-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {currentStep === 'burgerSauce' ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Weiter
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Hinzufügen
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Single button for other cases */
              <button
                onClick={handleAddToCart}
                className="w-full bg-light-blue-400 hover:bg-light-blue-500 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {item.isMeatSelection && currentStep === 'meat' ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {getButtonText()}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {getButtonText()}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        item={item}
        isOpen={showConfirmationModal}
        selectedSize={selectedSize}
        selectedIngredients={selectedIngredients}
        selectedExtras={selectedExtras}
        selectedPastaType={selectedPastaType}
        selectedSauce={
          item.isPizza
            ? undefined
            : item.isBurger
            ? selectedBurgerSauce
            : selectedSauces.length > 0
            ? selectedSauces.join(', ')
            : selectedSauce || selectedMeatType
        }
        selectedPizzaSauces={item.isPizza ? selectedPizzaSauces : undefined}
        selectedExclusions={
          item.isBurger ? selectedBurgerSaladExclusions : selectedExclusions
        }
        selectedSideDish={selectedSideDish}
        totalPrice={confirmationPrice}
        onConfirm={(quantity) => {
          let finalExtras: string[] = [];
          if (item.isBurger) {
            finalExtras = selectedBurgerExtras;
          } else if (item.isMeatSelection) {
            finalExtras = selectedDonerExtras;
          } else if (item.isCalzone) {
            finalExtras = selectedCalzoneExtras;
          } else {
            finalExtras = selectedExtras;
          }
          const finalExclusions = item.isBurger ? selectedBurgerSaladExclusions : selectedExclusions;

          for (let i = 0; i < quantity; i++) {
            onAddToOrder(
              item,
              selectedSize,
              selectedIngredients,
              finalExtras,
              selectedPastaType || undefined,
              item.isBurger
                ? selectedBurgerSauce
                : selectedSauces.length > 0
                ? selectedSauces.join(', ')
                : selectedSauce || selectedMeatType || undefined,
              finalExclusions,
              selectedSideDish || undefined,
              item.isCalzone
                ? (selectedCalzoneSauces.length > 0 ? selectedCalzoneSauces : undefined)
                : (selectedPizzaSauces.length > 0 ? selectedPizzaSauces : undefined)
            );
          }
          setShowConfirmationModal(false);
          onClose();
        }}
        onCancel={() => {
          setShowConfirmationModal(false);
        }}
      />
    </div>
  );
};

export default ItemModal;