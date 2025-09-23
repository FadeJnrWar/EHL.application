import React from 'react';
import { Filter } from 'lucide-react';

interface ComplaintFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

const ComplaintFilters: React.FC<ComplaintFiltersProps> = ({ filters, onFiltersChange }) => {
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
        <option value="all">All Status</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) => updateFilter('priority', e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
      >
        <option value="all">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        value={filters.assignee}
        onChange={(e) => updateFilter('assignee', e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
      >
        <option value="all">All Assignees</option>
        <option value="sarah">Sarah Johnson</option>
        <option value="mike">Mike Chen</option>
        <option value="lisa">Lisa Rodriguez</option>
      </select>
    </div>
  );
};

export default ComplaintFilters;