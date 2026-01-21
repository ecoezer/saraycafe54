export class AddressFormatter {
  static formatFullAddress(
    street: string,
    houseNumber: string,
    postcode: string,
    zoneLabel?: string
  ): string {
    let address = `${street} ${houseNumber}, ${postcode}`;
    if (zoneLabel) {
      address += ` (${zoneLabel})`;
    }
    return address;
  }

  static formatShortAddress(street: string, houseNumber: string, postcode: string): string {
    return `${street} ${houseNumber}, ${postcode}`;
  }
}
