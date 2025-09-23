import React from 'react';
import { FileCheck, BarChart3, PieChart, TrendingUp } from 'lucide-react';

const FinancialReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
        <p className="text-gray-600 mt-1">Comprehensive financial analytics and reporting</p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-8 text-center">
        <FileCheck className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Analytics</h2>
        <p className="text-gray-600 mb-6">
          Advanced reporting and analytics for financial performance monitoring and compliance.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Revenue Reports</h3>
            <p className="text-sm text-gray-600">Monthly and quarterly revenue</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <PieChart className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Claims Analytics</h3>
            <p className="text-sm text-gray-600">Claims cost analysis</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Profitability</h3>
            <p className="text-sm text-gray-600">Profit margin tracking</p>
          </div>
        </div>
        <p className="text-sm text-purple-600 mt-6 font-medium">Coming Soon - Under Development</p>
      </div>
    </div>
  );
};

export default FinancialReports;