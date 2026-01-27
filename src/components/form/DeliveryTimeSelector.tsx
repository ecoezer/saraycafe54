import React, { memo } from 'react';

interface DeliveryTimeSelectorProps {
    value: 'asap' | 'specific';
    specificTime?: string;
    onTimeTypeChange: (value: 'asap' | 'specific') => void;
    onSpecificTimeChange: (time: string) => void;
    timeOptions: string[];
    error?: string;
}

/**
 * Selector for delivery time - either ASAP or specific time slot.
 */
const DeliveryTimeSelector: React.FC<DeliveryTimeSelectorProps> = memo(({
    value,
    specificTime,
    onTimeTypeChange,
    onSpecificTimeChange,
    timeOptions,
    error
}) => {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
                Lieferzeit
            </label>
            <div className="space-y-2">
                <label
                    className={`flex items-center cursor-pointer p-3 rounded-lg border-2 transition-all ${value === 'asap'
                            ? 'border-light-blue-400 bg-light-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                >
                    <input
                        type="radio"
                        value="asap"
                        checked={value === 'asap'}
                        onChange={() => onTimeTypeChange('asap')}
                        className="sr-only"
                    />
                    <span className="text-sm font-medium text-gray-900">So schnell wie möglich</span>
                </label>
                <label
                    className={`flex items-center cursor-pointer p-3 rounded-lg border-2 transition-all ${value === 'specific'
                            ? 'border-light-blue-400 bg-light-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                >
                    <input
                        type="radio"
                        value="specific"
                        checked={value === 'specific'}
                        onChange={() => onTimeTypeChange('specific')}
                        className="sr-only"
                    />
                    <span className="text-sm font-medium text-gray-900">Zu bestimmter Zeit</span>
                </label>
            </div>

            {value === 'specific' && (
                <div className="mt-2 space-y-1">
                    <select
                        value={specificTime || ''}
                        onChange={(e) => onSpecificTimeChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 focus:border-light-blue-400 focus:ring-1 focus:ring-light-blue-400 p-2.5 text-sm bg-white"
                    >
                        <option value="">Bitte wählen...</option>
                        {timeOptions.map((time) => (
                            <option key={time} value={time}>
                                {time} Uhr
                            </option>
                        ))}
                    </select>
                    {error && (
                        <p className="text-xs text-red-600">{error}</p>
                    )}
                </div>
            )}
        </div>
    );
});

DeliveryTimeSelector.displayName = 'DeliveryTimeSelector';

export default DeliveryTimeSelector;
