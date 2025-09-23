import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, FileText, Guitar as Hospital, User, DollarSign, Package, Edit3, Save, X } from 'lucide-react';

interface ApprovalQueueProps {
  filters: any;
}

interface TreatmentItem {
  id: string;
  service: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

const ApprovalQueue: React.FC<ApprovalQueueProps> = ({ filters }) => {
  const [approvals, setApprovals] = useState([
    {
      id: 'REQ-001',
      enrolleeId: 'ENR-12345',
      enrolleeName: 'Maria Santos',
      provider: 'City General Hospital',
      icd10Code: 'B50.9',
      diagnosis: 'Plasmodium falciparum malaria, unspecified',
      requestDate: '2025-01-13',
      urgency: 'high',
      estimatedCost: '$1,250',
      status: 'pending',
      comments: 'Patient presents with high fever and chills. Rapid diagnostic test positive for P. falciparum.',
      treatments: [
        { id: '1', service: 'Consultation', unitPrice: 500, quantity: 1, total: 500 },
        { id: '2', service: 'Malaria Test (RDT)', unitPrice: 200, quantity: 1, total: 200 },
        { id: '3', service: 'Artemether Injection', unitPrice: 150, quantity: 3, total: 450 },
        { id: '4', service: 'IV Fluids', unitPrice: 100, quantity: 1, total: 100 }
      ]
    },
    {
      id: 'REQ-002',
      enrolleeId: 'ENR-67890',
      enrolleeName: 'Ahmed Ibrahim',
      provider: 'Metro Medical Center',
      icd10Code: 'E11.9',
      diagnosis: 'Type 2 diabetes mellitus without complications',
      requestDate: '2025-01-13',
      urgency: 'medium',
      estimatedCost: '$450',
      status: 'pending',
      comments: 'Routine diabetes management and monitoring. Patient compliance good.',
      treatments: [
        { id: '1', service: 'Consultation', unitPrice: 300, quantity: 1, total: 300 },
        { id: '2', service: 'HbA1c Test', unitPrice: 150, quantity: 1, total: 150 }
      ]
    },
    {
      id: 'REQ-003',
      enrolleeId: 'ENR-11111',
      enrolleeName: 'Grace Okafor',
      provider: 'Sunshine Clinic',
      icd10Code: 'I10',
      diagnosis: 'Essential hypertension',
      requestDate: '2025-01-12',
      urgency: 'low',
      estimatedCost: '$200',
      status: 'pending',
      comments: 'Blood pressure monitoring and medication adjustment needed.',
      treatments: [
        { id: '1', service: 'Consultation', unitPrice: 200, quantity: 1, total: 200 }
      ]
    }
  ]);

  const [editingTreatment, setEditingTreatment] = useState<{approvalId: string, treatmentId: string} | null>(null);
  const [editValues, setEditValues] = useState<{quantity: number, unitPrice: number}>({quantity: 1, unitPrice: 0});
  const handleApproval = (requestId: string, action: 'approve' | 'deny') => {
    setApprovals(prev => prev.map(approval => 
      approval.id === requestId 
        ? { ...approval, status: action === 'approve' ? 'approved' : 'denied' }
        : approval
    ));

    if (action === 'approve') {
      const paCode = `PA-${Date.now()}`;
      alert(`Request approved! PA Code: ${paCode}`);
    }
  };

  const startEditing = (approvalId: string, treatmentId: string, currentQuantity: number, currentPrice: number) => {
    setEditingTreatment({approvalId, treatmentId});
    setEditValues({quantity: currentQuantity, unitPrice: currentPrice});
  };

  const saveEdit = () => {
    if (!editingTreatment) return;
    
    setApprovals(prev => prev.map(approval => {
      if (approval.id === editingTreatment.approvalId) {
        return {
          ...approval,
          treatments: approval.treatments?.map((treatment: TreatmentItem) => {
            if (treatment.id === editingTreatment.treatmentId) {
              return {
                ...treatment,
                quantity: editValues.quantity,
                unitPrice: editValues.unitPrice,
                total: editValues.quantity * editValues.unitPrice
              };
            }
            return treatment;
          })
        };
      }
      return approval;
    }));
    
    setEditingTreatment(null);
  };

  const cancelEdit = () => {
    setEditingTreatment(null);
  };
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApprovals = approvals.filter(approval => {
    if (filters.status !== 'all' && approval.status !== filters.status) return false;
    if (filters.urgency !== 'all' && approval.urgency !== filters.urgency) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {filteredApprovals.map((approval) => (
        <div key={approval.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                <Hospital className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{approval.enrolleeName}</h3>
                <p className="text-gray-600">ID: {approval.enrolleeId}</p>
                <p className="text-sm text-gray-500">Request: {approval.id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(approval.urgency)}`}>
                {approval.urgency.toUpperCase()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                {approval.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Provider</p>
              <p className="font-medium text-gray-900">{approval.provider}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ICD-10 Code</p>
              <p className="font-medium text-gray-900">{approval.icd10Code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Request Date</p>
              <p className="font-medium text-gray-900">{approval.requestDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Est. Cost</p>
              <p className="font-medium text-gray-900">{approval.estimatedCost}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Diagnosis</p>
            <p className="text-gray-900">{approval.diagnosis}</p>
          </div>

          {/* Comments Section */}
          {approval.comments && (
            <div className="mb-4 bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">Provider Comments</p>
              <p className="text-gray-900 text-sm">{approval.comments}</p>
            </div>
          )}
          {/* Treatment Breakdown */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Package className="w-4 h-4 text-gray-600" />
              <h4 className="text-sm font-medium text-gray-900">Treatment Breakdown</h4>
              <span className="text-xs text-gray-500">(HMO staff can edit quantities and prices)</span>
            </div>
            
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="grid grid-cols-5 gap-4 p-3 bg-gray-100 text-xs font-medium text-gray-700 uppercase tracking-wide">
                <div>Service/Treatment</div>
                <div className="text-right">Unit Price</div>
                <div className="text-center">Qty</div>
                <div className="text-right">Total</div>
                <div className="text-center">Actions</div>
              </div>
              
              {approval.treatments?.map((treatment: TreatmentItem) => (
                <div key={treatment.id} className="grid grid-cols-5 gap-4 p-3 border-b border-gray-200 last:border-b-0 items-center">
                  <div className="text-sm text-gray-900">{treatment.service}</div>
                  
                  <div className="text-right">
                    {editingTreatment?.approvalId === approval.id && editingTreatment?.treatmentId === treatment.id ? (
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editValues.unitPrice}
                        onChange={(e) => setEditValues({...editValues, unitPrice: parseFloat(e.target.value) || 0})}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-sky-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">₦{treatment.unitPrice.toLocaleString()}</span>
                    )}
                  </div>
                  
                  <div className="text-center">
                    {editingTreatment?.approvalId === approval.id && editingTreatment?.treatmentId === treatment.id ? (
                      <input
                        type="number"
                        min="1"
                        value={editValues.quantity}
                        onChange={(e) => setEditValues({...editValues, quantity: parseInt(e.target.value) || 1})}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 text-center"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{treatment.quantity}</span>
                    )}
                  </div>
                  
                  <div className="text-sm font-medium text-gray-900 text-right">₦{treatment.total.toLocaleString()}</div>
                  
                  <div className="text-center">
                    {approval.status === 'pending' && (
                      editingTreatment?.approvalId === approval.id && editingTreatment?.treatmentId === treatment.id ? (
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={saveEdit}
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="Save changes"
                          >
                            <Save className="w-3 h-3" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Cancel edit"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(approval.id, treatment.id, treatment.quantity, treatment.unitPrice)}
                          className="p-1 text-sky-600 hover:text-sky-800 transition-colors"
                          title="Edit quantity/price"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
              
              <div className="grid grid-cols-5 gap-4 p-3 bg-sky-50 border-t-2 border-sky-200">
                <div className="col-span-4 text-sm font-medium text-gray-900">Total Amount</div>
                <div className="text-sm font-bold text-sky-700 text-right">
                  ₦{approval.treatments?.reduce((sum: number, item: TreatmentItem) => sum + item.total, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          {approval.status === 'pending' && (
            <div className="flex space-x-3">
              <button
                onClick={() => handleApproval(approval.id, 'approve')}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => handleApproval(approval.id, 'deny')}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Deny</span>
              </button>
            </div>
          )}
        </div>
      ))}

      {filteredApprovals.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h3>
          <p className="text-gray-600">All care requests have been processed</p>
        </div>
      )}
    </div>
  );
};

export default ApprovalQueue;