import React from 'react';
import { TrendingUp, Star, Clock, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

const ProviderPerformance: React.FC = () => {
  const providers = [
    {
      id: 'PRV-001',
      name: 'Lagos University Teaching Hospital (LUTH)',
      overallScore: 96.5,
      metrics: {
        claimsProcessed: 1247,
        approvalRate: 96.2,
        avgProcessingTime: 2.1,
        costEfficiency: 94.8,
        patientSatisfaction: 4.7
      },
      trends: {
        claimsProcessed: '+12%',
        approvalRate: '+2.1%',
        avgProcessingTime: '-0.3hrs',
        costEfficiency: '+1.2%'
      },
      alerts: []
    },
    {
      id: 'PRV-002',
      name: 'National Hospital Abuja',
      overallScore: 94.2,
      metrics: {
        claimsProcessed: 892,
        approvalRate: 94.1,
        avgProcessingTime: 2.8,
        costEfficiency: 92.3,
        patientSatisfaction: 4.5
      },
      trends: {
        claimsProcessed: '+8%',
        approvalRate: '+1.5%',
        avgProcessingTime: '-0.2hrs',
        costEfficiency: '+0.8%'
      },
      alerts: ['Processing time slightly above target']
    },
    {
      id: 'PRV-003',
      name: 'Reddington Hospital Victoria Island',
      overallScore: 92.8,
      metrics: {
        claimsProcessed: 634,
        approvalRate: 91.7,
        avgProcessingTime: 3.2,
        costEfficiency: 89.4,
        patientSatisfaction: 4.8
      },
      trends: {
        claimsProcessed: '+15%',
        approvalRate: '-1.2%',
        avgProcessingTime: '+0.4hrs',
        costEfficiency: '-2.1%'
      },
      alerts: ['Approval rate declining', 'Cost efficiency below target']
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 95) return 'bg-green-100';
    if (score >= 90) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getTrendColor = (trend: string) => {
    if (trend.startsWith('+')) return 'text-green-600';
    if (trend.startsWith('-') && trend.includes('hrs')) return 'text-green-600'; // Negative time is good
    if (trend.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Provider Performance</h1>
        <p className="text-gray-600 mt-1">Monitor and analyze provider performance metrics</p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Performance</p>
              <p className="text-2xl font-bold text-gray-900">94.5%</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Claims</p>
              <p className="text-2xl font-bold text-gray-900">2,773</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Processing</p>
              <p className="text-2xl font-bold text-gray-900">2.7 hrs</p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cost Efficiency</p>
              <p className="text-2xl font-bold text-gray-900">92.2%</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Provider Performance Cards */}
      <div className="space-y-6">
        {providers.map((provider) => (
          <div key={provider.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
                <p className="text-gray-600">Provider ID: {provider.id}</p>
              </div>
              
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getScoreBackground(provider.overallScore)}`}>
                  <span className={`text-2xl font-bold ${getScoreColor(provider.overallScore)}`}>
                    {provider.overallScore}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Overall Score</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{provider.metrics.claimsProcessed.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Claims Processed</p>
                <p className={`text-xs font-medium mt-1 ${getTrendColor(provider.trends.claimsProcessed)}`}>
                  {provider.trends.claimsProcessed}
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{provider.metrics.approvalRate}%</p>
                <p className="text-sm text-gray-600">Approval Rate</p>
                <p className={`text-xs font-medium mt-1 ${getTrendColor(provider.trends.approvalRate)}`}>
                  {provider.trends.approvalRate}
                </p>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{provider.metrics.avgProcessingTime}h</p>
                <p className="text-sm text-gray-600">Avg Processing</p>
                <p className={`text-xs font-medium mt-1 ${getTrendColor(provider.trends.avgProcessingTime)}`}>
                  {provider.trends.avgProcessingTime}
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{provider.metrics.costEfficiency}%</p>
                <p className="text-sm text-gray-600">Cost Efficiency</p>
                <p className={`text-xs font-medium mt-1 ${getTrendColor(provider.trends.costEfficiency)}`}>
                  {provider.trends.costEfficiency}
                </p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center space-x-1">
                  <Star className="w-5 h-5 text-orange-500 fill-current" />
                  <p className="text-2xl font-bold text-orange-600">{provider.metrics.patientSatisfaction}</p>
                </div>
                <p className="text-sm text-gray-600">Patient Rating</p>
              </div>
            </div>

            {/* Alerts */}
            {provider.alerts.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Performance Alerts</h4>
                <div className="space-y-2">
                  {provider.alerts.map((alert, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">{alert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                View Details
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Performance Report
              </button>
              {provider.alerts.length > 0 && (
                <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                  Address Issues
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderPerformance;