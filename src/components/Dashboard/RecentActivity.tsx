import React from 'react';
import { Clock, FileText, CheckCircle, MessageSquare, User } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'pa_generated',
      description: 'PA Code generated for John Doe (Malaria treatment)',
      timestamp: '2 minutes ago',
      icon: FileText,
      color: 'text-sky-600'
    },
    {
      id: 2,
      type: 'approval',
      description: 'Care request approved for Maria Santos',
      timestamp: '5 minutes ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'complaint',
      description: 'New complaint logged and assigned to Mike Chen',
      timestamp: '12 minutes ago',
      icon: MessageSquare,
      color: 'text-orange-600'
    },
    {
      id: 4,
      type: 'eligibility',
      description: 'Eligibility verified for Ahmed Ibrahim',
      timestamp: '18 minutes ago',
      icon: User,
      color: 'text-teal-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;