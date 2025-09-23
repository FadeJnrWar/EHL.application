import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface BenefitAlertsProps {
  alerts: Array<{
    type: 'warning' | 'info' | 'error';
    message: string;
  }>;
}

const BenefitAlerts: React.FC<BenefitAlertsProps> = ({ alerts }) => {
  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
      case 'error':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-sm font-medium text-gray-900">Benefit Alerts</h3>
      {alerts.map((alert, index) => {
        const Icon = getAlertIcon(alert.type);
        return (
          <div key={index} className={`border rounded-lg p-3 ${getAlertColor(alert.type)}`}>
            <div className="flex items-start space-x-2">
              <Icon className="w-4 h-4 mt-0.5" />
              <p className="text-sm">{alert.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BenefitAlerts;