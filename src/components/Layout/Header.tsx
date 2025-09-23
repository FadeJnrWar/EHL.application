import React from 'react';
import { Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import OfflineStatusButton from '../Common/OfflineStatusButton';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();

  return (
    <header className="bg-gradient-to-r from-white to-eagle-50/50 shadow-lg border-b border-eagle-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-eagle-600 to-naija-600 bg-clip-text text-transparent">
            {user?.department} Portal
          </h2>
          <p className="text-sm text-gold-600">Healthcare on Eagle's Wing</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <OfflineStatusButton />
          </div>
          
          <button className="relative p-2 text-gray-400 hover:text-eagle-600 transition-colors rounded-lg hover:bg-eagle-50">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center shadow-lg animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          <button className="p-2 text-gray-400 hover:text-eagle-600 transition-colors rounded-lg hover:bg-eagle-50">
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gold-600">{user?.role}</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-eagle-600 to-naija-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-sm font-medium text-white">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 flex items-center space-x-1"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;