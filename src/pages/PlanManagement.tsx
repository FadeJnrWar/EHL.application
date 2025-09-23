import React from 'react';
import { CreditCard, Shield, Star, DollarSign } from 'lucide-react';

const PlanManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Plan Management</h1>
        <p className="text-gray-600 mt-1">Manage healthcare plans and benefit structures</p>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-8 text-center">
        <CreditCard className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Healthcare Plans</h2>
        <p className="text-gray-600 mb-6">
          Comprehensive plan management system for different healthcare coverage options.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Basic Plan</h3>
            <p className="text-sm text-gray-600">Essential healthcare coverage</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Premium Plan</h3>
            <p className="text-sm text-gray-600">Comprehensive coverage</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <DollarSign className="w-8 h-8 text-gold-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Executive Plan</h3>
            <p className="text-sm text-gray-600">Premium executive coverage</p>
          </div>
        </div>
        <p className="text-sm text-green-600 mt-6 font-medium">Coming Soon - Under Development</p>
      </div>
    </div>
  );
};

export default PlanManagement;