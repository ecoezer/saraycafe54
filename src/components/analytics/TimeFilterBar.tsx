import React from 'react';

type TimePeriod = 'today' | 'yesterday' | 'week' | 'month' | 'year';

interface TimeFilterBarProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

const periods: Array<{ value: TimePeriod; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

const TimeFilterBar: React.FC<TimeFilterBarProps> = ({ selectedPeriod, onPeriodChange }) => {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      <div className="flex flex-wrap gap-2">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => onPeriodChange(period.value)}
            className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
              selectedPeriod === period.value
                ? 'bg-orange-500 text-white border border-orange-600'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeFilterBar;
