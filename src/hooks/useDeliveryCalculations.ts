import { useMemo } from 'react';
import { DeliveryService } from '../services/DeliveryService';

export const useDeliveryCalculations = (
  orderType: string,
  deliveryZone: string | undefined,
  subtotal: number
) => {
  const deliveryCalculation = useMemo(() => {
    return DeliveryService.calculateDelivery(orderType, deliveryZone, subtotal);
  }, [orderType, deliveryZone, subtotal]);

  const total = useMemo(() => {
    return subtotal + deliveryCalculation.deliveryFee;
  }, [subtotal, deliveryCalculation.deliveryFee]);

  return {
    deliveryFee: deliveryCalculation.deliveryFee,
    canOrder: deliveryCalculation.canOrder,
    minOrderMessage: deliveryCalculation.minOrderMessage,
    progress: deliveryCalculation.progress,
    remaining: deliveryCalculation.remaining,
    total
  };
};
