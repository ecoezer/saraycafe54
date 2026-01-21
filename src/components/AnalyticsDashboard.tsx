import React, { useEffect, useState, useMemo } from 'react';
import { BarChart3, DollarSign, ShoppingCart, TrendingUp, Package, ArrowLeft, Download } from 'lucide-react';
import { fetchOrders, OrderData } from '../services/orderService';
import { calculateAnalytics, filterOrdersByDateRange, AnalyticsData } from '../utils/analyticsUtils';
import { generateDetailedOrdersCSV, downloadCSV, getExportFilename } from '../utils/csvExportUtils';
import StatCard from './analytics/StatCard';
import TopProductsWidget from './analytics/TopProductsWidget';
import DeviceStatsCard from './analytics/DeviceStatsCard';
import TimeFilterBar from './analytics/TimeFilterBar';

interface AnalyticsDashboardProps {
  onBack: () => void;
}

type TimePeriod = 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'all';

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
      case 'all':
        return [new Date(0), endOfDay];
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
        <div className="mb-6">
          <TimeFilterBar selectedPeriod={timePeriod} onPeriodChange={setTimePeriod} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Total Revenue"
            value={`€${analytics.totalRevenue.toFixed(2)}`}
            color="green"
          />
          <StatCard
            icon={<ShoppingCart className="w-6 h-6" />}
            label="Total Orders"
            value={analytics.totalOrders}
            color="orange"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Average Order Value"
            value={`€${analytics.averageOrderValue.toFixed(2)}`}
            color="blue"
          />
          <StatCard
            icon={<Package className="w-6 h-6" />}
            label="Pickup vs Delivery"
            value={`${analytics.pickupCount}/${analytics.deliveryCount}`}
            color="purple"
            subtext={`${analytics.pickupCount} pickup, ${analytics.deliveryCount} delivery`}
          />
        </div>

        {analytics.topProducts.length > 0 && (
          <div className="mb-6">
            <TopProductsWidget products={analytics.topProducts} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DeviceStatsCard title="Device Statistics" deviceStats={analytics.deviceStats} />
          <DeviceStatsCard title="Platform Statistics" osStats={analytics.platformStats} />
          {analytics.browserStats.length > 0 && (
            <DeviceStatsCard title="Browser Statistics" browserStats={analytics.browserStats} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
