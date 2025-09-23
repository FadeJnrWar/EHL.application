import React, { useState, useEffect } from 'react';
import { Shield, FileText, BarChart3, Clock, CheckCircle, AlertTriangle, Building2, User, Calendar, DollarSign, Upload, Plus, Trash2, Calculator, Copy, Check, Eye, EyeOff, Save, X, Search, Wifi, WifiOff, Package, Edit3, UserCheck, History, Phone, Mail, MapPin } from 'lucide-react';
import { useOffline } from '../contexts/OfflineContext';
import { LogOut, Building2, FileText, Upload, Clock, CheckCircle, User, Shield, Bell, Settings, Wifi, WifiOff, Database, AlertTriangle, Power, Info, RefreshCw as Sync, Plus, Trash2, Calculator, Copy, Check, Edit3, Save, X, Paperclip } from 'lucide-react';
import OfflineBanner from '../components/Common/OfflineBanner';
import { validateICD10Code, getDiagnosisFromICD10, commonICD10Codes, generatePACode } from '../utils/icd10Validator';
import { findEnrolleeById, enrollees } from '../data/enrollees';

const ProviderPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const { 
    isOnline, 
    isManualOffline,
    setOnlineMode,
    setOfflineMode,
    saveFormData, 
    getFormData, 
    hasBackup, 
    clearFormData,
    getAllBackups,
    lastOnlineTime
  } = useOffline();
  
  // Initialize formData state
  const [formData, setFormData] = useState({
    paCode: '',
    enrolleeId: '',
    enrolleeName: '',
    enrolleeGender: '',
    enrolleeAge: '',
    enrolleePhone: '',
    enrolleeCompany: '',
    enrolleePlan: '',
    patientName: '',
    diagnosis: '',
    icd10Code: '',
    treatmentDate: '',
    amount: '',
    notes: '',
    urgency: 'routine',
    treatmentPlan: ''
  });
  
  const commonServices = [
    'Consultation',
    'Laboratory Test',
    'X-Ray',
    'Ultrasound',
    'CT Scan',
    'MRI',
    'Blood Test',
    'Urine Test',
    'ECG',
    'Medication',
    'IV Fluids',
    'Injection',
    'Physiotherapy Session',
    'Surgical Procedure',
    'Admission (per day)',
    'Emergency Care',
    'Specialist Consultation'
  ];

  // Handle enrollee ID input with dropdown
  const handleEnrolleeIdChange = (value) => {
    setFormData({ ...formData, enrolleeId: value });
    
    if (value.length > 0) {
      const filtered = enrollees.filter(enrollee => 
        enrollee.id.toLowerCase().includes(value.toLowerCase()) ||
        enrollee.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredEnrollees(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
      setFilteredEnrollees([]);
      // Clear other fields when ID is cleared
      setFormData({
        ...formData,
        enrolleeId: '',
        enrolleeName: '',
        enrolleeGender: '',
        enrolleeAge: '',
        enrolleePhone: '',
        enrolleeCompany: '',
        enrolleePlan: ''
      });
    }
  };

  // Select enrollee from dropdown
  const selectEnrollee = (enrollee) => {
    setFormData({
      ...formData,
      enrolleeId: enrollee.id,
      enrolleeName: enrollee.name,
      enrolleeGender: enrollee.gender,
      enrolleeAge: enrollee.age.toString(),
      enrolleePhone: enrollee.phone,
      enrolleeCompany: enrollee.company,
      enrolleePlan: enrollee.plan
    });
    setShowDropdown(false);
  };

  // Handle ICD-10 code change
  const handleICD10Change = (value) => {
    setFormData({ ...formData, icd10Code: value.toUpperCase() });
    const description = getDiagnosisFromICD10(value.toUpperCase());
    if (description) {
      setFormData({ ...formData, icd10Code: value.toUpperCase(), diagnosis: description });
    }
  };

  // Treatment management
  const addTreatment = () => {
    const newId = (treatments.length + 1).toString();
    setTreatments([...treatments, { 
      id: newId, 
      service: '', 
      unitPrice: 0, 
      quantity: 1, 
      total: 0 
    }]);
  };

  const removeTreatment = (id) => {
    if (treatments.length > 1) {
      setTreatments(treatments.filter(t => t.id !== id));
    }
  };

  const updateTreatment = (id, field, value) => {
    setTreatments(treatments.map(treatment => {
      if (treatment.id === id) {
        const updated = { ...treatment, [field]: value };
        // Recalculate total when price or quantity changes
        if (field === 'unitPrice' || field === 'quantity') {
          updated.total = updated.unitPrice * updated.quantity;
        }
        return updated;
      }
      return treatment;
    }));
  };

  const getTotalAmount = () => {
    return treatments.reduce((sum, treatment) => sum + treatment.total, 0);
  };

  // File upload handling
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Generate PA Code
  const handleGeneratePACode = () => {
    if (!formData.enrolleeId || !formData.icd10Code || !formData.treatmentPlan) {
      alert('Please fill in Enrollee ID, ICD-10 Code, and Treatment Plan before generating PA code.');
      return;
    }
    
    const paCode = generatePACode();
    setGeneratedPACode(paCode);
    setFormData({ ...formData, paCode: paCode });
    
    if (!isOnline) {
      saveFormData('provider_pa_request', { ...formData, paCode, treatments, uploadedFiles: uploadedFiles.map(f => f.name) });
      alert(`PA Code Generated Offline: ${paCode}\n\nSaved locally and will be submitted when connection is restored.`);
    } else {
      alert(`PA Code Generated: ${paCode}\n\nThis code has been sent to Eagle HMO for processing.`);
    }
  };

  // Copy PA Code
  const handleCopyPACode = () => {
    navigator.clipboard.writeText(generatedPACode);
    setCopiedPA(true);
    setTimeout(() => setCopiedPA(false), 2000);
  };

  // Load PA Code into claim form
  const loadPACodeToClaim = () => {
    if (!generatedPACode) {
      alert('Please generate a PA code first.');
      return;
    }
    
    // Switch to submit claim tab and populate data
    setActiveTab('submit-claim');
    setFormData({
      ...formData,
      patientName: formData.enrolleeName,
      diagnosis: formData.diagnosis,
      treatmentDate: new Date().toISOString().split('T')[0],
      amount: getTotalAmount().toString()
    });
  };
  const [treatments, setTreatments] = useState([
    { id: '1', service: '', unitPrice: 0, quantity: 1, total: 0 }
  ]);
  
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredEnrollees, setFilteredEnrollees] = useState([]);
  const [generatedPACode, setGeneratedPACode] = useState('');
  const [copiedPA, setCopiedPA] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [verificationData, setVerificationData] = useState({
    providerName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    specialization: '',
    bankName: '',
    accountNumber: '',
    accountName: ''
  });
  const [paHistory, setPaHistory] = useState([
    {
      id: 'PA-1736789456789-123',
      enrolleeId: 'ENR-12345',
      enrolleeName: 'Adebayo Olumide',
      diagnosis: 'Plasmodium falciparum malaria',
      icd10Code: 'B50.9',
      dateGenerated: '2025-01-10',
      generatedBy: 'Winifred Festus (Call Center)',
      estimatedCost: 45000,
      status: 'active',
      claimSubmitted: true,
      claimId: 'CLM-001',
      claimStatus: 'approved'
    },
    {
      id: 'PA-1736789356789-456',
      enrolleeId: 'ENR-67890',
      enrolleeName: 'Fatima Abubakar',
      diagnosis: 'Type 2 diabetes mellitus',
      icd10Code: 'E11.9',
      dateGenerated: '2025-01-11',
      generatedBy: 'Ajayi Seyi (Call Center)',
      estimatedCost: 28500,
      status: 'active',
      claimSubmitted: true,
      claimId: 'CLM-002',
      claimStatus: 'approved'
    },
    {
      id: 'PA-1736789256789-789',
      enrolleeId: 'ENR-11111',
      enrolleeName: 'Chinedu Okafor',
      diagnosis: 'Essential hypertension',
      icd10Code: 'I10',
      dateGenerated: '2025-01-09',
      generatedBy: 'Winifred Festus (Call Center)',
      estimatedCost: 85000,
      status: 'expired',
      claimSubmitted: true,
      claimId: 'CLM-003',
      claimStatus: 'rejected'
    }
  ]);
  const [claims, setClaims] = useState([
    {
      id: 'CLM-001',
      patientName: 'John Doe',
      diagnosis: 'Hypertension',
      amount: 25000,
      status: 'pending',
      submissionDate: '2025-01-13'
    },
    {
      id: 'CLM-002', 
      patientName: 'Jane Smith',
      diagnosis: 'Diabetes',
      amount: 18500,
      status: 'approved',
      submissionDate: '2025-01-12'
    }
  ]);

  // Save current form data when offline
  const saveCurrentData = () => {
    if (formData && (formData.patientName || formData.diagnosis || formData.amount || formData.enrolleeId)) {
      saveFormData('provider_claim_form', formData);
      saveFormData('provider_treatments', treatments);
    }
  };

  // Auto-save form data when offline
  useEffect(() => {
    if (!isOnline) {
      saveCurrentData();
    }
  }, [formData, isOnline]);

  // Restore form data when coming back online
  useEffect(() => {
    if (hasBackup('provider_claim_form')) {
      const backupData = getFormData('provider_claim_form');
      const backupTreatments = getFormData('provider_treatments');
      if (backupData && window.confirm('Restore your previous form data?')) {
        setFormData({
          paCode: backupData.paCode || '',
          enrolleeId: backupData.enrolleeId || '',
          enrolleeName: backupData.enrolleeName || '',
          enrolleeGender: backupData.enrolleeGender || '',
          enrolleeAge: backupData.enrolleeAge || '',
          enrolleePhone: backupData.enrolleePhone || '',
          enrolleeCompany: backupData.enrolleeCompany || '',
          enrolleePlan: backupData.enrolleePlan || '',
          patientName: backupData.patientName || '',
          diagnosis: backupData.diagnosis || '',
          icd10Code: backupData.icd10Code || '',
          treatmentDate: backupData.treatmentDate || '',
          amount: backupData.amount || '',
          notes: backupData.notes || '',
          urgency: backupData.urgency || 'routine',
          treatmentPlan: backupData.treatmentPlan || ''
        });
        if (backupTreatments) {
          setTreatments(backupTreatments);
        }
        clearFormData('provider_claim_form');
        clearFormData('provider_treatments');
      }
    }
  }, [hasBackup, getFormData, clearFormData]);

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOnline) {
      saveCurrentData();
      alert('You are offline. Claim saved locally and will be submitted when connection is restored.');
      return;
    }

    // Simulate claim submission
    const newClaim = {
      id: `CLM-${Date.now()}`,
      patientName: formData.patientName,
      diagnosis: formData.diagnosis,
      amount: parseFloat(formData.amount),
      status: 'pending',
      submissionDate: new Date().toISOString().split('T')[0]
    };

    setClaims(prev => [newClaim, ...prev]);
    setFormData({
      paCode: '',
      enrolleeId: '',
      enrolleeName: '',
      enrolleeGender: '',
      enrolleeAge: '',
      enrolleePhone: '',
      enrolleeCompany: '',
      enrolleePlan: '',
      patientName: '',
      diagnosis: '',
      icd10Code: '',
      treatmentDate: '',
      amount: '',
      notes: '',
      urgency: 'routine',
      treatmentPlan: ''
    });
    setTreatments([{ id: '1', service: '', unitPrice: 0, quantity: 1, total: 0 }]);
    setUploadedFiles([]);
    
    // Clear any backup data after successful submission
    clearFormData('provider_claim_form');
    clearFormData('provider_treatments');
    alert('Claim submitted successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Building2 },
    { id: 'verification', label: 'Provider Verification', icon: UserCheck },
    { id: 'request-pa', label: 'Request PA Code', icon: FileText },
    { id: 'submit-claim', label: 'Submit Claim', icon: Upload },
    { id: 'pa-history', label: 'PA Code History', icon: History }
    { id: 'claim-history', label: 'Claim History', icon: FileText },
    { id: 'offline-mode', label: 'Offline Mode', icon: Wifi }
  ];

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Provider verification request submitted! Eagle HMO will review and contact you within 2-3 business days.');
  };

  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eagle-50 via-naija-50 to-gold-50">
      <OfflineBanner />
      
      // Update PA history to show claim was submitted
      setPaHistory(prev => prev.map(pa => 
        pa.id === claimData.paCode 
              <img 
                src="/ehl.jpeg" 
                alt="Eagle HMO Logo" 
                className="w-12 h-12 rounded-xl shadow-lg object-contain bg-white p-1"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-12 h-12 bg-gradient-to-br from-eagle-600 to-naija-600 rounded-xl flex items-center justify-center shadow-lg hidden">
                <Shield className="w-7 h-7 text-white" />
              </div>
      
      {/* Header */}
      <header className="bg-gradient-to-r from-white to-eagle-50/50 shadow-lg border-b border-eagle-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-eagle-600 to-naija-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-eagle-600 to-naija-600 bg-clip-text text-transparent">
                Provider Portal
              </h1>
              <p className="text-sm text-gold-600 font-medium">Healthcare on Eagle's Wing</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-eagle-600 transition-colors rounded-lg hover:bg-eagle-50">
              <Bell className="w-5 h-5" />
            </button>
            
            <button className="p-2 text-gray-400 hover:text-eagle-600 transition-colors rounded-lg hover:bg-eagle-50">
              <Settings className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gold-600">{user?.role}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-eagle-600 to-naija-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0) || 'P'}
                </span>
              </div>
            </div>
            
            <button 
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-eagle-100">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-eagle-100 to-naija-100 rounded-xl flex items-center justify-center">
                <User className="w-8 h-8 text-eagle-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h2>
                <p className="text-gray-600">Manage your claims and track submissions</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Verified Provider</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-lg mb-6 border border-eagle-100">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-eagle-600 text-eagle-700'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-eagle-50 to-eagle-100 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-eagle-600">Total Claims</p>
                          <p className="text-2xl font-bold text-eagle-700">{claims.length}</p>
                        </div>
                        <FileText className="w-8 h-8 text-eagle-600" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600">Approved</p>
                          <p className="text-2xl font-bold text-green-700">
                            {claims.filter(c => c.status === 'approved').length}
                          </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-600">Pending</p>
                          <p className="text-2xl font-bold text-yellow-700">
                            {claims.filter(c => c.status === 'pending').length}
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-600" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Claims</h3>
                    <div className="space-y-3">
                      {claims.slice(0, 3).map((claim) => (
                        <div key={claim.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{claim.patientName}</p>
                            <p className="text-sm text-gray-600">{claim.diagnosis}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">₦{claim.amount.toLocaleString()}</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                              {claim.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Request PA Code Tab */}
              {activeTab === 'request-pa' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Request PA Code</h3>
                  <div className="bg-eagle-50 border border-eagle-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-eagle-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-eagle-900">Prior Authorization Request</h4>
                        <p className="text-sm text-eagle-700 mt-1">
                          Submit patient information to request a PA code before treatment
                        </p>
                      </div>
                    </div>
                  </div>

                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Patient Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 focus:border-transparent"
                          placeholder="Enter patient full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enrollee ID *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 focus:border-transparent"
                          placeholder="Enter enrollee ID"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Proposed Diagnosis *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 focus:border-transparent"
                          placeholder="Enter proposed diagnosis"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ICD-10 Code
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 focus:border-transparent"
                          placeholder="e.g., B50.9"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estimated Treatment Cost (₦) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 focus:border-transparent"
                          placeholder="Enter estimated cost"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Urgency Level *
                        </label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 focus:border-transparent"
                        >
                          <option value="">Select urgency</option>
                          <option value="routine">Routine</option>
                          <option value="urgent">Urgent</option>
                          <option value="emergency">Emergency</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Treatment Plan Details *
                      </label>
                      <textarea
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 focus:border-transparent h-24 resize-none"
                        placeholder="Describe the proposed treatment plan and medical justification"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supporting Documents
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="hidden"
                          id="pa-file-upload"
                        />
                        <label htmlFor="pa-file-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Upload medical reports or supporting documents</p>
                          <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DOC files up to 10MB</p>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-eagle-600 to-naija-600 text-white py-3 rounded-lg hover:from-eagle-700 hover:to-naija-700 transition-all font-medium flex items-center justify-center space-x-2"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isOnline) {
                          alert('You are offline. PA request saved locally and will be submitted when connection is restored.');
                        } else {
                          alert(`PA Code Generated: PA-${Date.now()}\n\nThis code has been sent to the HMO for processing.`);
                        }
                      }}
                    >
                      <FileText className="w-4 h-4" />
                      <span>{isOnline ? 'Request PA Code' : 'Save PA Request (Offline)'}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Submit Claim Tab */}
              {activeTab === 'submit-claim' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit New Claim</h3>
                  
                  {/* PA Code Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">PA Code Required</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Enter the PA code you received from Eagle HMO before submitting your claim
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitClaim} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PA Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.paCode}
                          onChange={(e) => setFormData({ ...formData, paCode: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 focus:border-transparent"
                          placeholder="Enter PA code (e.g., PA-1736789456789-123)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enrollee ID *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={formData.enrolleeId}
                            onChange={(e) => handleEnrolleeIdChange(e.target.value)}
                            onFocus={() => formData.enrolleeId && setShowDropdown(true)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 focus:border-transparent"
                            placeholder="Enter enrollee ID"
                          />
                          
                          {showDropdown && filteredEnrollees.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {filteredEnrollees.map((enrollee) => (
                                <div
                                  key={enrollee.id}
                                  onClick={() => selectEnrollee(enrollee)}
                                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium text-gray-900">{enrollee.name}</p>
                                      <p className="text-sm text-gray-600">{enrollee.id} • {enrollee.gender}, {enrollee.age}y</p>
                                      <p className="text-xs text-gray-500">{enrollee.company}</p>
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
                          Patient Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.patientName}
                          onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 focus:border-transparent"
                          placeholder="Enter patient name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ICD-10 Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.icd10Code}
                          onChange={(e) => handleICD10Change(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 focus:border-transparent"
                          placeholder="e.g., B50.9"
                          list="claim-icd10-list"
                        />
                        <datalist id="claim-icd10-list">
                          {commonICD10Codes.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.code} - {item.description}
                            </option>
                          ))}
                        </datalist>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Diagnosis *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.diagnosis}
                          onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 focus:border-transparent"
                          placeholder="Auto-populated from ICD-10 or enter manually"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Encounter Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.treatmentDate}
                          onChange={(e) => setFormData({ ...formData, treatmentDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Treatment Items Section */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Treatment Items</h3>
                        <button
                          type="button"
                          onClick={addTreatment}
                          className="flex items-center space-x-2 px-3 py-2 bg-eagle-600 text-white rounded-lg hover:bg-eagle-700 transition-colors text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Item</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {treatments.map((treatment, index) => (
                          <div key={treatment.id} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Service/Treatment *
                                </label>
                                <select
                                  value={treatment.service}
                                  onChange={(e) => updateTreatment(treatment.id, 'service', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 focus:border-transparent"
                                  required
                                >
                                  <option value="">Select service</option>
                                  {commonServices.map((service) => (
                                    <option key={service} value={service}>{service}</option>
                                  ))}
                                  <option value="Other">Other (specify in notes)</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Unit Price (₦) *
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={treatment.unitPrice || ''}
                                  onChange={(e) => updateTreatment(treatment.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 focus:border-transparent"
                                  placeholder="0.00"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Quantity *
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={treatment.quantity}
                                  onChange={(e) => updateTreatment(treatment.id, 'quantity', parseInt(e.target.value) || 1)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 focus:border-transparent"
                                  required
                                />
                              </div>

                              <div className="flex items-center space-x-2">
                                <div className="flex-1">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total (₦)
                                  </label>
                                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 font-medium">
                                    ₦{treatment.total.toLocaleString()}
                                  </div>
                                </div>
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
                      </div>

                      {/* Total Summary */}
                      <div className="bg-eagle-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Calculator className="w-5 h-5 text-eagle-600" />
                            <span className="text-lg font-medium text-gray-900">Total Claim Amount</span>
                          </div>
                          <span className="text-2xl font-bold text-eagle-700">
                            ₦{getTotalAmount().toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 focus:border-transparent h-24 resize-none"
                        placeholder="Enter any additional notes about the claim"
                      />
                    </div>

                    {/* File Upload for Claims */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supporting Documents
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="claim-file-upload"
                        />
                        <label htmlFor="claim-file-upload" className="cursor-pointer">
                          <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Upload medical reports, receipts, or supporting documents</p>
                          <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DOC files up to 10MB</p>
                        </label>
                      </div>
                      
                      {uploadedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!formData.paCode || !formData.enrolleeId || treatments.some(t => !t.service || t.unitPrice <= 0)}
                      className="w-full bg-gradient-to-r from-eagle-600 to-naija-600 text-white py-3 rounded-lg hover:from-eagle-700 hover:to-naija-700 transition-all font-medium flex items-center justify-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isOnline ? 'Submit Claim' : 'Save Offline'}</span>
                    </button>
                    
                    {(!formData.paCode || !formData.enrolleeId) && (
                      <p className="text-sm text-red-600 text-center">PA Code and Enrollee ID are required before submission</p>
                    )}
                  </form>
                </div>
              )}

              {/* Claim History Tab */}
              {activeTab === 'claim-history' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim History</h3>
                  <div className="space-y-4">
                    {claims.map((claim) => (
                      <div key={claim.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{claim.patientName}</h4>
                            <p className="text-sm text-gray-600">{claim.diagnosis}</p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                            {claim.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Claim ID</p>
                            <p className="font-medium text-gray-900">{claim.id}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Amount</p>
                            <p className="font-medium text-gray-900">₦{claim.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Submission Date</p>
                            <p className="font-medium text-gray-900">{claim.submissionDate}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Offline Mode Tab */}
              {activeTab === 'offline-mode' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Offline Mode Management</h3>
                    <p className="text-gray-600">Control your connection mode and manage offline data</p>
                  </div>

                  {/* Current Status */}
                  <div className={`rounded-lg border p-6 ${
                    isOnline ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                          {isOnline ? (
                            <Wifi className="w-8 h-8 text-green-600" />
                          ) : (
                            <WifiOff className="w-8 h-8 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h2 className={`text-xl font-bold ${isOnline ? 'text-green-800' : 'text-red-800'}`}>
                            {isOnline ? 'Online Mode' : 'Offline Mode'}
                          </h2>
                          <p className={`${isOnline ? 'text-green-700' : 'text-red-700'}`}>
                            {isOnline
                              ? 'Connected to Eagle HMO servers. Claims submit in real-time.'
                              : 'No connection. Claims will be saved locally and submitted when online.'
                            }
                          </p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full ${
                        isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                      }`}></div>
                    </div>

                    {lastOnlineTime && (
                      <div className={`flex items-center space-x-2 text-sm ${
                        isOnline ? 'text-green-700' : 'text-red-700'
                      } opacity-75`}>
                        <Clock className="w-4 h-4" />
                        <span>Last online: {new Date(lastOnlineTime).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Mode Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Online Mode */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Wifi className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Online Mode</h4>
                          <p className="text-sm text-gray-600">Real-time claim submission</p>
                        </div>
                      </div>
                      
                      <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Instant claim submission</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Real-time status updates</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Live notifications</span>
                        </li>
                      </ul>
                      
                      <button
                        onClick={setOnlineMode}
                        disabled={isOnline && !isManualOffline}
                        className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                          isOnline && !isManualOffline
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700 shadow-lg transform hover:scale-[1.02]'
                        }`}
                      >
                        <Wifi className="w-5 h-5" />
                        <span>{isOnline && !isManualOffline ? 'Currently Online' : 'Switch to Online'}</span>
                      </button>
                    </div>

                    {/* Offline Mode */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <WifiOff className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Offline Mode</h4>
                          <p className="text-sm text-gray-600">Local storage and sync later</p>
                        </div>
                      </div>
                      
                      <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        <li className="flex items-center space-x-2">
                          <Database className="w-4 h-4 text-orange-600" />
                          <span>Local claim storage</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Sync className="w-4 h-4 text-orange-600" />
                          <span>Auto-sync when online</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          <span>Limited functionality</span>
                        </li>
                      </ul>
                      
                      <button
                        onClick={setOfflineMode}
                        disabled={!isOnline}
                        className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                          !isOnline
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg transform hover:scale-[1.02]'
                        }`}
                      >
                        <WifiOff className="w-5 h-5" />
                        <span>{!isOnline ? 'Currently Offline' : 'Switch to Offline'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Backup Data Management */}
                  {getAllBackups().length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Saved Claim Data</h3>
                        <button
                          onClick={() => {
                            if (window.confirm('Clear all saved claim data?')) {
                              getAllBackups().forEach(backup => clearFormData(backup));
                              window.location.reload();
                            }
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Clear All
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {getAllBackups().map((backupKey) => {
                          const backupData = getFormData(backupKey);
                          return (
                            <div key={backupKey} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {backupKey.replace('_', ' ').toUpperCase()}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Saved: {backupData ? new Date(backupData.timestamp).toLocaleString() : 'Unknown'}
                                  </p>
                                  {backupData?.patientName && (
                                    <p className="text-xs text-gray-500">
                                      Patient: {backupData.patientName}
                                    </p>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => {
                                      if (backupData && window.confirm('Restore this claim data?')) {
                                        setFormData({
                                          claimId: backupData.claimId || '',
                                          patientName: backupData.patientName || '',
                                          diagnosis: backupData.diagnosis || '',
                                          treatmentDate: backupData.treatmentDate || '',
                                          amount: backupData.amount || '',
                                          notes: backupData.notes || ''
                                        });
                                        setActiveTab('submit-claim');
                                        clearFormData(backupKey);
                                      }
                                    }}
                                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                  >
                                    Restore
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Delete this backup?')) {
                                        clearFormData(backupKey);
                                        window.location.reload();
                                      }
                                    }}
                                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Network Information */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <Power className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-800">Network Status</span>
                        </div>
                        <p className={`text-lg font-bold ${navigator.onLine ? 'text-green-600' : 'text-red-600'}`}>
                          {navigator.onLine ? 'Connected' : 'Disconnected'}
                        </p>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <Settings className="w-5 h-5 text-purple-600" />
                          <span className="font-medium text-purple-800">Current Mode</span>
                        </div>
                        <p className="text-lg font-bold text-purple-600">
                          {isManualOffline ? 'Manual Offline' : (navigator.onLine ? 'Online' : 'Auto Offline')}
                        </p>
                      </div>
                      
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <Database className="w-5 h-5 text-yellow-600" />
                          <span className="font-medium text-yellow-800">Saved Claims</span>
                        </div>
                        <p className="text-lg font-bold text-yellow-600">
                          {getAllBackups().length} {getAllBackups().length === 1 ? 'Item' : 'Items'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* How It Works for Providers */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works for Providers</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Automatic Detection</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                            <span>When internet goes down, automatically saves your claim forms</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Database className="w-4 h-4 text-blue-500 mt-0.5" />
                            <span>All claim data is safely stored in your browser</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Sync className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>When internet returns, manually submit your saved claims</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Manual Control</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-start space-x-2">
                            <Power className="w-4 h-4 text-orange-500 mt-0.5" />
                            <span>Switch to offline mode anytime using the buttons above</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Your preference is remembered for future sessions</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                            <span>Switch back to online mode when ready to submit claims</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderPortal;