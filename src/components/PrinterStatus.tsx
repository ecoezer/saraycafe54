import React, { useEffect, useState } from 'react';
import { Printer, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';

interface PrinterStatusData {
  isConnected: boolean;
  type: string;
  timestamp: string;
}

export const PrinterStatus: React.FC = () => {
  const [status, setStatus] = useState<PrinterStatusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkPrinterStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/printer/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        setError('');
      } else {
        setError('Failed to fetch printer status');
      }
    } catch (err) {
      setError('Cannot connect to printer service');
    } finally {
      setLoading(false);
    }
  };

  const testPrint = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/printer/test', {
        method: 'POST'
      });
      if (response.ok) {
        alert('Test print sent to printer!');
      } else {
        setError('Test print failed');
      }
    } catch (err) {
      setError('Failed to send test print');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPrinterStatus();
    const interval = setInterval(checkPrinterStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Printer className="w-5 h-5 text-gray-700" />
          <h3 className="font-semibold text-gray-900">Printer Status</h3>
        </div>
        <button
          onClick={checkPrinterStatus}
          disabled={loading}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {status && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {status.isConnected ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700 font-medium">Connected</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-700 font-medium">Disconnected</span>
              </>
            )}
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 rounded p-2 space-y-1">
            <p>
              <span className="font-medium">Type:</span> {status.type}
            </p>
            <p>
              <span className="font-medium">Last Check:</span>{' '}
              {new Date(status.timestamp).toLocaleTimeString('de-DE')}
            </p>
          </div>

          {status.isConnected && (
            <button
              onClick={testPrint}
              disabled={loading}
              className="w-full px-3 py-2 text-sm rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium border border-orange-200"
            >
              {loading ? 'Sending...' : 'Send Test Print'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
