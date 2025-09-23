import React from 'react';
import { Receipt, DollarSign, TrendingUp, Calendar } from 'lucide-react';

const Billing: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing Management</h1>
        <p className="text-gray-600 mt-1">Handle premium billing and payment processing</p>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-8 text-center">
        <Receipt className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Finance Unit</h2>
        <p className="text-gray-600 mb-6">
          Comprehensive billing and financial management system for premium collections and payments.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Premium Billing</h3>
            <p className="text-sm text-gray-600">Monthly premium processing</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Revenue Analytics</h3>
            <p className="text-sm text-gray-600">Financial performance tracking</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Payment Schedules</h3>
            <p className="text-sm text-gray-600">Automated billing cycles</p>
          </div>
        </div>
        <p className="text-sm text-yellow-600 mt-6 font-medium">Coming Soon - Under Development</p>
      </div>
    </div>
  );
};

export default Billing;