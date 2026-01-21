export const allergenData: Record<string, string> = {
  '1': 'mit Süßungsmitteln',
  '2': 'chininhaltig',
  '3': 'mit Farbstoffen',
  '3.1': 'Könnten die Aktivität und Aufmerksamkeit von Kindern beeinträchtigen',
  '4': 'koffeinhaltig',
  '4.1': 'enthält Koffein. Für Kinder, schwangere Frauen und koffeinempfindliche Personen nicht geeignet',
  '5': 'mit Taurin',
  '6': 'mit Antioxidationsmitteln',
  '7': 'mit Phosphat (E 338 bis E 341, E 450 bis E 452)',
  '8': 'mit Eiweiß',
  '8.1': 'mit Milcheiweiß',
  '8.2': 'mit Stärke',
  '9': 'mit Konservierungsstoffen',
  '9.1': 'mit Nitritpökelsalz',
  '9.2': 'mit Nitrat',
  '9.I': 'mit Nitritpökelsalz',
  '10': 'gewachst',
  '11': 'Schwefeldioxid (mehr als 10 mg/kg o. 10 mg/l)',
  '12': 'geschwärzt (Eisen-II-gluconat (E 579) oder Eisen-II-lactat (E 585)',
  '13': 'enthält eine Phenylalaninquelle (z.B. Aspartam)',
  '14': 'mit Geschmacksverstärker',
  '15': 'Erhöhter Koffeingehalt. Für Kinder und Schwangere oder stillende Frauen nicht empfohlen (Getränke mit mehr als 150 mg Koffein pro Liter - hier 300 mg)',
  '16': 'hergestellt aus zerkleinertem Fleisch',
  '17': 'Stabilisatoren',
  '18': 'Säuerungsmittel/-regulatoren',
  '19': 'gentechnisch verändert',
  'A': 'Glutenhaltige Getreide/-erzeugnisse (a. Weizen, b. Roggen, c. Gerste, d. Hafer, e. Dinkel, f. Kamut o. g. Hybridstämme)',
  'Aa': 'Glutenhaltige Getreide/-erzeugnisse (a. Weizen, b. Roggen, c. Gerste, d. Hafer, e. Dinkel, f. Kamut o. g. Hybridstämme)',
  'A1': 'Glutenhaltige Getreide/-erzeugnisse (a. Weizen, b. Roggen, c. Gerste, d. Hafer, e. Dinkel, f. Kamut o. g. Hybridstämme)',
  'Ao': 'Glutenhaltige Getreide/-erzeugnisse (a. Weizen, b. Roggen, c. Gerste, d. Hafer, e. Dinkel, f. Kamut o. g. Hybridstämme)',
  'B': 'Sellerie/-erzeugnisse',
  'C': 'Krebstiere/-erzeugnisse',
  'D': 'Lupine/-erzeugnisse',
  'E': 'Sesam/-erzeugnisse',
  'F': 'Fisch/-erzeugnisse',
  'G': 'Senf/-erzeugnisse',
  'H': 'Erdnüsse/-erzeugnisse',
  'I': 'Milch/-erzeugnisse (inkl. Laktose)',
  'J': 'Schalenfrüchte (Nüsse)-erzeugnisse (a. Mandel, b. Haselnuss, c. Walnuss, d. Cashew, e. Pekannuss, f. Paranuss, g. Pistazie, h. Macadamianuss o. i. Queenslandnuss)',
  'K': 'Eier/-erzeugnisse',
  'L': 'Weichtiere/-erzeugnisse',
  'M': 'Soja/-erzeugnisse',
  'N': 'Sulfite (mehr als 10 mg/kg o. 10 mg/l)'
};

export const parseAllergens = (allergenString?: string): Array<{ code: string; description: string }> => {
  if (!allergenString) return [];

  const allergenCodes = allergenString.split(',').map(code => code.trim());

  return allergenCodes.map(code => ({
    code,
    description: allergenData[code] || 'Unbekanntes Allergen'
  }));
};
