import React, { useState } from 'react';
import { Key, Eye, EyeOff, Save, RefreshCw, Shield, Building2, Mail, Lock } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  loginAttempts: number;
}

const ProviderLoginManagement: React.FC = () => {
  const [providers] = useState<Provider[]>([
    {
      id: 'PRV-001',
      name: 'Lagos University Teaching Hospital (LUTH)',
      email: 'provider@luth.edu.ng',
      status: 'active',
      lastLogin: '2025-01-13 14:30',
      loginAttempts: 0
    },
    {
      id: 'PRV-002',
      name: 'National Hospital Abuja',
      email: 'provider@nationalhospital.gov.ng',
      status: 'active',
      lastLogin: '2025-01-12 09:15',
      loginAttempts: 0
    },
    {
      id: 'PRV-003',
      name: 'Reddington Hospital Victoria Island',
      email: 'provider@reddingtonhospital.com',
      status: 'inactive',
      lastLogin: '2025-01-10 16:45',
      loginAttempts: 2
    }
  ]);

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetPassword = async (provider: Provider) => {
    setSelectedProvider(provider);
    setShowPasswordReset(true);
    // Generate random password
    const randomPassword = Math.random().toString(36).slice(-8);
    setNewPassword(randomPassword);
  };

  const confirmPasswordReset = async () => {
    if (!selectedProvider || !newPassword) return;
    
    setIsResetting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsResetting(false);
      setShowPasswordReset(false);
      setSelectedProvider(null);
      setNewPassword('');
      alert(`Password reset successful for ${selectedProvider.name}!\n\nNew credentials:\nEmail: ${selectedProvider.email}\nPassword: ${newPassword}\n\nProvider has been notified via email.`);
    }, 2000);
  };

  const handleToggleStatus = (provider: Provider) => {
    const newStatus = provider.status === 'active' ? 'inactive' : 'active';
    alert(`${provider.name} status changed to ${newStatus.toUpperCase()}`);
  };

  const handleUnlockAccount = (provider: Provider) => {
    alert(`Account unlocked for ${provider.name}. Login attempts reset to 0.`);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Provider Login Management</h2>
              <p className="text-sm text-gray-600">Manage provider account access and reset passwords</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{provider.email}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">ID: {provider.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(provider.status)}`}>
                      {provider.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-600">Last Login</p>
                    <p className="font-medium text-gray-900">{provider.lastLogin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Failed Attempts</p>
                    <p className={`font-medium ${provider.loginAttempts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {provider.loginAttempts}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Status</p>
                    <p className="font-medium text-gray-900">
                      {provider.loginAttempts >= 3 ? 'Locked' : 'Active'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleResetPassword(provider)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset Password</span>
                  </button>
                  
                  <button
                    onClick={() => handleToggleStatus(provider)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                      provider.status === 'active'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>{provider.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                  </button>
                  
                  {provider.loginAttempts >= 3 && (
                    <button
                      onClick={() => handleUnlockAccount(provider)}
                      className="flex items-center space-x-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                    >
                      <Key className="w-4 h-4" />
                      <span>Unlock</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showPasswordReset && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedProvider.name}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={selectedProvider.email}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> The provider will be notified of the password change via email and SMS.
                </p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowPasswordReset(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPasswordReset}
                disabled={isResetting || !newPassword}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
              >
                {isResetting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Resetting...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Reset Password</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderLoginManagement;