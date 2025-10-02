import React, { useState } from 'react';
import { Bell, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import OfflineStatusButton from '../Common/OfflineStatusButton';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [showUserMenu, setShowUserMenu] = useState(false);

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
          
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-eagle-50 transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gold-600">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-eagle-600 to-naija-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-600">{user?.email}</p>
                  <p className="text-xs text-gold-600 mt-1">{user?.role} • {user?.department}</p>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>

                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;