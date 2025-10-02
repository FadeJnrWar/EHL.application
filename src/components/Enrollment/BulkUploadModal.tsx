import React, { useState, useEffect } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle, Download, Building2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Client {
  id: string;
  client_code: string;
  name: string;
}

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

interface ParsedEnrollee {
  name: string;
  nhia_number?: string;
  bvn?: string;
  gender: string;
  date_of_birth: string;
  phone?: string;
  email?: string;
  address?: string;
  plan: string;
  effective_date?: string;
  expiration_date?: string;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose, onUploadComplete }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [uploadResult, setUploadResult] = useState<{
    total: number;
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadClients();
    }
  }, [isOpen]);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, client_code, name')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus('idle');
      setUploadResult(null);
    }
  };

  const parseCSV = (text: string): ParsedEnrollee[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const enrollees: ParsedEnrollee[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const enrollee: any = {};

      headers.forEach((header, index) => {
        const value = values[index] || '';

        if (header.includes('name')) enrollee.name = value;
        else if (header.includes('nhia')) enrollee.nhia_number = value;
        else if (header.includes('bvn')) enrollee.bvn = value;
        else if (header.includes('gender')) enrollee.gender = value;
        else if (header.includes('dob') || header.includes('birth')) enrollee.date_of_birth = value;
        else if (header.includes('phone')) enrollee.phone = value;
        else if (header.includes('email')) enrollee.email = value;
        else if (header.includes('address')) enrollee.address = value;
        else if (header.includes('plan')) enrollee.plan = value;
        else if (header.includes('effective')) enrollee.effective_date = value;
        else if (header.includes('expiration')) enrollee.expiration_date = value;
      });

      if (enrollee.name && enrollee.date_of_birth) {
        if (!enrollee.plan) enrollee.plan = 'Bronze';
        if (!enrollee.gender) enrollee.gender = 'Other';

        const birthDate = new Date(enrollee.date_of_birth);
        const today = new Date();
        enrollee.age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

        enrollees.push(enrollee);
      }
    }

    return enrollees;
  };

  const handleUpload = async () => {
    if (!file || !selectedClient) {
      alert('Please select a client and file');
      return;
    }

    setIsUploading(true);
    setUploadStatus('processing');

    try {
      const text = await file.text();
      const enrollees = parseCSV(text);

      if (enrollees.length === 0) {
        throw new Error('No valid enrollees found in file. Please check the format.');
      }

      const uploadRecord = await supabase
        .from('bulk_uploads')
        .insert({
          client_id: selectedClient,
          uploaded_by: 'Current User',
          file_name: file.name,
          total_records: enrollees.length,
          status: 'processing'
        })
        .select()
        .single();

      if (uploadRecord.error) throw uploadRecord.error;

      let successful = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const enrollee of enrollees) {
        try {
          const { error } = await supabase
            .from('enrollees')
            .insert({
              ...enrollee,
              client_id: selectedClient,
              status: 'pending',
              validation_status: 'pending'
            });

          if (error) {
            failed++;
            errors.push(`${enrollee.name}: ${error.message}`);
          } else {
            successful++;
          }
        } catch (err: any) {
          failed++;
          errors.push(`${enrollee.name}: ${err.message}`);
        }
      }

      await supabase
        .from('bulk_uploads')
        .update({
          successful_records: successful,
          failed_records: failed,
          status: failed === 0 ? 'completed' : 'completed',
          error_log: errors
        })
        .eq('id', uploadRecord.data.id);

      setUploadResult({
        total: enrollees.length,
        successful,
        failed,
        errors: errors.slice(0, 10)
      });

      setUploadStatus('success');
      onUploadComplete();
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setUploadResult({
        total: 0,
        successful: 0,
        failed: 0,
        errors: [error.message]
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = 'Name,NHIA Number,BVN,Gender,Date of Birth,Phone,Email,Address,Plan,Effective Date,Expiration Date\n' +
      'John Doe,NHIA-123456789,12345678901,Male,1985-01-15,+234-801-234-5678,john.doe@example.com,123 Main St Lagos,Gold,2025-01-01,2025-12-31\n' +
      'Jane Smith,NHIA-987654321,10987654321,Female,1990-06-20,+234-802-345-6789,jane.smith@example.com,456 Park Ave Abuja,Silver,2025-01-01,2025-12-31';

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enrollment_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Upload className="w-6 h-6 text-eagle-600" />
              <h2 className="text-xl font-semibold text-gray-900">Bulk Enrollee Upload</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
              disabled={isUploading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {uploadStatus === 'idle' && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">Upload Instructions</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• CSV file with columns: Name, NHIA Number, BVN, Gender, DOB, Phone, Email, Address, Plan</li>
                  <li>• System will auto-generate unique Enrollment IDs (ENR-YYYY-####)</li>
                  <li>• System will auto-generate unique e-IDs for digital cards</li>
                  <li>• All enrollees will have "Pending" status until validated</li>
                  <li>• Age will be calculated automatically from date of birth</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Client Organization
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                    disabled={isUploading}
                  >
                    <option value="">Choose a client...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name} ({client.client_code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CSV File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="bulk-upload-file"
                    disabled={isUploading}
                  />
                  <label htmlFor="bulk-upload-file" className="cursor-pointer">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    {file ? (
                      <div>
                        <p className="text-lg text-gray-700 font-medium mb-1">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg text-gray-600 mb-2">Click to select CSV file</p>
                        <p className="text-sm text-gray-500">or drag and drop</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={downloadTemplate}
                  className="flex items-center space-x-2 text-eagle-600 hover:text-eagle-700"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Download Template</span>
                </button>

                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!file || !selectedClient || isUploading}
                    className="px-6 py-2 bg-eagle-600 text-white rounded-lg hover:bg-eagle-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Enrollees</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {uploadStatus === 'processing' && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-eagle-600 border-t-transparent mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Upload...</h3>
              <p className="text-gray-600">Please wait while we process your enrollees</p>
            </div>
          )}

          {uploadStatus === 'success' && uploadResult && (
            <div className="space-y-4">
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Completed!</h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-600 mb-1">Total</p>
                  <p className="text-2xl font-bold text-blue-900">{uploadResult.total}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-600 mb-1">Successful</p>
                  <p className="text-2xl font-bold text-green-900">{uploadResult.successful}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-red-600 mb-1">Failed</p>
                  <p className="text-2xl font-bold text-red-900">{uploadResult.failed}</p>
                </div>
              </div>

              {uploadResult.errors.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Errors (showing first 10)</span>
                  </h4>
                  <ul className="text-sm text-yellow-800 space-y-1 max-h-40 overflow-y-auto">
                    {uploadResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setFile(null);
                    setUploadStatus('idle');
                    setUploadResult(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Upload More
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-eagle-600 text-white rounded-lg hover:bg-eagle-700"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {uploadStatus === 'error' && uploadResult && (
            <div className="space-y-4">
              <div className="text-center py-6">
                <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Failed</h3>
                <p className="text-gray-600">There was an error processing your file</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">Error Details</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  {uploadResult.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setFile(null);
                    setUploadStatus('idle');
                    setUploadResult(null);
                  }}
                  className="px-6 py-2 bg-eagle-600 text-white rounded-lg hover:bg-eagle-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;
