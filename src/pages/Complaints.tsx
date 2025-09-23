import React, { useState } from 'react';
import { MessageSquare, Plus, Filter, Search } from 'lucide-react';
import ComplaintForm from '../components/Complaints/ComplaintForm';
import ComplaintList from '../components/Complaints/ComplaintList';
import ComplaintFilters from '../components/Complaints/ComplaintFilters';
import OfflineBanner from '../components/Common/OfflineBanner';

const Complaints: React.FC = () => {
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignee: 'all'
  });

  return (
    <div className="space-y-6">
      <OfflineBanner />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaint Management</h1>
          <p className="text-gray-600 mt-1">Log and track enrollee complaints with real-time updates</p>
        </div>
        <button
          onClick={() => setShowNewComplaint(true)}
          className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Complaint</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <ComplaintFilters filters={filters} onFiltersChange={setFilters} />
        </div>
        <ComplaintList filters={filters} />
      </div>

      {showNewComplaint && (
        <ComplaintForm onClose={() => setShowNewComplaint(false)} />
      )}
    </div>
  );
};

export default Complaints;