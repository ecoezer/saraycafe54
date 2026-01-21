import React from 'react';
import { MenuItem } from '../../types';
import { formatPriceWithCurrency } from '../../utils/priceCalculations';
import { PRICING } from '../../constants/pricing';

interface PriceDisplayProps {
  item: MenuItem;
  specialRippchen: boolean;
  specialSchnitzel: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ item, specialRippchen, specialSchnitzel }) => {
  if (specialRippchen || specialSchnitzel) {
    const oldPrice = specialRippchen ? PRICING.RIPPCHEN_SPECIAL_OLD_PRICE : PRICING.SCHNITZEL_SPECIAL_OLD_PRICE;
    return (
      <div className="flex items-center gap-2">
        <div className="text-xs text-gray-500 line-through">{formatPriceWithCurrency(oldPrice)}</div>
        <div className="text-sm font-bold text-red-600 animate-pulse">{formatPriceWithCurrency(item.price)}</div>
      </div>
    );
  }
  return (
    <div className="text-sm font-bold text-gray-900">{formatPriceWithCurrency(item.price)}</div>
  );
};

export default React.memo(PriceDisplay);
