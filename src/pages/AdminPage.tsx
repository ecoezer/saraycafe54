import React, { useState, useEffect } from 'react';
import SimpleAdminLogin from '../components/SimpleAdminLogin';
import AdminOrderHistory from '../components/AdminOrderHistory';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

type AdminView = 'orders' | 'analytics';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<AdminView>('orders');

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('admin_authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('orders');
    sessionStorage.removeItem('admin_authenticated');
  };

  const handleViewAnalytics = () => {
    setCurrentView('analytics');
  };

  const handleBackToOrders = () => {
    setCurrentView('orders');
  };

  if (!isAuthenticated) {
    return <SimpleAdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      {currentView === 'orders' && (
        <AdminOrderHistory onLogout={handleLogout} onViewAnalytics={handleViewAnalytics} />
      )}
      {currentView === 'analytics' && <AnalyticsDashboard onBack={handleBackToOrders} />}
    </>
  );
};

export default AdminPage;
