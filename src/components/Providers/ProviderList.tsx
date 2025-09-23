import React, { useState } from 'react';
import { Building2, Phone, Mail, MapPin, Star, AlertTriangle, Edit, Trash2, FileText } from 'lucide-react';

interface ProviderListProps {
  searchQuery: string;
  filters: any;
}

const ProviderList: React.FC<ProviderListProps> = ({ searchQuery, filters }) => {
  const [providers] = useState([
    {
      id: 'PRV-001',
      name: 'Lagos University Teaching Hospital',
      category: 'General Hospital',
      tier: 'Tier 1',
      status: 'active',
      location: 'Lagos',
      phone: '+234-801-234-5678',
      email: 'admin@luth.edu.ng',
      address: 'Idi-Araba, Lagos',
      specialServices: ['Cardiology', 'Neurology', 'Oncology'],
      performanceScore: 96.5,
      totalClaims: 1247,
      pendingIssues: 2,
      contractStart: '2023-01-01',
      contractEnd: '2025-12-31'
    },
    {
      id: 'PRV-002',
      name: 'National Hospital Abuja',
      category: 'General Hospital',
      tier: 'Tier 1',
      status: 'active',
      location: 'Abuja',
      phone: '+234-809-876-5432',
      email: 'info@nationalhospital.gov.ng',
      address: 'Central Business District, Abuja',
      specialServices: ['Emergency Care', 'Surgery', 'Pediatrics'],
      performanceScore: 94.2,
      totalClaims: 892,
      pendingIssues: 0,
      contractStart: '2023-06-01',
      contractEnd: '2026-05-31'
    },
    {
      id: 'PRV-003',
      name: 'Reddington Hospital',
      category: 'Specialist',
      tier: 'Tier 2',
      status: 'active',
      location: 'Lagos',
      phone: '+234-701-345-6789',
      email: 'contact@reddingtonhospital.com',
      address: 'Victoria Island, Lagos',
      specialServices: ['Maternity', 'Diagnostics', 'Wellness'],
      performanceScore: 92.8,
      totalClaims: 634,
      pendingIssues: 1,
      contractStart: '2023-03-15',
      contractEnd: '2025-03-14'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Tier 1': return 'bg-blue-100 text-blue-800';
      case 'Tier 2': return 'bg-purple-100 text-purple-800';
      case 'Tier 3': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filters.category === 'all' || provider.category.toLowerCase().includes(filters.category);
    const matchesTier = filters.tier === 'all' || provider.tier.toLowerCase().includes(filters.tier);
    const matchesStatus = filters.status === 'all' || provider.status === filters.status;
    const matchesLocation = filters.location === 'all' || provider.location.toLowerCase() === filters.location;

    return matchesSearch && matchesCategory && matchesTier && matchesStatus && matchesLocation;
  });

  return (
    <div className="space-y-4">
      {filteredProviders.map((provider) => (
        <div key={provider.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                <p className="text-gray-600">{provider.id}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                    {provider.status.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(provider.tier)}`}>
                    {provider.tier}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {provider.category}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-900">{provider.performanceScore}%</span>
              </div>
              {provider.pendingIssues > 0 && (
                <div className="flex items-center space-x-1 text-orange-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">{provider.pendingIssues}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{provider.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{provider.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{provider.email}</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Special Services</p>
              <div className="flex flex-wrap gap-1">
                {provider.specialServices.map((service, index) => (
                  <span key={index} className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Claims:</span>
                <span className="font-medium text-gray-900">{provider.totalClaims.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contract:</span>
                <span className="font-medium text-gray-900">{provider.contractStart} - {provider.contractEnd}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors">
              <FileText className="w-4 h-4" />
              <span>View Tariffs</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 text-sky-600 hover:text-sky-800 transition-colors">
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-800 transition-colors">
              <Trash2 className="w-4 h-4" />
              <span>Delist</span>
            </button>
          </div>
        </div>
      ))}

      {filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Providers Found</h3>
          <p className="text-gray-600">No providers match the selected criteria</p>
        </div>
      )}
    </div>
  );
};

export default ProviderList;