import React, { useState, useEffect } from 'react';
import SimpleAdminLogin from '../components/SimpleAdminLogin';
import AdminOrderHistory from '../components/AdminOrderHistory';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
    sessionStorage.removeItem('admin_authenticated');
  };

  if (!isAuthenticated) {
    return <SimpleAdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminOrderHistory onLogout={handleLogout} />;
};

export default AdminPage;
