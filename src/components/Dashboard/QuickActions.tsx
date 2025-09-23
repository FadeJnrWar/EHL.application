import React from 'react';
import { Plus, Search, FileText, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Check Eligibility',
      description: 'Verify enrollee coverage',
      icon: Search,
      color: 'bg-sky-600 hover:bg-sky-700',
      onClick: () => navigate('/eligibility')
    },
    {
      title: 'Upload Diagnosis',
      description: 'Generate PA code',
      icon: FileText,
      color: 'bg-teal-600 hover:bg-teal-700',
      onClick: () => navigate('/diagnoses')
    },
    {
      title: 'Review Approvals',
      description: 'Process care requests',
      icon: CheckCircle,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => navigate('/approvals')
    },
    {
      title: 'Log Complaint',
      description: 'Create new complaint',
      icon: Plus,
      color: 'bg-orange-600 hover:bg-orange-700',
      onClick: () => navigate('/complaints')
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className={`w-full ${action.color} text-white p-4 rounded-lg transition-colors text-left`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <div>
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;