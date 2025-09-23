import React from 'react';
import { Building2, Users, AlertTriangle, TrendingUp } from 'lucide-react';

const ProviderStats: React.FC = () => {
  const stats = [
    {
      title: 'Active Providers',
      value: '247',
      change: '+12',
      icon: Building2,
      color: 'bg-sky-100 text-sky-600'
    },
    {
      title: 'Tier 1 Hospitals',
      value: '89',
      change: '+3',
      icon: Users,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Pending Issues',
      value: '8',
      change: '-2',
      icon: AlertTriangle,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Performance Score',
      value: '94.2%',
      change: '+1.5%',
      icon: TrendingUp,
      color: 'bg-teal-100 text-teal-600'
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
                <p className="text-sm text-green-600 mt-1">{stat.change} this month</p>
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

export default ProviderStats;