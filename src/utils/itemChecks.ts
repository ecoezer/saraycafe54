import { SPECIAL_ITEM_IDS } from '../constants/menuConfig';
import { MenuItem } from '../types';

export const needsConfiguration = (item: MenuItem): boolean => {
  return !!(
    item.sizes ||
    item.isWunschPizza ||
    item.isPizza ||
    item.isPasta ||
    item.isBeerSelection ||
    item.isMeatSelection ||
    item.isSauceSelection ||
    item.isFalafel ||
    item.isPide ||
    item.isBurger ||
    item.isCalzone ||
    (item.isSpezialitaet && !SPECIAL_ITEM_IDS.SCHNITZEL_WITHOUT_SAUCE.includes(item.id) && !item.isMeatSelection) ||
    (item.id >= 564 && item.id <= 568 && item.isSpezialitaet) ||
    SPECIAL_ITEM_IDS.MEAT_SELECTION_NUMBERS.concat(
      SPECIAL_ITEM_IDS.PIZZABROETCHEN_NUMBERS,
      SPECIAL_ITEM_IDS.SNACK_NUMBERS,
      SPECIAL_ITEM_IDS.BURGER_NUMBERS,
      SPECIAL_ITEM_IDS.CALZONE_NUMBERS,
      SPECIAL_ITEM_IDS.VEGETARIAN_NUMBERS
    ).includes(item.number) ||
    SPECIAL_ITEM_IDS.ALCOHOLIC.includes(item.id)
  );
};

export const isRippchenSpecial = (itemId: number, today: number): boolean => {
  return itemId === SPECIAL_ITEM_IDS.RIPPCHEN && today === 3;
};

export const isSchnitzelSpecial = (itemId: number, today: number): boolean => {
  return SPECIAL_ITEM_IDS.SCHNITZEL.includes(itemId) && today === 4;
};

export const isAlcoholicItem = (itemId: number): boolean => {
  return SPECIAL_ITEM_IDS.ALCOHOLIC.includes(itemId);
};
