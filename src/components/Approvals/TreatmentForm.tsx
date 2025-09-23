import React, { useState } from 'react';
import { Plus, Trash2, Calculator, Save, X } from 'lucide-react';

interface TreatmentItem {
  id: string;
  service: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

interface TreatmentFormProps {
  onClose: () => void;
  onSubmit: (treatments: TreatmentItem[]) => void;
  enrolleeId: string;
  enrolleeName: string;
  diagnosis: string;
}

const TreatmentForm: React.FC<TreatmentFormProps> = ({ 
  onClose, 
  onSubmit, 
  enrolleeId, 
  enrolleeName, 
  diagnosis 
}) => {
  const [treatments, setTreatments] = useState<TreatmentItem[]>([
    { id: '1', service: '', unitPrice: 0, quantity: 1, total: 0 }
  ]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validTreatments = treatments.filter(t => t.service && t.unitPrice > 0);
    if (validTreatments.length === 0) {
      alert('Please add at least one valid treatment');
      return;
    }
    onSubmit(validTreatments);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Treatment Request Form</h2>
            <p className="text-gray-600 mt-1">
              {enrolleeName} ({enrolleeId}) - {diagnosis}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
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
                <div key={treatment.id} className="bg-gray-50 rounded-lg p-4">
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
          </div>

          {/* Total Summary */}
          <div className="bg-sky-50 rounded-lg p-4 mb-6">
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

          {/* Additional Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent h-24 resize-none"
              placeholder="Any additional information about the treatment..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Submit Treatment Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TreatmentForm;