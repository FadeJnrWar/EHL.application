import React from 'react';
import { Search, Filter, Building2 } from 'lucide-react';

interface ProviderSearchProps {
  onSearch: (query: string) => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
}

const ProviderSearch: React.FC<ProviderSearchProps> = ({ onSearch, filters, onFiltersChange }) => {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-sky-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Search Providers</h2>
          <p className="text-sm text-gray-600">Find hospitals and clinics</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Provider name or location"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Categories</option>
              <option value="general">General Hospital</option>
              <option value="specialist">Specialist</option>
              <option value="clinic">Clinic</option>
              <option value="diagnostic">Diagnostic Center</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Tier</label>
            <select
              value={filters.tier}
              onChange={(e) => updateFilter('tier', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Tiers</option>
              <option value="tier1">Tier 1</option>
              <option value="tier2">Tier 2</option>
              <option value="tier3">Tier 3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="all">All Status</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Location</label>
            <select
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Locations</option>
              <option value="lagos">Lagos</option>
              <option value="abuja">Abuja</option>
              <option value="kano">Kano</option>
              <option value="port-harcourt">Port Harcourt</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderSearch;