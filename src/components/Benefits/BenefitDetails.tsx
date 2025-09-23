import React from 'react';
import { CreditCard, AlertTriangle, TrendingDown, CheckCircle } from 'lucide-react';

interface BenefitDetailsProps {
  enrollee: any;
}

const BenefitDetails: React.FC<BenefitDetailsProps> = ({ enrollee }) => {
  if (!enrollee) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Enrollee Selected</h3>
        <p className="text-gray-600">Search for an enrollee to view their benefits</p>
      </div>
    );
  }

  const calculateUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 90) return { color: 'text-red-600', icon: AlertTriangle };
    if (percentage >= 75) return { color: 'text-yellow-600', icon: TrendingDown };
    return { color: 'text-green-600', icon: CheckCircle };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{enrollee.name}</h2>
            <p className="text-gray-600">{enrollee.plan}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Benefit Utilization</h3>
        
        <div className="space-y-6">
          {Object.entries(enrollee.benefits).map(([benefitType, benefit]: [string, any]) => {
            const percentage = calculateUsagePercentage(benefit.used, benefit.limit);
            const status = getUsageStatus(percentage);
            const StatusIcon = status.icon;
            
            return (
              <div key={benefitType} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 capitalize">{benefitType}</span>
                    <StatusIcon className={`w-4 h-4 ${status.color}`} />
                  </div>
                  <span className="text-sm text-gray-600">
                    ${benefit.used.toLocaleString()} / ${benefit.limit.toLocaleString()}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className={status.color}>{percentage}% used</span>
                  <span className="text-gray-600">
                    ${(benefit.limit - benefit.used).toLocaleString()} remaining
                  </span>
                </div>
                
                {percentage >= 90 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Benefit Limit Alert</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      This enrollee has used {percentage}% of their {benefitType} benefits. 
                      Additional approvals may require manual review.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BenefitDetails;