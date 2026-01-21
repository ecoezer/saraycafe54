import { FirebaseService } from './FirebaseService';
import type { OrderData } from './FirebaseService';

export type { OrderData };

export const saveOrder = async (orderData: Omit<OrderData, 'created_at'>): Promise<string> => {
  return FirebaseService.saveOrder(orderData);
};

export const fetchOrders = async (): Promise<OrderData[]> => {
  return FirebaseService.fetchOrders();
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  return FirebaseService.deleteOrder(orderId);
};
