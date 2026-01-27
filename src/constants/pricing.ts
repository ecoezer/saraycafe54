/**
 * Centralized pricing configuration.
 * All pricing rules in one place for easy maintenance.
 */

// Extra pricing per pizza size
export const PIZZA_EXTRA_PRICING: Record<string, number> = {
  '24cm': 1.00,
  '28cm': 1.50,
  '40cm': 2.50
};

// Calzone extra pricing per size
export const CALZONE_EXTRA_PRICING: Record<string, number> = {
  'Normal': 0.75,
  'Groß': 1.00
};

// Standard extra pricing
export const EXTRA_PRICES = {
  doner: 1.00,       // Per döner extra
  pide: 1.50,        // Per pide extra
  burger: {          // Burger extras have individual prices
    'Extra Fleisch': 2.50,
    'Käse': 1.00,
    'Bacon': 1.50,
    'Ei': 1.00,
    'Zwiebel': 0.50
  }
} as const;

// Sauce pricing
export const SAUCE_PRICING = {
  firstSauceFree: true,
  additionalSaucePrice: 1.00,
  maxSauces: 3
} as const;

// Delivery zone configuration
export const DELIVERY_ZONE_CONFIG = {
  default: {
    minOrder: 15.00,
    fee: 2.00
  }
} as const;

// Pfand (deposit) for bottles
export const PFAND_PRICES = {
  bottle: 0.25,
  crate: 3.10
} as const;

/**
 * Calculate extra price based on item type and size.
 */
export function calculateExtraPrice(
  itemType: 'pizza' | 'calzone' | 'doner' | 'pide' | 'burger' | 'standard',
  sizeName?: string,
  extraName?: string
): number {
  switch (itemType) {
    case 'pizza':
      return PIZZA_EXTRA_PRICING[sizeName || '24cm'] || 1.00;
    case 'calzone':
      return CALZONE_EXTRA_PRICING[sizeName || 'Normal'] || 0.75;
    case 'doner':
      return EXTRA_PRICES.doner;
    case 'pide':
      return EXTRA_PRICES.pide;
    case 'burger':
      if (extraName && extraName in EXTRA_PRICES.burger) {
        return EXTRA_PRICES.burger[extraName as keyof typeof EXTRA_PRICES.burger];
      }
      return 1.00;
    default:
      return 1.00;
  }
}

/**
 * Calculate sauce pricing - first is free, additional cost 1€.
 */
export function calculateSaucePrice(selectedSauces: string[]): number {
  if (selectedSauces.length <= 1) return 0;
  return (selectedSauces.length - 1) * SAUCE_PRICING.additionalSaucePrice;
}

// Backward compatibility
export const PRICING = {
  EXTRA_PRICE: 1.00
};
