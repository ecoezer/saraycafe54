import React from 'react';
import { TimeValidators } from '../../validators/timeValidators';

interface TimeSelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export const TimeSelect: React.FC<TimeSelectProps> = ({
  value,
  onChange,
  error,
  className = ''
}) => {
  const timeSlots = TimeValidators.generateTimeSlots();

  return (
    <div>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border border-gray-300 focus:border-light-blue-400 focus:ring-1 focus:ring-light-blue-400 p-2.5 text-sm bg-white ${className}`}
      >
        <option value="">Bitte wählen...</option>
        {timeSlots.map(slot => (
          <option key={slot.value} value={slot.value}>
            {slot.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
      <p className="text-xs text-gray-500 mt-1">
        Mindestens 20 Minuten im Voraus
      </p>
    </div>
  );
};
