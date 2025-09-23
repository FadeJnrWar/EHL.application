import React, { useState } from 'react';
import { DollarSign, Download, CheckCircle, Clock, Building2, FileText, Calendar } from 'lucide-react';

const PaymentProcessing: React.FC = () => {
  const [selectedBatch, setSelectedBatch] = useState('BATCH-SEP-2025-001');

  const batches = [
    {
      id: 'BATCH-SEP-2025-001',
      month: 'September 2025',
      totalAmount: 70500,
      claimsCount: 2,
      providersCount: 2,
      status: 'ready_for_payment',
      createdDate: '2025-01-13',
      providers: [
        {
          name: 'Lagos University Teaching Hospital (LUTH)',
          account: '0123456789',
          bank: 'First Bank Nigeria',
          encounters: 1,
          submittedAmount: 45000,
          vettedAmount: 42000,
          claims: ['CLM-001']
        },
        {
          name: 'National Hospital Abuja',
          account: '0987654321',
          bank: 'Zenith Bank',
          encounters: 1,
          submittedAmount: 28500,
          vettedAmount: 28500,
          claims: ['CLM-002']
        }
      ]
    },
    {
      id: 'BATCH-AUG-2025-001',
      month: 'August 2025',
      totalAmount: 156000,
      claimsCount: 8,
      providersCount: 5,
      status: 'paid',
      createdDate: '2025-01-01',
      paidDate: '2025-01-05'
    }
  ];

  const handleExportBatch = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    console.log('Exporting batch:', batch);
    alert(`Batch ${batchId} exported successfully! CSV file downloaded.`);
  };

  const handleMarkAsPaid = (batchId: string) => {
    alert(`Batch ${batchId} marked as paid! Providers will be notified.`);
  };

  const selectedBatchData = batches.find(b => b.id === selectedBatch);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Processing</h1>
          <p className="text-gray-600 mt-1">Manage provider payments and batch processing</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleExportBatch(selectedBatch)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Batch</span>
          </button>
          {selectedBatchData?.status === 'ready_for_payment' && (
            <button
              onClick={() => handleMarkAsPaid(selectedBatch)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark as Paid</span>
            </button>
          )}
        </div>
      </div>

      {/* Batch Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Batch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => (
            <div
              key={batch.id}
              onClick={() => setSelectedBatch(batch.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedBatch === batch.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{batch.month}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  batch.status === 'paid' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {batch.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">₦{batch.totalAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-600">{batch.claimsCount} claims • {batch.providersCount} providers</p>
            </div>
          ))}
        </div>
      </div>

      {/* Batch Details */}
      {selectedBatchData && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedBatchData.month} Payment Batch</h2>
                <p className="text-gray-600">Batch ID: {selectedBatchData.id}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">₦{selectedBatchData.totalAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Payment Amount</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">₦{selectedBatchData.totalAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Amount</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{selectedBatchData.claimsCount}</p>
                <p className="text-sm text-gray-600">Claims</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Building2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{selectedBatchData.providersCount}</p>
                <p className="text-sm text-gray-600">Providers</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-orange-600">{selectedBatchData.createdDate}</p>
                <p className="text-sm text-gray-600">Created Date</p>
              </div>
            </div>

            {/* Provider Breakdown */}
            {selectedBatchData.providers && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Provider Payment Breakdown</h3>
                <div className="space-y-4">
                  {selectedBatchData.providers.map((provider, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{provider.name}</h4>
                          <p className="text-sm text-gray-600">Account: {provider.account} • {provider.bank}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">₦{provider.vettedAmount.toLocaleString()}</p>
                          {provider.submittedAmount !== provider.vettedAmount && (
                            <p className="text-sm text-gray-500">
                              Submitted: ₦{provider.submittedAmount.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Encounters</p>
                          <p className="font-medium text-gray-900">{provider.encounters}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Claims</p>
                          <p className="font-medium text-gray-900">{provider.claims.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Adjustment</p>
                          <p className={`font-medium ${
                            provider.submittedAmount === provider.vettedAmount 
                              ? 'text-green-600' 
                              : 'text-orange-600'
                          }`}>
                            {provider.submittedAmount === provider.vettedAmount 
                              ? 'No adjustment' 
                              : `₦${(provider.submittedAmount - provider.vettedAmount).toLocaleString()} reduced`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentProcessing;