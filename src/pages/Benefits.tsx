import React, { useState } from 'react';
import { CreditCard, Search, AlertTriangle, TrendingDown } from 'lucide-react';
import BenefitSearch from '../components/Benefits/BenefitSearch';
import BenefitDetails from '../components/Benefits/BenefitDetails';
import BenefitAlerts from '../components/Benefits/BenefitAlerts';
import OfflineBanner from '../components/Common/OfflineBanner';

const Benefits: React.FC = () => {
  const [selectedEnrollee, setSelectedEnrollee] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async (searchData: any) => {
    // Simulate API call
    setTimeout(() => {
      const mockResults = {
        enrolleeId: searchData.enrolleeId,
        name: 'Jane Smith',
        plan: 'Premium Family Plan',
        benefits: {
          medical: { used: 15000, limit: 50000 },
          dental: { used: 800, limit: 2000 },
          optical: { used: 150, limit: 500 },
          maternity: { used: 0, limit: 10000 }
        },
        alerts: [
          { type: 'warning', message: 'Approaching dental benefit limit (80% used)' },
          { type: 'info', message: 'Maternity benefit unused - consider wellness check' }
        ]
      };
      setSearchResults(mockResults);
      setSelectedEnrollee(mockResults);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <OfflineBanner />
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Member Benefits</h1>
        <p className="text-gray-600 mt-1">View and manage enrollee benefit utilization</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BenefitSearch onSearch={handleSearch} />
          {searchResults && <BenefitAlerts alerts={searchResults.alerts} />}
        </div>
        <div className="lg:col-span-2">
          <BenefitDetails enrollee={selectedEnrollee} />
        </div>
      </div>
    </div>
  );
};

export default Benefits;