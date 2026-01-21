import React, { useState } from 'react';
import { Globe } from 'lucide-react';

type TimePeriod = 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'all';
type Language = 'de' | 'tr' | 'en';

interface TimeFilterBarProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

const getLabels = (lang: Language) => {
  const labels: Record<Language, Record<TimePeriod, string>> = {
    de: {
      today: 'Heute',
      yesterday: 'Gestern',
      week: 'Woche',
      month: 'Monat',
      year: 'Jahr',
      all: 'Alle Zeiten',
    },
    tr: {
      today: 'Bugün',
      yesterday: 'Dün',
      week: 'Hafta',
      month: 'Ay',
      year: 'Yıl',
      all: 'Tüm Zamanlar',
    },
    en: {
      today: 'Today',
      yesterday: 'Yesterday',
      week: 'Week',
      month: 'Month',
      year: 'Year',
      all: 'All Times',
    },
  };
  return labels[lang];
};

const periods: Array<TimePeriod> = ['today', 'yesterday', 'week', 'month', 'year', 'all'];

const TimeFilterBar: React.FC<TimeFilterBarProps> = ({ selectedPeriod, onPeriodChange }) => {
  const [language, setLanguage] = useState<Language>('de');
  const labels = getLabels(language);

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-gray-600" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white text-gray-700 font-medium hover:border-gray-400 transition-colors cursor-pointer"
          >
            <option value="de">Deutsch</option>
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => onPeriodChange(period)}
              className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-orange-500 text-white border border-orange-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {labels[period]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeFilterBar;
