export interface MenuItem {
  id: number;
  number: number | string;
  name: string;
  description?: string;
  price: number;
  allergens?: string;
  sizes?: PizzaSize[];
  pfand?: number;
  isWunschPizza?: boolean;
  isPizza?: boolean;
  isPasta?: boolean;
  isSpezialitaet?: boolean;
  isBeerSelection?: boolean;
  isMeatSelection?: boolean;
  isSauceSelection?: boolean;
  isFalafel?: boolean;
  isPide?: boolean;
  isBaguette?: boolean;
  isBurger?: boolean;
  isCalzone?: boolean;
}

export interface PizzaSize {
  name: string;
  price: number;
  description?: string;
}

export interface OrderItem {
  cartItemId: string; // Unique ID for the item in the cart
  menuItem: MenuItem;
  quantity: number;
  selectedSize?: PizzaSize;
  selectedIngredients?: string[];
  selectedExtras?: string[];
  selectedPastaType?: string;
  selectedSauce?: string;
  selectedPizzaSauces?: string[];
  selectedCalzoneSauces?: string[];
  selectedExclusions?: string[];
  selectedSideDish?: string;
}

export interface CustomerInfo {
  name: string;
  address: string;
  phone: string;
  note?: string;
}

export interface MenuSectionConfig {
  id: string;
  title: string;
  description: string;
  items: readonly MenuItem[];
}

export interface BadgeProps {
  color: 'red' | 'blue' | 'green' | 'purple' | 'yellow' | 'indigo' | 'amber';
  icon: React.ReactNode;
  text: string;
}

export interface ProductFrequency {
  name: string;
  count: number;
  revenue: number;
}

export interface DeviceStats {
  mobile: number;
  tablet: number;
  desktop: number;
}

export interface OSStats {
  ios: number;
  android: number;
}

export interface BrowserStats {
  name: string;
  count: number;
}

export interface AnalyticsMetrics {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  pickupDeliveryRatio: {
    pickup: number;
    delivery: number;
  };
}