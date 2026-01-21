import React, { useEffect, useState } from 'react';
import { Printer, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { db } from '../config/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

interface PrinterStatusData {
  connected: boolean;
  connection_type: string;
  last_update: string;
  queue_size?: number;
}

export const PrinterStatus: React.FC = () => {
  const [status, setStatus] = useState<PrinterStatusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendTestPrintCommand = async () => {
    try {
      setLoading(true);
      setError('');

      const commandRef = doc(db, 'printer_commands', `test_print_${Date.now()}`);
      await setDoc(commandRef, {
        command_type: 'test',
        created_at: new Date().toISOString(),
        processed: false
      });

      alert('Test print command sent! Check printer in a few seconds.');
    } catch (err) {
      setError('Failed to send test print command');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const statusRef = doc(db, 'printer_status', 'current');

    const unsubscribe = onSnapshot(
      statusRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setStatus({
            connected: data.connected || false,
            connection_type: data.connection_type || 'usb',
            last_update: data.last_update || new Date().toISOString(),
            queue_size: data.queue_size || 0
          });
          setError('');
        } else {
          setStatus(null);
          setError('Printer status not available yet');
        }
      },
      (err) => {
        console.error('Error listening to printer status:', err);
        setError('Failed to connect to printer status updates');
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Printer className="w-5 h-5 text-gray-700" />
          <h3 className="font-semibold text-gray-900">Printer Status</h3>
        </div>
        <span className="text-xs text-gray-500">Real-time</span>
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
            {status.connected ? (
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
              <span className="font-medium">Type:</span> {status.connection_type}
            </p>
            <p>
              <span className="font-medium">Queue:</span> {status.queue_size || 0} order(s)
            </p>
            <p>
              <span className="font-medium">Last Update:</span>{' '}
              {new Date(status.last_update).toLocaleTimeString('de-DE')}
            </p>
          </div>

          {status.connected && (
            <button
              onClick={sendTestPrintCommand}
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
