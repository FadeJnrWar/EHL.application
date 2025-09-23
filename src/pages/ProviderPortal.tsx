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
  WifiOff
} from 'lucide-react';
import { useOffline } from '../contexts/OfflineContext';

interface Enrollee {
  id: string;
  name: string;
  memberNumber: string;
  plan: string;
  employer: string;
  status: 'active' | 'inactive';
}

interface TreatmentItem {
  id: string;
  description: string;
  code: string;
  amount: number;
}

interface PACode {
  id: string;
  code: string;
  enrolleeId: string;
  enrolleeName: string;
  diagnosis: string;
  icdCode: string;
  treatments: TreatmentItem[];
  totalAmount: number;
  generatedBy: string;
  generatedDate: string;
  status: 'pending' | 'used' | 'expired';
  claimSubmitted: boolean;
}

const mockEnrollees: Enrollee[] = [
  { id: '1', name: 'John Doe', memberNumber: 'EHM001234', plan: 'Gold Plan', employer: 'Tech Corp', status: 'active' },
  { id: '2', name: 'Jane Smith', memberNumber: 'EHM001235', plan: 'Silver Plan', employer: 'Bank Ltd', status: 'active' },
  { id: '3', name: 'Mike Johnson', memberNumber: 'EHM001236', plan: 'Bronze Plan', employer: 'Retail Inc', status: 'active' },
];

const mockPACodes: PACode[] = [
  {
    id: '1',
    code: 'PA2024001',
    enrolleeId: '1',
    enrolleeName: 'John Doe',
    diagnosis: 'Hypertension',
    icdCode: 'I10',
    treatments: [
      { id: '1', description: 'Blood Pressure Monitoring', code: 'BP001', amount: 5000 },
      { id: '2', description: 'Medication Prescription', code: 'MED001', amount: 15000 }
    ],
    totalAmount: 20000,
    generatedBy: 'Dr. Sarah Wilson (Call Center)',
    generatedDate: '2024-01-15',
    status: 'used',
    claimSubmitted: true
  },
  {
    id: '2',
    code: 'PA2024002',
    enrolleeId: '2',
    enrolleeName: 'Jane Smith',
    diagnosis: 'Diabetes Type 2',
    icdCode: 'E11',
    treatments: [
      { id: '1', description: 'Blood Sugar Test', code: 'BST001', amount: 3000 },
      { id: '2', description: 'Insulin Prescription', code: 'INS001', amount: 25000 }
    ],
    totalAmount: 28000,
    generatedBy: 'Nurse Mary Johnson (Call Center)',
    generatedDate: '2024-01-14',
    status: 'pending',
    claimSubmitted: false
  }
];

const icdCodes = [
  { code: 'I10', description: 'Essential hypertension' },
  { code: 'E11', description: 'Type 2 diabetes mellitus' },
  { code: 'J44', description: 'Chronic obstructive pulmonary disease' },
  { code: 'M79.3', description: 'Panniculitis, unspecified' },
  { code: 'K59.00', description: 'Constipation, unspecified' },
];

export default function ProviderPortal() {
  const { isOnline } = useOffline();
  const [activeTab, setActiveTab] = useState('request-pa');
  const [selectedEnrollee, setSelectedEnrollee] = useState<Enrollee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [icdSearch, setIcdSearch] = useState('');
  const [selectedIcd, setSelectedIcd] = useState<{code: string, description: string} | null>(null);
  const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
  const [newTreatment, setNewTreatment] = useState({ description: '', code: '', amount: 0 });
  const [generatedPA, setGeneratedPA] = useState<string | null>(null);
  const [paHistory, setPaHistory] = useState<PACode[]>(mockPACodes);

  // Provider verification form state
  const [verificationData, setVerificationData] = useState({
    hospitalName: '',
    registrationNumber: '',
    address: '',
    contactPerson: '',
    phone: '',
    email: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    licenseNumber: '',
    specialization: '',
    yearsOfOperation: ''
  });

  // Claim submission state
  const [claimData, setClaimData] = useState({
    paCode: '',
    enrolleeId: '',
    icdCode: '',
    diagnosis: '',
    treatments: [] as TreatmentItem[],
    totalAmount: 0,
    documents: [] as File[]
  });

  const filteredEnrollees = mockEnrollees.filter(enrollee =>
    enrollee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollee.memberNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIcdCodes = icdCodes.filter(icd =>
    icd.code.toLowerCase().includes(icdSearch.toLowerCase()) ||
    icd.description.toLowerCase().includes(icdSearch.toLowerCase())
  );

  const addTreatment = () => {
    if (newTreatment.description && newTreatment.code && newTreatment.amount > 0) {
      const treatment: TreatmentItem = {
        id: Date.now().toString(),
        ...newTreatment
      };
      setTreatments([...treatments, treatment]);
      setNewTreatment({ description: '', code: '', amount: 0 });
    }
  };

  const removeTreatment = (id: string) => {
    setTreatments(treatments.filter(t => t.id !== id));
  };

  const totalAmount = treatments.reduce((sum, treatment) => sum + treatment.amount, 0);

  const generatePACode = () => {
    if (selectedEnrollee && selectedIcd && treatments.length > 0) {
      const paCode = `PA${Date.now()}`;
      setGeneratedPA(paCode);
      
      // Add to PA history
      const newPA: PACode = {
        id: Date.now().toString(),
        code: paCode,
        enrolleeId: selectedEnrollee.id,
        enrolleeName: selectedEnrollee.name,
        diagnosis: selectedIcd.description,
        icdCode: selectedIcd.code,
        treatments: [...treatments],
        totalAmount,
        generatedBy: 'Provider Portal',
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        claimSubmitted: false
      };
      
      setPaHistory([newPA, ...paHistory]);
    }
  };

  const copyPACode = () => {
    if (generatedPA) {
      navigator.clipboard.writeText(generatedPA);
    }
  };

  const useForClaim = (pa: PACode) => {
    setClaimData({
      paCode: pa.code,
      enrolleeId: pa.enrolleeId,
      icdCode: pa.icdCode,
      diagnosis: pa.diagnosis,
      treatments: [...pa.treatments],
      totalAmount: pa.totalAmount,
      documents: []
    });
    setActiveTab('submit-claim');
  };

  const submitClaim = () => {
    if (claimData.paCode && claimData.enrolleeId && claimData.treatments.length > 0) {
      // Update PA history to mark as claim submitted
      setPaHistory(paHistory.map(pa => 
        pa.code === claimData.paCode 
          ? { ...pa, claimSubmitted: true, status: 'used' as const }
          : pa
      ));
      
      alert('Claim submitted successfully!');
      
      // Reset form
      setClaimData({
        paCode: '',
        enrolleeId: '',
        icdCode: '',
        diagnosis: '',
        treatments: [],
        totalAmount: 0,
        documents: []
      });
    }
  };

  const handleVerificationSubmit = () => {
    alert('Verification request submitted successfully! You will receive a confirmation email within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header with Eagle HMO branding */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Provider Portal</h1>
            <p className="text-xl opacity-90">Manage PA codes, submit claims, and verify your facility</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'request-pa', label: 'Request PA Code', icon: FileText },
                { id: 'submit-claim', label: 'Submit Claim', icon: Upload },
                { id: 'pa-history', label: 'PA Code History', icon: Clock },
                { id: 'verification', label: 'Provider Verification', icon: Shield }
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
            {/* Request PA Code Tab */}
            {activeTab === 'request-pa' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Request PA Code</h2>
                  <p className="text-gray-600 mb-6">Generate a Pre-Authorization code for patient treatment</p>
                </div>

                {/* Enrollee Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Enrollee
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or member number..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  {searchTerm && (
                    <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredEnrollees.map((enrollee) => (
                        <button
                          key={enrollee.id}
                          onClick={() => {
                            setSelectedEnrollee(enrollee);
                            setSearchTerm(enrollee.name);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{enrollee.name}</div>
                          <div className="text-sm text-gray-500">{enrollee.memberNumber} • {enrollee.plan}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedEnrollee && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-900 mb-2">Selected Enrollee</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-700 font-medium">Name:</span> {selectedEnrollee.name}
                      </div>
                      <div>
                        <span className="text-green-700 font-medium">Member #:</span> {selectedEnrollee.memberNumber}
                      </div>
                      <div>
                        <span className="text-green-700 font-medium">Plan:</span> {selectedEnrollee.plan}
                      </div>
                      <div>
                        <span className="text-green-700 font-medium">Employer:</span> {selectedEnrollee.employer}
                      </div>
                    </div>
                  </div>
                )}

                {/* ICD-10 Code Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ICD-10 Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={icdSearch}
                      onChange={(e) => setIcdSearch(e.target.value)}
                      placeholder="Search ICD-10 codes..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  {icdSearch && (
                    <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredIcdCodes.map((icd) => (
                        <button
                          key={icd.code}
                          onClick={() => {
                            setSelectedIcd(icd);
                            setIcdSearch(`${icd.code} - ${icd.description}`);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{icd.code}</div>
                          <div className="text-sm text-gray-500">{icd.description}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Treatment Items */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Treatment Items</h3>
                  
                  {/* Add Treatment Form */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <input
                        type="text"
                        placeholder="Treatment description"
                        value={newTreatment.description}
                        onChange={(e) => setNewTreatment({...newTreatment, description: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Treatment code"
                        value={newTreatment.code}
                        onChange={(e) => setNewTreatment({...newTreatment, code: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Amount (₦)"
                        value={newTreatment.amount || ''}
                        onChange={(e) => setNewTreatment({...newTreatment, amount: Number(e.target.value)})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        onClick={addTreatment}
                        className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>

                  {/* Treatment List */}
                  {treatments.length > 0 && (
                    <div className="space-y-2">
                      {treatments.map((treatment) => (
                        <div key={treatment.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{treatment.description}</div>
                            <div className="text-sm text-gray-500">{treatment.code}</div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-900">₦{treatment.amount.toLocaleString()}</span>
                            <button
                              onClick={() => removeTreatment(treatment.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-green-900">Total Amount:</span>
                          <span className="text-xl font-bold text-green-900">₦{totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Generate PA Button */}
                <div className="flex justify-end">
                  <button
                    onClick={generatePACode}
                    disabled={!selectedEnrollee || !selectedIcd || treatments.length === 0}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Generate PA Code
                  </button>
                </div>

                {/* Generated PA Code */}
                {generatedPA && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-green-900 mb-4">PA Code Generated Successfully!</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="text-3xl font-bold text-green-900">{generatedPA}</div>
                        <div className="text-sm text-green-700 mt-1">Use this code for claim submission</div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={copyPACode}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('submit-claim')}
                          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Use for Claim</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Claim Tab */}
            {activeTab === 'submit-claim' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit Claim</h2>
                  <p className="text-gray-600 mb-6">Submit a claim using your PA code</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PA Code *
                    </label>
                    <input
                      type="text"
                      value={claimData.paCode}
                      onChange={(e) => setClaimData({...claimData, paCode: e.target.value})}
                      placeholder="Enter PA code"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enrollee ID *
                    </label>
                    <input
                      type="text"
                      value={claimData.enrolleeId}
                      onChange={(e) => setClaimData({...claimData, enrolleeId: e.target.value})}
                      placeholder="Enter enrollee ID"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ICD-10 Code *
                    </label>
                    <input
                      type="text"
                      value={claimData.icdCode}
                      onChange={(e) => setClaimData({...claimData, icdCode: e.target.value})}
                      placeholder="Enter ICD-10 code"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diagnosis *
                    </label>
                    <input
                      type="text"
                      value={claimData.diagnosis}
                      onChange={(e) => setClaimData({...claimData, diagnosis: e.target.value})}
                      placeholder="Enter diagnosis"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Treatment Items Display */}
                {claimData.treatments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Treatment Items</h3>
                    <div className="space-y-2">
                      {claimData.treatments.map((treatment) => (
                        <div key={treatment.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{treatment.description}</div>
                            <div className="text-sm text-gray-500">{treatment.code}</div>
                          </div>
                          <span className="font-medium text-gray-900">₦{treatment.amount.toLocaleString()}</span>
                        </div>
                      ))}
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-green-900">Total Amount:</span>
                          <span className="text-xl font-bold text-green-900">₦{claimData.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* File Upload */}
                <div>
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
                    Submit Claim
                  </button>
                </div>
              </div>
            )}

            {/* PA History Tab */}
            {activeTab === 'pa-history' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">PA Code History</h2>
                  <p className="text-gray-600 mb-6">View all PA codes generated by Eagle HMO staff</p>
                </div>

                <div className="space-y-4">
                  {paHistory.map((pa) => (
                    <div key={pa.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="text-2xl font-bold text-green-600">{pa.code}</div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              pa.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              pa.status === 'used' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {pa.status.charAt(0).toUpperCase() + pa.status.slice(1)}
                            </div>
                            {pa.claimSubmitted && (
                              <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                Claim Submitted
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-gray-500">Patient</div>
                              <div className="font-medium text-gray-900">{pa.enrolleeName}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Diagnosis</div>
                              <div className="font-medium text-gray-900">{pa.diagnosis}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">ICD-10 Code</div>
                              <div className="font-medium text-gray-900">{pa.icdCode}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Total Amount</div>
                              <div className="font-medium text-gray-900">₦{pa.totalAmount.toLocaleString()}</div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="text-sm text-gray-500 mb-2">Generated By</div>
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-900">{pa.generatedBy}</span>
                              <span className="text-gray-500">•</span>
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500">{pa.generatedDate}</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="text-sm text-gray-500 mb-2">Treatment Items</div>
                            <div className="space-y-1">
                              {pa.treatments.map((treatment) => (
                                <div key={treatment.id} className="flex justify-between text-sm">
                                  <span>{treatment.description} ({treatment.code})</span>
                                  <span>₦{treatment.amount.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => navigator.clipboard.writeText(pa.code)}
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
                              <span>Use for Claim</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Provider Verification Tab */}
            {activeTab === 'verification' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Provider Verification</h2>
                  <p className="text-gray-600 mb-6">Complete your facility verification to access all features</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hospital Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Hospital Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hospital Name *
                      </label>
                      <input
                        type="text"
                        value={verificationData.hospitalName}
                        onChange={(e) => setVerificationData({...verificationData, hospitalName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Number *
                      </label>
                      <input
                        type="text"
                        value={verificationData.registrationNumber}
                        onChange={(e) => setVerificationData({...verificationData, registrationNumber: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <textarea
                        value={verificationData.address}
                        onChange={(e) => setVerificationData({...verificationData, address: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={verificationData.specialization}
                        onChange={(e) => setVerificationData({...verificationData, specialization: e.target.value})}
                        placeholder="e.g., General Hospital, Cardiology Center"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Operation
                      </label>
                      <input
                        type="number"
                        value={verificationData.yearsOfOperation}
                        onChange={(e) => setVerificationData({...verificationData, yearsOfOperation: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Contact & Banking Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        value={verificationData.contactPerson}
                        onChange={(e) => setVerificationData({...verificationData, contactPerson: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={verificationData.phone}
                        onChange={(e) => setVerificationData({...verificationData, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={verificationData.email}
                        onChange={(e) => setVerificationData({...verificationData, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        License Number *
                      </label>
                      <input
                        type="text"
                        value={verificationData.licenseNumber}
                        onChange={(e) => setVerificationData({...verificationData, licenseNumber: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mt-6">Banking Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        value={verificationData.bankName}
                        onChange={(e) => setVerificationData({...verificationData, bankName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        value={verificationData.accountNumber}
                        onChange={(e) => setVerificationData({...verificationData, accountNumber: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Name *
                      </label>
                      <input
                        type="text"
                        value={verificationData.accountName}
                        onChange={(e) => setVerificationData({...verificationData, accountName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    onClick={handleVerificationSubmit}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Submit for Verification
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Connection Status */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isOnline ? (
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              ) : (
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              )}
              <div>
                <h2 className={`text-lg font-medium ${isOnline ? 'text-green-900' : 'text-red-900'}`}>
                  {isOnline ? 'Connected to Eagle HMO' : 'Working Offline'}
                </h2>
                <p className={`${isOnline ? 'text-green-700' : 'text-red-700'}`}>
                  {isOnline
                    ? 'Connected to Eagle HMO servers. Claims submit in real-time.'
                    : 'No connection. Claims will be saved locally and submitted when online.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}