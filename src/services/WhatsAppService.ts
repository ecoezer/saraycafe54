import { DELIVERY_ZONES } from '../constants/deliveryZones';
import { PriceService } from './PriceService';

interface OrderItem {
  menuItem: {
    id: number;
    name: string;
    number: string | number;
  };
  quantity: number;
  selectedSize?: { name: string };
  selectedIngredients?: string[];
  selectedExtras?: string[];
  selectedPastaType?: string;
  selectedSauce?: string;
  selectedExclusions?: string[];
  selectedSideDish?: string;
}

interface OrderFormData {
  name: string;
  phone: string;
  orderType: 'pickup' | 'delivery';
  deliveryZone?: string;
  street?: string;
  houseNumber?: string;
  postcode?: string;
  deliveryTime: 'asap' | 'specific';
  specificTime?: string;
  note?: string;
}

export class WhatsAppService {
  private static readonly PHONE_NUMBER = '+4915224290621';

  static generateMessage(
    data: OrderFormData,
    orderItems: OrderItem[],
    subtotal: number,
    deliveryFee: number,
    total: number
  ): string {
    let message = `*Neue Bestellung*\n\n`;

    message += `*Kunde:* ${data.name}\n`;
    message += `*Telefon:* ${data.phone}\n`;
    message += `*Art:* ${data.orderType === 'pickup' ? 'Abholung' : 'Lieferung'}\n`;

    if (data.orderType === 'delivery' && data.deliveryZone) {
      const zone = DELIVERY_ZONES[data.deliveryZone as keyof typeof DELIVERY_ZONES];
      message += `*Adresse:* ${data.street} ${data.houseNumber}, ${data.postcode}\n`;
      message += `*Gebiet:* ${zone?.label}\n`;
    }

    message += `*Zeit:* ${data.deliveryTime === 'asap' ? 'So schnell wie möglich' : `Um ${data.specificTime} Uhr`}\n\n`;

    message += `*Bestellung:*\n`;
    orderItems.forEach(item => {
      let itemText = `${item.quantity}x Nr. ${item.menuItem.number} ${item.menuItem.name}`;

      if (item.selectedSize) {
        itemText += ` (${item.selectedSize.name})`;
      }

      if (item.selectedPastaType) {
        itemText += ` - Nudelsorte: ${item.selectedPastaType}`;
      }

      if (item.selectedSauce) {
        itemText += ` - Soße: ${item.selectedSauce}`;
      }

      if (item.selectedExclusions && item.selectedExclusions.length > 0) {
        itemText += ` - Salat: ${item.selectedExclusions.join(', ')}`;
      }

      if (item.selectedSideDish) {
        itemText += ` - Beilage: ${item.selectedSideDish}`;
      }

      if (item.selectedIngredients && item.selectedIngredients.length > 0) {
        itemText += ` - Zutaten: ${item.selectedIngredients.join(', ')}`;
      }

      if (item.selectedExtras && item.selectedExtras.length > 0) {
        itemText += ` - Extras: ${item.selectedExtras.join(', ')} (+${(item.selectedExtras.length * 1.00).toFixed(2).replace('.', ',')}€)`;
      }

      const itemTotal = PriceService.calculateItemTotal(item as any);
      itemText += ` = ${PriceService.formatPriceWithoutSymbol(itemTotal)} €`;

      message += `• ${itemText}\n`;
    });

    message += `\n*Zwischensumme:* ${PriceService.formatPriceWithoutSymbol(subtotal)} €\n`;

    if (deliveryFee > 0) {
      message += `*Liefergebühr:* ${PriceService.formatPriceWithoutSymbol(deliveryFee)} €\n`;
    }

    message += `*Gesamtbetrag:* ${PriceService.formatPriceWithoutSymbol(total)} €\n`;

    if (data.note) {
      message += `\n*Anmerkung:* ${data.note}`;
    }

    return message;
  }

  static generateWhatsAppUrl(message: string): string {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${this.PHONE_NUMBER}?text=${encodedMessage}`;
  }

  static isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  static openWhatsApp(url: string): void {
    if (this.isMobile()) {
      try {
        const whatsappWindow = window.open(url, '_blank');
        if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed === 'undefined') {
          window.location.href = url;
        }
      } catch (error) {
        console.error('Error opening WhatsApp:', error);
        window.location.href = url;
      }
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}
