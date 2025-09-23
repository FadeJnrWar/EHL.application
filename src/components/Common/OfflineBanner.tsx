import React from 'react';
import { WifiOff, AlertTriangle } from 'lucide-react';
import { useOffline } from '../../contexts/OfflineContext';

const OfflineBanner: React.FC = () => {
  const { isOnline, isManualOffline } = useOffline();

  if (isOnline) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {isManualOffline ? (
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          ) : (
            <WifiOff className="h-5 w-5 text-yellow-400" />
          )}
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            {isManualOffline 
              ? 'You are in offline mode. Data will be saved locally and synced when you go online.'
              : 'No internet connection. Working in offline mode - your data will be saved locally.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfflineBanner;