import React from 'react';
import { Shield, FileCheck, AlertTriangle, Users } from 'lucide-react';

const Compliance: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Regulatory Compliance</h1>
        <p className="text-gray-600 mt-1">Ensure compliance with healthcare regulations</p>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-8 text-center">
        <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Regulation Unit</h2>
        <p className="text-gray-600 mb-6">
          Comprehensive compliance management system for regulatory requirements and healthcare standards.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <FileCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Regulatory Reports</h3>
            <p className="text-sm text-gray-600">NHIA compliance reporting</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Risk Monitoring</h3>
            <p className="text-sm text-gray-600">Compliance risk assessment</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Staff Training</h3>
            <p className="text-sm text-gray-600">Compliance education</p>
          </div>
        </div>
        <p className="text-sm text-green-600 mt-6 font-medium">Coming Soon - Under Development</p>
      </div>
    </div>
  );
};

export default Compliance;