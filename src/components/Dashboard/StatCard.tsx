import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: 'sky' | 'teal' | 'orange' | 'green';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change.startsWith('+');
  
  const colorClasses = {
    sky: 'bg-gradient-to-br from-naija-100 to-naija-200 text-naija-600',
    teal: 'bg-gradient-to-br from-eagle-100 to-eagle-200 text-eagle-600',
    orange: 'bg-gradient-to-br from-gold-100 to-gold-200 text-gold-600',
    green: 'bg-gradient-to-br from-green-100 to-green-200 text-green-600'
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-eagle-200 transform hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center space-x-1 text-sm ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="font-semibold">{change}</span>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1">{value}</h3>
      <p className="text-gray-600 font-medium">{title}</p>
    </div>
  );
};

export default StatCard;