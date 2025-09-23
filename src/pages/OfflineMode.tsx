import React from 'react';
import { Wifi, WifiOff, Power, Clock, Settings, Database, FolderSync as Sync, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useOffline } from '../contexts/OfflineContext';

const OfflineMode: React.FC = () => {
  const { 
    isOnline, 
    isManualOffline, 
    connectionStatus, 
    setOnlineMode, 
    setOfflineMode,
    lastOnlineTime,
    getAllBackups,
    clearFormData,
    getFormData
  } = useOffline();

  const backups = getAllBackups();

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'online':
        return {
          color: 'bg-green-50 border-green-200',
          textColor: 'text-green-800',
          icon: Wifi,
          title: 'Online Mode',
          description: 'Connected to Eagle HMO servers. All data syncs in real-time.',
          dotColor: 'bg-green-500',
          animate: 'animate-pulse'
        };
      case 'offline':
        return {
          color: 'bg-red-50 border-red-200',
          textColor: 'text-red-800',
          icon: WifiOff,
          title: 'Network Offline',
          description: 'No internet connection detected. Working in offline mode.',
          dotColor: 'bg-red-500',
          animate: ''
        };
      case 'manual-offline':
        return {
          color: 'bg-orange-50 border-orange-200',
          textColor: 'text-orange-800',
          icon: WifiOff,
          title: 'Manual Offline Mode',
          description: 'You have manually enabled offline mode. Data will be saved locally.',
          dotColor: 'bg-orange-500',
          animate: ''
        };
      default:
        return {
          color: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-800',
          icon: WifiOff,
          title: 'Unknown Status',
          description: 'Connection status unknown.',
          dotColor: 'bg-gray-500',
          animate: ''
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const handleRestoreBackup = (backupKey: string) => {
    const backupData = getFormData(backupKey);
    if (backupData) {
      const confirmRestore = window.confirm(
        `Restore backup from ${new Date(backupData.timestamp).toLocaleString()}?\n\nThis will navigate you to the ${backupData.page} page and restore your form data.`
      );
      
      if (confirmRestore) {
        // Navigate to the page where the backup was created
        window.location.href = backupData.page;
      }
    }
  };

  const handleClearBackup = (backupKey: string) => {
    if (window.confirm('Are you sure you want to delete this backup?')) {
      clearFormData(backupKey);
      window.location.reload(); // Refresh to update the backup list
    }
  };

  const handleClearAllBackups = () => {
    if (window.confirm('Are you sure you want to delete ALL backup data?')) {
      backups.forEach(backup => clearFormData(backup));
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Offline Mode Management</h1>
        <p className="text-gray-600 mt-1">Control your connection mode and manage offline data</p>
      </div>

      {/* Current Status */}
      <div className={`rounded-lg border p-6 ${statusInfo.color}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <StatusIcon className={`w-8 h-8 ${statusInfo.textColor}`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${statusInfo.textColor}`}>{statusInfo.title}</h2>
              <p className={`${statusInfo.textColor} opacity-80`}>{statusInfo.description}</p>
            </div>
          </div>
          <div className={`w-4 h-4 ${statusInfo.dotColor} rounded-full ${statusInfo.animate}`}></div>
        </div>

        {lastOnlineTime && (
          <div className={`flex items-center space-x-2 text-sm ${statusInfo.textColor} opacity-75`}>
            <Clock className="w-4 h-4" />
            <span>Last online: {new Date(lastOnlineTime).toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Mode Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Mode Controls</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Online Mode */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Wifi className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Online Mode</h4>
                <p className="text-sm text-gray-600">Real-time data synchronization</p>
              </div>
            </div>
            
            <ul className="text-sm text-gray-600 space-y-2 mb-4">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Real-time data sync</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Instant form submission</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Live notifications</span>
              </li>
            </ul>
            
            <button
              onClick={setOnlineMode}
              disabled={isOnline && !isManualOffline}
              className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                isOnline && !isManualOffline
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-lg transform hover:scale-[1.02]'
              }`}
            >
              <Wifi className="w-5 h-5" />
              <span>{isOnline && !isManualOffline ? 'Currently Online' : 'Switch to Online'}</span>
            </button>
          </div>

          {/* Offline Mode */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <WifiOff className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Offline Mode</h4>
                <p className="text-sm text-gray-600">Local data storage and sync later</p>
              </div>
            </div>
            
            <ul className="text-sm text-gray-600 space-y-2 mb-4">
              <li className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-orange-600" />
                <span>Local data storage</span>
              </li>
              <li className="flex items-center space-x-2">
                <Sync className="w-4 h-4 text-orange-600" />
                <span>Auto-sync when online</span>
              </li>
              <li className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span>Limited functionality</span>
              </li>
            </ul>
            
            <button
              onClick={setOfflineMode}
              disabled={!isOnline}
              className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                !isOnline
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg transform hover:scale-[1.02]'
              }`}
            >
              <WifiOff className="w-5 h-5" />
              <span>{!isOnline ? 'Currently Offline' : 'Switch to Offline'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backup Data Management */}
      {backups.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Offline Backup Data</h3>
            <button
              onClick={handleClearAllBackups}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Clear All Backups
            </button>
          </div>
          
          <div className="space-y-3">
            {backups.map((backupKey) => {
              const backupData = getFormData(backupKey);
              return (
                <div key={backupKey} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{backupKey.replace('_', ' ').toUpperCase()}</h4>
                      <p className="text-sm text-gray-600">
                        Saved: {backupData ? new Date(backupData.timestamp).toLocaleString() : 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Page: {backupData?.page || 'Unknown'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRestoreBackup(backupKey)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => handleClearBackup(backupKey)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Network Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Power className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Browser Status</span>
            </div>
            <p className={`text-lg font-bold ${navigator.onLine ? 'text-green-600' : 'text-red-600'}`}>
              {navigator.onLine ? 'Connected' : 'Disconnected'}
            </p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Settings className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-800">Current Mode</span>
            </div>
            <p className="text-lg font-bold text-purple-600">
              {isManualOffline ? 'Manual Offline' : (navigator.onLine ? 'Online' : 'Auto Offline')}
            </p>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Database className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Backup Data</span>
            </div>
            <p className="text-lg font-bold text-yellow-600">
              {backups.length} {backups.length === 1 ? 'Item' : 'Items'}
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How Offline Mode Works</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Automatic Detection</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                <span>When internet goes down, automatically switches to offline mode</span>
              </li>
              <li className="flex items-start space-x-2">
                <Database className="w-4 h-4 text-blue-500 mt-0.5" />
                <span>All form data is automatically saved to your browser</span>
              </li>
              <li className="flex items-start space-x-2">
                <Sync className="w-4 h-4 text-green-500 mt-0.5" />
                <span>When internet returns, you can manually sync your data</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Manual Control</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <Power className="w-4 h-4 text-orange-500 mt-0.5" />
                <span>You can manually switch to offline mode anytime</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Your preference is remembered across sessions</span>
              </li>
              <li className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <span>Switch back to online mode when ready to sync</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineMode;