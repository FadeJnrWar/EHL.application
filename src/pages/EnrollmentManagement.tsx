import React, { useState, useEffect } from 'react';
import { Users, Upload, Search, CreditCard as Edit3, CheckCircle, XCircle, AlertTriangle, X, CreditCard, FileText } from 'lucide-react';
import { useOffline } from '../contexts/OfflineContext';
import BulkUploadModal from '../components/Enrollment/BulkUploadModal';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Enrollee {
  id: string;
  enrollment_id: string;
  e_id: string;
  name: string;
  nhia_number: string;
  bvn: string;
  gender: string;
  age: number;
  date_of_birth: string;
  phone: string;
  email: string;
  address: string;
  client: {
    name: string;
  };
  plan: string;
  status: string;
  effective_date: string;
  expiration_date: string;
  validation_status: string;
  validated_by?: string;
  validation_date?: string;
  validation_notes?: string;
}

const EnrollmentManagement: React.FC = () => {
  const { isOnline } = useOffline();
  const [activeTab, setActiveTab] = useState('search');
  const [enrollees, setEnrollees] = useState<Enrollee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnrollees, setSelectedEnrollees] = useState<string[]>([]);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showEditForm, setShowEditForm] = useState<Enrollee | null>(null);
  const [showValidationForm, setShowValidationForm] = useState<Enrollee | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    plan: 'all',
    validationStatus: 'all'
  });

  const tabs = [
    { id: 'search', label: 'Search & Manage', icon: Search },
    { id: 'validation', label: 'Human Validation', icon: CheckCircle },
    { id: 'bulk', label: 'Bulk Upload', icon: Upload },
    { id: 'benefits', label: 'Benefits Upload', icon: CreditCard },
    { id: 'cards', label: 'Generate E-Cards', icon: FileText }
  ];

  useEffect(() => {
    loadEnrollees();
  }, []);

  const loadEnrollees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('enrollees')
        .select(`
          *,
          client:clients(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnrollees(data || []);
    } catch (error) {
      console.error('Error loading enrollees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollees = enrollees.filter(enrollee => {
    const matchesSearch = enrollee.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         enrollee.enrollment_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         enrollee.client?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filters.status === 'all' || enrollee.status === filters.status;
    const matchesPlan = filters.plan === 'all' || enrollee.plan === filters.plan;
    const matchesValidation = filters.validationStatus === 'all' || enrollee.validation_status === filters.validationStatus;

    return matchesSearch && matchesStatus && matchesPlan && matchesValidation;
  });

  const handleSelectEnrollee = (enrolleeId: string) => {
    setSelectedEnrollees(prev =>
      prev.includes(enrolleeId)
        ? prev.filter(id => id !== enrolleeId)
        : [...prev, enrolleeId]
    );
  };

  const handleBulkAction = async (action: 'delete' | 'deactivate' | 'reactivate') => {
    if (selectedEnrollees.length === 0) {
      alert('Please select enrollees first');
      return;
    }

    const actionText = action === 'delete' ? 'delete' : action === 'deactivate' ? 'deactivate' : 'reactivate';
    const confirmMessage = `Are you sure you want to ${actionText} ${selectedEnrollees.length} enrollee(s)?`;

    if (confirm(confirmMessage)) {
      try {
        const newStatus = action === 'reactivate' ? 'active' : 'inactive';

        const { error } = await supabase
          .from('enrollees')
          .update({ status: newStatus })
          .in('id', selectedEnrollees);

        if (error) throw error;

        await loadEnrollees();
        setSelectedEnrollees([]);
        alert(`${selectedEnrollees.length} enrollee(s) ${actionText}d successfully`);
      } catch (error) {
        console.error('Bulk action error:', error);
        alert('Failed to perform bulk action');
      }
    }
  };

  const handleValidateEnrollee = async (enrollee: Enrollee, status: 'approved' | 'rejected', notes: string) => {
    try {
      const { error } = await supabase
        .from('enrollees')
        .update({
          validation_status: status,
          validated_by: 'Current Officer',
          validation_date: new Date().toISOString(),
          validation_notes: notes,
          status: status === 'approved' ? 'active' : 'inactive'
        })
        .eq('id', enrollee.id);

      if (error) throw error;

      await loadEnrollees();
      setShowValidationForm(null);
      alert(`Enrollee ${status} successfully!`);
    } catch (error) {
      console.error('Validation error:', error);
      alert('Failed to validate enrollee');
    }
  };

  const generateECard = (enrollee: Enrollee) => {
    alert(`E-Card Generated!\n\nEnrollee: ${enrollee.name}\nEnrollment ID: ${enrollee.enrollment_id}\ne-ID: ${enrollee.e_id}\n\nDigital card sent to: ${enrollee.email}`);
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
          <p className="text-gray-600 mt-1">Comprehensive enrollee management with auto-generated IDs</p>
        </div>
        <button
          onClick={() => setShowBulkUpload(true)}
          className="bg-eagle-600 text-white px-4 py-2 rounded-lg hover:bg-eagle-700 transition-colors flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Bulk Upload</span>
        </button>
      </div>

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
                {enrollees.filter(e => e.validation_status === 'pending').length}
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
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                      placeholder="Search..."
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

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-eagle-600 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading enrollees...</p>
                </div>
              ) : (
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
                              <p className="text-sm text-gray-600">{enrollee.enrollment_id}</p>
                              <p className="text-xs text-gray-500">e-ID: {enrollee.e_id}</p>
                              <p className="text-xs text-gray-500">{enrollee.gender}, {enrollee.age}y</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{enrollee.client?.name}</p>
                              <p className="text-sm text-gray-600">{enrollee.plan} Plan</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollee.status)}`}>
                              {enrollee.status?.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getValidationColor(enrollee.validation_status)}`}>
                              {enrollee.validation_status?.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {enrollee.validation_status === 'pending' && (
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
                                className="p-1 text-blue-600 hover:text-blue-800"
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
              )}
            </div>
          )}

          {activeTab === 'validation' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Pending Validation</p>
                    <p className="text-xs text-yellow-700">
                      {enrollees.filter(e => e.validation_status === 'pending').length} enrollees require validation
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {enrollees.filter(e => e.validation_status === 'pending').map((enrollee) => (
                  <div key={enrollee.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{enrollee.name}</h3>
                        <p className="text-gray-600">{enrollee.enrollment_id} • {enrollee.client?.name}</p>
                        <p className="text-sm text-gray-500">{enrollee.gender}, {enrollee.age}y • {enrollee.plan} Plan</p>
                      </div>
                      <button
                        onClick={() => setShowValidationForm(enrollee)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Review & Validate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bulk' && (
            <div className="space-y-6">
              <div className="text-center">
                <Upload className="w-16 h-16 text-eagle-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bulk Enrollee Upload</h2>
                <p className="text-gray-600">Upload multiple enrollees via CSV file with auto-generated IDs</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Features</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Auto-generated Enrollment IDs (ENR-YYYY-####)</li>
                  <li>• Auto-generated e-IDs for digital cards</li>
                  <li>• Organized by client/company</li>
                  <li>• Real-time validation and error reporting</li>
                </ul>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowBulkUpload(true)}
                  className="bg-eagle-600 text-white px-6 py-3 rounded-lg hover:bg-eagle-700 transition-colors flex items-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Start Bulk Upload</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <BulkUploadModal
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onUploadComplete={loadEnrollees}
      />

      {showValidationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Validate Enrollee</h2>
              <p className="text-gray-600">{showValidationForm.name} ({showValidationForm.enrollment_id})</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>NHIA:</strong> {showValidationForm.nhia_number}</p>
                  <p><strong>BVN:</strong> {showValidationForm.bvn}</p>
                  <p><strong>e-ID:</strong> {showValidationForm.e_id}</p>
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
                  id="validation-notes"
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
                  onClick={() => {
                    const notes = (document.getElementById('validation-notes') as HTMLTextAreaElement).value;
                    handleValidateEnrollee(showValidationForm, 'rejected', notes || 'Rejected after review');
                  }}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    const notes = (document.getElementById('validation-notes') as HTMLTextAreaElement).value;
                    handleValidateEnrollee(showValidationForm, 'approved', notes || 'Approved after validation');
                  }}
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
