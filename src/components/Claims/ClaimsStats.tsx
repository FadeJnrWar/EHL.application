import React from 'react';
import { FileText, Clock, CheckCircle, XCircle, DollarSign, AlertTriangle } from 'lucide-react';

const ClaimsStats: React.FC = () => {
  const stats = [
    {
      title: 'Pending Claims',
      value: '156',
      change: '+23',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'Approved Today',
      value: '89',
      change: '+12',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Rejected Claims',
      value: '12',
      change: '-3',
      icon: XCircle,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Total Value',
      value: '₦2.4M',
      change: '+15%',
      icon: DollarSign,
      color: 'bg-sky-100 text-sky-600'
    },
    {
      title: 'Avg Processing Time',
      value: '2.3 hrs',
      change: '-0.5 hrs',
      icon: AlertTriangle,
      color: 'bg-teal-100 text-teal-600'
    },
    {
      title: 'Auto-Rejected',
      value: '34',
      change: '+8',
      icon: FileText,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs text-green-600 font-medium">{stat.change}</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-600">{stat.title}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ClaimsStats;