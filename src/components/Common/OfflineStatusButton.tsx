import React from 'react';
import { Wifi, WifiOff, Power, Clock, Settings } from 'lucide-react';
import { useOffline } from '../../contexts/OfflineContext';

const OfflineStatusButton: React.FC = () => {
  const { 
    isOnline, 
    isManualOffline, 
    connectionStatus, 
    setOnlineMode, 
    setOfflineMode,
    lastOnlineTime,
    getAllBackups
  } = useOffline();

  const backupCount = getAllBackups().length;

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'online':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: Wifi,
          text: 'Online',
          dotColor: 'bg-green-500',
          animate: 'animate-pulse'
        };
      case 'offline':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: WifiOff,
          text: 'Network Offline',
          dotColor: 'bg-red-500',
          animate: ''
        };
      case 'manual-offline':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: WifiOff,
          text: 'Manual Offline',
          dotColor: 'bg-orange-500',
          animate: ''
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: WifiOff,
          text: 'Unknown',
          dotColor: 'bg-gray-500',
          animate: ''
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="flex items-center space-x-3">
      {/* Status Display */}
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${statusInfo.color}`}>
        <StatusIcon className="w-4 h-4" />
        <span className="font-medium">{statusInfo.text}</span>
        <div className={`w-2 h-2 ${statusInfo.dotColor} rounded-full ${statusInfo.animate}`}></div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={setOnlineMode}
          disabled={!isManualOffline && navigator.onLine}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            isOnline && !isManualOffline
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200'
          }`}
          title="Switch to Online Mode"
        >
          <Wifi className="w-4 h-4" />
          <span>Online</span>
        </button>

        <button
          onClick={setOfflineMode}
          disabled={!navigator.onLine && !isManualOffline}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            !isOnline
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-orange-100 text-orange-800 hover:bg-orange-200 border border-orange-200'
          }`}
          title="Switch to Offline Mode"
        >
          <WifiOff className="w-4 h-4" />
          <span>Offline</span>
        </button>
      </div>

      {/* Additional Info */}
      {(lastOnlineTime || backupCount > 0) && (
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          {lastOnlineTime && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Last: {new Date(lastOnlineTime).toLocaleTimeString()}</span>
            </div>
          )}
          {backupCount > 0 && (
            <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded">
              <Settings className="w-3 h-3" />
              <span>{backupCount} backup{backupCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OfflineStatusButton;