import React, { useState, useEffect } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

interface SimpleAdminLoginProps {
  onLoginSuccess: () => void;
}

const ADMIN_PASSWORD = 'Zb^73ZnP9T%Hr!';
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 5 * 60 * 1000;

const SimpleAdminLogin: React.FC<SimpleAdminLoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockEndTime, setBlockEndTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    const storedAttempts = localStorage.getItem('admin_failed_attempts');
    const storedBlockEnd = localStorage.getItem('admin_block_end');

    if (storedAttempts) {
      setFailedAttempts(parseInt(storedAttempts));
    }

    if (storedBlockEnd) {
      const blockEnd = parseInt(storedBlockEnd);
      const now = Date.now();

      if (blockEnd > now) {
        setIsBlocked(true);
        setBlockEndTime(blockEnd);
        setRemainingTime(Math.ceil((blockEnd - now) / 1000));
      } else {
        localStorage.removeItem('admin_block_end');
        localStorage.removeItem('admin_failed_attempts');
      }
    }
  }, []);

  useEffect(() => {
    if (!isBlocked || !blockEndTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.ceil((blockEndTime - now) / 1000);

      if (remaining <= 0) {
        setIsBlocked(false);
        setBlockEndTime(null);
        setFailedAttempts(0);
        localStorage.removeItem('admin_block_end');
        localStorage.removeItem('admin_failed_attempts');
        setError('');
      } else {
        setRemainingTime(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isBlocked, blockEndTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isBlocked) {
      setError(`Too many failed attempts. Try again in ${formatTime(remainingTime)}`);
      return;
    }

    if (password === ADMIN_PASSWORD) {
      setFailedAttempts(0);
      localStorage.removeItem('admin_failed_attempts');
      localStorage.removeItem('admin_block_end');
      onLoginSuccess();
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem('admin_failed_attempts', newAttempts.toString());

      if (newAttempts >= MAX_ATTEMPTS) {
        const blockEnd = Date.now() + BLOCK_DURATION;
        setIsBlocked(true);
        setBlockEndTime(blockEnd);
        localStorage.setItem('admin_block_end', blockEnd.toString());
        setError(`Too many failed attempts. Account temporarily blocked for 5 minutes.`);
      } else {
        const attemptsLeft = MAX_ATTEMPTS - newAttempts;
        setError(`Invalid password. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} left before temporary block.`);
      }

      setPassword('');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-blue-50 to-blue-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md ${shake ? 'animate-shake' : ''}`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-light-blue-100 rounded-full mb-4">
            <Lock className="w-8 h-8 text-light-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Enter password to access order history</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-light-blue-400 focus:ring-light-blue-400 transition-colors"
              placeholder="Enter admin password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!password || isBlocked}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
              !password || isBlocked
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-light-blue-400 hover:bg-light-blue-500 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
            }`}
          >
            {isBlocked ? `Blocked - ${formatTime(remainingTime)}` : 'Login'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Secure admin access
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleAdminLogin;
