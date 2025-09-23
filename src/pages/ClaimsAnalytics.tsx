import React from 'react';
import ClaimsAnalytics from '../components/Claims/ClaimsAnalytics';

const ClaimsAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Claims Analytics</h1>
        <p className="text-gray-600 mt-1">Comprehensive claims performance metrics and insights</p>
      </div>
      <ClaimsAnalytics />
    </div>
  );
};

export default ClaimsAnalyticsPage;