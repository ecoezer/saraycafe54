import {
  drehspiessaSauceTypes,
  snackSauceTypes,
  pizzabroetchenSauceTypes,
  saladSauceTypes,
  sauceTypes
} from '../data/menuItems';
import { SPECIAL_ITEM_IDS } from '../constants/menuConfig';

export const getSauceOptions = (itemNumber: number, itemId: number, isSpezialitaet: boolean, isMeatSelection: boolean): readonly string[] => {
  if (isMeatSelection) {
    return drehspiessaSauceTypes;
  }

  if (SPECIAL_ITEM_IDS.VEGETARIAN_NUMBERS.includes(itemNumber)) {
    return drehspiessaSauceTypes;
  }

  if (SPECIAL_ITEM_IDS.PIZZABROETCHEN_NUMBERS.includes(itemNumber)) {
    return pizzabroetchenSauceTypes;
  }

  if (SPECIAL_ITEM_IDS.SNACK_NUMBERS.includes(itemNumber)) {
    return snackSauceTypes;
  }

  if (itemId >= 564 && itemId <= 568 && isSpezialitaet) {
    return saladSauceTypes;
  }

  if (SPECIAL_ITEM_IDS.BURGER_NUMBERS.includes(itemNumber)) {
    return sauceTypes.filter(sauce => !['Tzatziki', 'Kräutersoße', 'Curry Sauce'].includes(sauce)).concat('Burger Sauce').sort();
  }

  return sauceTypes;
};
