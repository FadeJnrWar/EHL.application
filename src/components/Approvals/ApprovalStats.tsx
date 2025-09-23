import React from 'react';
import { Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const ApprovalStats: React.FC = () => {
  const stats = [
    {
      title: 'Pending Requests',
      value: '12',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'Approved Today',
      value: '45',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Denied Today',
      value: '3',
      icon: XCircle,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Avg. Response Time',
      value: '12 min',
      icon: TrendingUp,
      color: 'bg-sky-100 text-sky-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApprovalStats;