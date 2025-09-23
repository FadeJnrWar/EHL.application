import React, { useState } from 'react';
import { FileText, Clock, User, Building2, CheckCircle, XCircle, Lock, Download, Eye, AlertTriangle, MessageSquare, History, DollarSign, Calendar, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface ClaimsQueueProps {
  filters: any;
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  notes?: string;
}

interface Treatment {
  id: string;
  service: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Claim {
  id: string;
  paCode: string;
  enrolleeId: string;
  enrolleeName: string;
  enrolleeCompany: string;
  providerId: string;
  providerName: string;
  providerAccount: string;
  diagnosis: string;
  icd10Code: string;
  claimAmount: number;
  submittedAmount: number;
  vettedAmount: number;
  submissionDate: string;
  status: string;
  adjudicator: string | null;
  lockedBy: string | null;
  lockTime: string | null;
  aiScore: number;
  aiFlags: string[];
  llmReview: {
    recommendation: string;
    confidence: number;
    reasoning: string;
    suggestedAmount: number;
  };
  treatments: Treatment[];
  documents: string[];
  auditLog: AuditLog[];
  batchId?: string;
  paymentStatus?: string;
}

const ClaimsQueue: React.FC<ClaimsQueueProps> = ({ filters }) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [claims, setClaims] = useState<Claim[]>([
    // APPROVED CLAIMS - Processed by Emmanuel and Dr. Owolabi
    {
      id: 'CLM-001',
      paCode: 'PA-1736789456789-123',
      enrolleeId: 'ENR-12345',
      enrolleeName: 'Adebayo Olumide',
      enrolleeCompany: 'Dangote Group',
      providerId: 'PRV-001',
      providerName: 'Lagos University Teaching Hospital (LUTH)',
      providerAccount: '0123456789',
      diagnosis: 'Plasmodium falciparum malaria, unspecified',
      icd10Code: 'B50.9',
      claimAmount: 45000,
      submittedAmount: 45000,
      vettedAmount: 42000,
      submissionDate: '2025-01-10 09:30',
      status: 'approved',
      adjudicator: 'Dr. Owolabi Adebayo',
      lockedBy: null,
      lockTime: null,
      aiScore: 85,
      aiFlags: ['High cost for diagnosis adjusted'],
      batchId: 'BATCH-SEP-2025-001',
      paymentStatus: 'pending',
      llmReview: {
        recommendation: 'APPROVE_WITH_ADJUSTMENT',
        confidence: 85,
        reasoning: 'Treatment plan appropriate for malaria. Recommended reducing IV fluids from 3 to 2 units to optimize cost.',
        suggestedAmount: 42000
      },
      treatments: [
        { id: '1', service: 'Consultation', quantity: 1, unitPrice: 15000, total: 15000 },
        { id: '2', service: 'Malaria Test (RDT)', quantity: 1, unitPrice: 5000, total: 5000 },
        { id: '3', service: 'Artemether Injection', quantity: 3, unitPrice: 4000, total: 12000 },
        { id: '4', service: 'IV Fluids', quantity: 2, unitPrice: 5000, total: 10000 }
      ],
      documents: ['medical_report.pdf', 'lab_results.pdf'],
      auditLog: [
        {
          id: '1',
          action: 'Claim Submitted',
          user: 'System',
          timestamp: '2025-01-10 09:30',
          notes: 'Auto-submitted by provider portal'
        },
        {
          id: '2',
          action: 'AI Pre-screening Completed',
          user: 'AI System',
          timestamp: '2025-01-10 09:31',
          notes: 'Score: 85%, Flagged for manual review due to high cost'
        },
        {
          id: '3',
          action: 'Manual Review Started',
          user: 'Emmanuel Onifade',
          timestamp: '2025-01-10 14:30',
          notes: 'Locked for initial review'
        },
        {
          id: '4',
          action: 'Forwarded to Medical Director',
          user: 'Emmanuel Onifade',
          timestamp: '2025-01-10 15:45',
          notes: 'Recommended approval with cost adjustment. Reduced IV fluids quantity.'
        },
        {
          id: '5',
          action: 'Medical Review Completed',
          user: 'Dr. Owolabi Adebayo',
          timestamp: '2025-01-11 08:15',
          notes: 'Approved with adjustment. Final amount: ₦42,000'
        }
      ]
    },

    {
      id: 'CLM-002',
      paCode: 'PA-1736789356789-456',
      enrolleeId: 'ENR-67890',
      enrolleeName: 'Fatima Abubakar',
      enrolleeCompany: 'Nigerian National Petroleum Corporation (NNPC)',
      providerId: 'PRV-002',
      providerName: 'National Hospital Abuja',
      providerAccount: '0987654321',
      diagnosis: 'Type 2 diabetes mellitus without complications',
      icd10Code: 'E11.9',
      claimAmount: 28500,
      submittedAmount: 28500,
      vettedAmount: 28500,
      submissionDate: '2025-01-11 11:15',
      status: 'approved',
      adjudicator: 'Dr. Owolabi Adebayo',
      lockedBy: null,
      lockTime: null,
      aiScore: 92,
      aiFlags: [],
      batchId: 'BATCH-SEP-2025-001',
      paymentStatus: 'pending',
      llmReview: {
        recommendation: 'APPROVE',
        confidence: 92,
        reasoning: 'Standard diabetes management protocol followed. All treatments within normal range.',
        suggestedAmount: 28500
      },
      treatments: [
        { id: '1', service: 'Consultation', quantity: 1, unitPrice: 10000, total: 10000 },
        { id: '2', service: 'HbA1c Test', quantity: 1, unitPrice: 8500, total: 8500 },
        { id: '3', service: 'Medication', quantity: 1, unitPrice: 10000, total: 10000 }
      ],
      documents: ['consultation_notes.pdf'],
      auditLog: [
        {
          id: '1',
          action: 'Claim Submitted',
          user: 'System',
          timestamp: '2025-01-11 11:15'
        },
        {
          id: '2',
          action: 'AI Pre-screening Completed',
          user: 'AI System',
          timestamp: '2025-01-11 11:16',
          notes: 'Score: 92%, Recommended for approval'
        },
        {
          id: '3',
          action: 'Fast-track Approval',
          user: 'Emmanuel Onifade',
          timestamp: '2025-01-11 14:30',
          notes: 'Standard case - approved without medical review'
        },
        {
          id: '4',
          action: 'Final Approval',
          user: 'Dr. Owolabi Adebayo',
          timestamp: '2025-01-11 16:00',
          notes: 'Confirmed approval - routine diabetes management'
        }
      ]
    },

    // REJECTED CLAIM - Example of rejection workflow
    {
      id: 'CLM-003',
      paCode: 'PA-1736789256789-789',
      enrolleeId: 'ENR-11111',
      enrolleeName: 'Chinedu Okafor',
      enrolleeCompany: 'Access Bank Plc',
      providerId: 'PRV-003',
      providerName: 'Reddington Hospital Victoria Island',
      providerAccount: '1122334455',
      diagnosis: 'Essential hypertension',
      icd10Code: 'I10',
      claimAmount: 85000,
      submittedAmount: 85000,
      vettedAmount: 0,
      submissionDate: '2025-01-09 16:45',
      status: 'rejected',
      adjudicator: 'Dr. Owolabi Adebayo',
      lockedBy: null,
      lockTime: null,
      aiScore: 45,
      aiFlags: ['Excessive cost for diagnosis', 'Unusual treatment combination', 'Provider history flagged'],
      batchId: null,
      paymentStatus: 'rejected',
      llmReview: {
        recommendation: 'REJECT',
        confidence: 78,
        reasoning: 'Cost significantly exceeds standard hypertension management. Unnecessary procedures included.',
        suggestedAmount: 0
      },
      treatments: [
        { id: '1', service: 'Consultation', quantity: 1, unitPrice: 15000, total: 15000 },
        { id: '2', service: 'ECG', quantity: 3, unitPrice: 10000, total: 30000 },
        { id: '3', service: 'CT Scan', quantity: 1, unitPrice: 40000, total: 40000 }
      ],
      documents: ['consultation_notes.pdf'],
      auditLog: [
        {
          id: '1',
          action: 'Claim Submitted',
          user: 'System',
          timestamp: '2025-01-09 16:45'
        },
        {
          id: '2',
          action: 'AI Pre-screening Failed',
          user: 'AI System',
          timestamp: '2025-01-09 16:46',
          notes: 'Score: 45%, Multiple red flags detected'
        },
        {
          id: '3',
          action: 'Manual Review Started',
          user: 'Emmanuel Onifade',
          timestamp: '2025-01-10 08:00',
          notes: 'High-risk claim - detailed review required'
        },
        {
          id: '4',
          action: 'Forwarded to Medical Director',
          user: 'Emmanuel Onifade',
          timestamp: '2025-01-10 10:30',
          notes: 'Recommending rejection - excessive procedures for hypertension'
        },
        {
          id: '5',
          action: 'Claim Rejected',
          user: 'Dr. Owolabi Adebayo',
          timestamp: '2025-01-10 14:15',
          notes: 'Rejected: CT scan not medically necessary for routine hypertension. Multiple ECGs unjustified.'
        }
      ]
    },

    // PENDING CLAIMS - Currently in workflow
    {
      id: 'CLM-004',
      paCode: 'PA-1736789156789-101',
      enrolleeId: 'ENR-22222',
      enrolleeName: 'Kemi Adebayo',
      enrolleeCompany: 'MTN Nigeria',
      providerId: 'PRV-001',
      providerName: 'Lagos University Teaching Hospital (LUTH)',
      providerAccount: '0123456789',
      diagnosis: 'Acute appendicitis',
      icd10Code: 'K35.9',
      claimAmount: 125000,
      submittedAmount: 125000,
      vettedAmount: 125000,
      submissionDate: '2025-01-13 09:30',
      status: 'medical_review',
      adjudicator: 'Emmanuel Onifade',
      lockedBy: 'Dr. Owolabi Adebayo',
      lockTime: '2025-01-13 14:30',
      aiScore: 88,
      aiFlags: ['High-value claim requires medical review'],
      batchId: null,
      paymentStatus: 'pending',
      llmReview: {
        recommendation: 'APPROVE',
        confidence: 88,
        reasoning: 'Appropriate surgical intervention for acute appendicitis. Costs within expected range.',
        suggestedAmount: 125000
      },
      treatments: [
        { id: '1', service: 'Emergency Consultation', quantity: 1, unitPrice: 20000, total: 20000 },
        { id: '2', service: 'Appendectomy', quantity: 1, unitPrice: 80000, total: 80000 },
        { id: '3', service: 'Anesthesia', quantity: 1, unitPrice: 15000, total: 15000 },
        { id: '4', service: 'Post-op Care', quantity: 1, unitPrice: 10000, total: 10000 }
      ],
      documents: ['surgical_report.pdf', 'anesthesia_record.pdf'],
      auditLog: [
        {
          id: '1',
          action: 'Claim Submitted',
          user: 'System',
          timestamp: '2025-01-13 09:30'
        },
        {
          id: '2',
          action: 'AI Pre-screening Completed',
          user: 'AI System',
          timestamp: '2025-01-13 09:31',
          notes: 'Score: 88%, High-value claim flagged for medical review'
        },
        {
          id: '3',
          action: 'Initial Review Completed',
          user: 'Emmanuel Onifade',
          timestamp: '2025-01-13 12:00',
          notes: 'Surgical case verified. Forwarding to medical director for final approval.'
        },
        {
          id: '4',
          action: 'Medical Review Started',
          user: 'Dr. Owolabi Adebayo',
          timestamp: '2025-01-13 14:30',
          notes: 'Under medical director review - surgical case'
        }
      ]
    },

    {
      id: 'CLM-005',
      paCode: 'PA-1736789056789-202',
      enrolleeId: 'ENR-33333',
      enrolleeName: 'Ibrahim Musa',
      enrolleeCompany: 'First Bank of Nigeria',
      providerId: 'PRV-002',
      providerName: 'National Hospital Abuja',
      providerAccount: '0987654321',
      diagnosis: 'Pneumonia, unspecified organism',
      icd10Code: 'J18.9',
      claimAmount: 35000,
      submittedAmount: 35000,
      vettedAmount: 35000,
      submissionDate: '2025-01-13 15:20',
      status: 'under_review',
      adjudicator: null,
      lockedBy: 'Emmanuel Onifade',
      lockTime: '2025-01-13 16:00',
      aiScore: 91,
      aiFlags: [],
      batchId: null,
      paymentStatus: 'pending',
      llmReview: {
        recommendation: 'APPROVE',
        confidence: 91,
        reasoning: 'Standard pneumonia treatment protocol. Appropriate medications and monitoring.',
        suggestedAmount: 35000
      },
      treatments: [
        { id: '1', service: 'Consultation', quantity: 1, unitPrice: 12000, total: 12000 },
        { id: '2', service: 'Chest X-Ray', quantity: 1, unitPrice: 8000, total: 8000 },
        { id: '3', service: 'Antibiotics', quantity: 1, unitPrice: 15000, total: 15000 }
      ],
      documents: ['xray_report.pdf', 'prescription.pdf'],
      auditLog: [
        {
          id: '1',
          action: 'Claim Submitted',
          user: 'System',
          timestamp: '2025-01-13 15:20'
        },
        {
          id: '2',
          action: 'AI Pre-screening Completed',
          user: 'AI System',
          timestamp: '2025-01-13 15:21',
          notes: 'Score: 91%, Recommended for approval'
        },
        {
          id: '3',
          action: 'Manual Review Started',
          user: 'Emmanuel Onifade',
          timestamp: '2025-01-13 16:00',
          notes: 'Standard pneumonia case - reviewing for final approval'
        }
      ]
    }
  ]);

  const [showAuditLog, setShowAuditLog] = useState<string | null>(null);
  const [showBatchSummary, setShowBatchSummary] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'medical_review': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'auto_rejected': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLLMRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'APPROVE': return 'bg-green-100 text-green-800';
      case 'APPROVE_WITH_ADJUSTMENT': return 'bg-yellow-100 text-yellow-800';
      case 'REJECT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canUserReview = (claim: Claim) => {
    if (!user) return false;
    
    if (user.permissions?.includes('all')) return true;
    
    if (user.role === 'Claims Adjudicator' && claim.status === 'pending_review') return true;
    if (user.role === 'Medical Director' && (claim.status === 'medical_review' || claim.status === 'under_review')) return true;
    
    return false;
  };

  const handleLockClaim = (claimId: string) => {
    setClaims(prev => prev.map(claim => 
      claim.id === claimId 
        ? { 
            ...claim, 
            lockedBy: user?.name || 'Current User',
            lockTime: new Date().toISOString(),
            status: user?.role === 'Medical Director' ? 'medical_review' : 'under_review',
            auditLog: [
              ...claim.auditLog,
              {
                id: Date.now().toString(),
                action: `Review Started by ${user?.role}`,
                user: user?.name || 'Current User',
                timestamp: new Date().toISOString(),
                notes: `Claim locked for ${user?.role === 'Medical Director' ? 'medical' : 'manual'} review`
              }
            ]
          }
        : claim
    ));
  };

  const handleApproveClaim = (claimId: string) => {
    const notes = prompt('Add approval notes (required for audit):') || 'Approved after review';
    setClaims(prev => prev.map(claim => 
      claim.id === claimId 
        ? { 
            ...claim, 
            status: 'approved',
            adjudicator: user?.name || 'Current User',
            lockedBy: null,
            lockTime: null,
            batchId: 'BATCH-SEP-2025-001',
            paymentStatus: 'pending',
            auditLog: [
              ...claim.auditLog,
              {
                id: Date.now().toString(),
                action: 'Claim Approved',
                user: user?.name || 'Current User',
                timestamp: new Date().toISOString(),
                notes: notes || 'Claim approved'
              }
            ]
          }
        : claim
    ));
    
    // Send notification to stakeholders
    addNotification({
      type: 'success',
      title: 'Claim Approved',
      message: `Claim ${claimId} has been approved and added to payment batch.`
    });
  };

  const handleRejectClaim = (claimId: string) => {
    const reason = prompt('Enter detailed rejection reason (required):');
    if (reason) {
      setClaims(prev => prev.map(claim => 
        claim.id === claimId 
          ? { 
              ...claim, 
              status: 'rejected',
              adjudicator: user?.name || 'Current User',
              lockedBy: null,
              lockTime: null,
              vettedAmount: 0,
              paymentStatus: 'rejected',
              auditLog: [
                ...claim.auditLog,
                {
                  id: Date.now().toString(),
                  action: 'Claim Rejected',
                  user: user?.name || 'Current User',
                  timestamp: new Date().toISOString(),
                  notes: `Rejection reason: ${reason}`
                }
              ]
            }
          : claim
      ));
      
      addNotification({
        type: 'warning',
        title: 'Claim Rejected',
        message: `Claim ${claimId} has been rejected. Provider will be notified.`
      });
    }
  };

  const handleForwardToMedical = (claimId: string) => {
    const notes = prompt('Add notes for medical director (required):') || 'Forwarded for medical review';
    setClaims(prev => prev.map(claim => 
      claim.id === claimId 
        ? { 
            ...claim, 
            status: 'medical_review',
            lockedBy: null,
            lockTime: null,
            auditLog: [
              ...claim.auditLog,
              {
                id: Date.now().toString(),
                action: 'Forwarded to Medical Director',
                user: user?.name || 'Current User',
                timestamp: new Date().toISOString(),
                notes: notes || 'Forwarded for medical review'
              }
            ]
          }
        : claim
    ));
    
    addNotification({
      type: 'info',
      title: 'Claim Forwarded',
      message: `Claim ${claimId} forwarded to Medical Director for review.`
    });
  };

  const handleAdjustAmount = (claimId: string) => {
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return;
    
    const newAmount = prompt(`Current amount: ₦${claim.claimAmount.toLocaleString()}\nEnter new vetted amount:`, claim.claimAmount.toString());
    const reason = prompt('Enter reason for adjustment:');
    
    if (newAmount && reason && !isNaN(Number(newAmount))) {
      setClaims(prev => prev.map(c => 
        c.id === claimId 
          ? { 
              ...c, 
              vettedAmount: Number(newAmount),
              auditLog: [
                ...c.auditLog,
                {
                  id: Date.now().toString(),
                  action: 'Amount Adjusted',
                  user: user?.name || 'Current User',
                  timestamp: new Date().toISOString(),
                  notes: `Amount adjusted from ₦${c.claimAmount.toLocaleString()} to ₦${Number(newAmount).toLocaleString()}. Reason: ${reason}`
                }
              ]
            }
          : c
      ));
      
      addNotification({
        type: 'info',
        title: 'Claim Amount Adjusted',
        message: `Claim ${claimId} amount adjusted to ₦${Number(newAmount).toLocaleString()}`
      });
    }
  };

  const generateBatchSummary = () => {
    const approvedClaims = claims.filter(claim => claim.status === 'approved' && claim.batchId === 'BATCH-SEP-2025-001');
    const providerSummary = approvedClaims.reduce((acc, claim) => {
      if (!acc[claim.providerId]) {
        acc[claim.providerId] = {
          name: claim.providerName,
          account: claim.providerAccount,
          encounters: 0,
          submittedAmount: 0,
          vettedAmount: 0,
          claims: []
        };
      }
      acc[claim.providerId].encounters += 1;
      acc[claim.providerId].submittedAmount += claim.submittedAmount;
      acc[claim.providerId].vettedAmount += claim.vettedAmount;
      acc[claim.providerId].claims.push(claim);
      return acc;
    }, {} as any);

    return Object.values(providerSummary);
  };

  const handleExportBatch = () => {
    const summary = generateBatchSummary();
    console.log('Exporting batch summary:', summary);
    alert('Batch summary exported to CSV! (In real app, this would download a file)');
  };

  const filteredClaims = claims.filter(claim => {
    if (filters.status !== 'all' && claim.status !== filters.status) return false;
    if (filters.adjudicator !== 'all' && claim.adjudicator !== filters.adjudicator) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Batch Summary Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">September 2025 Batch Summary</h3>
              <p className="text-sm text-gray-600">Ready for payment processing</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowBatchSummary(!showBatchSummary)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showBatchSummary ? 'Hide' : 'Show'} Summary
            </button>
            <button
              onClick={handleExportBatch}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {showBatchSummary && (
          <div className="bg-white rounded-lg p-4 border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">₦70,500</p>
                <p className="text-sm text-gray-600">Total Vetted Amount</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">₦73,500</p>
                <p className="text-sm text-gray-600">Total Submitted</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">2</p>
                <p className="text-sm text-gray-600">Approved Claims</p>
              </div>
            </div>

            <div className="space-y-3">
              {generateBatchSummary().map((provider: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{provider.name}</p>
                    <p className="text-sm text-gray-600">Account: {provider.account}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₦{provider.vettedAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{provider.encounters} encounters</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {filteredClaims.map((claim) => (
          <div key={claim.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{claim.enrolleeName}</h3>
                  <p className="text-gray-600">Claim: {claim.id} | PA: {claim.paCode}</p>
                  <p className="text-sm text-gray-500">Enrollee: {claim.enrolleeId} | {claim.enrolleeGender}, {claim.enrolleeAge}y</p>
                  <p className="text-sm text-gray-500">Company: {claim.enrolleeCompany}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">AI Score:</span>
                    <span className={`font-bold ${getAIScoreColor(claim.aiScore)}`}>
                      {claim.aiScore}%
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">₦{claim.claimAmount.toLocaleString()}</p>
                  {claim.vettedAmount !== claim.submittedAmount && (
                    <p className="text-sm text-green-600">Vetted: ₦{claim.vettedAmount.toLocaleString()}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(claim.status)}`}>
                  {claim.status.replace('_', ' ').toUpperCase()}
                </span>
                {claim.lockedBy && (
                  <div className="flex items-center space-x-1 text-orange-600">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs">Locked</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Provider</p>
                <p className="font-medium text-gray-900">{claim.providerName}</p>
                <p className="text-xs text-gray-500">{claim.providerId} | Acc: {claim.providerAccount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Enrollee Company</p>
                <p className="font-medium text-gray-900">{claim.enrolleeCompany}</p>
                <p className="text-xs text-gray-500">Corporate Client</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Diagnosis</p>
                <p className="font-medium text-gray-900">{claim.icd10Code}</p>
                <p className="text-xs text-gray-500">{claim.diagnosis}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Submitted Date</p>
                <p className="font-medium text-gray-900">{claim.submissionDate}</p>
                {claim.adjudicator && (
                  <p className="text-xs text-gray-500">Adjudicator: {claim.adjudicator}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Financial Summary</p>
                <p className="font-medium text-gray-900">Submitted: ₦{claim.submittedAmount.toLocaleString()}</p>
                {claim.vettedAmount !== claim.submittedAmount && (
                  <p className="text-sm text-green-600">Vetted: ₦{claim.vettedAmount.toLocaleString()}</p>
                )}
              </div>
            </div>

            {/* LLM Review Section */}
            {claim.llmReview && (
              <div className="mb-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-600">AI</span>
                    </div>
                    <span className="text-sm font-medium text-purple-800">LLM Analysis</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLLMRecommendationColor(claim.llmReview.recommendation)}`}>
                    {claim.llmReview.recommendation.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-purple-700 mb-2">{claim.llmReview.reasoning}</p>
                <div className="flex items-center justify-between text-xs text-purple-600">
                  <span>Confidence: {claim.llmReview.confidence}%</span>
                  {claim.llmReview.suggestedAmount !== claim.claimAmount && (
                    <span>Suggested: ₦{claim.llmReview.suggestedAmount.toLocaleString()}</span>
                  )}
                </div>
              </div>
            )}

            {/* AI Flags */}
            {claim.aiFlags.length > 0 && (
              <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">AI Flags</span>
                </div>
                <ul className="text-sm text-orange-700 space-y-1">
                  {claim.aiFlags.map((flag, index) => (
                    <li key={index}>• {flag}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Treatment Breakdown */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Treatment Breakdown</h4>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-3 bg-gray-100 text-xs font-medium text-gray-700 uppercase">
                  <div>Service</div>
                  <div className="text-center">Qty</div>
                  <div className="text-right">Unit Price</div>
                  <div className="text-right">Total</div>
                </div>
                {claim.treatments.map((treatment, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-3 border-b border-gray-200 last:border-b-0 text-sm">
                    <div className="text-gray-900">{treatment.service}</div>
                    <div className="text-center text-gray-900">{treatment.quantity}</div>
                    <div className="text-right text-gray-900">₦{treatment.unitPrice.toLocaleString()}</div>
                    <div className="text-right font-medium text-gray-900">₦{treatment.total.toLocaleString()}</div>
                  </div>
                ))}
                <div className="grid grid-cols-4 gap-4 p-3 bg-sky-50 border-t-2 border-sky-200">
                  <div className="col-span-3 text-sm font-medium text-gray-900">Total Claim Amount</div>
                  <div className="text-right text-sm font-bold text-sky-700">₦{claim.claimAmount.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Audit Log */}
            <div className="mb-4">
              <button
                onClick={() => setShowAuditLog(showAuditLog === claim.id ? null : claim.id)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <History className="w-4 h-4" />
                <span>View Audit Trail ({claim.auditLog.length} entries)</span>
              </button>
              
              {showAuditLog === claim.id && (
                <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-2">
                  {claim.auditLog.map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{log.action}</span>
                          <span className="text-gray-500">by {log.user}</span>
                          <span className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        {log.notes && (
                          <p className="text-gray-600 mt-1">{log.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Documents */}
            {claim.documents.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Attached Documents</h4>
                <div className="flex flex-wrap gap-2">
                  {claim.documents.map((doc, index) => (
                    <span key={index} className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      <FileText className="w-3 h-3" />
                      <span>{doc}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
              {/* Show vetting instructions for users */}
              {canUserReview(claim) && !claim.lockedBy && claim.status === 'pending_review' && (
                <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Ready for Vetting</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Click "Take Review" to lock this claim and start the vetting process.
                  </p>
                </div>
              )}

              {/* Vetting Actions */}
              {canUserReview(claim) && claim.lockedBy === user?.name && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 w-full">
                  <h4 className="text-sm font-medium text-blue-900 mb-3">🔍 Vetting Actions</h4>
                  <p className="text-xs text-blue-700 mb-3">
                    Use these tools to review and process the claim. All actions will be logged in the audit trail.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleAdjustAmount(claim.id)}
                      className="flex items-center space-x-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Adjust Amount</span>
                    </button>
                    
                    {user?.role === 'Claims Adjudicator' && (
                      <button
                        onClick={() => handleForwardToMedical(claim.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Forward to Medical</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleApproveClaim(claim.id)}
                      className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve Claim</span>
                    </button>
                    
                    <button
                      onClick={() => handleRejectClaim(claim.id)}
                      className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Claim</span>
                    </button>
                  </div>
                </div>
              )}
              
              <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button className="flex items-center space-x-1 px-3 py-2 text-sky-600 hover:text-sky-800 transition-colors">
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>

              {canUserReview(claim) && claim.status === 'pending_review' && !claim.lockedBy && (
                <button
                  onClick={() => handleLockClaim(claim.id)}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                >
                  <Lock className="w-4 h-4" />
                  <span>🔍 Start Vetting</span>
                </button>
              )}
            </div>

            {claim.lockedBy && claim.lockedBy !== user?.name && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-800">
                    This claim is currently being reviewed by {claim.lockedBy} since {new Date(claim.lockTime || '').toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredClaims.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Claims Found</h3>
            <p className="text-gray-600">No claims match the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimsQueue;