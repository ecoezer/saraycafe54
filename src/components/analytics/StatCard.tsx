import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'green' | 'orange' | 'blue' | 'purple';
  subtext?: string;
}

const colorClasses = {
  green: {
    icon: 'bg-green-50 text-green-600',
    value: 'text-green-600',
  },
  orange: {
    icon: 'bg-orange-50 text-orange-600',
    value: 'text-orange-600',
  },
  blue: {
    icon: 'bg-blue-50 text-blue-600',
    value: 'text-blue-600',
  },
  purple: {
    icon: 'bg-purple-50 text-purple-600',
    value: 'text-purple-600',
  },
};

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, subtext }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">{label}</p>
          <p className={`text-3xl font-bold ${colorClasses[color].value}`}>{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color].icon}`}>{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
