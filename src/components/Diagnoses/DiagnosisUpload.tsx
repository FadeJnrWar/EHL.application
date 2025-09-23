import React, { useState, useEffect } from 'react';
import { Upload, FileText, Check, AlertCircle, Plus, Trash2, Calculator, Paperclip, WifiOff, Edit3, Save, X } from 'lucide-react';
import { validateICD10Code, getDiagnosisFromICD10, commonICD10Codes } from '../../utils/icd10Validator';
import { findEnrolleeById, enrollees } from '../../data/enrollees';

interface TreatmentItem {
  id: string;
  service: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

interface DiagnosisItem {
  id: string;
  icd10Code: string;
  description: string;
}

const DiagnosisUpload: React.FC = () => {
  const [formData, setFormData] = useState({
    enrolleeId: '',
    enrolleeName: '',
    enrolleeGender: '',
    enrolleeAge: '',
    enrolleePhone: '',
    providerName: '',
    dateOfService: '',
    comments: ''
  });
  
  const [diagnoses, setDiagnoses] = useState<DiagnosisItem[]>([
    { id: '1', icd10Code: '', description: '' }
  ]);
  
  const [treatments, setTreatments] = useState<TreatmentItem[]>([
    { id: '1', service: '', unitPrice: 0, quantity: 1, total: 0 }
  ]);
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredEnrollees, setFilteredEnrollees] = useState<any[]>([]);
  const [editingDiagnosis, setEditingDiagnosis] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Offline mode detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle enrollee ID input with dropdown
  const handleEnrolleeIdChange = (value: string) => {
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
        enrolleePhone: ''
      });
    }
  };

  // Select enrollee from dropdown
  const selectEnrollee = (enrollee: any) => {
    setFormData({
      ...formData,
      enrolleeId: enrollee.id,
      enrolleeName: enrollee.name,
      enrolleeGender: enrollee.gender,
      enrolleeAge: enrollee.age.toString(),
      enrolleePhone: enrollee.phone
    });
    setShowDropdown(false);
  };

  // Update phone number in database
  const updateEnrolleePhone = (enrolleeId: string, newPhone: string) => {
    // In real app, this would update the database
    console.log(`Updating phone for ${enrolleeId} to ${newPhone}`);
    alert(`Phone number updated for enrollee ${enrolleeId}`);
  };

  const handlePhoneUpdate = () => {
    if (formData.enrolleeId && formData.enrolleePhone) {
      updateEnrolleePhone(formData.enrolleeId, formData.enrolleePhone);
    }
  };

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

  const addDiagnosis = () => {
    const newId = (diagnoses.length + 1).toString();
    setDiagnoses([...diagnoses, { id: newId, icd10Code: '', description: '' }]);
  };

  const removeDiagnosis = (id: string) => {
    if (diagnoses.length > 1) {
      setDiagnoses(diagnoses.filter(d => d.id !== id));
    }
  };

  const updateDiagnosis = (id: string, field: keyof DiagnosisItem, value: string) => {
    setDiagnoses(diagnoses.map(diagnosis => {
      if (diagnosis.id === id) {
        const updated = { ...diagnosis, [field]: value };
        // Auto-populate description when ICD-10 code changes
        if (field === 'icd10Code') {
          const description = getDiagnosisFromICD10(value);
          updated.description = description;
        }
        return updated;
      }
      return diagnosis;
    }));
  };

  const startEditingDiagnosis = (id: string) => {
    setEditingDiagnosis(id);
  };

  const saveEditDiagnosis = (id: string) => {
    setEditingDiagnosis(null);
  };

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

  const removeTreatment = (id: string) => {
    if (treatments.length > 1) {
      setTreatments(treatments.filter(t => t.id !== id));
    }
  };

  const updateTreatment = (id: string, field: keyof TreatmentItem, value: string | number) => {
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number is provided
    if (!formData.enrolleePhone) {
      alert('Phone number is required for PA generation. Please update the enrollee phone number.');
      return;
    }
    
    if (!isOnline) {
      // Save to localStorage for offline sync
      const offlineData = {
        ...formData,
        diagnoses,
        treatments,
        uploadedFiles: uploadedFiles.map(f => f.name), // Store file names only
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('offlineDiagnosis', JSON.stringify(offlineData));
      alert('You are offline. Diagnosis saved locally and will be processed when connection is restored.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate upload and PA generation
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`PA Code Generated: PA-${Date.now()}`);
      setFormData({
        enrolleeId: '',
        enrolleeName: '',
        enrolleeGender: '',
        enrolleeAge: '',
        providerName: '',
        dateOfService: '',
        comments: ''
      });
      setDiagnoses([{ id: '1', icd10Code: '', description: '' }]);
      setTreatments([{ id: '1', service: '', unitPrice: 0, quantity: 1, total: 0 }]);
      setUploadedFiles([]);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {!isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Offline Mode</p>
              <p className="text-xs text-yellow-700">Diagnoses will be processed when connection is restored</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FileText className="w-5 h-5 text-sky-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-sky-900">Upload Enrollee Diagnosis</h3>
            <p className="text-sm text-sky-700 mt-1">
              Enter enrollee information and diagnosis details to generate a Prior Authorization code
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter enrollee ID or name"
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
              Enrollee Name *
            </label>
            <input
              type="text"
              required
              value={formData.enrolleeName}
              readOnly={!!formData.enrolleeId}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                formData.enrolleeId ? 'bg-gray-100' : ''
              }`}
              placeholder="Enter enrollee name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <input
              type="text"
              value={formData.enrolleeGender}
              readOnly={!!formData.enrolleeId}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                formData.enrolleeId ? 'bg-gray-100' : ''
              }`}
              placeholder="Auto-populated"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="text"
              value={formData.enrolleeAge}
              readOnly={!!formData.enrolleeId}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                formData.enrolleeId ? 'bg-gray-100' : ''
              }`}
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
                value={formData.enrolleePhone}
                onChange={(e) => setFormData({ ...formData, enrolleePhone: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="+234-xxx-xxx-xxxx"
              />
              {formData.enrolleeId && formData.enrolleePhone && (
                <button
                  type="button"
                  onClick={handlePhoneUpdate}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Update
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Required for authorization requests. Update if missing.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider/Hospital *
            </label>
            <input
              type="text"
              required
              value={formData.providerName}
              onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Enter provider name"
            />
          </div>
        </div>

        {/* Multiple Diagnoses Section */}
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Diagnoses (ICD-10)</h3>
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
              <div key={diagnosis.id} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ICD-10 Code *
                    </label>
                    <div className="relative">
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
                      {diagnosis.description && (
                        <div className="absolute right-3 top-2.5">
                          <Check className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    {editingDiagnosis === diagnosis.id ? (
                      <textarea
                        value={diagnosis.description}
                        onChange={(e) => updateDiagnosis(diagnosis.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                        placeholder="Edit diagnosis description"
                      />
                    ) : (
                      <div className="relative">
                        <textarea
                          value={diagnosis.description}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 h-20 resize-none"
                          placeholder="Auto-populated from ICD-10 code"
                        />
                        {diagnosis.description && (
                          <button
                            type="button"
                            onClick={() => startEditingDiagnosis(diagnosis.id)}
                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {editingDiagnosis === diagnosis.id ? (
                      <div className="flex space-x-1">
                        <button
                          type="button"
                          onClick={() => saveEditDiagnosis(diagnosis.id)}
                          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingDiagnosis(null)}
                          className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm text-gray-600">Diagnosis #{index + 1}</span>
                        {diagnoses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDiagnosis(diagnosis.id)}
                            className="p-2 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Service *
          </label>
          <input
            type="date"
            required
            value={formData.dateOfService}
            onChange={(e) => setFormData({ ...formData, dateOfService: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>

        {/* Treatment Details Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Treatment Details</h3>
            <button
              type="button"
              onClick={addTreatment}
              className="flex items-center space-x-2 px-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Treatment</span>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select service</option>
                      {commonServices.map((service) => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                      <option value="Other">Other (specify in comments)</option>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
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
          <div className="bg-sky-50 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-sky-600" />
                <span className="text-lg font-medium text-gray-900">Total Treatment Cost</span>
              </div>
              <span className="text-2xl font-bold text-sky-700">
                ₦{getTotalAmount().toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical Reports/Documents
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload medical reports</p>
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

        {/* Comments Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Comments
          </label>
          <textarea
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent h-24 resize-none"
            placeholder="Any additional information about the diagnosis or treatment..."
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !formData.enrolleePhone || diagnoses.some(d => !d.icd10Code) || treatments.some(t => !t.service || t.unitPrice <= 0)}
          className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>{isOnline ? 'Generating PA Code...' : 'Saving Offline...'}</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>{isOnline ? 'Upload & Generate PA Code' : 'Save for Later (Offline)'}</span>
            </>
          )}
        </button>
        
        {!formData.enrolleePhone && (
          <p className="text-sm text-red-600 text-center">Phone number is required before submission</p>
        )}
      </form>
    </div>
  );
};

export default DiagnosisUpload;