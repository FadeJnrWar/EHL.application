import React, { useState } from 'react';
import { CheckCircle, Clock, Filter, AlertCircle, Plus } from 'lucide-react';
import ApprovalQueue from '../components/Approvals/ApprovalQueue';
import ApprovalFilters from '../components/Approvals/ApprovalFilters';
import ApprovalStats from '../components/Approvals/ApprovalStats';
import TreatmentForm from '../components/Approvals/TreatmentForm';
import OfflineBanner from '../components/Common/OfflineBanner';

const Approvals: React.FC = () => {
  const [filters, setFilters] = useState({
    status: 'pending',
    urgency: 'all',
    provider: 'all'
  });
  
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);

  const handleTreatmentSubmit = (treatments: any[]) => {
    console.log('Treatment request submitted:', treatments);
    setShowTreatmentForm(false);
    // In real app, this would send the request to the call center for approval
    alert('Treatment request submitted for approval!');
  };
  return (
    <div className="space-y-6">
      <OfflineBanner />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Care Approvals</h1>
          <p className="text-gray-600 mt-1">Review and approve hospital care requests</p>
        </div>
        <button
          onClick={() => setShowTreatmentForm(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Treatment Request</span>
        </button>
      </div>

      <ApprovalStats />

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <ApprovalFilters filters={filters} onFiltersChange={setFilters} />
        </div>
        <ApprovalQueue filters={filters} />
      </div>
      
      {showTreatmentForm && (
        <TreatmentForm
          onClose={() => setShowTreatmentForm(false)}
          onSubmit={handleTreatmentSubmit}
          enrolleeId="ENR-SAMPLE"
          enrolleeName="Sample Patient"
          diagnosis="Sample Diagnosis"
        />
      )}
    </div>
  );
};

export default Approvals;