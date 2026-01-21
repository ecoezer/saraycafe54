import React, { useEffect, useState, useMemo } from 'react';
import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  Smartphone,
  Monitor,
  ArrowLeft,
  Download,
} from 'lucide-react';
import { fetchOrders, OrderData } from '../services/orderService';
import { calculateAnalytics, filterOrdersByDateRange, AnalyticsData } from '../utils/analyticsUtils';
import { generateDetailedOrdersCSV, downloadCSV, getExportFilename } from '../utils/csvExportUtils';

interface AnalyticsDashboardProps {
  onBack: () => void;
}

type TimePeriod = 'today' | 'yesterday' | 'week' | 'month' | 'year';

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onBack }) => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('today');

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setError('');
      try {
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Failed to load orders: ${errorMessage}`);
        console.error('Error loading orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const getDateRange = (period: TimePeriod): [Date, Date] => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    switch (period) {
      case 'today':
        return [startOfDay, endOfDay];
      case 'yesterday':
        const yesterday = new Date(startOfDay);
        yesterday.setDate(yesterday.getDate() - 1);
        const endYesterday = new Date(yesterday);
        endYesterday.setHours(23, 59, 59, 999);
        return [yesterday, endYesterday];
      case 'week':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return [startOfWeek, endOfDay];
      case 'month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return [startOfMonth, endOfDay];
      case 'year':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return [startOfYear, endOfDay];
      default:
        return [startOfDay, endOfDay];
    }
  };

  const filteredOrders = useMemo(() => {
    const [startDate, endDate] = getDateRange(timePeriod);
    return filterOrdersByDateRange(orders, startDate, endDate);
  }, [orders, timePeriod]);

  const analytics: AnalyticsData = useMemo(() => {
    return calculateAnalytics(filteredOrders);
  }, [filteredOrders]);

  const exportToCSV = () => {
    try {
      const filename = getExportFilename(timePeriod);
      const blob = generateDetailedOrdersCSV(filteredOrders);
      downloadCSV(blob, filename);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-orange-500" />
              Analytics Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">Comprehensive sales and customer insights</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors font-medium border border-green-200"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium border border-gray-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTimePeriod('today')}
              className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                timePeriod === 'today'
                  ? 'bg-orange-500 text-white border border-orange-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimePeriod('yesterday')}
              className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                timePeriod === 'yesterday'
                  ? 'bg-orange-500 text-white border border-orange-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Yesterday
            </button>
            <button
              onClick={() => setTimePeriod('week')}
              className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                timePeriod === 'week'
                  ? 'bg-orange-500 text-white border border-orange-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimePeriod('month')}
              className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                timePeriod === 'month'
                  ? 'bg-orange-500 text-white border border-orange-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimePeriod('year')}
              className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                timePeriod === 'year'
                  ? 'bg-orange-500 text-white border border-orange-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">
                  €{analytics.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-orange-600">
                  {analytics.totalOrders}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Average Order Value</p>
                <p className="text-3xl font-bold text-blue-600">
                  €{analytics.averageOrderValue.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Pickup vs Delivery</p>
                <div className="text-sm font-semibold mt-2">
                  <p className="text-orange-600">{analytics.pickupCount} Pickup</p>
                  <p className="text-blue-600">{analytics.deliveryCount} Delivery</p>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {analytics.topProducts.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Top Products</h2>
            <div className="space-y-2">
              {analytics.topProducts.map((product, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.count} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">€{product.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-gray-600" />
              Device Statistics
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-900">Mobile</span>
                <span className="text-lg font-bold text-orange-600">{analytics.deviceStats.mobile}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-900">Tablet</span>
                <span className="text-lg font-bold text-blue-600">{analytics.deviceStats.tablet}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-900">Desktop</span>
                <span className="text-lg font-bold text-green-600">{analytics.deviceStats.desktop}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Platform Statistics</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-900">iOS</span>
                <span className="text-lg font-bold text-blue-600">{analytics.platformStats.ios}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-900">Android</span>
                <span className="text-lg font-bold text-green-600">{analytics.platformStats.android}</span>
              </div>
            </div>
          </div>

          {analytics.browserStats.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm lg:col-span-2">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Browser Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {analytics.browserStats.map((browser, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="font-medium text-gray-900">{browser.name}</span>
                    <span className="text-lg font-bold text-gray-600">{browser.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
