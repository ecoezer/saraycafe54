import React from 'react';
import { Plus, Star, ChefHat, Clock } from 'lucide-react';
import { MenuItem } from '../../types';
import Badge from '../common/Badge';
import { SPECIAL_ITEM_IDS } from '../../constants/menuConfig';

interface MenuItemBadgesProps {
  item: MenuItem;
  isRippchenSpecial: boolean;
  isSchnitzelSpecial: boolean;
  hasSizes: boolean;
}

const MenuItemBadges: React.FC<MenuItemBadgesProps> = ({
  item,
  isRippchenSpecial,
  isSchnitzelSpecial,
  hasSizes
}) => {
  const showSauceSelectionBadge = (
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 50, 51, 52, 53, 54, 55, 56, 57].includes(item.number) ||
    (item.isSpezialitaet && !SPECIAL_ITEM_IDS.SCHNITZEL_WITHOUT_SAUCE.includes(item.id) && !item.isMeatSelection && !(item.id >= 564 && item.id <= 568))
  );

  const showDressingBadge = item.id >= 564 && item.id <= 568 && item.isSpezialitaet;

  return (
    <div className="flex flex-wrap gap-0.5 mt-0.5">
      {isRippchenSpecial && <Badge color="red" icon={<Star className="w-2.5 h-2.5" />} text="RIPPCHEN-TAG" />}
      {isSchnitzelSpecial && <Badge color="red" icon={<Star className="w-2.5 h-2.5" />} text="SCHNITZEL-TAG" />}
      {hasSizes && <Badge color="blue" icon={<Star className="w-2.5 h-2.5" />} text="Größen wählbar" />}
      {item.isWunschPizza && <Badge color="purple" icon={<ChefHat className="w-2.5 h-2.5" />} text="Zutaten wählbar" />}
      {(item.isPizza || item.isWunschPizza) && <Badge color="green" icon={<Plus className="w-2.5 h-2.5" />} text="Extras" />}
      {item.isPasta && <Badge color="yellow" icon={<Clock className="w-2.5 h-2.5" />} text="Nudelsorte" />}
      {showSauceSelectionBadge && <Badge color="red" icon={<ChefHat className="w-2.5 h-2.5" />} text="Soße wählbar" />}
      {showDressingBadge && <Badge color="indigo" icon={<ChefHat className="w-2.5 h-2.5" />} text="Dressing" />}
    </div>
  );
};

export default React.memo(MenuItemBadges);
