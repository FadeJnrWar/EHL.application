import React, { useState } from 'react';
import { FileText, Filter, Download, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import ClaimsQueue from '../components/Claims/ClaimsQueue';
import ClaimsFilters from '../components/Claims/ClaimsFilters';
import ClaimsStats from '../components/Claims/ClaimsStats';
import ClaimsAnalytics from '../components/Claims/ClaimsAnalytics';
import OfflineBanner from '../components/Common/OfflineBanner';

const Claims: React.FC = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [filters, setFilters] = useState({
    status: 'pending',
    adjudicator: 'all',
    provider: 'all',
    dateRange: '7days'
  });

  const tabs = [
    { id: 'queue', label: 'Claims Queue', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: CheckCircle }
  ];

  const handleBulkExport = () => {
    alert('Exporting claims data...');
  };

  return (
    <div className="space-y-6">
      <OfflineBanner />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claims Processing</h1>
          <p className="text-gray-600 mt-1">Review and adjudicate provider claims</p>
        </div>
        <button
          onClick={handleBulkExport}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Claims</span>
        </button>
      </div>

      <ClaimsStats />

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
          {activeTab === 'queue' && (
            <>
              <ClaimsFilters filters={filters} onFiltersChange={setFilters} />
              <div className="mt-6">
                <ClaimsQueue filters={filters} />
              </div>
            </>
          )}
          {activeTab === 'analytics' && <ClaimsAnalytics />}
        </div>
      </div>
    </div>
  );
};

export default Claims;