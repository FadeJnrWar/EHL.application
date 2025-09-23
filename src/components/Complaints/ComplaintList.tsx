import React, { useState } from 'react';
import { MessageSquare, User, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface ComplaintListProps {
  filters: any;
}

const ComplaintList: React.FC<ComplaintListProps> = ({ filters }) => {
  const [complaints] = useState([
    {
      id: 'CMP-001',
      enrolleeId: 'ENR-12345',
      enrolleeName: 'John Doe',
      type: 'Coverage Denial',
      priority: 'high',
      status: 'open',
      assignedTo: 'Sarah Johnson',
      description: 'Coverage denied for specialist consultation',
      dateLogged: '2025-01-13',
      lastUpdate: '2025-01-13 14:30'
    },
    {
      id: 'CMP-002',
      enrolleeId: 'ENR-67890',
      enrolleeName: 'Maria Santos',
      type: 'Billing Issue',
      priority: 'medium',
      status: 'in_progress',
      assignedTo: 'Mike Chen',
      description: 'Incorrect charges on monthly statement',
      dateLogged: '2025-01-12',
      lastUpdate: '2025-01-13 09:15'
    },
    {
      id: 'CMP-003',
      enrolleeId: 'ENR-11111',
      enrolleeName: 'Ahmed Ibrahim',
      type: 'Provider Access',
      priority: 'low',
      status: 'resolved',
      assignedTo: 'Lisa Rodriguez',
      description: 'Difficulty finding in-network providers',
      dateLogged: '2025-01-11',
      lastUpdate: '2025-01-12 16:45'
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return AlertCircle;
      case 'in_progress': return Clock;
      case 'resolved': return CheckCircle;
      default: return MessageSquare;
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filters.status !== 'all' && complaint.status !== filters.status) return false;
    if (filters.priority !== 'all' && complaint.priority !== filters.priority) return false;
    return true;
  });

  return (
    <div className="space-y-4 p-6">
      {filteredComplaints.map((complaint) => {
        const StatusIcon = getStatusIcon(complaint.status);
        
        return (
          <div key={complaint.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <StatusIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{complaint.enrolleeName}</h3>
                  <p className="text-gray-600">ID: {complaint.enrolleeId}</p>
                  <p className="text-sm text-gray-500">Complaint: {complaint.id}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                  {complaint.priority.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                  {complaint.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium text-gray-900">{complaint.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Assigned To</p>
                <p className="font-medium text-gray-900">{complaint.assignedTo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Update</p>
                <p className="font-medium text-gray-900">{complaint.lastUpdate}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Description</p>
              <p className="text-gray-900">{complaint.description}</p>
            </div>

            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                View Details
              </button>
              <button className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                Update Status
              </button>
            </div>
          </div>
        );
      })}

      {filteredComplaints.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Complaints Found</h3>
          <p className="text-gray-600">No complaints match the selected filters</p>
        </div>
      )}
    </div>
  );
};

export default ComplaintList;