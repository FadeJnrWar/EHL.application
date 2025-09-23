import React from 'react';
import { Filter, Calendar } from 'lucide-react';

interface ClaimsFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

const ClaimsFilters: React.FC<ClaimsFiltersProps> = ({ filters, onFiltersChange }) => {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex items-center space-x-4 flex-wrap">
      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
      </div>

      <select
        value={filters.status}
        onChange={(e) => updateFilter('status', e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
      >
        <option value="all">All Status</option>
        <option value="pending_review">Pending Review</option>
        <option value="under_review">Under Review</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="auto_rejected">Auto-Rejected</option>
      </select>

      <select
        value={filters.adjudicator}
        onChange={(e) => updateFilter('adjudicator', e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
      >
        <option value="all">All Adjudicators</option>
        <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
        <option value="Dr. Mike Chen">Dr. Mike Chen</option>
        <option value="Dr. Lisa Rodriguez">Dr. Lisa Rodriguez</option>
        <option value="unassigned">Unassigned</option>
      </select>

      <select
        value={filters.provider}
        onChange={(e) => updateFilter('provider', e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
      >
        <option value="all">All Providers</option>
        <option value="PRV-001">Lagos University Teaching Hospital</option>
        <option value="PRV-002">National Hospital Abuja</option>
        <option value="PRV-003">Reddington Hospital</option>
      </select>

      <select
        value={filters.dateRange}
        onChange={(e) => updateFilter('dateRange', e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
      >
        <option value="today">Today</option>
        <option value="7days">Last 7 Days</option>
        <option value="30days">Last 30 Days</option>
        <option value="90days">Last 90 Days</option>
        <option value="all">All Time</option>
      </select>

      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <span>Custom Range:</span>
        <input
          type="date"
          className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-sky-500"
        />
        <span>to</span>
        <input
          type="date"
          className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-sky-500"
        />
      </div>
    </div>
  );
};

export default ClaimsFilters;