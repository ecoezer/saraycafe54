export const UI_CONFIG = {
  MOBILE_BREAKPOINT: 1024,
  SCROLL_THRESHOLD: 300,
  CART_ANIMATION_DURATION: 1000,
  CART_CLEAR_DELAY: 800,
  ORDER_SUBMIT_DELAY: 1000,
  MAX_CART_PREVIEW_ITEMS: 2,
  MAX_WUNSCH_PIZZA_INGREDIENTS: 4,
  MAX_MEAT_SAUCES: 3
} as const;

export const BUTTON_CLASSES = {
  scrollButton: 'fixed right-2 bottom-20 w-10 h-10 bg-light-blue-400 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center z-40 border-2 border-white/50 hover:scale-110'
} as const;
