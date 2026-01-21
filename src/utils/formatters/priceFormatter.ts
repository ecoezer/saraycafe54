export class PriceFormatter {
  static formatEuro(price: number): string {
    return price.toFixed(2).replace('.', ',') + ' €';
  }

  static formatEuroWithoutSymbol(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }

  static parseEuroString(priceStr: string): number {
    const cleanedStr = priceStr.replace(',', '.').replace(' €', '').replace('€', '').trim();
    return parseFloat(cleanedStr);
  }
}
