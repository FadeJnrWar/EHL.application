import React from 'react';
import { CheckCircle, XCircle, User, Calendar, CreditCard, DollarSign, FileText, Clock } from 'lucide-react';

interface EligibilityResultsProps {
  results: any;
  isLoading: boolean;
}

const EligibilityResults: React.FC<EligibilityResultsProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Search Results</h3>
        <p className="text-gray-600">Enter enrollee information to check eligibility</p>
      </div>
    );
  }

  const isActive = results.status === 'active';

  // Mock service history data
  const serviceHistory = [
    {
      id: 1,
      date: '2025-01-10',
      provider: 'City General Hospital',
      service: 'Consultation',
      icd10: 'B50.9',
      diagnosis: 'Malaria treatment',
      paCode: 'PA-1736789456789-123',
      amount: '₦2,500',
      status: 'completed'
    },
    {
      id: 2,
      date: '2025-01-05',
      provider: 'Metro Medical Center',
      service: 'Laboratory Test',
      icd10: 'Z00.00',
      diagnosis: 'Routine health check',
      paCode: 'PA-1736789356789-456',
      amount: '₦1,200',
      status: 'completed'
    },
    {
      id: 3,
      date: '2024-12-28',
      provider: 'Sunshine Clinic',
      service: 'Vaccination',
      icd10: 'Z23',
      diagnosis: 'Immunization',
      paCode: 'PA-1736789256789-789',
      amount: '₦800',
      status: 'completed'
    }
  ];
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isActive ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isActive ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{results.name}</h2>
              <p className="text-gray-600">ID: {results.enrolleeId}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isActive ? 'Active Coverage' : 'Inactive Coverage'}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Plan Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Plan Type</p>
                  <p className="font-medium text-gray-900">{results.plan}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Company</p>
                  <p className="font-medium text-gray-900">{results.company}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Effective Period</p>
                  <p className="font-medium text-gray-900">
                    {results.effectiveDate} - {results.expirationDate}
                  </p>
                </div>
              
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Patient Details</p>
                  <p className="font-medium text-gray-900">{results.gender}, {results.age} years old</p>
                  <p className="text-sm text-gray-500">DOB: {results.dateOfBirth}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-medium text-gray-900">{results.phone}</p>
                  <p className="text-sm text-gray-500">{results.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Benefit Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Copay</span>
                <span className="font-medium text-gray-900">{results.copay}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Deductible</span>
                <span className="font-medium text-gray-900">{results.deductible}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Remaining Deductible</span>
                <span className="font-medium text-gray-900">{results.remainingDeductible}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Benefits Used</span>
                  <span className="font-medium text-gray-900">{results.benefitsUsed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Benefits Remaining</span>
                  <span className="font-medium text-green-600">{results.benefitsRemaining}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Service History Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg font-medium text-gray-900">Service History</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">Previous treatments and services</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {serviceHistory.map((service) => (
              <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{service.service}</h4>
                      <p className="text-sm text-gray-600">{service.diagnosis}</p>
                      <p className="text-xs text-gray-500 mt-1">PA: {service.paCode}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{service.amount}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {service.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">{service.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Provider</p>
                    <p className="font-medium text-gray-900">{service.provider}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">ICD-10</p>
                    <p className="font-medium text-gray-900">{service.icd10}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityResults;