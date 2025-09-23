import React, { useState } from 'react';
import { FileText, Eye, Lock, CheckCircle, XCircle, DollarSign, AlertTriangle, MessageSquare, Edit3, Save, X, Building2, Calendar, Filter, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import OfflineBanner from '../components/Common/OfflineBanner';

interface Treatment {
  id: string;
  service: string;
  quantity: number;
  unitPrice: number;
  total: number;
  benefitType?: string;
  benefitLimit?: number;
  exceedsLimit?: boolean;
  submittedQuantity: number;
  submittedUnitPrice: number;
  submittedTotal: number;
  approvedQuantity: number;
  approvedUnitPrice: number;
  approvedTotal: number;
  status: 'approved' | 'rejected' | 'pending';
  comment: string;
  isNewItem?: boolean;
}

interface Claim {
  id: string;
  paCode: string;
  enrolleeId: string;
  enrolleeName: string;
  enrolleeCompany: string;
  enrolleePlan: string;
  enrolleeGender: string;
  enrolleeAge: number;
  providerId: string;
  providerName: string;
  submissionDate: string;
  encounterDate: string;
  submittedAmount: number;
  vettedAmount: number;
  aiScore: number;
  workflowStage: string;
  lockedBy?: string;
  treatments: Treatment[];
  llmComment: string;
  llmRecommendation: 'APPROVE' | 'REJECT' | 'REVIEW_REQUIRED';
  llmReasoning: string;
  benefitFlags: string[];
  editableComment: string;
  doctorComment?: string;
  auditLog: any[];
}

const SubmittedClaims: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [selectedMonth, setSelectedMonth] = useState('2025-01');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [workflowFilter, setWorkflowFilter] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [editingTreatmentComment, setEditingTreatmentComment] = useState<{claimId: string, treatmentId: string} | null>(null);
  const [treatmentCommentText, setTreatmentCommentText] = useState('');
  const [editingTreatment, setEditingTreatment] = useState<{claimId: string, treatmentId: string} | null>(null);
  const [editValues, setEditValues] = useState<{quantity: number, unitPrice: number}>({quantity: 1, unitPrice: 0});

  const commentOptions = [
    'APPROVED',
    'INAPPROPRIATE MEDICATION FOR DIAGNOSIS',
    'INAPPROPRIATE INVESTIGATION FOR DIAGNOSIS',
    'INAPPROPRIATE UNKNOWN FOR DIAGNOSIS',
    'APPROVED.',
    'EXCESSIVE QUANTITY',
    'PRICE TOO HIGH',
    'NOT COVERED UNDER PLAN',
    'REQUIRES PRIOR AUTHORIZATION',
    'DUPLICATE SERVICE'
  ];

  // Sample benefit limits database
  const benefitLimits = {
    'Bronze': {
      'Lens and Frame': 5000,
      'Consultation': 3000,
      'Laboratory Test': 2000,
      'X-Ray': 4000,
      'Medication': 10000
    },
    'Silver': {
      'Lens and Frame': 15000,
      'Consultation': 5000,
      'Laboratory Test': 5000,
      'X-Ray': 8000,
      'Medication': 25000
    },
    'Gold': {
      'Lens and Frame': 30000,
      'Consultation': 10000,
      'Laboratory Test': 10000,
      'X-Ray': 15000,
      'Medication': 50000
    }
  };

  const [claims, setClaims] = useState<Claim[]>([
    {
      id: 'CLM-001',
      paCode: 'PA-1736789456789-123',
      enrolleeId: 'ENR-12345',
      enrolleeName: 'Adebayo Olumide',
      enrolleeCompany: 'Zenith Bank Plc',
      enrolleePlan: 'Bronze',
      providerId: 'PRV-001',
      providerName: 'Lagos University Teaching Hospital (LUTH)',
      submissionDate: '2025-01-10',
      encounterDate: '2025-01-09',
      submittedAmount: 52500,
      vettedAmount: 32500,
      aiScore: 85,
      workflowStage: 'approved',
      treatments: [
        { 
          id: '1', 
          service: 'OMEPRAZOLE 20MG - Prescription', 
          quantity: 7, 
          unitPrice: 500, 
          total: 3500,
          submittedQuantity: 7,
          submittedUnitPrice: 500,
          submittedTotal: 3500,
          approvedQuantity: 7,
          approvedUnitPrice: 500,
          approvedTotal: 3500,
          status: 'approved',
          comment: 'APPROVED',
          benefitType: 'Medication', 
          benefitLimit: 10000, 
          exceedsLimit: false,
          isNewItem: false
        },
        { 
          id: '2', 
          service: 'PANADOL ADVANCE - Prescription', 
          quantity: 30, 
          unitPrice: 200, 
          total: 6000,
          submittedQuantity: 30,
          submittedUnitPrice: 200,
          submittedTotal: 6000,
          approvedQuantity: 30,
          approvedUnitPrice: 200,
          approvedTotal: 6000,
          status: 'approved',
          comment: 'APPROVED',
          benefitType: 'Medication', 
          benefitLimit: 10000, 
          exceedsLimit: false,
          isNewItem: false
        },
        { 
          id: '3', 
          service: 'H.PYLORI Ag stool - Lab Fees', 
          quantity: 1, 
          unitPrice: 23000, 
          total: 23000,
          submittedQuantity: 1,
          submittedUnitPrice: 23000,
          submittedTotal: 23000,
          approvedQuantity: 1,
          approvedUnitPrice: 23000,
          approvedTotal: 23000,
          status: 'approved',
          comment: 'APPROVED',
          benefitType: 'Laboratory Test', 
          benefitLimit: 2000, 
          exceedsLimit: true,
          isNewItem: false
        },
        { 
          id: '4', 
          service: 'BLOOD SLIDE BB.SS - Lab Fees', 
          quantity: 1, 
          unitPrice: 5000, 
          total: 5000,
          submittedQuantity: 1,
          submittedUnitPrice: 5000,
          submittedTotal: 5000,
          approvedQuantity: 0,
          approvedUnitPrice: 0,
          approvedTotal: 0,
          status: 'rejected',
          comment: 'INAPPROPRIATE INVESTIGATION FOR DIAGNOSIS',
          benefitType: 'Laboratory Test', 
          benefitLimit: 2000, 
          exceedsLimit: true,
          isNewItem: true
        },
        { 
          id: '5', 
          service: 'CRP Semi Quantitative Test - Lab Fees', 
          quantity: 1, 
          unitPrice: 15000, 
          total: 15000,
          submittedQuantity: 1,
          submittedUnitPrice: 15000,
          submittedTotal: 15000,
          approvedQuantity: 0,
          approvedUnitPrice: 0,
          approvedTotal: 0,
          status: 'rejected',
          comment: 'INAPPROPRIATE INVESTIGATION FOR DIAGNOSIS',
          benefitType: 'Laboratory Test', 
          benefitLimit: 2000, 
          exceedsLimit: true,
          isNewItem: true
        }
      ],
      llmComment: "APPROVED WITH ADJUSTMENTS: Medications are appropriate for gastric ulcer treatment. H.PYLORI test is medically justified despite exceeding Bronze plan limit. However, BLOOD SLIDE and CRP tests are not appropriate for this diagnosis and should be rejected. Total approved: ₦32,500 instead of ₦52,500.",
      llmRecommendation: 'APPROVE',
      llmReasoning: 'Core treatment appropriate but unnecessary tests rejected for cost optimization.',
      benefitFlags: ['H.PYLORI test exceeds Bronze plan limit (₦23,000 > ₦2,000) but medically justified'],
      editableComment: 'Patient with gastric ulcer. Core medications approved, unnecessary tests rejected.',
      doctorComment: 'Approved with selective test approval. H.PYLORI justified for diagnosis.',
      auditLog: [
        { id: '1', action: 'LLM Analysis Completed', user: 'AI System', timestamp: '2025-01-10 09:31', notes: 'Flagged unnecessary tests for gastric ulcer' },
        { id: '2', action: 'Initial Vetting', user: 'Emmanuel Onifade', timestamp: '2025-01-10 14:30', notes: 'Rejected inappropriate lab tests' },
        { id: '3', action: 'Medical Review', user: 'Dr. Owolabi Adebayo', timestamp: '2025-01-11 08:15', notes: 'Final approval with selective test approval' }
      ]
    },
    {
      id: 'CLM-006',
      paCode: 'PA-1736788956789-303',
      enrolleeId: 'ENR-44444',
      enrolleeName: 'Aisha Mohammed',
      enrolleeCompany: 'Zenith Bank Plc',
      enrolleePlan: 'Bronze',
      providerId: 'PRV-004',
      providerName: 'Eye Care Specialists Lagos',
      submissionDate: '2025-01-14',
      encounterDate: '2025-01-13',
      submittedAmount: 50000,
      vettedAmount: 8000,
      aiScore: 25,
      workflowStage: 'ready_for_initial_vetting',
      treatments: [
        { 
          id: '1', 
          service: 'Eye Consultation - Ophthalmology', 
          quantity: 1, 
          unitPrice: 5000, 
          total: 5000,
          submittedQuantity: 1,
          submittedUnitPrice: 5000,
          submittedTotal: 5000,
          approvedQuantity: 1,
          approvedUnitPrice: 3000,
          approvedTotal: 3000,
          status: 'approved',
          comment: 'APPROVED - ADJUSTED TO PLAN LIMIT',
          benefitType: 'Consultation', 
          benefitLimit: 3000, 
          exceedsLimit: true 
        },
        { 
          id: '2', 
          service: 'Premium Designer Lens and Frame', 
          quantity: 1, 
          unitPrice: 45000, 
          total: 45000,
          submittedQuantity: 1,
          submittedUnitPrice: 45000,
          submittedTotal: 45000,
          approvedQuantity: 1,
          approvedUnitPrice: 5000,
          approvedTotal: 5000,
          status: 'approved',
          comment: 'APPROVED - ADJUSTED TO BRONZE PLAN LIMIT',
          benefitType: 'Lens and Frame', 
          benefitLimit: 5000, 
          exceedsLimit: true 
        }
      ],
      llmComment: "MAJOR BENEFIT VIOLATIONS DETECTED: 1) Eye consultation ₦5,000 exceeds Bronze plan limit of ₦3,000. 2) CRITICAL: Premium lens and frame ₦45,000 severely exceeds Bronze plan limit of ₦5,000 (900% over limit). This appears to be premium services being claimed under basic Bronze plan. RECOMMENDATION: Adjust consultation to ₦3,000 and lens to ₦5,000. Total should be ₦8,000 maximum, not ₦50,000.",
      llmRecommendation: 'REVIEW_REQUIRED',
      llmReasoning: 'Severe plan limit violations - premium services claimed under Bronze plan require adjustment.',
      benefitFlags: [
        'CRITICAL: Premium Lens and Frame severely exceeds Bronze plan limit (₦45,000 > ₦5,000)',
        'Eye consultation exceeds Bronze plan limit (₦5,000 > ₦3,000)',
        'Total claim 625% over reasonable Bronze plan limits'
      ],
      editableComment: 'Major plan violation - premium lens claimed under Bronze plan. Adjusted to plan limits.',
      auditLog: [
        { id: '1', action: 'LLM Analysis Failed', user: 'AI System', timestamp: '2025-01-14 10:15', notes: 'Critical plan limit violation detected' }
      ]
    }
  ]);

  const getWorkflowStageColor = (stage: string) => {
    switch (stage) {
      case 'ready_for_initial_vetting': return 'bg-blue-100 text-blue-800';
      case 'under_initial_vetting': return 'bg-yellow-100 text-yellow-800';
      case 'pending_doctor_review': return 'bg-orange-100 text-orange-800';
      case 'under_doctor_review': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkflowStageText = (stage: string) => {
    switch (stage) {
      case 'ready_for_initial_vetting': return 'Ready for Initial Vetting (Emmanuel)';
      case 'under_initial_vetting': return 'Under Initial Vetting (Emmanuel)';
      case 'pending_doctor_review': return 'Pending Doctor Review (Dr. Owolabi)';
      case 'under_doctor_review': return 'Under Doctor Review (Dr. Owolabi)';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return stage;
    }
  };

  const getLLMRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'APPROVE': return 'bg-green-100 text-green-800';
      case 'REJECT': return 'bg-red-100 text-red-800';
      case 'REVIEW_REQUIRED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  // Filter claims by selected provider and month
  const filteredClaims = claims.filter(claim => {
    const matchesProvider = selectedProvider === 'all' || claim.providerId === selectedProvider;
    const matchesMonth = claim.submissionDate.startsWith(selectedMonth);
    const matchesWorkflow = workflowFilter === 'all' || claim.workflowStage === workflowFilter;
    return matchesProvider && matchesMonth && matchesWorkflow;
  });

  const handleStartVetting = (claimId: string) => {
    setClaims(prev => prev.map(claim => 
      claim.id === claimId 
        ? { 
            ...claim, 
            workflowStage: 'under_initial_vetting',
            lockedBy: user?.name || 'Current User'
          }
        : claim
    ));
  };

  const handleEditComment = (claimId: string, currentComment: string) => {
    setEditingComment(claimId);
    setCommentText(currentComment);
  };

  const handleSaveComment = (claimId: string) => {
    setClaims(prev => prev.map(claim => 
      claim.id === claimId 
        ? { ...claim, editableComment: commentText }
        : claim
    ));
    setEditingComment(null);
    setCommentText('');
  };

  const startEditingTreatment = (claimId: string, treatmentId: string, currentQuantity: number, currentPrice: number) => {
    setEditingTreatment({claimId, treatmentId});
    setEditValues({quantity: currentQuantity, unitPrice: currentPrice});
  };

  const saveEditTreatment = () => {
    if (!editingTreatment) return;
    
    setClaims(prev => prev.map(claim => {
      if (claim.id === editingTreatment.claimId) {
        return {
          ...claim,
          treatments: claim.treatments.map((treatment: Treatment) => {
            if (treatment.id === editingTreatment.treatmentId) {
              return {
                ...treatment,
                approvedQuantity: editValues.quantity,
                approvedUnitPrice: editValues.unitPrice,
                approvedTotal: editValues.quantity * editValues.unitPrice
              };
            }
            return treatment;
          })
        };
      }
      return claim;
    }));
    
    setEditingTreatment(null);
  };

  const cancelEditTreatment = () => {
    setEditingTreatment(null);
  };

  const startEditingTreatmentComment = (claimId: string, treatmentId: string, currentComment: string) => {
    setEditingTreatmentComment({claimId, treatmentId});
    setTreatmentCommentText(currentComment);
  };

  const saveTreatmentComment = () => {
    if (!editingTreatmentComment) return;
    
    setClaims(prev => prev.map(claim => {
      if (claim.id === editingTreatmentComment.claimId) {
        return {
          ...claim,
          treatments: claim.treatments.map((treatment: Treatment) => {
            if (treatment.id === editingTreatmentComment.treatmentId) {
              return {
                ...treatment,
                comment: treatmentCommentText
              };
            }
            return treatment;
          })
        };
      }
      return claim;
    }));
    
    setEditingTreatmentComment(null);
    setTreatmentCommentText('');
  };

  const cancelEditTreatmentComment = () => {
    setEditingTreatmentComment(null);
    setTreatmentCommentText('');
  };

  const providers = [
    { id: 'all', name: 'All Providers' },
    { id: 'PRV-001', name: 'Lagos University Teaching Hospital (LUTH)' },
    { id: 'PRV-002', name: 'National Hospital Abuja' },
    { id: 'PRV-003', name: 'Reddington Hospital Victoria Island' },
    { id: 'PRV-004', name: 'Eye Care Specialists Lagos' }
  ];

  const workflowStages = [
    { id: 'all', name: 'All Stages' },
    { id: 'ready_for_initial_vetting', name: 'Ready for Emmanuel' },
    { id: 'under_initial_vetting', name: 'With Emmanuel' },
    { id: 'pending_doctor_review', name: 'Pending Dr. Owolabi' },
    { id: 'under_doctor_review', name: 'With Dr. Owolabi' },
    { id: 'approved', name: 'Approved' },
    { id: 'rejected', name: 'Rejected' }
  ];

  return (
    <div className="space-y-6">
      <OfflineBanner />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submitted Claims</h1>
          <p className="text-gray-600 mt-1">Review and vet provider claims with LLM assistance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            >
              <option value="2025-01">January 2025</option>
              <option value="2024-12">December 2024</option>
              <option value="2024-11">November 2024</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            >
              {providers.map(provider => (
                <option key={provider.id} value={provider.id}>{provider.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Workflow Stage</label>
            <select
              value={workflowFilter}
              onChange={(e) => setWorkflowFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            >
              {workflowStages.map(stage => (
                <option key={stage.id} value={stage.id}>{stage.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-center p-3 bg-sky-50 rounded-lg w-full">
              <p className="text-2xl font-bold text-sky-600">{filteredClaims.length}</p>
              <p className="text-sm text-gray-600">Claims Found</p>
            </div>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claim Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollee & Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workflow Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{claim.id}</div>
                      <div className="text-sm text-gray-500">{claim.paCode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{claim.providerName}</div>
                      <div className="text-sm text-gray-500">{claim.providerId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{claim.enrolleeName}</div>
                      <div className="text-sm text-gray-500">{claim.enrolleeCompany}</div>
                      <div className="text-xs text-blue-600">{claim.enrolleePlan} Plan</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">Sub: {claim.submissionDate}</div>
                      <div className="text-sm text-gray-500">Enc: {claim.encounterDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">₦{claim.submittedAmount.toLocaleString()}</div>
                      {claim.vettedAmount !== claim.submittedAmount && (
                        <div className="text-sm text-green-600">Vetted: ₦{claim.vettedAmount.toLocaleString()}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        claim.aiScore >= 90 ? 'text-green-600' : 
                        claim.aiScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {claim.aiScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getWorkflowStageColor(claim.workflowStage)}`}>
                      {getWorkflowStageText(claim.workflowStage)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedClaim(claim)}
                        className="text-sky-600 hover:text-sky-900 flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      
                      {claim.workflowStage === 'ready_for_initial_vetting' && (
                        <button
                          onClick={() => handleStartVetting(claim.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 flex items-center space-x-1"
                        >
                          <Lock className="w-3 h-3" />
                          <span>Start Vetting</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClaims.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Claims Found</h3>
            <p className="text-gray-600">No claims match the selected filters</p>
          </div>
        )}
      </div>

      {/* Detailed View Modal - EXACT MATCH TO YOUR SCREENSHOTS */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Claim Details - {selectedClaim.id}</h2>
                <p className="text-gray-600">{selectedClaim.enrolleeName} ({selectedClaim.enrolleeGender}, {selectedClaim.enrolleeAge}y) - {selectedClaim.enrolleeCompany} ({selectedClaim.enrolleePlan} Plan)</p>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* LLM Analysis */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-600">AI</span>
                    </div>
                    <span className="text-sm font-medium text-purple-800">LLM Analysis & Recommendation</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLLMRecommendationColor(selectedClaim.llmRecommendation)}`}>
                    {selectedClaim.llmRecommendation.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-purple-700 mb-3">{selectedClaim.llmComment}</p>
                <p className="text-xs text-purple-600">Reasoning: {selectedClaim.llmReasoning}</p>
              </div>

              {/* Benefit Flags */}
              {selectedClaim.benefitFlags.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Benefit Limit Violations</span>
                  </div>
                  <ul className="text-sm text-red-700 space-y-1">
                    {selectedClaim.benefitFlags.map((flag, index) => (
                      <li key={index}>• {flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Treatment Breakdown - EXACT MATCH TO YOUR SCREENSHOTS */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Treatment Items - Inline Editing</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-8 gap-4 p-3 bg-gray-100 text-xs font-medium text-gray-700 uppercase">
                    <div>ITEM</div>
                    <div className="text-center">QTY</div>
                    <div className="text-right">BILL SUBMITTED</div>
                    <div className="text-center">QTY</div>
                    <div className="text-right">BILL APPROVED</div>
                    <div>COMMENT</div>
                    <div className="text-center">STATUS</div>
                    <div className="text-center">ACTIONS</div>
                  </div>
                  {selectedClaim.treatments.map((treatment) => (
                    <div key={treatment.id} className="grid grid-cols-8 gap-4 p-3 border-b border-gray-200 last:border-b-0 text-sm items-center">
                      <div>
                        <div className="font-medium text-gray-900">{treatment.service}</div>
                        <div className="text-xs text-gray-500">Unit Price: ₦{treatment.unitPrice.toLocaleString()}</div>
                        {treatment.benefitLimit && (
                          <div className="text-xs text-blue-600">
                            {treatment.benefitType} - Limit: ₦{treatment.benefitLimit.toLocaleString()}
                          </div>
                        )}
                        {treatment.exceedsLimit && (
                          <div className="text-xs text-red-600 font-medium">
                            ⚠️ EXCEEDS LIMIT
                          </div>
                        )}
                        {treatment.isNewItem && (
                          <div className="text-xs text-orange-600 font-medium">
                            🆕 NOT IN ORIGINAL PA
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center text-gray-900">{treatment.submittedQuantity}</div>
                      <div className="text-right text-gray-900">₦{treatment.submittedTotal.toLocaleString()}</div>
                      
                      <div className="text-center">
                        {editingTreatment?.claimId === selectedClaim.id && editingTreatment?.treatmentId === treatment.id ? (
                          <input
                            type="number"
                            min="0"
                            value={editValues.quantity}
                            onChange={(e) => setEditValues({...editValues, quantity: parseInt(e.target.value) || 0})}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 text-center"
                          />
                        ) : (
                          <span className="text-gray-900">{treatment.approvedQuantity}</span>
                        )}
                      </div>
                      
                      <div className="text-right">
                        {editingTreatment?.claimId === selectedClaim.id && editingTreatment?.treatmentId === treatment.id ? (
                          <div>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editValues.unitPrice}
                              onChange={(e) => setEditValues({...editValues, unitPrice: parseFloat(e.target.value) || 0})}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 mb-1"
                            />
                            <div className="text-xs font-medium">₦{(editValues.quantity * editValues.unitPrice).toLocaleString()}</div>
                          </div>
                        ) : (
                          <span className="font-medium text-gray-900">₦{treatment.approvedTotal.toLocaleString()}</span>
                        )}
                      </div>
                      
                      <div>
                        {editingTreatmentComment?.claimId === selectedClaim.id && editingTreatmentComment?.treatmentId === treatment.id ? (
                          <div className="space-y-2">
                            <select
                              value={treatmentCommentText}
                              onChange={(e) => setTreatmentCommentText(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-sky-500"
                            >
                              {commentOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                            <div className="flex space-x-1">
                              <button
                                onClick={saveTreatmentComment}
                                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditTreatmentComment}
                                className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">{treatment.comment}</span>
                            <button
                              onClick={() => startEditingTreatmentComment(selectedClaim.id, treatment.id, treatment.comment)}
                              className="p-1 text-sky-600 hover:text-sky-800 transition-colors"
                              title="Edit comment"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className={`text-xs font-medium ${getStatusColor(treatment.status)}`}>
                          {treatment.status}
                        </span>
                      </div>
                      
                      <div className="text-center">
                        {editingTreatment?.claimId === selectedClaim.id && editingTreatment?.treatmentId === treatment.id ? (
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={saveEditTreatment}
                              className="p-1 text-green-600 hover:text-green-800 transition-colors"
                              title="Save changes"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditTreatment}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                              title="Cancel edit"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditingTreatment(selectedClaim.id, treatment.id, treatment.approvedQuantity, treatment.approvedUnitPrice)}
                            className="p-1 text-sky-600 hover:text-sky-800 transition-colors"
                            title="Edit quantity/price"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="grid grid-cols-8 gap-4 p-3 bg-sky-50 border-t-2 border-sky-200">
                    <div className="col-span-2 text-sm font-medium text-gray-900">TOTAL</div>
                    <div className="text-right text-sm font-bold text-gray-900">₦{selectedClaim.submittedAmount.toLocaleString()}</div>
                    <div></div>
                    <div className="text-right text-sm font-bold text-sky-700">
                      ₦{selectedClaim.treatments.reduce((sum, item) => sum + item.approvedTotal, 0).toLocaleString()}
                    </div>
                    <div className="col-span-3"></div>
                  </div>
                </div>
              </div>

              {/* Editable Comment */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">Staff Comments</span>
                  {editingComment !== selectedClaim.id && (
                    <button
                      onClick={() => handleEditComment(selectedClaim.id, selectedClaim.editableComment)}
                      className="text-sky-600 hover:text-sky-800 flex items-center space-x-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span className="text-xs">Edit</span>
                    </button>
                  )}
                </div>
                
                {editingComment === selectedClaim.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 h-20 resize-none"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveComment(selectedClaim.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 flex items-center space-x-1"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setEditingComment(null)}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 flex items-center space-x-1"
                      >
                        <X className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">{selectedClaim.editableComment}</p>
                )}
              </div>

              {/* Doctor Comment */}
              {selectedClaim.doctorComment && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Dr. Owolabi's Comment</span>
                  </div>
                  <p className="text-sm text-blue-700">{selectedClaim.doctorComment}</p>
                </div>
              )}

              {/* Audit Trail */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Audit Trail</h3>
                <div className="space-y-3">
                  {selectedClaim.auditLog.map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{log.action}</span>
                          <span className="text-gray-500">by {log.user}</span>
                          <span className="text-xs text-gray-400">{log.timestamp}</span>
                        </div>
                        {log.notes && (
                          <p className="text-gray-600 mt-1 text-sm">{log.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmittedClaims;