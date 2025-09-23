import React, { useState } from 'react';
import { FileText, Calendar, DollarSign, Building2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const ProviderContracts: React.FC = () => {
  const [contracts] = useState([
    {
      id: 'CNT-001',
      providerId: 'PRV-001',
      providerName: 'Lagos University Teaching Hospital (LUTH)',
      contractType: 'Comprehensive Care',
      startDate: '2023-01-01',
      endDate: '2025-12-31',
      value: 50000000,
      status: 'active',
      tier: 'Tier 1',
      services: ['Emergency Care', 'Surgery', 'Cardiology', 'Neurology'],
      renewalDate: '2025-10-01',
      daysToRenewal: 261
    },
    {
      id: 'CNT-002',
      providerId: 'PRV-002',
      providerName: 'National Hospital Abuja',
      contractType: 'Specialist Services',
      startDate: '2023-06-01',
      endDate: '2026-05-31',
      value: 35000000,
      status: 'active',
      tier: 'Tier 1',
      services: ['Oncology', 'Pediatrics', 'Maternity'],
      renewalDate: '2026-02-01',
      daysToRenewal: 384
    },
    {
      id: 'CNT-003',
      providerId: 'PRV-003',
      providerName: 'Reddington Hospital Victoria Island',
      contractType: 'Premium Care',
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      value: 25000000,
      status: 'expiring_soon',
      tier: 'Tier 2',
      services: ['Diagnostics', 'Wellness', 'Executive Health'],
      renewalDate: '2025-10-01',
      daysToRenewal: 45
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring_soon': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'expiring_soon': return AlertTriangle;
      case 'expired': return AlertTriangle;
      case 'pending': return Clock;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Provider Contracts</h1>
        <p className="text-gray-600 mt-1">Manage provider agreements and contract renewals</p>
      </div>

      {/* Contract Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Contracts</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₦110M</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Contract</p>
              <p className="text-2xl font-bold text-gray-900">2.5 yrs</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {contracts.map((contract) => {
          const StatusIcon = getStatusIcon(contract.status);
          
          return (
            <div key={contract.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{contract.providerName}</h3>
                    <p className="text-gray-600">{contract.contractType}</p>
                    <p className="text-sm text-gray-500">Contract ID: {contract.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}>
                    <StatusIcon className="w-4 h-4 inline mr-1" />
                    {contract.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {contract.tier}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Contract Period</p>
                  <p className="font-medium text-gray-900">{contract.startDate} - {contract.endDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contract Value</p>
                  <p className="font-medium text-gray-900">₦{(contract.value / 1000000).toFixed(0)}M</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Renewal Date</p>
                  <p className="font-medium text-gray-900">{contract.renewalDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Days to Renewal</p>
                  <p className={`font-medium ${
                    contract.daysToRenewal < 60 ? 'text-red-600' : 
                    contract.daysToRenewal < 120 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {contract.daysToRenewal} days
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Covered Services</p>
                <div className="flex flex-wrap gap-2">
                  {contract.services.map((service, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {contract.status === 'expiring_soon' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Contract Renewal Required</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    This contract expires in {contract.daysToRenewal} days. Please initiate renewal process.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                  View Details
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Manage Contract
                </button>
                {contract.status === 'expiring_soon' && (
                  <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                    Initiate Renewal
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProviderContracts;