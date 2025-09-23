import React, { useState } from 'react';
import { Shield, UserPlus, Building2, Mail, Phone, MapPin, FileText, Upload, Check, AlertTriangle } from 'lucide-react';

const ProviderRegistration: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    facilityName: '',
    facilityType: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    alternatePhone: '',
    
    // Address Information
    address: '',
    city: '',
    state: '',
    lga: '',
    
    // License & Certification
    cacNumber: '',
    medicalLicense: '',
    nhisAccreditation: '',
    
    // Services & Specialization
    services: [],
    specializations: [],
    bedCapacity: '',
    
    // Banking Information
    bankName: '',
    accountNumber: '',
    accountName: '',
    
    // Staff Information
    staffMembers: [
      { name: '', email: '', role: '', phone: '' }
    ]
  });

  const [uploadedDocs, setUploadedDocs] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const facilityTypes = [
    'General Hospital',
    'Specialist Hospital',
    'Teaching Hospital',
    'Private Clinic',
    'Diagnostic Center',
    'Maternity Home',
    'Eye Care Center',
    'Dental Clinic'
  ];

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
    'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  const serviceOptions = [
    'Emergency Care', 'Surgery', 'Cardiology', 'Neurology', 'Pediatrics',
    'Obstetrics & Gynecology', 'Orthopedics', 'Ophthalmology', 'ENT',
    'Dermatology', 'Psychiatry', 'Radiology', 'Laboratory Services',
    'Pharmacy', 'Physiotherapy', 'Dialysis', 'ICU', 'NICU'
  ];

  const staffRoles = [
    'Medical Director',
    'Chief Medical Officer',
    'Head of Administration',
    'Claims Officer',
    'Patient Relations Officer',
    'IT Administrator'
  ];

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const addStaffMember = () => {
    setFormData(prev => ({
      ...prev,
      staffMembers: [...prev.staffMembers, { name: '', email: '', role: '', phone: '' }]
    }));
  };

  const removeStaffMember = (index: number) => {
    if (formData.staffMembers.length > 1) {
      setFormData(prev => ({
        ...prev,
        staffMembers: prev.staffMembers.filter((_, i) => i !== index)
      }));
    }
  };

  const updateStaffMember = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      staffMembers: prev.staffMembers.map((staff, i) => 
        i === index ? { ...staff, [field]: value } : staff
      )
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedDocs(prev => [...prev, ...files]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Registration submitted successfully!\n\nReference ID: REG-${Date.now()}\n\nEagle HMO will review your application and contact you within 2-3 business days.`);
    }, 3000);
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eagle-50 via-naija-50 to-gold-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <img 
              src="/ehl.jpeg" 
              alt="Eagle HMO Logo" 
              className="w-16 h-16 rounded-xl shadow-lg object-contain bg-white p-2"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-16 h-16 bg-gradient-to-br from-eagle-600 to-naija-600 rounded-xl flex items-center justify-center shadow-lg hidden">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-eagle-600 to-naija-600 bg-clip-text text-transparent">
                Eagle HMO
              </h1>
              <p className="text-gold-600 font-semibold text-lg">Provider Registration</p>
            </div>
          </div>
          <p className="text-xl text-gray-600">Join Nigeria's Premier Healthcare Network</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= stepNum 
                    ? 'bg-gradient-to-r from-eagle-600 to-naija-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepNum ? <Check className="w-5 h-5" /> : stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNum ? 'bg-gradient-to-r from-eagle-600 to-naija-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="grid grid-cols-4 gap-8 text-center">
              <span className={`text-sm ${step >= 1 ? 'text-eagle-600 font-medium' : 'text-gray-500'}`}>
                Basic Info
              </span>
              <span className={`text-sm ${step >= 2 ? 'text-eagle-600 font-medium' : 'text-gray-500'}`}>
                Services
              </span>
              <span className={`text-sm ${step >= 3 ? 'text-eagle-600 font-medium' : 'text-gray-500'}`}>
                Staff & Banking
              </span>
              <span className={`text-sm ${step >= 4 ? 'text-eagle-600 font-medium' : 'text-gray-500'}`}>
                Documents
              </span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Building2 className="w-12 h-12 text-eagle-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Facility Information</h2>
                <p className="text-gray-600">Tell us about your healthcare facility</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facility Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.facilityName}
                    onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                    placeholder="Hospital/Clinic Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facility Type *
                  </label>
                  <select
                    required
                    value={formData.facilityType}
                    onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                  >
                    <option value="">Select facility type</option>
                    {facilityTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                    placeholder="Primary contact person"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                    placeholder="e.g., Medical Director, Administrator"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                    placeholder="contact@hospital.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                    placeholder="+234-xxx-xxx-xxxx"
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Facility Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 h-20 resize-none"
                      placeholder="Complete facility address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <select
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                    >
                      <option value="">Select state</option>
                      {nigerianStates.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City/LGA *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                      placeholder="City or Local Government Area"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Services & Specialization */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <FileText className="w-12 h-12 text-eagle-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Services & Licensing</h2>
                <p className="text-gray-600">What services do you provide?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CAC Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cacNumber}
                    onChange={(e) => setFormData({ ...formData, cacNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                    placeholder="CAC Number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical License Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.medicalLicense}
                    onChange={(e) => setFormData({ ...formData, medicalLicense: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                    placeholder="Medical License"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NHIS Accreditation
                  </label>
                  <input
                    type="text"
                    value={formData.nhisAccreditation}
                    onChange={(e) => setFormData({ ...formData, nhisAccreditation: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                    placeholder="NHIS Accreditation Number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Services Offered * (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {serviceOptions.map((service) => (
                    <label key={service} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="rounded border-gray-300 text-eagle-600 focus:ring-eagle-500"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bed Capacity (if applicable)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.bedCapacity}
                  onChange={(e) => setFormData({ ...formData, bedCapacity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                  placeholder="Number of beds"
                />
              </div>
            </div>
          )}

          {/* Step 3: Staff & Banking */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <UserPlus className="w-12 h-12 text-eagle-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Staff & Banking Information</h2>
                <p className="text-gray-600">Add key staff members and banking details</p>
              </div>

              {/* Banking Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Banking Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                      placeholder="Bank name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                      placeholder="Account number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.accountName}
                      onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                      placeholder="Account name"
                    />
                  </div>
                </div>
              </div>

              {/* Staff Members */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Key Staff Members</h3>
                  <button
                    type="button"
                    onClick={addStaffMember}
                    className="flex items-center space-x-2 px-4 py-2 bg-eagle-600 text-white rounded-lg hover:bg-eagle-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Staff</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.staffMembers.map((staff, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={staff.name}
                            onChange={(e) => updateStaffMember(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                            placeholder="Staff name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={staff.email}
                            onChange={(e) => updateStaffMember(index, 'email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                            placeholder="staff@hospital.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role *
                          </label>
                          <select
                            required
                            value={staff.role}
                            onChange={(e) => updateStaffMember(index, 'role', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                          >
                            <option value="">Select role</option>
                            {staffRoles.map((role) => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-end space-x-2">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone
                            </label>
                            <input
                              type="tel"
                              value={staff.phone}
                              onChange={(e) => updateStaffMember(index, 'phone', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                              placeholder="+234-xxx-xxx-xxxx"
                            />
                          </div>
                          {formData.staffMembers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStaffMember(index)}
                              className="p-2 text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Document Upload */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Upload className="w-12 h-12 text-eagle-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Required Documents</h2>
                <p className="text-gray-600">Upload necessary documents for verification</p>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <label htmlFor="document-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 mb-2">Upload Required Documents</p>
                    <p className="text-sm text-gray-500">
                      CAC Certificate, Medical License, NHIS Accreditation, etc.
                    </p>
                  </label>
                </div>

                {uploadedDocs.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Uploaded Documents:</h4>
                    {uploadedDocs.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedDocs(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">What Happens Next?</h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>Eagle HMO will review your application within 2-3 business days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>You'll receive login credentials for approved staff members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>Contract terms and tariff schedules will be shared</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>Training on the provider portal will be provided</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-eagle-600 to-naija-600 text-white py-4 rounded-lg hover:from-eagle-700 hover:to-naija-700 disabled:opacity-50 transition-all font-semibold flex items-center justify-center space-x-2 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Submit Registration</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex justify-between pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-eagle-600 to-naija-600 text-white rounded-lg hover:from-eagle-700 hover:to-naija-700 transition-all"
              >
                Next Step
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderRegistration;