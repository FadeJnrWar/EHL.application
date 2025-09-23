import React, { useState } from 'react';
import { Building2, Plus, Filter, Download, Users, AlertTriangle, Key } from 'lucide-react';
import ProviderSearch from '../components/Providers/ProviderSearch';
import ProviderList from '../components/Providers/ProviderList';
import ProviderForm from '../components/Providers/ProviderForm';
import ProviderStats from '../components/Providers/ProviderStats';
import ProviderLoginManagement from '../components/Providers/ProviderLoginManagement';
import OfflineBanner from '../components/Common/OfflineBanner';

const Providers: React.FC = () => {
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [activeTab, setActiveTab] = useState('directory');
  const [filters, setFilters] = useState({
    category: 'all',
    tier: 'all',
    status: 'active',
    location: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handleExport = () => {
    // Generate CSV export of filtered providers
    alert('Exporting provider data...');
  };

  const tabs = [
    { id: 'directory', label: 'Provider Directory', icon: Building2 },
    { id: 'login-management', label: 'Login Management', icon: Key }
  ];

  return (
    <div className="space-y-6">
      <OfflineBanner />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Provider Management</h1>
          <p className="text-gray-600 mt-1">Manage hospital network and provider relationships</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddProvider(true)}
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Provider</span>
          </button>
        </div>
      </div>

      <ProviderStats />

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-sky-600 text-sky-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'directory' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <ProviderSearch 
                  onSearch={setSearchQuery}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>
              <div className="lg:col-span-3">
                <ProviderList 
                  searchQuery={searchQuery}
                  filters={filters}
                />
              </div>
            </div>
          )}
          {activeTab === 'login-management' && <ProviderLoginManagement />}
        </div>
      </div>

      {showAddProvider && (
        <ProviderForm onClose={() => setShowAddProvider(false)} />
      )}
    </div>
  );
};

export default Providers;