import { DELIVERY_ZONES } from '../constants/deliveryZones';

export interface DeliveryZoneInfo {
  label: string;
  minOrder: number;
  fee: number;
}

export interface DeliveryCalculation {
  deliveryFee: number;
  canOrder: boolean;
  minOrderMessage: string;
  progress: number;
  remaining: number;
}

export class DeliveryService {
  static getZoneInfo(zoneKey: string): DeliveryZoneInfo | null {
    const zone = DELIVERY_ZONES[zoneKey as keyof typeof DELIVERY_ZONES];
    return zone || null;
  }

  static calculateDeliveryFee(zoneKey: string): number {
    const zone = this.getZoneInfo(zoneKey);
    return zone ? zone.fee : 0;
  }

  static getMinimumOrder(zoneKey: string): number {
    const zone = this.getZoneInfo(zoneKey);
    return zone ? zone.minOrder : 0;
  }

  static calculateDelivery(
    orderType: string,
    zoneKey: string | undefined,
    subtotal: number
  ): DeliveryCalculation {
    if (orderType !== 'delivery' || !zoneKey) {
      return {
        deliveryFee: 0,
        canOrder: true,
        minOrderMessage: '',
        progress: 100,
        remaining: 0
      };
    }

    const zone = this.getZoneInfo(zoneKey);
    if (!zone) {
      return {
        deliveryFee: 0,
        canOrder: true,
        minOrderMessage: '',
        progress: 100,
        remaining: 0
      };
    }

    const remaining = Math.max(0, zone.minOrder - subtotal);
    const canOrder = subtotal >= zone.minOrder;
    const progress = Math.min((subtotal / zone.minOrder) * 100, 100);
    const minOrderMessage = canOrder
      ? ''
      : `Mindestbestellwert für ${zone.label}: ${zone.minOrder.toFixed(2).replace('.', ',')} €`;

    return {
      deliveryFee: zone.fee,
      canOrder,
      minOrderMessage,
      progress,
      remaining
    };
  }

  static getAllZones(): Array<{ key: string; info: DeliveryZoneInfo }> {
    return Object.entries(DELIVERY_ZONES).map(([key, info]) => ({
      key,
      info
    }));
  }
}
