import { collection, addDoc, query, orderBy, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface OrderItem {
  menuItemId: number;
  menuItemNumber: string | number;
  name: string;
  quantity: number;
  basePrice: number;
  selectedSize?: { name: string; description?: string; price: number };
  selectedIngredients?: string[];
  selectedExtras?: string[];
  selectedPastaType?: string;
  selectedSauce?: string;
  selectedExclusions?: string[];
  selectedSideDish?: string;
  totalPrice: number;
}

export interface OrderData {
  id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string;
  items: OrderItem[];
  total_amount: number;
  notes: string;
  created_at?: Timestamp | any;
  browser_info?: string;
  device_type?: string;
  ip_address?: string;
}

export class FirebaseService {
  private static readonly ORDERS_COLLECTION = 'orders';

  private static getBrowserInfo(): string {
    const ua = navigator.userAgent;
    let browser = 'Unknown';

    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

    return `${browser} - ${ua}`;
  }

  private static getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return 'Mobile';
    if (/tablet/i.test(ua)) return 'Tablet';
    return 'Desktop';
  }

  private static async getIPAddress(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'Unknown';
    } catch (error) {
      console.error('Error fetching IP:', error);
      return 'Unknown';
    }
  }

  static async saveOrder(orderData: Omit<OrderData, 'created_at'>): Promise<string> {
    try {
      const ipAddress = await this.getIPAddress();

      const docRef = await addDoc(collection(db, this.ORDERS_COLLECTION), {
        ...orderData,
        browser_info: this.getBrowserInfo(),
        device_type: this.getDeviceType(),
        ip_address: ipAddress,
        created_at: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  }

  static async fetchOrders(): Promise<OrderData[]> {
    try {
      console.log('Fetching orders from collection:', this.ORDERS_COLLECTION);
      const ordersQuery = query(collection(db, this.ORDERS_COLLECTION), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(ordersQuery);

      console.log('Orders fetched successfully. Count:', querySnapshot.docs.length);
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OrderData[];

      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          code: (error as any).code,
          name: error.name
        });
      }
      throw error;
    }
  }

  static async deleteOrder(orderId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.ORDERS_COLLECTION, orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
}
