import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface CartNotificationProps {
  itemName: string;
  onClose: () => void;
}

const CartNotification: React.FC<CartNotificationProps> = ({ itemName, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] animate-slide-down">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 shadow-lg">
        <div className="container mx-auto max-w-7xl flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium text-center">
            {itemName} wurde zum Warenkorb hinzugefügt
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartNotification;
