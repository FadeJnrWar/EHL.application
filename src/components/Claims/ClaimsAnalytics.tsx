import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Clock, DollarSign } from 'lucide-react';

const ClaimsAnalytics: React.FC = () => {
  const metrics = [
    {
      title: 'Claims Processing Efficiency',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      description: 'Claims processed within SLA'
    },
    {
      title: 'Average Processing Time',
      value: '2.3 hours',
      change: '-0.5 hours',
      trend: 'down',
      description: 'Time from submission to decision'
    },
    {
      title: 'Auto-Approval Rate',
      value: '67%',
      change: '+5%',
      trend: 'up',
      description: 'Claims approved by AI system'
    },
    {
      title: 'Rejection Rate',
      value: '8.5%',
      change: '-1.2%',
      trend: 'down',
      description: 'Claims rejected after review'
    }
  ];

  const topProviders = [
    { name: 'Lagos University Teaching Hospital', claims: 1247, amount: '₦15.2M', approval: '96%' },
    { name: 'National Hospital Abuja', claims: 892, amount: '₦11.8M', approval: '94%' },
    { name: 'Reddington Hospital', claims: 634, amount: '₦8.9M', approval: '92%' },
    { name: 'St. Nicholas Hospital', claims: 456, amount: '₦6.1M', approval: '89%' },
    { name: 'EKO Hospital', claims: 389, amount: '₦5.3M', approval: '91%' }
  ];

  const commonDiagnoses = [
    { icd10: 'B50.9', diagnosis: 'Malaria', claims: 234, percentage: 18.5 },
    { icd10: 'E11.9', diagnosis: 'Type 2 Diabetes', claims: 189, percentage: 14.9 },
    { icd10: 'I10', diagnosis: 'Hypertension', claims: 156, percentage: 12.3 },
    { icd10: 'J44.1', diagnosis: 'COPD', claims: 123, percentage: 9.7 },
    { icd10: 'N39.0', diagnosis: 'UTI', claims: 98, percentage: 7.7 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              {metric.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Providers */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Providers by Volume</h3>
          </div>
          <div className="space-y-4">
            {topProviders.map((provider, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{provider.name}</p>
                  <p className="text-sm text-gray-600">{provider.claims} claims • {provider.amount}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {provider.approval} approval
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Diagnoses */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Most Common Diagnoses</h3>
          </div>
          <div className="space-y-4">
            {commonDiagnoses.map((diagnosis, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{diagnosis.diagnosis}</p>
                    <p className="text-sm text-gray-600">{diagnosis.icd10} • {diagnosis.claims} claims</p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{diagnosis.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${diagnosis.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Processing Time Trends */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Processing Time Trends</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">1.8 hrs</p>
            <p className="text-sm text-gray-600">AI Auto-Processing</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">3.2 hrs</p>
            <p className="text-sm text-gray-600">Manual Review</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">5.1 hrs</p>
            <p className="text-sm text-gray-600">Medical Review</p>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">₦47.3M</p>
            <p className="text-sm text-gray-600">Total Claims Value</p>
            <p className="text-xs text-green-600 mt-1">+12% vs last month</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">₦43.1M</p>
            <p className="text-sm text-gray-600">Approved Amount</p>
            <p className="text-xs text-green-600 mt-1">91.1% approval rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">₦4.2M</p>
            <p className="text-sm text-gray-600">Rejected Amount</p>
            <p className="text-xs text-red-600 mt-1">8.9% rejection rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">₦12,450</p>
            <p className="text-sm text-gray-600">Average Claim Value</p>
            <p className="text-xs text-blue-600 mt-1">-3% vs last month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimsAnalytics;