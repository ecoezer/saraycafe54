import type { OrderData } from '../services/FirebaseService';

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  pickupCount: number;
  deliveryCount: number;
  topProducts: Array<{ name: string; count: number; revenue: number }>;
  deviceStats: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  platformStats: {
    ios: number;
    android: number;
  };
  browserStats: Array<{ name: string; count: number }>;
}

export const parsePickupDelivery = (deliveryAddress: string): 'pickup' | 'delivery' => {
  if (!deliveryAddress) return 'delivery';
  return deliveryAddress === 'Abholung' ? 'pickup' : 'delivery';
};

export const extractBrowserName = (browserInfo?: string): string => {
  if (!browserInfo) return 'Unknown';
  if (browserInfo.includes('Firefox')) return 'Firefox';
  if (browserInfo.includes('Edg')) return 'Edge';
  if (browserInfo.includes('Chrome')) return 'Chrome';
  if (browserInfo.includes('Safari')) return 'Safari';
  if (browserInfo.includes('Opera') || browserInfo.includes('OPR')) return 'Opera';
  return 'Unknown';
};

export const detectPlatform = (
  deviceType?: string,
  browserInfo?: string
): 'ios' | 'android' | 'other' => {
  if (!browserInfo && !deviceType) return 'other';

  const browser = (browserInfo || '').toLowerCase();
  const device = (deviceType || '').toLowerCase();

  if (browser.includes('iphone') || browser.includes('ipad') || browser.includes('mac os')) {
    return 'ios';
  }
  if (browser.includes('android')) {
    return 'android';
  }
  if (device.includes('mobile') && browser.includes('android')) {
    return 'android';
  }
  if (device.includes('tablet') && browser.includes('android')) {
    return 'android';
  }

  return 'other';
};

export const getTopProducts = (orders: OrderData[], limit: number = 10) => {
  const productMap = new Map<string, { count: number; revenue: number }>();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const key = `${item.menuItemNumber}-${item.name}`;
      const existing = productMap.get(key) || { count: 0, revenue: 0 };
      productMap.set(key, {
        count: existing.count + item.quantity,
        revenue: existing.revenue + item.totalPrice,
      });
    });
  });

  return Array.from(productMap.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const calculateAnalytics = (orders: OrderData[]): AnalyticsData => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  let pickupCount = 0;
  let deliveryCount = 0;

  const deviceStats = { mobile: 0, tablet: 0, desktop: 0 };
  const platformStats = { ios: 0, android: 0 };
  const browserCountMap = new Map<string, number>();

  orders.forEach((order) => {
    const orderType = parsePickupDelivery(order.delivery_address);
    if (orderType === 'pickup') {
      pickupCount++;
    } else {
      deliveryCount++;
    }

    if (order.device_type) {
      if (order.device_type === 'Mobile') {
        deviceStats.mobile++;
      } else if (order.device_type === 'Tablet') {
        deviceStats.tablet++;
      } else if (order.device_type === 'Desktop') {
        deviceStats.desktop++;
      }
    }

    const platform = detectPlatform(order.device_type, order.browser_info);
    if (platform === 'ios') {
      platformStats.ios++;
    } else if (platform === 'android') {
      platformStats.android++;
    }

    const browser = extractBrowserName(order.browser_info);
    browserCountMap.set(browser, (browserCountMap.get(browser) || 0) + 1);
  });

  const browserStats = Array.from(browserCountMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const topProducts = getTopProducts(orders, 10);

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    pickupCount,
    deliveryCount,
    topProducts,
    deviceStats,
    platformStats,
    browserStats,
  };
};

export const filterOrdersByDateRange = (
  orders: OrderData[],
  startDate: Date,
  endDate: Date
): OrderData[] => {
  return orders.filter((order) => {
    let orderDate: Date;

    if (order.created_at?.toDate) {
      orderDate = order.created_at.toDate();
    } else if (order.created_at?.seconds) {
      orderDate = new Date(order.created_at.seconds * 1000);
    } else {
      orderDate = new Date(order.created_at);
    }

    return orderDate >= startDate && orderDate <= endDate;
  });
};
