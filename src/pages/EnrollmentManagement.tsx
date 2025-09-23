import React, { useState } from 'react';
import { Users, Upload, Search, Edit3, Trash2, Download, Plus, FileText, CheckCircle, XCircle, AlertTriangle, Eye, Save, X, Filter, Calendar, Building2, Phone, Mail, CreditCard, UserPlus } from 'lucide-react';
import { useOffline } from '../contexts/OfflineContext';

interface Enrollee {
  id: string;
  name: string;
  nhiaNumber: string;
  bvn: string;
  gender: 'Male' | 'Female';
  age: number;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  company: string;
  plan: 'Bronze' | 'Silver' | 'Gold';
  status: 'active' | 'pending' | 'inactive';
  effectiveDate: string;
  expirationDate: string;
  validationStatus: 'pending' | 'approved' | 'rejected';
  validatedBy?: string;
  validationDate?: string;
  validationNotes?: string;
}

const EnrollmentManagement: React.FC = () => {
  const { isOnline, saveFormData } = useOffline();
  const [activeTab, setActiveTab] = useState('search');
  const [enrollees, setEnrollees] = useState<Enrollee[]>([
    {
      id: 'ENR-2025-1001',
      name: 'Adebayo Olumide',
      nhiaNumber: 'NHIA-123456789',
      bvn: '12345678901',
      gender: 'Male',
      age: 39,
      dateOfBirth: '1985-03-15',
      phone: '+234-801-234-5678',
      email: 'adebayo.olumide@zenithbank.com',
      address: '123 Victoria Island, Lagos',
      company: 'Zenith Bank Plc',
      plan: 'Gold',
      status: 'active',
      effectiveDate: '2024-01-01',
      expirationDate: '2024-12-31',
      validationStatus: 'approved',
      validatedBy: 'Emmanuel Onifade',
      validationDate: '2024-01-01',
      validationNotes: 'All documents verified'
    },
    {
      id: 'ENR-2025-1002',
      name: 'Fatima Abubakar',
      nhiaNumber: 'NHIA-987654321',
      bvn: '10987654321',
      gender: 'Female',
      age: 34,
      dateOfBirth: '1990-07-22',
      phone: '+234-802-345-6789',
      email: 'fatima.abubakar@nnpc.gov.ng',
      address: '456 Garki District, Abuja',
      company: 'Nigerian National Petroleum Corporation',
      plan: 'Silver',
      status: 'pending',
      effectiveDate: '2025-01-01',
      expirationDate: '2025-12-31',
      validationStatus: 'pending',
      validationNotes: 'Awaiting HR confirmation'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnrollees, setSelectedEnrollees] = useState<string[]>([]);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showEditForm, setShowEditForm] = useState<Enrollee | null>(null);
  const [showValidationForm, setShowValidationForm] = useState<Enrollee | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    plan: 'all',
    company: 'all',
    validationStatus: 'all'
  });

  const tabs = [
    { id: 'search', label: 'Search & Manage', icon: Search },
    { id: 'validation', label: 'Human Validation', icon: CheckCircle },
    { id: 'bulk', label: 'Bulk Upload', icon: Upload },
    { id: 'benefits', label: 'Benefits Upload', icon: CreditCard },
    { id: 'cards', label: 'Generate E-Cards', icon: FileText }
  ];

  const companies = [
    'Zenith Bank Plc',
    'Nigerian National Petroleum Corporation',
    'Access Bank Plc',
    'MTN Nigeria',
    'First Bank of Nigeria',
    'Dangote Cement Plc'
  ];

  const filteredEnrollees = enrollees.filter(enrollee => {
    const matchesSearch = enrollee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         enrollee.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         enrollee.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || enrollee.status === filters.status;
    const matchesPlan = filters.plan === 'all' || enrollee.plan === filters.plan;
    const matchesCompany = filters.company === 'all' || enrollee.company === filters.company;
    const matchesValidation = filters.validationStatus === 'all' || enrollee.validationStatus === filters.validationStatus;
    
    return matchesSearch && matchesStatus && matchesPlan && matchesCompany && matchesValidation;
  });

  const handleSelectEnrollee = (enrolleeId: string) => {
    setSelectedEnrollees(prev => 
      prev.includes(enrolleeId) 
        ? prev.filter(id => id !== enrolleeId)
        : [...prev, enrolleeId]
    );
  };

  const handleBulkAction = (action: 'delete' | 'deactivate' | 'reactivate') => {
    if (selectedEnrollees.length === 0) {
      alert('Please select enrollees first');
      return;
    }

    const actionText = action === 'delete' ? 'delete' : action === 'deactivate' ? 'deactivate' : 'reactivate';
    const confirmMessage = `Are you sure you want to ${actionText} ${selectedEnrollees.length} enrollee(s)?`;
    
    if (confirm(confirmMessage)) {
      setEnrollees(prev => prev.map(enrollee => {
        if (selectedEnrollees.includes(enrollee.id)) {
          if (action === 'delete') {
            // In real app, this would archive the record
            return { ...enrollee, status: 'inactive' as const, validationNotes: 'Deleted by admin' };
          } else if (action === 'deactivate') {
            return { ...enrollee, status: 'inactive' as const };
          } else {
            return { ...enrollee, status: 'active' as const };
          }
        }
        return enrollee;
      }));
      setSelectedEnrollees([]);
      alert(`${selectedEnrollees.length} enrollee(s) ${actionText}d successfully`);
    }
  };

  const handleValidateEnrollee = (enrollee: Enrollee, status: 'approved' | 'rejected', notes: string) => {
    setEnrollees(prev => prev.map(e => 
      e.id === enrollee.id 
        ? { 
            ...e, 
            validationStatus: status,
            validatedBy: 'Current Officer',
            validationDate: new Date().toISOString().split('T')[0],
            validationNotes: notes,
            status: status === 'approved' ? 'active' : 'inactive'
          }
        : e
    ));
    setShowValidationForm(null);
    alert(`Enrollee ${status} successfully!`);
  };

  const generateECard = (enrollee: Enrollee) => {
    alert(`E-Card generated for ${enrollee.name}!\n\nDigital card sent to: ${enrollee.email}\nQR Code: ${enrollee.id}-${Date.now()}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getValidationColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enrollment Management</h1>
          <p className="text-gray-600 mt-1">Comprehensive enrollee management and validation system</p>
        </div>
        <div className="flex items-center space-x-3">
          {!isOnline && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm">Offline Mode</span>
            </div>
          )}
          <button
            onClick={() => setShowBulkUpload(true)}
            className="bg-eagle-600 text-white px-4 py-2 rounded-lg hover:bg-eagle-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Upload</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Enrollees</p>
              <p className="text-2xl font-bold text-gray-900">{enrollees.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {enrollees.filter(e => e.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Validation</p>
              <p className="text-2xl font-bold text-yellow-600">
                {enrollees.filter(e => e.validationStatus === 'pending').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-red-600">
                {enrollees.filter(e => e.status === 'inactive').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm">
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
          {/* Search & Manage Tab */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                      placeholder="Search by name, ID, or company..."
                    />
                  </div>
                </div>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>

                <select
                  value={filters.plan}
                  onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                >
                  <option value="all">All Plans</option>
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>

                <select
                  value={filters.validationStatus}
                  onChange={(e) => setFilters({ ...filters, validationStatus: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                >
                  <option value="all">All Validation</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Bulk Actions */}
              {selectedEnrollees.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">
                      {selectedEnrollees.length} enrollee(s) selected
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBulkAction('reactivate')}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Reactivate
                      </button>
                      <button
                        onClick={() => handleBulkAction('deactivate')}
                        className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                      >
                        Deactivate
                      </button>
                      <button
                        onClick={() => handleBulkAction('delete')}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Enrollees Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEnrollees(filteredEnrollees.map(e => e.id));
                            } else {
                              setSelectedEnrollees([]);
                            }
                          }}
                          className="rounded border-gray-300 text-eagle-600"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Enrollee Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Company & Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Validation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEnrollees.map((enrollee) => (
                      <tr key={enrollee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedEnrollees.includes(enrollee.id)}
                            onChange={() => handleSelectEnrollee(enrollee.id)}
                            className="rounded border-gray-300 text-eagle-600"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{enrollee.name}</p>
                            <p className="text-sm text-gray-600">{enrollee.id}</p>
                            <p className="text-xs text-gray-500">{enrollee.gender}, {enrollee.age}y</p>
                            <p className="text-xs text-gray-500">{enrollee.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{enrollee.company}</p>
                            <p className="text-sm text-gray-600">{enrollee.plan} Plan</p>
                            <p className="text-xs text-gray-500">{enrollee.effectiveDate} - {enrollee.expirationDate}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollee.status)}`}>
                            {enrollee.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getValidationColor(enrollee.validationStatus)}`}>
                              {enrollee.validationStatus.toUpperCase()}
                            </span>
                            {enrollee.validatedBy && (
                              <p className="text-xs text-gray-500 mt-1">By: {enrollee.validatedBy}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setShowEditForm(enrollee)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {enrollee.validationStatus === 'pending' && (
                              <button
                                onClick={() => setShowValidationForm(enrollee)}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Validate"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => generateECard(enrollee)}
                              className="p-1 text-purple-600 hover:text-purple-800"
                              title="Generate E-Card"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Human Validation Tab */}
          {activeTab === 'validation' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Pending Validation</p>
                    <p className="text-xs text-yellow-700">
                      {enrollees.filter(e => e.validationStatus === 'pending').length} enrollees require validation
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {enrollees.filter(e => e.validationStatus === 'pending').map((enrollee) => (
                  <div key={enrollee.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{enrollee.name}</h3>
                        <p className="text-gray-600">{enrollee.id} • {enrollee.company}</p>
                        <p className="text-sm text-gray-500">{enrollee.gender}, {enrollee.age}y • {enrollee.plan} Plan</p>
                      </div>
                      <button
                        onClick={() => setShowValidationForm(enrollee)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Review & Validate
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">NHIA Number:</p>
                        <p className="font-medium text-gray-900">{enrollee.nhiaNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">BVN:</p>
                        <p className="font-medium text-gray-900">{enrollee.bvn}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Phone:</p>
                        <p className="font-medium text-gray-900">{enrollee.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bulk Upload Tab */}
          {activeTab === 'bulk' && (
            <div className="space-y-6">
              <div className="text-center">
                <Upload className="w-16 h-16 text-eagle-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bulk Enrollee Upload</h2>
                <p className="text-gray-600">Upload multiple enrollees via CSV/Excel file</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Upload Instructions</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• CSV file with columns: Name, NHIA Number, BVN, Gender, DOB, Phone, Email, Address, Company, Plan</li>
                  <li>• System will auto-generate unique IDs starting from ENR-2025-{enrollees.length + 1}</li>
                  <li>• All enrollees will have "Pending Activation" status until payment processed</li>
                  <li>• Existing enrollees will be updated, new ones will be created</li>
                </ul>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  id="bulk-upload"
                />
                <label htmlFor="bulk-upload" className="cursor-pointer">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600 mb-2">Upload CSV/Excel File</p>
                  <p className="text-sm text-gray-500">Click to select file or drag and drop</p>
                </label>
              </div>

              <div className="flex justify-center">
                <button className="bg-eagle-600 text-white px-6 py-3 rounded-lg hover:bg-eagle-700 transition-colors">
                  Process Upload
                </button>
              </div>
            </div>
          )}

          {/* Benefits Upload Tab */}
          {activeTab === 'benefits' && (
            <div className="space-y-6">
              <div className="text-center">
                <CreditCard className="w-16 h-16 text-naija-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Enrollee Benefits</h2>
                <p className="text-gray-600">Manage coverage limits and co-pays per enrollee</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-3">Benefits Upload Process</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Upload benefits data via CSV with columns: Enrollee ID, Service Type, Coverage Limit, Copay</li>
                  <li>• System will link benefits to specific plans automatically</li>
                  <li>• Real-time database updates with immediate effect</li>
                  <li>• Enrollees will be notified via email/SMS of benefit changes</li>
                </ul>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-2">Upload Benefits CSV</p>
                <p className="text-sm text-gray-500">Select benefits configuration file</p>
              </div>
            </div>
          )}

          {/* Generate E-Cards Tab */}
          {activeTab === 'cards' && (
            <div className="space-y-6">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gold-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate E-Cards</h2>
                <p className="text-gray-600">Create digital enrollment cards for members</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Bulk E-Card Generation</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Generate e-cards for all active enrollees or selected groups
                  </p>
                  <div className="space-y-3">
                    <button className="w-full bg-eagle-600 text-white py-2 rounded-lg hover:bg-eagle-700 transition-colors">
                      Generate All Active E-Cards
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Generate by Company
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Individual E-Card</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Generate e-card for specific enrollee
                  </p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter Enrollee ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                    />
                    <button className="w-full bg-naija-600 text-white py-2 rounded-lg hover:bg-naija-700 transition-colors">
                      Generate E-Card
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Edit Enrollee</h2>
                <button
                  onClick={() => setShowEditForm(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={showEditForm.name}
                    onChange={(e) => setShowEditForm({ ...showEditForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={showEditForm.phone}
                    onChange={(e) => setShowEditForm({ ...showEditForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={showEditForm.email}
                    onChange={(e) => setShowEditForm({ ...showEditForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
                  <select
                    value={showEditForm.plan}
                    onChange={(e) => setShowEditForm({ ...showEditForm, plan: e.target.value as 'Bronze' | 'Silver' | 'Gold' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={showEditForm.address}
                  onChange={(e) => setShowEditForm({ ...showEditForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 h-20 resize-none"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEditForm(null)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setEnrollees(prev => prev.map(e => e.id === showEditForm.id ? showEditForm : e));
                    setShowEditForm(null);
                    alert('Enrollee updated successfully!');
                  }}
                  className="flex-1 bg-eagle-600 text-white py-2 rounded-lg hover:bg-eagle-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Form Modal */}
      {showValidationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Validate Enrollee</h2>
              <p className="text-gray-600">{showValidationForm.name} ({showValidationForm.id})</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>NHIA:</strong> {showValidationForm.nhiaNumber}</p>
                  <p><strong>BVN:</strong> {showValidationForm.bvn}</p>
                  <p><strong>Company:</strong> {showValidationForm.company}</p>
                </div>
                <div>
                  <p><strong>Phone:</strong> {showValidationForm.phone}</p>
                  <p><strong>Email:</strong> {showValidationForm.email}</p>
                  <p><strong>Plan:</strong> {showValidationForm.plan}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Validation Notes</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 h-20 resize-none"
                  placeholder="Enter validation notes..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowValidationForm(null)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleValidateEnrollee(showValidationForm, 'rejected', 'Rejected after review')}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleValidateEnrollee(showValidationForm, 'approved', 'Approved after validation')}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentManagement;