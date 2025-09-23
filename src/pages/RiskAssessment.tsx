import React from 'react';
import { Scale, AlertTriangle, Shield, TrendingDown } from 'lucide-react';

const RiskAssessment: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Risk Assessment</h1>
        <p className="text-gray-600 mt-1">Evaluate and manage underwriting risks</p>
      </div>

      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-8 text-center">
        <Scale className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Underwriting Unit</h2>
        <p className="text-gray-600 mb-6">
          Advanced risk assessment and underwriting tools for evaluating member applications and claims patterns.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Risk Scoring</h3>
            <p className="text-sm text-gray-600">Automated risk evaluation</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Policy Guidelines</h3>
            <p className="text-sm text-gray-600">Underwriting standards</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <TrendingDown className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Loss Ratios</h3>
            <p className="text-sm text-gray-600">Claims vs premium analysis</p>
          </div>
        </div>
        <p className="text-sm text-red-600 mt-6 font-medium">Coming Soon - Under Development</p>
      </div>
    </div>
  );
};

export default RiskAssessment;