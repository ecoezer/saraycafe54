import { useState, useCallback } from 'react';
import { WhatsAppService } from '../services/WhatsAppService';
import { FirebaseService } from '../services/FirebaseService';
import { OrderTransformer } from '../utils/transformers/orderTransformer';
import { AddressFormatter } from '../utils/formatters/addressFormatter';
import { DeliveryService } from '../services/DeliveryService';
import { OrderFormData } from '../validators/orderValidation';

interface OrderItem {
  menuItem: any;
  quantity: number;
  selectedSize?: any;
  selectedIngredients?: string[];
  selectedExtras?: string[];
  selectedPastaType?: string;
  selectedSauce?: string;
  selectedExclusions?: string[];
  selectedSideDish?: string;
}

export const useOrderSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitOrder = useCallback(async (
    data: OrderFormData,
    orderItems: OrderItem[],
    subtotal: number,
    deliveryFee: number,
    total: number,
    onSuccess: () => void
  ) => {
    if (orderItems.length === 0) {
      setError('Warenkorb ist leer');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let deliveryAddress = 'Abholung';

      if (data.orderType === 'delivery' && data.deliveryZone && data.street && data.houseNumber && data.postcode) {
        const zone = DeliveryService.getZoneInfo(data.deliveryZone);
        deliveryAddress = AddressFormatter.formatFullAddress(
          data.street,
          data.houseNumber,
          data.postcode,
          zone?.label
        );
      }

      const orderData = {
        customer_name: data.name,
        customer_phone: data.phone,
        customer_email: null,
        delivery_address: deliveryAddress,
        items: OrderTransformer.transformCartItems(orderItems),
        total_amount: total,
        notes: [
          data.orderType === 'pickup' ? 'Abholung' : 'Lieferung',
          data.deliveryTime === 'asap' ? 'So schnell wie möglich' : `Um ${data.specificTime} Uhr`,
          data.note
        ].filter(Boolean).join(' | ')
      };

      FirebaseService.saveOrder(orderData)
        .then(() => console.log('Order saved to Firebase successfully'))
        .catch(error => console.error('Error saving order to Firebase:', error));

      const message = WhatsAppService.generateMessage(
        data as any,
        orderItems as any,
        subtotal,
        deliveryFee,
        total
      );
      const whatsappUrl = WhatsAppService.generateWhatsAppUrl(message);

      WhatsAppService.openWhatsApp(whatsappUrl);

      setTimeout(() => {
        onSuccess();
      }, 1000);

    } catch (err) {
      console.error('Order submission error:', err);
      setError('Fehler beim Absenden der Bestellung');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    isSubmitting,
    error,
    submitOrder
  };
};
