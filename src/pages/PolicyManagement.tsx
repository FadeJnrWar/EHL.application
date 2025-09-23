import React from 'react';
import { FileText, Settings, CheckCircle, Clock } from 'lucide-react';

const PolicyManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Policy Management</h1>
        <p className="text-gray-600 mt-1">Manage underwriting policies and guidelines</p>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-8 text-center">
        <FileText className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Policy Administration</h2>
        <p className="text-gray-600 mb-6">
          Comprehensive policy management system for underwriting guidelines and procedures.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Settings className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Policy Configuration</h3>
            <p className="text-sm text-gray-600">Setup underwriting rules</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Approval Workflows</h3>
            <p className="text-sm text-gray-600">Automated decision making</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Policy Updates</h3>
            <p className="text-sm text-gray-600">Version control and updates</p>
          </div>
        </div>
        <p className="text-sm text-indigo-600 mt-6 font-medium">Coming Soon - Under Development</p>
      </div>
    </div>
  );
};

export default PolicyManagement;