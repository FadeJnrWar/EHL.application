import React from 'react';
import { UserPlus, Users, TrendingUp, Clock } from 'lucide-react';

const MemberRegistration: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Member Registration</h1>
        <p className="text-gray-600 mt-1">Manage enrollee registration and membership</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8 text-center">
        <UserPlus className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enrollment Unit</h2>
        <p className="text-gray-600 mb-6">
          This module will handle member registration, plan enrollment, and membership management.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Member Registration</h3>
            <p className="text-sm text-gray-600">New enrollee onboarding</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Plan Management</h3>
            <p className="text-sm text-gray-600">Healthcare plan administration</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Renewal Processing</h3>
            <p className="text-sm text-gray-600">Membership renewals</p>
          </div>
        </div>
        <p className="text-sm text-blue-600 mt-6 font-medium">Coming Soon - Under Development</p>
      </div>
    </div>
  );
};

export default MemberRegistration;