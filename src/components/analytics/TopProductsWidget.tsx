import React from 'react';
import type { ProductFrequency } from '../../types';

interface TopProductsWidgetProps {
  products: ProductFrequency[];
}

const TopProductsWidget: React.FC<TopProductsWidgetProps> = ({ products }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Top Products</h2>
      {products.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-gray-500">No products to display</p>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                    #{idx + 1}
                  </span>
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                </div>
                <p className="text-xs text-gray-600 mt-1">{product.count} orders</p>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="font-semibold text-green-600">€{product.revenue.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopProductsWidget;
