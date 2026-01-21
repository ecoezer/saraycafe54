import React, { useEffect, useState } from 'react';
import { ShoppingBag, Clock, Phone, MapPin, Package, LogOut, RefreshCw, Monitor, Smartphone, Calendar, Trash2 } from 'lucide-react';
import { fetchOrders, deleteOrder, OrderData } from '../services/orderService';

interface AdminOrderHistoryProps {
  onLogout: () => void;
}

type TimeFilter = 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';

const AdminOrderHistory: React.FC<AdminOrderHistoryProps> = ({ onLogout }) => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  const getOrderDate = (order: OrderData): Date => {
    if (order.created_at?.toDate) {
      return order.created_at.toDate();
    } else if (order.created_at?.seconds) {
      return new Date(order.created_at.seconds * 1000);
    } else {
      return new Date(order.created_at);
    }
  };

  const filterOrders = (allOrders: OrderData[], filter: TimeFilter, startDate?: string, endDate?: string) => {
    if (filter === 'all') {
      return allOrders;
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return allOrders.filter(order => {
      const orderDate = getOrderDate(order);

      if (filter === 'custom' && startDate && endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      }

      switch (filter) {
        case 'today':
          return orderDate >= startOfDay;
        case 'week':
          return orderDate >= startOfWeek;
        case 'month':
          return orderDate >= startOfMonth;
        case 'year':
          return orderDate >= startOfYear;
        default:
          return true;
      }
    });
  };

  const loadOrders = async () => {
    setIsLoading(true);
    setError('');

    try {
      const fetchedOrders = await fetchOrders();
      setOrders(fetchedOrders);

      if (fetchedOrders.length > 0) {
        const dates = fetchedOrders.map(order => getOrderDate(order));
        const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
        const latest = new Date(Math.max(...dates.map(d => d.getTime())));

        setMinDate(earliest.toISOString().split('T')[0]);
        setMaxDate(latest.toISOString().split('T')[0]);
      }

      setFilteredOrders(filterOrders(fetchedOrders, timeFilter, customStartDate, customEndDate));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to load orders: ${errorMessage}. Please check Firebase configuration and try again.`);
      console.error('Error loading orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    setFilteredOrders(filterOrders(orders, timeFilter, customStartDate, customEndDate));
  }, [timeFilter, orders, customStartDate, customEndDate]);

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      setTimeFilter('custom');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!orderId) return;

    const confirmDelete = window.confirm('Möchten Sie diese Bestellung wirklich löschen?');
    if (!confirmDelete) return;

    setDeletingOrderId(orderId);

    try {
      await deleteOrder(orderId);

      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      setFilteredOrders(filterOrders(updatedOrders, timeFilter, customStartDate, customEndDate));
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Fehler beim Löschen der Bestellung. Bitte versuchen Sie es erneut.');
    } finally {
      setDeletingOrderId(null);
    }
  };

  const getCountryFlag = (ip: string): string => {
    if (!ip) return '🌍';
    if (ip.startsWith('192.168') || ip.startsWith('10.') || ip.startsWith('172.')) return '🏠';
    const firstOctet = parseInt(ip.split('.')[0]);
    if (firstOctet >= 1 && firstOctet <= 50) return '🇺🇸';
    if (firstOctet >= 51 && firstOctet <= 100) return '🇬🇧';
    if (firstOctet >= 101 && firstOctet <= 150) return '🇩🇪';
    return '🌍';
  };

  const totalAmount = filteredOrders.reduce((sum, order) => sum + order.total_amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-light-blue-600" />
            Order History
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={loadOrders}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-light-blue-100 text-light-blue-700 hover:bg-light-blue-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
          <div className="flex flex-wrap gap-1.5 mb-3">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                timeFilter === 'all'
                  ? 'bg-light-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTimeFilter('today')}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                timeFilter === 'today'
                  ? 'bg-light-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                timeFilter === 'week'
                  ? 'bg-light-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                timeFilter === 'month'
                  ? 'bg-light-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeFilter('year')}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                timeFilter === 'year'
                  ? 'bg-light-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Year
            </button>
          </div>

          <div className="border-t pt-3 mt-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Calendar className="w-4 h-4 text-light-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">Custom Range</h3>
            </div>
            <div className="flex flex-wrap gap-2 items-end">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">Start</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  min={minDate}
                  max={maxDate}
                  disabled={!minDate || !maxDate}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-light-blue-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">End</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  min={customStartDate || minDate}
                  max={maxDate}
                  disabled={!minDate || !maxDate}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-light-blue-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <button
                onClick={handleCustomDateApply}
                disabled={!customStartDate || !customEndDate}
                className="px-4 py-1.5 text-sm rounded-md bg-light-blue-500 text-white hover:bg-light-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between items-center text-sm">
              <p className="font-semibold text-gray-900">
                Orders: <span className="text-light-blue-600">{filteredOrders.length}</span>
              </p>
              <p className="font-semibold text-gray-900">
                Revenue: <span className="text-light-blue-600">{totalAmount.toFixed(2).replace('.', ',')} €</span>
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-light-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow relative">
                <button
                  onClick={() => handleDeleteOrder(order.id!)}
                  disabled={deletingOrderId === order.id}
                  className="absolute top-3 right-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Bestellung löschen"
                >
                  {deletingOrderId === order.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(order.created_at)}
                      </div>
                      <div className="text-sm font-bold text-light-blue-600">
                        {order.total_amount.toFixed(2).replace('.', ',')} €
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-light-blue-600" />
                        <span className="font-semibold text-sm text-gray-900">{order.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <Phone className="w-3.5 h-3.5" />
                        <a href={`tel:${order.customer_phone}`} className="hover:text-light-blue-600">
                          {order.customer_phone}
                        </a>
                      </div>
                      <div className="flex items-start gap-1.5 text-sm text-gray-700">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{order.delivery_address}</span>
                      </div>
                    </div>

                    {(order.device_type || order.ip_address || order.browser_info) && (
                      <div className="bg-gray-50 rounded px-2 py-1.5 space-y-1">
                        {order.device_type && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            {order.device_type === 'Mobile' || order.device_type === 'Tablet' ? (
                              <Smartphone className="w-3 h-3" />
                            ) : (
                              <Monitor className="w-3 h-3" />
                            )}
                            <span>{order.device_type}</span>
                          </div>
                        )}
                        {order.ip_address && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <span className="text-base leading-none">{getCountryFlag(order.ip_address)}</span>
                            <span className="font-medium">IP:</span>
                            <span>{order.ip_address}</span>
                          </div>
                        )}
                        {order.browser_info && (
                          <div className="flex items-start gap-1.5 text-xs text-gray-600">
                            <span className="font-medium">Browser:</span>
                            <span className="break-all">{order.browser_info}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {order.notes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded px-2 py-1.5">
                        <p className="text-xs text-gray-700">
                          <span className="font-medium">Note:</span> {order.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-1.5 max-h-60 overflow-y-auto">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 rounded p-2">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-900">
                                {item.quantity}x Nr.{item.menuItemNumber} {item.name}
                              </p>
                              {item.selectedSize && (
                                <p className="text-xs text-gray-600 truncate">
                                  {item.selectedSize.name}
                                </p>
                              )}
                              {item.selectedPastaType && (
                                <p className="text-xs text-gray-600">Pasta: {item.selectedPastaType}</p>
                              )}
                              {item.selectedSauce && (
                                <p className="text-xs text-gray-600">Sauce: {item.selectedSauce}</p>
                              )}
                              {item.selectedSideDish && (
                                <p className="text-xs text-gray-600">Side: {item.selectedSideDish}</p>
                              )}
                              {item.selectedIngredients && item.selectedIngredients.length > 0 && (
                                <p className="text-xs text-gray-600">
                                  {item.selectedIngredients.join(', ')}
                                </p>
                              )}
                              {item.selectedExtras && item.selectedExtras.length > 0 && (
                                <p className="text-xs text-gray-600">+ {item.selectedExtras.join(', ')}</p>
                              )}
                              {item.selectedExclusions && item.selectedExclusions.length > 0 && (
                                <p className="text-xs text-gray-600">
                                  - {item.selectedExclusions.join(', ')}
                                </p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-semibold text-sm text-light-blue-600">
                                {item.totalPrice.toFixed(2).replace('.', ',')} €
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderHistory;
