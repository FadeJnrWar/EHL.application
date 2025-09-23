import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Upload, 
  Copy, 
  Search,
  Plus,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Shield,
  Wifi,
  WifiOff,
  UserCheck,
  LayoutDashboard,
  AlertTriangle,
  Edit3,
  Save,
  X,
  ChevronDown,
  Users,
  TrendingUp,
  Activity,
  HeadphonesIcon
} from 'lucide-react';
import { useOffline } from '../contexts/OfflineContext';
import { findEnrolleeById, enrollees } from '../data/enrollees';
import { commonICD10Codes, getDiagnosisFromICD10 } from '../utils/icd10Validator';

interface Enrollee {
  id: string;
  name: string;
  memberNumber: string;
  plan: string;
  employer: string;
  status: 'active' | 'inactive';
  gender: string;
  age: number;
  phone: string;
  email: string;
  dateOfBirth: string;
  effectiveDate: string;
  expirationDate: string;
}

interface TreatmentItem {
  id: string;
  description: string;
  code: string;
  amount: number;
  isNewItem?: boolean;
}

interface DiagnosisItem {
  id: string;
  icd10Code: string;
  description: string;
}

interface PACode {
  id: string;
  code: string;
  enrolleeId: string;
  enrolleeName: string;
  enrolleeGender: string;
  enrolleeAge: number;
  diagnosis: DiagnosisItem[];
  treatments: TreatmentItem[];
  totalAmount: number;
  generatedBy: string;
  generatedDate: string;
  status: 'pending' | 'used' | 'expired';
  claimSubmitted: boolean;
  claimStatus?: 'pending' | 'approved' | 'rejected' | 'paid';
  paidAmount?: number;
  paidDate?: string;
}

interface Claim {
  id: string;
  paCode: string;
  enrolleeId: string;
  enrolleeName: string;
  submittedAmount: number;
  approvedAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  submittedDate: string;
  paidDate?: string;
  paidAmount?: number;
}

const mockEnrollees: Enrollee[] = enrollees.map(e => ({
  id: e.id,
  name: e.name,
  memberNumber: e.id,
  plan: `${e.plan} Plan`,
  employer: e.company,
  status: e.status,
  gender: e.gender,
  age: e.age,
  phone: e.phone,
  email: e.email,
  dateOfBirth: e.dateOfBirth,
  effectiveDate: e.effectiveDate,
  expirationDate: e.expirationDate
}));

const mockPACodes: PACode[] = [
  {
    id: '1',
    code: 'PA-1736789456789-123',
    enrolleeId: 'ENR-12345',
    enrolleeName: 'Adebayo Olumide',
    enrolleeGender: 'Male',
    enrolleeAge: 39,
    diagnosis: [
      { id: '1', icd10Code: 'B50.9', description: 'Plasmodium falciparum malaria, unspecified' }
    ],
    treatments: [
      { id: '1', description: 'Consultation', code: 'CONS001', amount: 15000 },
      { id: '2', description: 'Malaria Test (RDT)', code: 'LAB001', amount: 5000 },
      { id: '3', description: 'Artemether Injection', code: 'MED001', amount: 12000 }
    ],
    totalAmount: 32000,
    generatedBy: 'Winifred Festus (Call Center)',
    generatedDate: '2025-01-15',
    status: 'used',
    claimSubmitted: true,
    claimStatus: 'paid',
    paidAmount: 30000,
    paidDate: '2025-01-20'
  },
  {
    id: '2',
    code: 'PA-1736789356789-456',
    enrolleeId: 'ENR-67890',
    enrolleeName: 'Fatima Abubakar',
    enrolleeGender: 'Female',
    enrolleeAge: 34,
    diagnosis: [
      { id: '1', icd10Code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' }
    ],
    treatments: [
      { id: '1', description: 'Consultation', code: 'CONS001', amount: 10000 },
      { id: '2', description: 'HbA1c Test', code: 'LAB002', amount: 8500 },
      { id: '3', description: 'Medication', code: 'MED002', amount: 10000 }
    ],
    totalAmount: 28500,
    generatedBy: 'Ajayi Seyi (Call Center)',
    generatedDate: '2025-01-14',
    status: 'pending',
    claimSubmitted: false
  }
];

const mockClaims: Claim[] = [
  {
    id: 'CLM-001',
    paCode: 'PA-1736789456789-123',
    enrolleeId: 'ENR-12345',
    enrolleeName: 'Adebayo Olumide',
    submittedAmount: 35000,
    approvedAmount: 30000,
    status: 'paid',
    submittedDate: '2025-01-16',
    paidDate: '2025-01-20',
    paidAmount: 30000
  },
  {
    id: 'CLM-002',
    paCode: 'PA-1736789356789-456',
    enrolleeId: 'ENR-67890',
    enrolleeName: 'Fatima Abubakar',
    submittedAmount: 28500,
    approvedAmount: 0,
    status: 'pending',
    submittedDate: '2025-01-17'
  }
];

export default function ProviderPortal() {
  const { isOnline, saveFormData, getFormData } = useOffline();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dashboard state
  const [dashboardStats, setDashboardStats] = useState({
    totalClaims: 15,
    pendingClaims: 3,
    approvedClaims: 10,
    rejectedClaims: 2,
    totalPaid: 450000,
    thisMonthClaims: 8
  });

  // Eligibility check state
  const [eligibilitySearch, setEligibilitySearch] = useState({
    enrolleeId: '',
    enrolleeName: ''
  });
  const [selectedEnrollee, setSelectedEnrollee] = useState<Enrollee | null>(null);
  const [showEnrolleeDropdown, setShowEnrolleeDropdown] = useState(false);
  const [filteredEnrollees, setFilteredEnrollees] = useState<Enrollee[]>([]);
  const [eligibilityResults, setEligibilityResults] = useState<any>(null);

  // PA Request state
  const [paRequestData, setPaRequestData] = useState({
    enrolleeId: '',
    enrolleeName: '',
    enrolleeGender: '',
    enrolleeAge: '',
    enrolleePhone: '',
    providerName: 'Lagos University Teaching Hospital (LUTH)',
    dateOfService: '',
    comments: ''
  });
  const [diagnoses, setDiagnoses] = useState<DiagnosisItem[]>([
    { id: '1', icd10Code: '', description: '' }
  ]);
  const [treatments, setTreatments] = useState<TreatmentItem[]>([
    { id: '1', description: '', code: '', amount: 0 }
  ]);
  const [generatedPA, setGeneratedPA] = useState<string | null>(null);

  // PA Lookup state
  const [paLookupCode, setPaLookupCode] = useState('');
  const [paLookupResult, setPaLookupResult] = useState<PACode | null>(null);

  // Claim submission state
  const [claimData, setClaimData] = useState({
    paCode: '',
    enrolleeId: '',
    enrolleeName: '',
    enrolleeGender: '',
    enrolleeAge: '',
    diagnoses: [] as DiagnosisItem[],
    treatments: [] as TreatmentItem[],
    totalAmount: 0,
    documents: [] as File[]
  });

  const [paHistory, setPaHistory] = useState<PACode[]>(mockPACodes);
  const [claimHistory, setClaimHistory] = useState<Claim[]>(mockClaims);

  // Handle enrollee search with dropdown
  const handleEnrolleeSearch = (value: string, isEligibility = false) => {
    if (isEligibility) {
      setEligibilitySearch({ ...eligibilitySearch, enrolleeId: value });
    } else {
      setPaRequestData({ ...paRequestData, enrolleeId: value });
    }
    
    if (value.length > 0) {
      const filtered = mockEnrollees.filter(enrollee => 
        enrollee.id.toLowerCase().includes(value.toLowerCase()) ||
        enrollee.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredEnrollees(filtered);
      setShowEnrolleeDropdown(true);
    } else {
      setShowEnrolleeDropdown(false);
      setFilteredEnrollees([]);
    }
  };

  // Select enrollee from dropdown
  const selectEnrollee = (enrollee: Enrollee, isEligibility = false) => {
    if (isEligibility) {
      setEligibilitySearch({
        enrolleeId: enrollee.id,
        enrolleeName: enrollee.name
      });
      setSelectedEnrollee(enrollee);
    } else {
      setPaRequestData({
        ...paRequestData,
        enrolleeId: enrollee.id,
        enrolleeName: enrollee.name,
        enrolleeGender: enrollee.gender,
        enrolleeAge: enrollee.age.toString(),
        enrolleePhone: enrollee.phone
      });
    }
    setShowEnrolleeDropdown(false);
  };

  // Check eligibility
  const checkEligibility = () => {
    if (selectedEnrollee) {
      setEligibilityResults({
        enrolleeId: selectedEnrollee.id,
        name: selectedEnrollee.name,
        gender: selectedEnrollee.gender,
        age: selectedEnrollee.age,
        dateOfBirth: selectedEnrollee.dateOfBirth,
        status: selectedEnrollee.status,
        plan: selectedEnrollee.plan,
        company: selectedEnrollee.employer,
        effectiveDate: selectedEnrollee.effectiveDate,
        expirationDate: selectedEnrollee.expirationDate,
        phone: selectedEnrollee.phone,
        email: selectedEnrollee.email,
        copay: selectedEnrollee.status === 'inactive' ? 'N/A' : '₦1,000',
        deductible: selectedEnrollee.status === 'inactive' ? 'N/A' : '₦5,000',
        remainingDeductible: selectedEnrollee.status === 'inactive' ? 'N/A' : '₦1,500',
        benefitsUsed: selectedEnrollee.status === 'inactive' ? 'N/A' : '₦45,000',
        benefitsRemaining: selectedEnrollee.status === 'inactive' ? 'N/A' : '₦455,000'
      });
    }
  };

  // Update phone number
  const updateEnrolleePhone = (enrolleeId: string, newPhone: string) => {
    console.log(`Updating phone for ${enrolleeId} to ${newPhone}`);
    alert(`Phone number updated for enrollee ${enrolleeId}`);
  };

  // Handle diagnosis changes
  const updateDiagnosis = (id: string, field: keyof DiagnosisItem, value: string) => {
    setDiagnoses(diagnoses.map(diagnosis => {
      if (diagnosis.id === id) {
        const updated = { ...diagnosis, [field]: value };
        if (field === 'icd10Code') {
          const description = getDiagnosisFromICD10(value);
          updated.description = description;
        }
        return updated;
      }
      return diagnosis;
    }));
  };

  const addDiagnosis = () => {
    const newId = (diagnoses.length + 1).toString();
    setDiagnoses([...diagnoses, { id: newId, icd10Code: '', description: '' }]);
  };

  const removeDiagnosis = (id: string) => {
    if (diagnoses.length > 1) {
      setDiagnoses(diagnoses.filter(d => d.id !== id));
    }
  };

  // Handle treatment changes
  const addTreatment = () => {
    const newId = (treatments.length + 1).toString();
    setTreatments([...treatments, { 
      id: newId, 
      description: '', 
      code: '', 
      amount: 0,
      isNewItem: false
    }]);
  };

  const removeTreatment = (id: string) => {
    if (treatments.length > 1) {
      setTreatments(treatments.filter(t => t.id !== id));
    }
  };

  const updateTreatment = (id: string, field: keyof TreatmentItem, value: string | number | boolean) => {
    setTreatments(treatments.map(treatment => 
      treatment.id === id ? { ...treatment, [field]: value } : treatment
    ));
  };

  const totalAmount = treatments.reduce((sum, treatment) => sum + treatment.amount, 0);

  // PA Code lookup
  const lookupPACode = () => {
    const foundPA = paHistory.find(pa => pa.code === paLookupCode);
    if (foundPA) {
      setPaLookupResult(foundPA);
      // Pre-fill claim form
      setClaimData({
        paCode: foundPA.code,
        enrolleeId: foundPA.enrolleeId,
        enrolleeName: foundPA.enrolleeName,
        enrolleeGender: foundPA.enrolleeGender,
        enrolleeAge: foundPA.enrolleeAge,
        diagnoses: [...foundPA.diagnosis],
        treatments: foundPA.treatments.map(t => ({ ...t, isNewItem: false })),
        totalAmount: foundPA.totalAmount,
        documents: []
      });
    } else {
      setPaLookupResult(null);
      alert('PA Code not found. Please check the code and try again.');
    }
  };

  // Generate PA Code
  const generatePACode = () => {
    if (!paRequestData.enrolleePhone) {
      alert('Phone number is required before generating PA code. Please update the enrollee phone number.');
      return;
    }

    if (paRequestData.enrolleeId && diagnoses.some(d => d.icd10Code && d.description) && treatments.some(t => t.description && t.amount > 0)) {
      const paCode = `PA-${Date.now()}`;
      setGeneratedPA(paCode);
      
      const newPA: PACode = {
        id: Date.now().toString(),
        code: paCode,
        enrolleeId: paRequestData.enrolleeId,
        enrolleeName: paRequestData.enrolleeName,
        enrolleeGender: paRequestData.enrolleeGender,
        enrolleeAge: parseInt(paRequestData.enrolleeAge),
        diagnosis: diagnoses.filter(d => d.icd10Code && d.description),
        treatments: treatments.filter(t => t.description && t.amount > 0).map(t => ({ ...t, isNewItem: false })),
        totalAmount,
        generatedBy: 'Provider Portal Request',
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        claimSubmitted: false
      };
      
      setPaHistory([newPA, ...paHistory]);

      // Save offline if needed
      if (!isOnline) {
        saveFormData('pa_request', {
          ...paRequestData,
          diagnoses,
          treatments,
          paCode
        });
      }
    }
  };

  // Add treatment to claim
  const addClaimTreatment = () => {
    const newTreatment: TreatmentItem = {
      id: Date.now().toString(),
      description: '',
      code: '',
      amount: 0,
      isNewItem: true
    };
    setClaimData({
      ...claimData,
      treatments: [...claimData.treatments, newTreatment],
      totalAmount: claimData.treatments.reduce((sum, t) => sum + t.amount, 0) + newTreatment.amount
    });
  };

  const updateClaimTreatment = (id: string, field: keyof TreatmentItem, value: string | number | boolean) => {
    const updatedTreatments = claimData.treatments.map(treatment => 
      treatment.id === id ? { ...treatment, [field]: value } : treatment
    );
    setClaimData({
      ...claimData,
      treatments: updatedTreatments,
      totalAmount: updatedTreatments.reduce((sum, t) => sum + t.amount, 0)
    });
  };

  // Submit claim
  const submitClaim = () => {
    if (claimData.paCode && claimData.enrolleeId && claimData.treatments.length > 0) {
      // Update PA history
      setPaHistory(paHistory.map(pa => 
        pa.code === claimData.paCode 
          ? { ...pa, claimSubmitted: true, status: 'used' as const, claimStatus: 'pending' as const }
          : pa
      ));
      
      // Add to claim history
      const newClaim: Claim = {
        id: `CLM-${Date.now()}`,
        paCode: claimData.paCode,
        enrolleeId: claimData.enrolleeId,
        enrolleeName: claimData.enrolleeName,
        submittedAmount: claimData.totalAmount,
        approvedAmount: 0,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0]
      };
      
      setClaimHistory([newClaim, ...claimHistory]);
      
      alert('Claim submitted successfully! You will receive updates on the claim status.');
      
      // Reset form
      setClaimData({
        paCode: '',
        enrolleeId: '',
        enrolleeName: '',
        enrolleeGender: '',
        enrolleeAge: '',
        diagnoses: [],
        treatments: [],
        totalAmount: 0,
        documents: []
      });
      setPaLookupCode('');
      setPaLookupResult(null);
    }
  };

  // Use PA for claim
  const useForClaim = (pa: PACode) => {
    setClaimData({
      paCode: pa.code,
      enrolleeId: pa.enrolleeId,
      enrolleeName: pa.enrolleeName,
      enrolleeGender: pa.enrolleeGender,
      enrolleeAge: pa.enrolleeAge,
      diagnoses: [...pa.diagnosis],
      treatments: pa.treatments.map(t => ({ ...t, isNewItem: false })),
      totalAmount: pa.totalAmount,
      documents: []
    });
    setActiveTab('submit-claim');
  };

  const copyPACode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('PA Code copied to clipboard!');
  };

  // Offline mode handling
  useEffect(() => {
    if (!isOnline) {
      // Save current form data
      saveFormData('provider_pa_request', {
        paRequestData,
        diagnoses,
        treatments
      });
    }
  }, [paRequestData, diagnoses, treatments, isOnline]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header with Eagle HMO branding */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="/ehl.jpeg" 
                  alt="Eagle HMO Logo" 
                  className="w-10 h-10 rounded-lg object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center hidden">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Eagle HMO</h1>
                  <p className="text-sm text-gray-500">Provider Portal</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                You are working offline. Data will be saved locally and synced when connection is restored.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div 
        className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1200")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Provider Portal</h1>
            <p className="text-xl opacity-90">Manage PA codes, submit claims, and verify enrollee eligibility</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'eligibility', label: 'Check Eligibility', icon: UserCheck },
                { id: 'request-pa', label: 'Request PA Code', icon: FileText },
                { id: 'lookup-pa', label: 'PA Code Lookup', icon: Search },
                { id: 'submit-claim', label: 'Submit Claim', icon: Upload },
                { id: 'pa-history', label: 'PA History', icon: Clock },
                { id: 'claim-history', label: 'Claim History', icon: DollarSign }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Provider Dashboard</h2>
                  <p className="text-gray-600 mb-6">Overview of your claims and PA codes</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Claims</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalClaims}</p>
                      </div>
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending Claims</p>
                        <p className="text-2xl font-bold text-yellow-600">{dashboardStats.pendingClaims}</p>
                      </div>
                      <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Approved Claims</p>
                        <p className="text-2xl font-bold text-green-600">{dashboardStats.approvedClaims}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Paid</p>
                        <p className="text-2xl font-bold text-green-600">₦{dashboardStats.totalPaid.toLocaleString()}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {claimHistory.slice(0, 5).map((claim) => (
                      <div key={claim.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{claim.enrolleeName}</p>
                          <p className="text-sm text-gray-600">Claim {claim.id} • PA: {claim.paCode}</p>
                          <p className="text-xs text-gray-500">Submitted: {claim.submittedDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₦{claim.submittedAmount.toLocaleString()}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            claim.status === 'paid' ? 'bg-green-100 text-green-800' :
                            claim.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                            claim.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {claim.status.toUpperCase()}
                          </span>
                          {claim.paidDate && (
                            <p className="text-xs text-green-600 mt-1">Paid: {claim.paidDate}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <HeadphonesIcon className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-900">Eagle HMO Contact Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900">Call Center</h4>
                      <p className="text-lg font-bold text-green-600">09020006666</p>
                      <p className="text-sm text-gray-600">24/7 Support Line</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900">Claims Support</h4>
                      <p className="text-sm font-medium text-blue-600">claims@eaglehmo.com</p>
                      <p className="text-sm text-gray-600">Claims inquiries</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <Mail className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900">Call Center Email</h4>
                      <p className="text-sm font-medium text-purple-600">callcenter@eaglehmo.com</p>
                      <p className="text-sm text-gray-600">General inquiries</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Check Eligibility Tab */}
            {activeTab === 'eligibility' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Enrollee Eligibility</h2>
                  <p className="text-gray-600 mb-6">Verify enrollee coverage before providing treatment</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Search Form */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Enrollee</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enrollee ID or Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={eligibilitySearch.enrolleeId}
                            onChange={(e) => handleEnrolleeSearch(e.target.value, true)}
                            onFocus={() => eligibilitySearch.enrolleeId && setShowEnrolleeDropdown(true)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter enrollee ID or name"
                          />
                          
                          {showEnrolleeDropdown && filteredEnrollees.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {filteredEnrollees.map((enrollee) => (
                                <div
                                  key={enrollee.id}
                                  onClick={() => selectEnrollee(enrollee, true)}
                                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium text-gray-900">{enrollee.name}</p>
                                      <p className="text-sm text-gray-600">{enrollee.id} • {enrollee.gender}, {enrollee.age}y</p>
                                      <p className="text-xs text-gray-500">{enrollee.employer}</p>
                                    </div>
                                    <div className="text-right">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        enrollee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                      }`}>
                                        {enrollee.status.toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={checkEligibility}
                        disabled={!selectedEnrollee}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Check Eligibility
                      </button>
                    </div>
                  </div>

                  {/* Eligibility Results */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    {eligibilityResults ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">{eligibilityResults.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            eligibilityResults.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {eligibilityResults.status === 'active' ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">ID:</p>
                            <p className="font-medium">{eligibilityResults.enrolleeId}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Plan:</p>
                            <p className="font-medium">{eligibilityResults.plan}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Gender:</p>
                            <p className="font-medium">{eligibilityResults.gender}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Age:</p>
                            <p className="font-medium">{eligibilityResults.age} years</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Company:</p>
                            <p className="font-medium">{eligibilityResults.company}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Phone:</p>
                            <p className="font-medium">{eligibilityResults.phone}</p>
                          </div>
                        </div>

                        {eligibilityResults.status === 'active' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-medium text-green-900 mb-2">Coverage Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-green-700">Copay: {eligibilityResults.copay}</p>
                                <p className="text-green-700">Deductible: {eligibilityResults.deductible}</p>
                              </div>
                              <div>
                                <p className="text-green-700">Benefits Used: {eligibilityResults.benefitsUsed}</p>
                                <p className="text-green-700">Remaining: {eligibilityResults.benefitsRemaining}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {eligibilityResults.status === 'active' && (
                          <button
                            onClick={() => {
                              setPaRequestData({
                                ...paRequestData,
                                enrolleeId: eligibilityResults.enrolleeId,
                                enrolleeName: eligibilityResults.name,
                                enrolleeGender: eligibilityResults.gender,
                                enrolleeAge: eligibilityResults.age.toString(),
                                enrolleePhone: eligibilityResults.phone
                              });
                              setActiveTab('request-pa');
                            }}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Request PA Code for This Patient
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Results</h3>
                        <p className="text-gray-600">Search for an enrollee to check eligibility</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Request PA Code Tab */}
            {activeTab === 'request-pa' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Request PA Code</h2>
                  <p className="text-gray-600 mb-6">Generate a Pre-Authorization code for patient treatment</p>
                </div>

                {/* Enrollee Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enrollee ID *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={paRequestData.enrolleeId}
                          onChange={(e) => handleEnrolleeSearch(e.target.value, false)}
                          onFocus={() => paRequestData.enrolleeId && setShowEnrolleeDropdown(true)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter enrollee ID or name"
                        />
                        
                        {showEnrolleeDropdown && filteredEnrollees.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredEnrollees.map((enrollee) => (
                              <div
                                key={enrollee.id}
                                onClick={() => selectEnrollee(enrollee, false)}
                                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium text-gray-900">{enrollee.name}</p>
                                    <p className="text-sm text-gray-600">{enrollee.id} • {enrollee.gender}, {enrollee.age}y</p>
                                    <p className="text-xs text-gray-500">{enrollee.employer}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      enrollee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {enrollee.status.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Patient Name
                      </label>
                      <input
                        type="text"
                        value={paRequestData.enrolleeName}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        placeholder="Auto-populated"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <input
                        type="text"
                        value={paRequestData.enrolleeGender}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        placeholder="Auto-populated"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        type="text"
                        value={paRequestData.enrolleeAge}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        placeholder="Auto-populated"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="tel"
                          required
                          value={paRequestData.enrolleePhone}
                          onChange={(e) => setPaRequestData({ ...paRequestData, enrolleePhone: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="+234-xxx-xxx-xxxx"
                        />
                        {paRequestData.enrolleeId && paRequestData.enrolleePhone && (
                          <button
                            type="button"
                            onClick={() => updateEnrolleePhone(paRequestData.enrolleeId, paRequestData.enrolleePhone)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Service *
                      </label>
                      <input
                        type="date"
                        required
                        value={paRequestData.dateOfService}
                        onChange={(e) => setPaRequestData({ ...paRequestData, dateOfService: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Multiple Diagnoses Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Diagnoses (ICD-10)</h3>
                    <button
                      type="button"
                      onClick={addDiagnosis}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Diagnosis</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {diagnoses.map((diagnosis, index) => (
                      <div key={diagnosis.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ICD-10 Code *
                            </label>
                            <input
                              type="text"
                              required
                              value={diagnosis.icd10Code}
                              onChange={(e) => updateDiagnosis(diagnosis.id, 'icd10Code', e.target.value.toUpperCase())}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="e.g., B50.9"
                              list={`icd10-list-${diagnosis.id}`}
                            />
                            <datalist id={`icd10-list-${diagnosis.id}`}>
                              {commonICD10Codes.map((item) => (
                                <option key={item.code} value={item.code}>
                                  {item.code} - {item.description}
                                </option>
                              ))}
                            </datalist>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            <input
                              type="text"
                              value={diagnosis.description}
                              onChange={(e) => updateDiagnosis(diagnosis.id, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Auto-populated or edit manually"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Diagnosis #{index + 1}</span>
                            {diagnoses.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeDiagnosis(diagnosis.id)}
                                className="p-2 text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Treatment Items */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Treatment Items</h3>
                    <button
                      type="button"
                      onClick={addTreatment}
                      className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Treatment</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {treatments.map((treatment, index) => (
                      <div key={treatment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Treatment/Service *
                            </label>
                            <input
                              type="text"
                              required
                              value={treatment.description}
                              onChange={(e) => updateTreatment(treatment.id, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="e.g., Consultation, X-Ray"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Service Code
                            </label>
                            <input
                              type="text"
                              value={treatment.code}
                              onChange={(e) => updateTreatment(treatment.id, 'code', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Service code"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Amount (₦) *
                            </label>
                            <input
                              type="number"
                              min="0"
                              required
                              value={treatment.amount || ''}
                              onChange={(e) => updateTreatment(treatment.id, 'amount', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Item #{index + 1}</span>
                            {treatments.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTreatment(treatment.id)}
                                className="p-2 text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-green-900">Total Amount:</span>
                        <span className="text-xl font-bold text-green-900">₦{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Comments
                  </label>
                  <textarea
                    value={paRequestData.comments}
                    onChange={(e) => setPaRequestData({ ...paRequestData, comments: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-24 resize-none"
                    placeholder="Any additional information..."
                  />
                </div>

                {/* Generate PA Button */}
                <div className="flex justify-end">
                  <button
                    onClick={generatePACode}
                    disabled={!paRequestData.enrolleeId || !paRequestData.enrolleePhone || !diagnoses.some(d => d.icd10Code && d.description) || !treatments.some(t => t.description && t.amount > 0)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Request PA Code from Call Center
                  </button>
                </div>

                {/* Generated PA Code */}
                {generatedPA && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-green-900 mb-4">PA Request Submitted!</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-green-900">{generatedPA}</div>
                        <div className="text-sm text-green-700 mt-1">Request sent to Eagle HMO Call Center for approval</div>
                      </div>
                      <button
                        onClick={() => copyPACode(generatedPA)}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PA Code Lookup Tab */}
            {activeTab === 'lookup-pa' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">PA Code Lookup</h2>
                  <p className="text-gray-600 mb-6">Look up existing PA codes and their details</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex space-x-4 mb-6">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PA Code
                      </label>
                      <input
                        type="text"
                        value={paLookupCode}
                        onChange={(e) => setPaLookupCode(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter PA code (e.g., PA-1736789456789-123)"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={lookupPACode}
                        disabled={!paLookupCode}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Lookup
                      </button>
                    </div>
                  </div>

                  {paLookupResult && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-blue-900">PA Code Details</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          paLookupResult.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          paLookupResult.status === 'used' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {paLookupResult.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-medium text-blue-900 mb-2">Patient Information</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-blue-700">Name:</span> {paLookupResult.enrolleeName}</p>
                            <p><span className="text-blue-700">ID:</span> {paLookupResult.enrolleeId}</p>
                            <p><span className="text-blue-700">Gender:</span> {paLookupResult.enrolleeGender}</p>
                            <p><span className="text-blue-700">Age:</span> {paLookupResult.enrolleeAge} years</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-900 mb-2">PA Information</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-blue-700">Generated by:</span> {paLookupResult.generatedBy}</p>
                            <p><span className="text-blue-700">Date:</span> {paLookupResult.generatedDate}</p>
                            <p><span className="text-blue-700">Total Amount:</span> ₦{paLookupResult.totalAmount.toLocaleString()}</p>
                            <p><span className="text-blue-700">Claim Status:</span> {paLookupResult.claimSubmitted ? 'Submitted' : 'Not Submitted'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-blue-900 mb-2">Diagnoses</h4>
                        <div className="space-y-2">
                          {paLookupResult.diagnosis.map((diag) => (
                            <div key={diag.id} className="bg-white rounded p-3 border">
                              <p className="font-medium">{diag.icd10Code} - {diag.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-medium text-blue-900 mb-2">Approved Treatments</h4>
                        <div className="space-y-2">
                          {paLookupResult.treatments.map((treatment) => (
                            <div key={treatment.id} className="flex justify-between items-center bg-white rounded p-3 border">
                              <div>
                                <p className="font-medium">{treatment.description}</p>
                                <p className="text-sm text-gray-600">{treatment.code}</p>
                              </div>
                              <span className="font-medium">₦{treatment.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {!paLookupResult.claimSubmitted && (
                        <button
                          onClick={() => useForClaim(paLookupResult)}
                          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Use This PA Code for Claim Submission
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Claim Tab */}
            {activeTab === 'submit-claim' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit Claim</h2>
                  <p className="text-gray-600 mb-6">Submit a claim using your PA code</p>
                </div>

                {/* PA Code Input */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex space-x-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PA Code *
                      </label>
                      <input
                        type="text"
                        value={claimData.paCode}
                        onChange={(e) => setClaimData({...claimData, paCode: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter PA code"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setPaLookupCode(claimData.paCode);
                          lookupPACode();
                        }}
                        disabled={!claimData.paCode}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                      >
                        Load PA Details
                      </button>
                    </div>
                  </div>

                  {claimData.enrolleeId && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Patient Information</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">Name:</span> {claimData.enrolleeName}
                        </div>
                        <div>
                          <span className="text-blue-700">ID:</span> {claimData.enrolleeId}
                        </div>
                        <div>
                          <span className="text-blue-700">Gender:</span> {claimData.enrolleeGender}
                        </div>
                        <div>
                          <span className="text-blue-700">Age:</span> {claimData.enrolleeAge} years
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Diagnoses Display */}
                {claimData.diagnoses.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Diagnoses</h3>
                    <div className="space-y-2">
                      {claimData.diagnoses.map((diagnosis) => (
                        <div key={diagnosis.id} className="bg-gray-50 rounded p-3 border">
                          <p className="font-medium">{diagnosis.icd10Code} - {diagnosis.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Treatment Items with Add/Edit */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Treatment Items</h3>
                    <button
                      onClick={addClaimTreatment}
                      className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Item</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {claimData.treatments.map((treatment) => (
                      <div key={treatment.id} className={`rounded-lg p-4 border-2 ${
                        treatment.isNewItem ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div>
                            <input
                              type="text"
                              value={treatment.description}
                              onChange={(e) => updateClaimTreatment(treatment.id, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              placeholder="Treatment description"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={treatment.code}
                              onChange={(e) => updateClaimTreatment(treatment.id, 'code', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              placeholder="Service code"
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              min="0"
                              value={treatment.amount || ''}
                              onChange={(e) => updateClaimTreatment(treatment.id, 'amount', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              placeholder="Amount"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            {treatment.isNewItem && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                                NEW ITEM
                              </span>
                            )}
                            <button
                              onClick={() => {
                                const updatedTreatments = claimData.treatments.filter(t => t.id !== treatment.id);
                                setClaimData({
                                  ...claimData,
                                  treatments: updatedTreatments,
                                  totalAmount: updatedTreatments.reduce((sum, t) => sum + t.amount, 0)
                                });
                              }}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-green-900">Total Claim Amount:</span>
                        <span className="text-xl font-bold text-green-900">₦{claimData.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supporting Documents
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload medical documents
                        </span>
                        <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">PNG, JPG, PDF up to 10MB each</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    onClick={submitClaim}
                    disabled={!claimData.paCode || !claimData.enrolleeId || claimData.treatments.length === 0}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Submit Claim to Eagle HMO
                  </button>
                </div>
              </div>
            )}

            {/* PA History Tab */}
            {activeTab === 'pa-history' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">PA Code History</h2>
                  <p className="text-gray-600 mb-6">View all PA codes generated for your facility</p>
                </div>

                <div className="space-y-4">
                  {paHistory.map((pa) => (
                    <div key={pa.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="text-xl font-bold text-green-600">{pa.code}</div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              pa.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              pa.status === 'used' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {pa.status.toUpperCase()}
                            </span>
                            {pa.claimSubmitted && (
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                Claim Submitted
                              </span>
                            )}
                            {pa.claimStatus === 'paid' && (
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                PAID
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Patient</p>
                              <p className="font-medium text-gray-900">{pa.enrolleeName}</p>
                              <p className="text-xs text-gray-500">{pa.enrolleeGender}, {pa.enrolleeAge}y</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Generated By</p>
                              <p className="font-medium text-gray-900">{pa.generatedBy}</p>
                              <p className="text-xs text-gray-500">{pa.generatedDate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Amount</p>
                              <p className="font-medium text-gray-900">₦{pa.totalAmount.toLocaleString()}</p>
                              {pa.paidAmount && (
                                <p className="text-xs text-green-600">Paid: ₦{pa.paidAmount.toLocaleString()} on {pa.paidDate}</p>
                              )}
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Diagnoses</p>
                            <div className="flex flex-wrap gap-2">
                              {pa.diagnosis.map((diag) => (
                                <span key={diag.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {diag.icd10Code} - {diag.description}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => copyPACode(pa.code)}
                            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </button>
                          
                          {!pa.claimSubmitted && (
                            <button
                              onClick={() => useForClaim(pa)}
                              className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Submit Claim</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Claim History Tab */}
            {activeTab === 'claim-history' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Claim History</h2>
                  <p className="text-gray-600 mb-6">Track your submitted claims and payment status</p>
                </div>

                <div className="space-y-4">
                  {claimHistory.map((claim) => (
                    <div key={claim.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{claim.id}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              claim.status === 'paid' ? 'bg-green-100 text-green-800' :
                              claim.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                              claim.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {claim.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Patient</p>
                              <p className="font-medium text-gray-900">{claim.enrolleeName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">PA Code</p>
                              <p className="font-medium text-gray-900">{claim.paCode}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Submitted Amount</p>
                              <p className="font-medium text-gray-900">₦{claim.submittedAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Submitted Date</p>
                              <p className="font-medium text-gray-900">{claim.submittedDate}</p>
                            </div>
                          </div>

                          {claim.status === 'paid' && claim.paidDate && (
                            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-900">Payment Completed</span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-green-700">Paid Amount:</span> ₦{claim.paidAmount?.toLocaleString()}
                                </div>
                                <div>
                                  <span className="text-green-700">Payment Date:</span> {claim.paidDate}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}