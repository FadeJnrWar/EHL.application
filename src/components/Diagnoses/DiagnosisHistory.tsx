import React from 'react';
import { FileText, Calendar, User, Copy } from 'lucide-react';

const DiagnosisHistory: React.FC = () => {
  const history = [
    {
      id: 1,
      paCode: 'PA-1736789456789-123',
      enrolleeId: 'ENR-12345',
      enrolleeName: 'John Doe',
      icd10Code: 'B50.9',
      diagnosis: 'Plasmodium falciparum malaria, unspecified',
      provider: 'City General Hospital',
      dateGenerated: '2025-01-13',
      status: 'active'
    },
    {
      id: 2,
      paCode: 'PA-1736789356789-456',
      enrolleeId: 'ENR-67890',
      enrolleeName: 'Maria Santos',
      icd10Code: 'E11.9',
      diagnosis: 'Type 2 diabetes mellitus without complications',
      provider: 'Metro Medical Center',
      dateGenerated: '2025-01-12',
      status: 'used'
    }
  ];

  const handleCopyPACode = (paCode: string) => {
    navigator.clipboard.writeText(paCode);
  };

  return (
    <div className="space-y-4">
      {history.map((record) => (
        <div key={record.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{record.enrolleeName}</h3>
                <p className="text-gray-600">ID: {record.enrolleeId}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {record.paCode}
                  </span>
                  <button
                    onClick={() => handleCopyPACode(record.paCode)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              record.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {record.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">ICD-10 Code</p>
              <p className="font-medium text-gray-900">{record.icd10Code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Provider</p>
              <p className="font-medium text-gray-900">{record.provider}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date Generated</p>
              <p className="font-medium text-gray-900">{record.dateGenerated}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Diagnosis</p>
            <p className="text-gray-900">{record.diagnosis}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiagnosisHistory;