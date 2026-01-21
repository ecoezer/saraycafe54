import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import type { DeviceStats, OSStats, BrowserStats } from '../../types';

interface DeviceStatsCardProps {
  title: string;
  deviceStats?: DeviceStats;
  osStats?: OSStats;
  browserStats?: BrowserStats[];
}

const DeviceStatsCard: React.FC<DeviceStatsCardProps> = ({
  title,
  deviceStats,
  osStats,
  browserStats,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        {deviceStats ? <Monitor className="w-5 h-5 text-gray-600" /> : <Smartphone className="w-5 h-5 text-gray-600" />}
        {title}
      </h2>
      <div className="space-y-3">
        {deviceStats && (
          <>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-medium text-gray-900">Mobile</span>
              <span className="text-lg font-bold text-orange-600">{deviceStats.mobile}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-medium text-gray-900">Tablet</span>
              <span className="text-lg font-bold text-blue-600">{deviceStats.tablet}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-medium text-gray-900">Desktop</span>
              <span className="text-lg font-bold text-green-600">{deviceStats.desktop}</span>
            </div>
          </>
        )}

        {osStats && (
          <>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-medium text-gray-900">iOS</span>
              <span className="text-lg font-bold text-blue-600">{osStats.ios}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-medium text-gray-900">Android</span>
              <span className="text-lg font-bold text-green-600">{osStats.android}</span>
            </div>
          </>
        )}

        {browserStats && browserStats.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {browserStats.map((browser, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="font-medium text-sm text-gray-900">{browser.name}</span>
                <span className="text-lg font-bold text-gray-600">{browser.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceStatsCard;
