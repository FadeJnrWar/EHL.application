import React from 'react';
import { Filter } from 'lucide-react';

interface ApprovalFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

const ApprovalFilters: React.FC<ApprovalFiltersProps> = ({ filters, onFiltersChange }) => {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
      </div>

      <select
        value={filters.status}
        onChange={(e) => updateFilter('status', e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
      >
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="denied">Denied</option>
        <option value="all">All Status</option>
      </select>

      <select
        value={filters.urgency}
        onChange={(e) => updateFilter('urgency', e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
      >
        <option value="all">All Urgency</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        value={filters.provider}
        onChange={(e) => updateFilter('provider', e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
      >
        <option value="all">All Providers</option>
        <option value="city_general">City General Hospital</option>
        <option value="metro_medical">Metro Medical Center</option>
        <option value="sunshine_clinic">Sunshine Clinic</option>
      </select>
    </div>
  );
};

export default ApprovalFilters;