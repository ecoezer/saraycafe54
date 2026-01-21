import { MenuItem } from '../types';

// Pizza sizes with prices and descriptions
export const pizzaSizes = [
  { name: 'ø24cm', price: 0, description: 'Klein ø24cm' },
  { name: 'ø28cm', price: 0, description: 'Groß ø28cm' },
  { name: 'ø40cm', price: 0, description: 'Familien ø40cm' }
] as const;

// Pasta types (simple string arrays)
export const pastaTypes = ['Spaghetti', 'Maccheroni'] as const;

// Sauce types grouped by use case (for Baguette)
export const baguetteSauceTypes = [
  'Tzatziki', 'Chili-Sauce', 'Kräutersoße', 'Curry Sauce',
  'Ketchup', 'Mayonnaise', 'ohne Soße'
] as const;

export const sauceTypes = [
  'Tzatziki', 'Chili-Sauce', 'Kräutersoße', 'Curry Sauce',
  'Ketchup', 'Mayonnaise', 'ohne Soße'
] as const;

// Granatapfel-Sirup options for salads
export const granatapfelOptions = ['mit Granatapfel-Sirup', 'ohne Granatapfel-Sirup'] as const;

// Salat sauce types - now same as döner sauces
export const saladSauceTypes = ['Zaziki', 'Scharfer Sauce', 'Ezme', 'Currysauce', 'Cocktailsauce', 'ohne Soße'] as const;

// Drehspieß sauce options (max 3 selectable) - These are the standard sauces for all döner items
export const drehspiessaSauceTypes = ['Zaziki', 'Scharfer Sauce', 'Ezme', 'Currysauce', 'Cocktailsauce', 'ohne Soße'] as const;

// Snack sauce options (same as Drehspieß + Ketchup & Mayo)
export const snackSauceTypes = ['Cocktail-Soße', 'scharfe Soße', 'Tzatziki', 'Ketchup', 'Mayonnaise', 'ohne Soße'] as const;

// Pizzabrötchen sauce options
export const pizzabroetchenSauceTypes = ['Joghurt', 'Kräuterremoulade', 'Chilicheese', 'Cocktail', 'Aioli', 'Tzatziki'] as const;

// Sauce bottle selection for item #89
export const sauceBottleTypes = ['Zaziki', 'Scharfer Sauce', 'Ezme', 'Currysauce', 'Cocktailsauce'] as const;

// Salad exclusion options for Drehspieß items
export const saladExclusionOptions = [
  'Ohne Beilagen bzw. Salate',
  'ohne Eisbergsalat',
  'ohne Zwiebel',
  'ohne Rotkohl',
  'ohne Tomaten',
  'ohne Gurken',
  'ohne Weißkraut'
] as const;

// Side dish options for Döner Teller and Hähnchen-Döner Teller
export const sideDishOptions = ['Pommes frites', 'Reis'] as const;

// Wunsch Pizza ingredients
export const wunschPizzaIngredients = [
  'Ananas', 'Artischocken', 'Barbecuesauce', 'Brokkoli', 'Champignons frisch',
  'Chili-Cheese-Sauce', 'Doppelt Käse', 'Formfleisch-Vorderschinken', 'Gewürzgurken',
  'Gorgonzola', 'Gyros', 'Hirtenkäse', 'Hähnchenbrust', 'Jalapeños',
  'Knoblauchwurst', 'Mais', 'Milde Peperoni', 'Mozzarella', 'Oliven', 'Paprika',
  'Parmaputenschinken', 'Peperoni, scharf', 'Remoulade', 'Rindermett', 'Rindersalami',
  'Rucola', 'Röstzwiebeln', 'Sauce Hollandaise', 'Spiegelei', 'Spinat', 'Tomaten',
  'Würstchen', 'Zwiebeln', 'ohne Zutat'
] as const;

// Pizza extras with size-dependent pricing
export const pizzaExtras = [
  'Ananas', 'Brokkoli', 'Champignons frisch', 'Doppelt Käse', 'Gewürzgurken',
  'Hähnchenbrust', 'Jalapeños', 'Mais', 'Mozzarella', 'Oliven', 'Paprika',
  'Peperoni mild', 'Putenschinken', 'Rindersalami', 'Sauce Hollandaise', 'Spinat',
  'Sucuk', 'Tomaten', 'Zwiebeln', 'Dönerfleisch Kalb', 'Dönerfleisch Hähnchen', 'Weichkäse', 'Thunfisch'
] as const;

// Döner extras (flat 1€ price for all)
export const donerExtras = ['Weichkäse', 'Hollandaise Sauce', 'Jalapeños'] as const;

// Burger salad exclusion options
export const burgerSaladExclusions = [
  'ohne Zwiebeln',
  'ohne Tomaten',
  'ohne Gewürzgurke',
  'ohne Eisbergsalat'
] as const;

// Burger sauce options
export const burgerSauceTypes = [
  'mit Ketchup',
  'mit Mayonnaise',
  'mit Senf',
  'mit Chilisauce'
] as const;

// Calzone extras (same as pizza, but with different size pricing)
export const calzoneExtras = [
  'Ananas', 'Brokkoli', 'Champignons frisch', 'Doppelt Käse', 'Gewürzgurken',
  'Hähnchenbrust', 'Jalapeños', 'Mais', 'Mozzarella', 'Oliven', 'Paprika',
  'Peperoni mild', 'Putenschinken', 'Rindersalami', 'Sauce Hollandaise', 'Spinat',
  'Sucuk', 'Tomaten', 'Zwiebeln', 'Dönerfleisch Kalb', 'Dönerfleisch Hähnchen', 'Weichkäse', 'Thunfisch'
] as const;

// Calzone extras pricing by size (Normal and Groß)
export const calzoneExtrasPricing: { [key: string]: { 'Normal': number; 'Groß': number } } = {
  'Ananas': { 'Normal': 1.00, 'Groß': 1.00 },
  'Brokkoli': { 'Normal': 1.00, 'Groß': 1.00 },
  'Champignons frisch': { 'Normal': 1.00, 'Groß': 1.00 },
  'Doppelt Käse': { 'Normal': 1.00, 'Groß': 1.00 },
  'Gewürzgurken': { 'Normal': 1.00, 'Groß': 1.00 },
  'Hähnchenbrust': { 'Normal': 1.00, 'Groß': 1.00 },
  'Jalapeños': { 'Normal': 1.00, 'Groß': 1.00 },
  'Mais': { 'Normal': 1.00, 'Groß': 1.00 },
  'Mozzarella': { 'Normal': 1.00, 'Groß': 1.00 },
  'Oliven': { 'Normal': 1.00, 'Groß': 1.00 },
  'Paprika': { 'Normal': 1.00, 'Groß': 1.00 },
  'Peperoni mild': { 'Normal': 1.00, 'Groß': 1.00 },
  'Putenschinken': { 'Normal': 1.00, 'Groß': 1.00 },
  'Rindersalami': { 'Normal': 1.00, 'Groß': 1.00 },
  'Sauce Hollandaise': { 'Normal': 1.00, 'Groß': 1.00 },
  'Spinat': { 'Normal': 1.00, 'Groß': 1.00 },
  'Sucuk': { 'Normal': 1.00, 'Groß': 1.00 },
  'Tomaten': { 'Normal': 1.00, 'Groß': 1.00 },
  'Zwiebeln': { 'Normal': 1.00, 'Groß': 1.00 },
  'Dönerfleisch Kalb': { 'Normal': 1.00, 'Groß': 1.00 },
  'Dönerfleisch Hähnchen': { 'Normal': 1.00, 'Groß': 1.00 },
  'Weichkäse': { 'Normal': 1.00, 'Groß': 1.00 },
  'Thunfisch': { 'Normal': 1.00, 'Groß': 1.00 }
} as const;

// Burger extras with pricing
export const burgerExtras = [
  { name: 'Extra Schmelzkäse', price: 0.50 },
  { name: 'Extra Jalapeños', price: 0.50 },
  { name: 'Extra Burger Patty', price: 2.50 }
] as const;

// Pizza extras pricing by size
export const pizzaExtrasPricing: { [key: string]: { '24cm': number; '28cm': number; '40cm': number } } = {
  'Ananas': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Brokkoli': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Champignons frisch': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Doppelt Käse': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Gewürzgurken': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Hähnchenbrust': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Jalapeños': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Mais': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Mozzarella': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Oliven': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Paprika': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Peperoni mild': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Putenschinken': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Rindersalami': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Sauce Hollandaise': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Spinat': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Sucuk': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Tomaten': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Zwiebeln': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Dönerfleisch Kalb': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Dönerfleisch Hähnchen': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Weichkäse': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 },
  'Thunfisch': { '24cm': 1.00, '28cm': 1.50, '40cm': 2.50 }
} as const;

// Pasta
export const pasta: readonly MenuItem[] = [
  { id: 597, number: 97, name: "Spaghetti Bolognese", description: "mit Tomaten-Fleischsauce", price: 9.00, allergens: "Aa, I" },
  { id: 598, number: 98, name: "Makaroni Pikante", description: "mit Sahnesauce & Käse überbacken", price: 9.50, allergens: "Aa, I" },
  { id: 599, number: 99, name: "Makaroni Carbonara", description: "mit Geflügelformschinken, Sahnesauce & Parmesan", price: 9.50, allergens: "Aa, B, I, G, 6, 9, 9.I, 17" }
];

// Nachtisch (Desserts)
export const nachtisch: readonly MenuItem[] = [
  { id: 950, number: 130, name: "Hausgemachter Käsekuchen", description: "Stückpreis", price: 4.20 },
  { id: 951, number: 131, name: "Hausgemachtes Tiramisu", description: "Stückpreis", price: 4.20 },
  { id: 952, number: 132, name: "Erdbeer-Spaghetti-Eis", description: "", price: 3.90 },
  { id: 953, number: 133, name: "Linsensuppe mit Brotbeilage", description: "", price: 5.00 },
  { id: 954, number: 134, name: "Baklava-Dreieck (Muska)", description: "Stückpreis", price: 2.50 },
  { id: 955, number: 135, name: "Baklava-Viereck mit Pistazien", description: "Stückpreis", price: 1.50 }
];

// Pide
export const pide: readonly MenuItem[] = [
  { id: 570, number: 70, name: "Pide Döner", description: "mit Dönerfleisch & Pizzakäse", price: 11.00, allergens: "Aa, G, I, M, 14, 17, 18", isPide: true },
  { id: 571, number: 71, name: "Pide Sucuk", description: "mit Knoblauchwurst & Ei", price: 11.00, allergens: "Aa, B, G, I, K, M, 3, 6, 9, 14, 17, 18", isPide: true },
  { id: 572, number: 72, name: "Pide Spinat", description: "mit Spinat, Ei & Weichkäse", price: 10.50, allergens: "Aa, I, K", isPide: true },
  { id: 573, number: 73, name: "Pide Gouda", description: "mit Pizzakäse", price: 9.50, allergens: "Aa, I", isPide: true }
];

// Falafel, Burger & co
export const croques: readonly MenuItem[] = [
  { id: 675, number: 75, name: "Falafel-Tasche", description: "mit Salat & Sauce", price: 7.50, allergens: "Aa, E, G", isFalafel: true },
  { id: 676, number: 76, name: "Falafel-Dürüm", description: "mit Salat & Sauce", price: 8.50, allergens: "Aa, E, G", isFalafel: true },
  { id: 677, number: 77, name: "Falafel-Teller", description: "mit 6 Falafelstücken, Pommes, gemischtem Salat, Krautsalat & Sauce", price: 11.00, allergens: "Aa, E, G", isFalafel: true },
  { id: 678, number: 78, name: "Chicken Nuggets", description: "mit 4 Stück & Pommes", price: 6.50, allergens: "Ao, I, 8.2" },
  { id: 679, number: 79, name: "Chicken Nuggets Teller", description: "mit 6 Stück, Pommes, gemischtem Salat, Krautsalat & Sauce", price: 11.00, allergens: "Ao, I, 8.2" },
  { id: 680, number: 80, name: "Currywurst", description: "mit Geflügelcurrywurst, Pommes & Currysauce", price: 8.50, allergens: "Ao, G, I, K, 6, 8.2, 9, 9.I, 17" },
  { id: 681, number: 81, name: "Hamburger", description: "mit 125 g Patty", price: 5.50, allergens: "Aa, B, G", isBurger: true },
  { id: 682, number: 82, name: "Cheeseburger", description: "mit 125 g Patty & Käse", price: 6.00, allergens: "Aa, B, G, I", isBurger: true },
  { id: 683, number: "82a", name: "Chili-Cheese-Burger", description: "mit 125 g Patty & Jalapeños", price: 6.50, allergens: "Aa, B, G, I", isBurger: true },
  { id: 684, number: 83, name: "Chickenburger", description: "mit 125 g Patty", price: 6.50, allergens: "Aa, I, 8.2", isBurger: true },
  { id: 685, number: 84, name: "Dönerburger", description: "mit Weichkäse, Zwiebeln & Sauce", price: 8.00, allergens: "Aa, G, I, M, 14, 17, 18" },
  { id: 686, number: 85, name: "Pommes Groß", description: "", price: 4.50 },
  { id: 687, number: 86, name: "Pommes Klein", description: "", price: 3.50 },
  { id: 688, number: 87, name: "Sigara Börek", description: "mit 5 Stück", price: 6.50, allergens: "Aa, I" },
  { id: 689, number: 88, name: "Sigara Börek Menü", description: "mit 5 Stück, Salat & Sauce", price: 9.00, allergens: "Aa, I", isMeatSelection: true },
  { id: 692, number: "M1", name: "Hamburger Menü", description: "Hamburger, Pommes & Cola (0,33l)", price: 10.50, allergens: "Aa, B, G, 3, 4, 18", isBurger: true },
  { id: 693, number: "M2", name: "Döner Menü", description: "Dönerfleisch (Hähnchen oder Rind), Pommes & Cola (0,33l)", price: 13.50, allergens: "G, I, M, 14, 17, 18, 3, 4" },
  { id: 694, number: "M3", name: "Döner-Burger Menü", description: "Döner-Burger, Pommes & Cola (0,33l)", price: 12.50, allergens: "Aa, G, I, M, 14, 17, 18, 3, 4" }
];

// Schnitzel
export const schnitzel: readonly MenuItem[] = [
  { id: 590, number: 90, name: "Chili-Schnitzel", description: "mit Chilisauce", price: 12.00, isSpezialitaet: true },
  { id: 591, number: 91, name: "Jägerschnitzel", description: "mit Champignon-Sahne-Sauce", price: 12.00, isSpezialitaet: true },
  { id: 592, number: 92, name: "Zigeunerschnitzel", description: "mit cremiger Paprika-Sahne-Sauce", price: 12.00, isSpezialitaet: true },
  { id: 593, number: 93, name: "Hollandaise Schnitzel", description: "mit Hollandaisesauce", price: 13.00, isSpezialitaet: true },
  { id: 594, number: 94, name: "Wiener Schnitzel", description: "mit Zitrone", price: 11.00, isSpezialitaet: true },
  { id: 595, number: 95, name: "Schnitzel Überbacken", description: "mit Hollandaisesauce & Hartkäse überbacken", price: 13.50, isSpezialitaet: true },
  { id: 596, number: 96, name: "Hawaii Schnitzel", description: "mit Ananas", price: 12.00, isSpezialitaet: true }
];

// Auflauf
export const auflauf: readonly MenuItem[] = [
  { id: 6951, number: 15, name: "Döner-Auflauf (Mixfleisch)", description: "Kalb- und Hähnchendöner, Hollandaise-Sauce, mit Käse überbacken dazu Salat und Brot", price: 13.50, isSpezialitaet: true, allergens: "Aa, B, G, E, I, K, M, 3, 14, 17, 18" },
  { id: 6961, number: 16, name: "Döner-Auflauf", description: "Kalbdöner, Tomatensauce, Jägersauce, Paprikasauce mit Käse überbacken dazu Salat und Brot", price: 13.00, isSpezialitaet: true, allergens: "Aa, G, I, M, 14, 17, 18" },
  { id: 6971, number: 17, name: "Hähnchendöner-Auflauf", description: "Hähnchendöner, Tomatensauce, Jägersauce, Paprikasauce mit Käse überbacken dazu Salat und Brot", price: 12.50, isSpezialitaet: true, allergens: "Aa, G, I, M, 14, 17, 18" },
  { id: 6981, number: 18, name: "Gemüse-Auflauf", description: "Paprika, Brokkoli, Champignons, Tomaten-Sahnesauce, mit Käse überbacken dazu Salat und Brot", price: 12.00, isSpezialitaet: true, allergens: "Aa, I" }
];

// Salads
export const salads: readonly MenuItem[] = [
  { id: 564, number: 105, name: "Bauernsalat", description: "mit Eisbergsalat, Tomaten, Paprika & Oliven", price: 8.00, isSpezialitaet: true, allergens: "Aa, I" },
  { id: 565, number: 106, name: "Weichkäsesalat", description: "mit Weichkäse, Tomaten, Gurken, Paprika & Oliven", price: 9.00, isSpezialitaet: true, allergens: "Aa, I" },
  { id: 566, number: 107, name: "Schinken-Käse-Salat", description: "mit Eisbergsalat, Tomaten, Gurken, Paprika, Zwiebeln & Goudakäse", price: 8.50, isSpezialitaet: true, allergens: "Aa, B, I, G, 6, 9, 9.I, 17" },
  { id: 567, number: 108, name: "Thunfischsalat", description: "mit Eisbergsalat, Tomaten, Gurken, Paprika & Thunfisch", price: 8.50, isSpezialitaet: true, allergens: "Aa, F, I" },
  { id: 568, number: 109, name: "Maissalat", description: "mit Tomaten, Gurken, Paprika & Mais", price: 9.00, isSpezialitaet: true, allergens: "Aa, I" },
  { id: 569, number: 110, name: "Krautsalat", description: "mit Krautsalat & Zaziki", price: 7.00, isSpezialitaet: true, allergens: "Aa, I" },
  { id: 810, number: 111, name: "Tomatensalat", description: "mit Tomaten, Gurken, Zwiebeln, Paprika & Weichkäse", price: 9.00, isSpezialitaet: true, allergens: "Aa, I" },
  { id: 811, number: 112, name: "Happy Salat", description: "mit Tomaten, Gurken, Eisbergsalat & Hähnchenfleisch", price: 9.00, isSpezialitaet: true, allergens: "Aa, I" },
  { id: 812, number: 113, name: "Saray Salat", description: "mit gemischtem Salat, Reis, Dönerfleisch & Sauce", price: 11.00, isSpezialitaet: true, allergens: "Aa, G, I, M, 14, 17, 18" }
];

// Dips
export const dips: readonly MenuItem[] = [
  { id: 690, number: 89, name: "Zaziki", description: "", price: 2.50, sizes: [
    { name: '125g', price: 2.50, description: '125g' },
    { name: '250g', price: 3.50, description: '250g' }
  ]},
  { id: 6901, number: 89, name: "Scharfer Sauce", description: "", price: 2.50, sizes: [
    { name: '125g', price: 2.50, description: '125g' },
    { name: '250g', price: 3.50, description: '250g' }
  ]},
  { id: 6902, number: 89, name: "Ezme", description: "", price: 2.50, sizes: [
    { name: '125g', price: 2.50, description: '125g' },
    { name: '250g', price: 3.50, description: '250g' }
  ]},
  { id: 6903, number: 89, name: "Currysauce", description: "", price: 2.50, sizes: [
    { name: '125g', price: 2.50, description: '125g' },
    { name: '250g', price: 3.50, description: '250g' }
  ]},
  { id: 6904, number: 89, name: "Cocktailsauce", description: "", price: 2.50, sizes: [
    { name: '125g', price: 2.50, description: '125g' },
    { name: '250g', price: 3.50, description: '250g' }
  ]},
  { id: 691, number: "89a", name: "Ketchup", description: "", price: 0.50 },
  { id: 6911, number: "89b", name: "Mayonnaise", description: "", price: 0.50 }
];

// Alkoholfreie Getränke
export const alkoholfreieGetraenke: readonly MenuItem[] = [
  { id: 820, number: "", name: "Coca Cola", description: "0,33l", price: 2.50, pfand: 0.25, allergens: "3, 4, 18" },
  { id: 821, number: "", name: "Coca Cola Light", description: "0,33l", price: 2.50, pfand: 0.25, allergens: "1, 3, 4, 13, 18" },
  { id: 823, number: "", name: "Sprite", description: "0,33l", price: 2.50, pfand: 0.25, allergens: "18" },
  { id: 824, number: "", name: "Mezzo Mix", description: "0,33l", price: 2.50, pfand: 0.25, allergens: "3, 4, 17, 18" },
  { id: 825, number: "", name: "Fanta", description: "0,33l", price: 2.50, pfand: 0.25, allergens: "3, 6, 17, 18" },
  { id: 826, number: "", name: "Coca Cola", description: "1,0l", price: 3.50, pfand: 0.25, allergens: "3, 4, 18" },
  { id: 827, number: "", name: "Coca Cola Light", description: "1,0l", price: 3.50, pfand: 0.25, allergens: "1, 3, 4, 13, 18" },
  { id: 828, number: "", name: "Mezzo Mix", description: "1,0l", price: 3.50, pfand: 0.25, allergens: "3, 4, 17, 18" },
  { id: 829, number: "", name: "Fanta", description: "1,0l", price: 3.50, pfand: 0.25, allergens: "3, 6, 17, 18" },
  { id: 830, number: "", name: "Sprite", description: "1,0l", price: 3.50, pfand: 0.25, allergens: "18" },
  { id: 831, number: "", name: "Ayran", description: "0,25l", price: 2.00, allergens: "I" },
  { id: 836, number: "", name: "Wasser still", description: "0,5l", price: 2.00, pfand: 0.25 },
  { id: 837, number: "", name: "Wasser mit Kohlensäure", description: "0,5l", price: 2.00, pfand: 0.25 },
  { id: 838, number: "", name: "Fritz Limo Orange", description: "3,3l", price: 3.30, pfand: 0.08 },
  { id: 839, number: "", name: "Fritz Limo Zitrone", description: "3,3l", price: 3.30, pfand: 0.08 },
  { id: 822, number: "", name: "Uludag", description: "0,33l", price: 2.50, pfand: 0.25 },
  { id: 832, number: "", name: "Fanta Exotic", description: "0,33l", price: 2.50, pfand: 0.25, allergens: "3, 6, 17, 18" },
  { id: 835, number: "", name: "Uludag Orange", description: "0,33l", price: 2.50, pfand: 0.25 },
  { id: 833, number: "", name: "Hot Blood Eistee Pfirsich", description: "0,33l", price: 2.50, pfand: 0.25 },
  { id: 834, number: "", name: "Fuze Tea Zitrone", description: "0,33l", price: 2.50, pfand: 0.25 },
  { id: 840, number: "", name: "Capri-Sonne", description: "0,25l", price: 1.50 }
];

// Alkoholische Getränke
export const alkoholischeGetraenke: readonly MenuItem[] = [
  { id: 7931, number: "", name: "Beck's", description: "0,33l", price: 2.50, pfand: 0.08, allergens: "Aa" },
  { id: 7932, number: "", name: "Krombacher", description: "0,33l", price: 2.50, pfand: 0.08, allergens: "Aa" },
  { id: 7933, number: "", name: "Beck's Gold", description: "0,33l", price: 2.50, pfand: 0.08, allergens: "Aa" },
  { id: 7934, number: "", name: "Beck's Lemon", description: "0,33l", price: 2.50, pfand: 0.08, allergens: "Aa" },
  { id: 7941, number: "", name: "Schneider Weisse Hefeweissbier", description: "0,5l", price: 3.80, pfand: 0.08, allergens: "Aa" },
  { id: 7942, number: "", name: "Alkoholfrei Hefeweizen Bier", description: "0,5l", price: 3.80, pfand: 0.08, allergens: "Aa" }
];

// Grillspezialitäten
export const grillspezialitaeten: readonly MenuItem[] = [
  { id: 720, number: 120, name: "Köfte Teller", description: "mit 5 Frikadellen, Salat, Sauce & Pommes oder Reis", price: 13.50, allergens: "Aa" },
  { id: 721, number: 121, name: "Mix Köfte Teller", description: "mit 4 Frikadellen, Hähnchenbrustfilet, Salat, Sauce & Pommes oder Reis", price: 15.50, allergens: "Aa" },
  { id: 722, number: 122, name: "Hähnchenteller", description: "mit Hähnchenbrustfilet, Salat, Sauce & Pommes oder Reis", price: 13.50, allergens: "Aa" },
  { id: 723, number: 123, name: "Köfte-Tasche", description: "mit 3 Frikadellen, Tomaten, Zwiebeln & Sauce", price: 9.50, allergens: "Aa" },
  { id: 724, number: 124, name: "Köfte-Dürüm", description: "mit 3 Frikadellen, Tomaten & Zwiebeln", price: 10.00, allergens: "Aa" },
  { id: 725, number: 125, name: "Sucuk Teller", description: "mit Knoblauchwurst, Salat, Sauce, Tomaten, Zwiebeln & Pommes oder Reis", price: 13.50, allergens: "Aa, B, G, M, 3, 6, 9, 14, 17, 18" },
  { id: 726, number: 126, name: "Sucuk-Dürüm", description: "mit Knoblauchwurst, Salat, Sauce, Tomaten & Zwiebeln", price: 10.00, allergens: "Aa, B, G, M, 3, 6, 9, 14, 17, 18" }
];

// Drehspieß (Meat dishes)
export const fleischgerichte: readonly MenuItem[] = [
  { id: 529, number: 1, name: "Döner Kebabtasche", description: "Salat, Tomaten, Zwiebeln, Sauce", price: 9.00, isSpezialitaet: true, isMeatSelection: true, allergens: "A1, G, 1, M, 14, 17, 18" },
  { id: 5291, number: "1a", name: "Döner Kebabtasche XL", description: "Salat, Tomaten, Zwiebeln, Sauce", price: 10.00, isSpezialitaet: true, isMeatSelection: true, allergens: "A1, G, 1, M, 14, 17, 18" },
  { id: 530, number: 2, name: "Döner Kebabtasche mit Weichkäse", description: "Salat, Tomaten, Zwiebeln, Sauce", price: 9.50, isSpezialitaet: true, isMeatSelection: true, allergens: "A1, G, I, 1, M, 14, 17, 18" },
  { id: 531, number: 3, name: "Dürüm Döner", description: "Salat, Tomaten, Zwiebeln, Sauce", price: 9.50, isSpezialitaet: true, isMeatSelection: true, allergens: "A1, G, 1, M, 14, 17, 18" },
  { id: 532, number: 4, name: "Dönerbox", description: "Pommes oder Salat, Kalb- oder Hähnchendöner, Sauce", price: 8.00, isSpezialitaet: true, isMeatSelection: true, allergens: "A1, G, 1, M, 14, 17, 18" },
  { id: 840, number: 5, name: "Vegetarisch im Fladenbrot", description: "Salat, Tomaten, Zwiebeln, Weichkäse, Sauce", price: 7.50, isSpezialitaet: true, allergens: "A1, I" },
  { id: 841, number: 6, name: "Vegetarisch Dürüm", description: "Salat, Tomaten, Zwiebeln, Weichkäse, Sauce", price: 8.50, isSpezialitaet: true, allergens: "A1, I" },
  { id: 533, number: 7, name: "Hähnchen Kebabtasche", description: "Salat, Tomaten, Zwiebeln, Sauce (Weichkäse +1,00 € extra)", price: 8.50, isSpezialitaet: true, isMeatSelection: true, allergens: "A1, G, 1, M, 14, 17, 18" },
  { id: 534, number: 8, name: "Hähnchen Dürüm", description: "Salat, Tomaten, Zwiebeln, Sauce (Weichkäse +1,00 € extra)", price: 9.00, isSpezialitaet: true, isMeatSelection: true, allergens: "A1, G, 1, M, 14, 17, 18" },
  { id: 535, number: 9, name: "Döner Teller", description: "Pommes oder Reis, gemischter Salat, Krautsalat, Sauce", price: 13.00, isSpezialitaet: true, isMeatSelection: true, allergens: "A1, G, 1, M, 14, 17, 18" },
  { id: 5351, number: 10, name: "Hähnchen-Döner Teller", description: "Pommes oder Reis, gemischter Salat, Krautsalat, Sauce", price: 12.50, isSpezialitaet: true, isMeatSelection: true, allergens: "A1, G, 1, M, 14, 17, 18" },
  { id: 536, number: "10a", name: "Pom-Dürüm", description: "mit Kalb- oder Hähnchendöner, Pommes & Hollandaise-Sauce", price: 10.50, isSpezialitaet: true, isMeatSelection: true, allergens: "A1, G, E, I, K, 1, M, 14, 17, 18" }
];

// Lahmacun
export const lahmacun: readonly MenuItem[] = [
  { id: 666, number: 66, name: "Lahmacun", description: "mit Salat, Tomaten & Sauce", price: 7.00, isSpezialitaet: true, allergens: "Aa" },
  { id: 667, number: 67, name: "Lahmacun-Döner", description: "mit Lahmacun, Dönerfleisch, Salat, Tomaten & Sauce", price: 9.00, isSpezialitaet: true, isMeatSelection: true, allergens: "Aa, G, M, 14, 17, 18" }
];

// Baguette
export const baguette: readonly MenuItem[] = [
  { id: 607, number: 55, name: "Schinken", description: "mit Geflügelformschinken", price: 8.50, allergens: "Aa, B, I, G, 6, 9, 9.I, 17", isBaguette: true },
  { id: 608, number: 56, name: "Salami", description: "mit Geflügelsalami", price: 8.50, allergens: "Aa, B, I, G, 6, 9, 9.I", isBaguette: true },
  { id: 609, number: 57, name: "Bomba", description: "mit Geflügelsalami & Peperoni", price: 9.00, allergens: "Aa, B, I, G, 6, 9, 9.I", isBaguette: true },
  { id: 610, number: 58, name: "Thunfisch", description: "mit Thunfisch & Zwiebeln", price: 9.00, allergens: "Aa, F, I", isBaguette: true },
  { id: 611, number: 59, name: "Hawaii", description: "mit Geflügelformschinken & Ananas", price: 9.00, allergens: "Aa, B, I, G, 6, 9, 9.I, 17", isBaguette: true },
  { id: 612, number: 60, name: "Sucuk", description: "mit Knoblauchwurst & Weichkäse", price: 10.00, allergens: "Aa, B, G, I, M, 3, 6, 9, 14, 17, 18", isBaguette: true },
  { id: 613, number: 61, name: "Döner", description: "mit Kalbdöner & Sauce", price: 10.00, isSpezialitaet: true, allergens: "Aa, G, I, M, 14, 17, 18", isBaguette: true },
  { id: 614, number: 62, name: "Hähnchendöner", description: "mit Hähnchendönerfleisch & Sauce", price: 10.00, isSpezialitaet: true, allergens: "Aa, G, I, M, 14, 17, 18", isBaguette: true },
  { id: 615, number: 63, name: "Hähnchenbrust", description: "mit Hähnchenbrustfilet", price: 10.00, allergens: "Aa, I", isBaguette: true },
  { id: 616, number: 64, name: "Vegetarisch", description: "mit Tomaten & Weichkäse", price: 8.50, allergens: "Aa, I", isBaguette: true }
];

// Calzone sizes
export const calzoneSizes = [
  { name: 'Normal', price: 0, description: 'Normal' },
  { name: 'Groß', price: 0, description: 'Groß' }
] as const;

// Calzone
export const calzone: readonly MenuItem[] = [
  { id: 601, number: 46, name: "Döner", description: "mit Dönerfleisch & Sauce", price: 10.50, allergens: "Aa, G, I, M, 14, 17, 18", isCalzone: true, sizes: [
    { name: 'Normal', price: 10.50, description: 'Normal' },
    { name: 'Groß', price: 12.50, description: 'Groß' }
  ]},
  { id: 602, number: 47, name: "Hähnchendöner", description: "mit Hähnchendönerfleisch & Sauce", price: 10.50, allergens: "Aa, G, I, M, 14, 17, 18", isCalzone: true, sizes: [
    { name: 'Normal', price: 10.50, description: 'Normal' },
    { name: 'Groß', price: 12.50, description: 'Groß' }
  ]},
  { id: 603, number: 48, name: "Döner Mais", description: "mit Dönerfleisch, Zwiebeln, Mais & Tabasco", price: 11.00, allergens: "Aa, G, I, M, 14, 17, 18", isCalzone: true, sizes: [
    { name: 'Normal', price: 11.00, description: 'Normal' },
    { name: 'Groß', price: 13.00, description: 'Groß' }
  ]},
  { id: 604, number: 49, name: "Schinken-Salami", description: "mit Geflügelformschinken, Geflügelsalami & Champignons", price: 10.00, allergens: "Aa, B, I, G, 6, 9, 9.I, 17", isCalzone: true, sizes: [
    { name: 'Normal', price: 10.00, description: 'Normal' },
    { name: 'Groß', price: 12.00, description: 'Groß' }
  ]},
  { id: 605, number: 50, name: "Spinat", description: "mit Spinat, Weichkäse & Knoblauch", price: 9.00, allergens: "Aa, I", isCalzone: true, sizes: [
    { name: 'Normal', price: 9.00, description: 'Normal' },
    { name: 'Groß', price: 11.50, description: 'Groß' }
  ]},
  { id: 606, number: 52, name: "Partypizza", description: "mit Tomatensauce & Käse (60x40cm) - Jeder Extra-Belag +3 €", price: 22.00, allergens: "Aa, I" }
];

// Pizza dishes - Alle Pizzen werden mit Tomatensauce und Käse zubereitet
export const pizzas: readonly MenuItem[] = [
  { id: 520, number: 20, name: "Margherita", description: "mit Tomatensauce & Käse", price: 7.00, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø24cm', price: 7.00, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 8.50, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 15.00, description: 'Familien ø40cm' }
  ]},
  { id: 521, number: 21, name: "Salami", description: "mit Geflügelsalami", price: 8.00, isPizza: true, allergens: "Aa, B, I, G, 6, 9, 9.I", sizes: [
    { name: 'ø24cm', price: 8.00, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 9.50, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 17.00, description: 'Familien ø40cm' }
  ]},
  { id: 522, number: 22, name: "Schinken", description: "mit Geflügelformschinken", price: 8.00, isPizza: true, allergens: "Aa, B, I, G, 6, 9, 9.I, 17", sizes: [
    { name: 'ø24cm', price: 8.00, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 9.50, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 17.00, description: 'Familien ø40cm' }
  ]},
  { id: 523, number: 23, name: "Salami Schinken", description: "mit Geflügelsalami & Geflügelformschinken", price: 8.50, isPizza: true, allergens: "Aa, B, I, G, 6, 9, 9.I, 17", sizes: [
    { name: 'ø24cm', price: 8.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 10.50, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 18.00, description: 'Familien ø40cm' }
  ]},
  { id: 524, number: 24, name: "Salami Champignons Schinken", description: "mit Geflügelsalami, Geflügelformschinken & Champignons", price: 9.50, isPizza: true, allergens: "Aa, B, I, G, 6, 9, 9.I, 17", sizes: [
    { name: 'ø24cm', price: 9.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 12.00, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 21.00, description: 'Familien ø40cm' }
  ]},
  { id: 525, number: 25, name: "Vier Jahreszeiten", description: "mit Geflügelsalami, Geflügelformschinken, Champignons & Paprika", price: 10.00, isPizza: true, allergens: "Aa, B, I, G, 6, 9, 9.I, 17", sizes: [
    { name: 'ø24cm', price: 10.00, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 12.00, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 21.00, description: 'Familien ø40cm' }
  ]},
  { id: 526, number: 26, name: "Thunfisch", description: "mit Thunfisch & Zwiebeln", price: 9.50, isPizza: true, allergens: "Aa, F, I", sizes: [
    { name: 'ø24cm', price: 9.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 11.50, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 21.00, description: 'Familien ø40cm' }
  ]},
  { id: 527, number: 27, name: "Hawaii", description: "mit Geflügelformschinken & Ananas", price: 9.50, isPizza: true, allergens: "Aa, B, I, G, 6, 9, 9.I, 17", sizes: [
    { name: 'ø24cm', price: 9.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 11.50, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 21.00, description: 'Familien ø40cm' }
  ]},
  { id: 528, number: 28, name: "Bomba", description: "mit Geflügelsalami & Peperoni (scharf)", price: 9.50, isPizza: true, allergens: "Aa, B, I, G, 6, 9, 9.I", sizes: [
    { name: 'ø24cm', price: 9.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 11.50, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 20.00, description: 'Familien ø40cm' }
  ]},
  { id: 529, number: 29, name: "Spezial", description: "mit Weichkäse, Zwiebeln, Tomaten & Knoblauch", price: 10.00, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø24cm', price: 10.00, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 12.00, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 21.00, description: 'Familien ø40cm' }
  ]},
  { id: 530, number: 30, name: "Cocktail", description: "mit Geflügelsalami, Paprika, Peperoni & Weichkäse", price: 9.50, isPizza: true, allergens: "Aa, B, I, G, 6, 9, 9.I", sizes: [
    { name: 'ø24cm', price: 9.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 12.00, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 21.00, description: 'Familien ø40cm' }
  ]},
  { id: 531, number: 31, name: "Sucuk", description: "mit türkischer Knoblauchwurst und Ei", price: 9.50, isPizza: true, allergens: "Aa, B, G, I, K, M, 3, 6, 9, 14, 17, 18", sizes: [
    { name: 'ø24cm', price: 9.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 12.00, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 22.00, description: 'Familien ø40cm' }
  ]},
  { id: 532, number: "31a", name: "Pizza Azo", description: "mit Döner, türkischer Knoblauchwurst, Peperoni & Hollandaise-Sauce", price: 11.50, isPizza: true, allergens: "Aa, B, G, E, I, K, M, 3, 6, 9, 14, 17, 18", sizes: [
    { name: 'ø24cm', price: 11.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 13.50, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 25.00, description: 'Familien ø40cm' }
  ]},
  { id: 533, number: "31b", name: "Pizza Jako", description: "mit Hähnchenbrustfilet, Jalapeños & Hollandaise-Sauce", price: 11.50, isPizza: true, allergens: "Aa, B, G, E, I, K, M, 3, 14, 17, 18", sizes: [
    { name: 'ø24cm', price: 11.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 13.50, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 25.00, description: 'Familien ø40cm' }
  ]},
  { id: 534, number: "31c", name: "Pizza Berro", description: "mit Döner, Weichkäse, Peperoni und Zwiebeln", price: 11.50, isPizza: true, allergens: "Aa, G, I, M, 14, 17, 18", sizes: [
    { name: 'ø24cm', price: 11.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 13.50, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 24.00, description: 'Familien ø40cm' }
  ]},
  { id: 535, number: "31d", name: "Funghi", description: "mit frischen Champignons", price: 7.50, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø24cm', price: 7.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 9.00, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 17.00, description: 'Familien ø40cm' }
  ]},
  { id: 536, number: 32, name: "Döner", description: "mit Kalbdönerfleisch & Sauce", price: 9.50, isPizza: true, allergens: "Aa, G, I, M, 14, 17, 18", sizes: [
    { name: 'ø24cm', price: 9.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 12.00, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 23.00, description: 'Familien ø40cm' }
  ]},
  { id: 537, number: 33, name: "Hähnchendöner", description: "mit Hähnchendönerfleisch & Sauce", price: 9.50, isPizza: true, allergens: "Aa, G, I, M, 14, 17, 18", sizes: [
    { name: 'ø24cm', price: 9.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 12.00, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 23.00, description: 'Familien ø40cm' }
  ]},
  { id: 538, number: 34, name: "Döner Hollandaise", description: "mit Kalbdönerfleisch, Zwiebeln, Jalapeños & Hollandaise", price: 11.50, isPizza: true, allergens: "Aa, B, G, E, I, K, M, 3, 14, 17, 18", sizes: [
    { name: 'ø24cm', price: 11.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 13.50, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 25.00, description: 'Familien ø40cm' }
  ]},
  { id: 539, number: 35, name: "Saray", description: "mit Kalb- & Hähnchendönerfleisch, Jalapeños, Mais & Hollandaise", price: 11.50, isPizza: true, allergens: "Aa, B, G, E, I, K, M, 3, 14, 17, 18", sizes: [
    { name: 'ø24cm', price: 11.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 13.50, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 25.00, description: 'Familien ø40cm' }
  ]},
  { id: 540, number: 36, name: "Vegetarisch", description: "mit Spinat, Broccoli & Paprika", price: 9.00, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø24cm', price: 9.00, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 11.50, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 20.00, description: 'Familien ø40cm' }
  ]},
  { id: 541, number: 37, name: "Mozzarella", description: "mit Mozzarella, Zwiebeln & Tomaten", price: 9.50, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø24cm', price: 9.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 11.50, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 21.00, description: 'Familien ø40cm' }
  ]},
  { id: 542, number: 38, name: "Gemüse", description: "mit Spinat, Mais & Knoblauch", price: 10.00, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø24cm', price: 10.00, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 12.00, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 22.00, description: 'Familien ø40cm' }
  ]},
  { id: 543, number: 39, name: "Vier Käse", description: "mit Gouda, Gorgonzola, Mozzarella & Weichkäse", price: 9.50, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø24cm', price: 9.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 11.50, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 21.00, description: 'Familien ø40cm' }
  ]},
  { id: 544, number: 40, name: "Meeresfrüchte", description: "mit Meeresfrüchten, Knoblauch & Oliven", price: 10.50, isPizza: true, allergens: "Aa, I, L", sizes: [
    { name: 'ø24cm', price: 10.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 12.00, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 23.00, description: 'Familien ø40cm' }
  ]},
  { id: 545, number: 41, name: "Hamburger", description: "mit Hamburgerpatty, Eisberg, Tomaten, Zwiebeln & Burger Sauce", price: 11.00, isPizza: true, allergens: "Aa, I, K", sizes: [
    { name: 'ø24cm', price: 11.00, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 13.50, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 25.00, description: 'Familien ø40cm' }
  ]},
  { id: 546, number: 42, name: "Chef", description: "mit Hähnchenbrustfilet, Broccoli, Hollandaise & Mais", price: 11.50, isPizza: true, allergens: "Aa, B, E, I, K, M, 3, 14, 17, 18", sizes: [
    { name: 'ø24cm', price: 11.50, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 13.50, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 25.00, description: 'Familien ø40cm' }
  ]},
  { id: 547, number: 43, name: "Pizzabrot", description: "mit Knoblauchsauce", price: 7.00, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø24cm', price: 7.00, description: 'Klein ø24cm' },
    { name: 'ø28cm', price: 7.00, description: 'Groß ø28cm' },
    { name: 'ø40cm', price: 7.00, description: 'Familien ø40cm' }
  ]}
];