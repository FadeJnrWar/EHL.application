import React, { createContext, useContext, useState, useEffect } from 'react';

interface OfflineContextType {
  isOnline: boolean;
  isManualOffline: boolean;
  connectionStatus: 'online' | 'offline' | 'manual-offline';
  toggleOfflineMode: () => void;
  setOnlineMode: () => void;
  setOfflineMode: () => void;
  saveFormData: (key: string, data: any) => void;
  getFormData: (key: string) => any;
  clearFormData: (key: string) => void;
  hasBackup: (key: string) => boolean;
  getAllBackups: () => string[];
  lastOnlineTime: string | null;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isNetworkOnline, setIsNetworkOnline] = useState(navigator.onLine);
  const [isManualOffline, setIsManualOffline] = useState(false);
  const [lastOnlineTime, setLastOnlineTime] = useState<string | null>(null);

  // Effective online status (false if either network is down OR manual offline is enabled)
  const isOnline = isNetworkOnline && !isManualOffline;
  
  const connectionStatus = isManualOffline ? 'manual-offline' : (isNetworkOnline ? 'online' : 'offline');

  useEffect(() => {
    const handleOnline = () => {
      console.log('Network came back online');
      setIsNetworkOnline(true);
      setLastOnlineTime(new Date().toISOString());
    };
    
    const handleOffline = () => {
      console.log('Network went offline');
      setIsNetworkOnline(false);
      setLastOnlineTime(new Date().toISOString());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for saved offline state
    const savedOfflineState = localStorage.getItem('manualOfflineMode');
    if (savedOfflineState === 'true') {
      setIsManualOffline(true);
    }

    // Set initial last online time
    if (navigator.onLine) {
      setLastOnlineTime(new Date().toISOString());
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleOfflineMode = () => {
    const newOfflineState = !isManualOffline;
    setIsManualOffline(newOfflineState);
    localStorage.setItem('manualOfflineMode', newOfflineState.toString());
    
    if (newOfflineState) {
      console.log('Manually switched to offline mode');
    } else {
      console.log('Manually switched to online mode');
      setLastOnlineTime(new Date().toISOString());
    }
  };

  const setOnlineMode = () => {
    setIsManualOffline(false);
    localStorage.setItem('manualOfflineMode', 'false');
    setLastOnlineTime(new Date().toISOString());
    console.log('Forced online mode');
  };

  const setOfflineMode = () => {
    setIsManualOffline(true);
    localStorage.setItem('manualOfflineMode', 'true');
    console.log('Forced offline mode');
  };

  const saveFormData = (key: string, data: any) => {
    const backupData = {
      ...data,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      userAgent: navigator.userAgent
    };
    localStorage.setItem(`backup_${key}`, JSON.stringify(backupData));
    console.log(`Form data saved for ${key}:`, backupData);
  };

  const getFormData = (key: string) => {
    const data = localStorage.getItem(`backup_${key}`);
    return data ? JSON.parse(data) : null;
  };

  const clearFormData = (key: string) => {
    localStorage.removeItem(`backup_${key}`);
    console.log(`Cleared backup data for ${key}`);
  };

  const hasBackup = (key: string) => {
    return localStorage.getItem(`backup_${key}`) !== null;
  };

  const getAllBackups = () => {
    const backups: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('backup_')) {
        backups.push(key.replace('backup_', ''));
      }
    }
    return backups;
  };

  return (
    <OfflineContext.Provider value={{
      isOnline,
      isManualOffline,
      connectionStatus,
      toggleOfflineMode,
      setOnlineMode,
      setOfflineMode,
      saveFormData,
      getFormData,
      clearFormData,
      hasBackup,
      getAllBackups,
      lastOnlineTime
    }}>
      {children}
    </OfflineContext.Provider>
  );
};
