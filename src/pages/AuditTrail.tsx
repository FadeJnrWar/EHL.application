import React, { useState } from 'react';
import { History, User, Calendar, Filter, Search, FileText, Eye, Download } from 'lucide-react';

const AuditTrail: React.FC = () => {
  const [filters, setFilters] = useState({
    dateRange: '7days',
    user: 'all',
    action: 'all',
    module: 'all'
  });

  const [searchQuery, setSearchQuery] = useState('');

  const auditLogs = [
    {
      id: 'AUD-001',
      timestamp: '2025-01-13 14:30:25',
      user: 'Dr. Owolabi Adebayo',
      action: 'Claim Approved',
      module: 'Claims Management',
      details: 'Approved claim CLM-004 for Kemi Adebayo - Appendectomy',
      ipAddress: '192.168.1.45',
      userAgent: 'Chrome 120.0.0.0',
      severity: 'high',
      affectedRecord: 'CLM-004'
    },
    {
      id: 'AUD-002',
      timestamp: '2025-01-13 12:15:10',
      user: 'Emmanuel Onifade',
      action: 'Claim Forwarded',
      module: 'Claims Management',
      details: 'Forwarded claim CLM-004 to Medical Director for review',
      ipAddress: '192.168.1.23',
      userAgent: 'Chrome 120.0.0.0',
      severity: 'medium',
      affectedRecord: 'CLM-004'
    },
    {
      id: 'AUD-003',
      timestamp: '2025-01-13 10:45:33',
      user: 'Winifred Festus',
      action: 'PA Code Generated',
      module: 'Call Center',
      details: 'Generated PA code PA-1736789156789-101 for ENR-22222',
      ipAddress: '192.168.1.67',
      userAgent: 'Chrome 120.0.0.0',
      severity: 'low',
      affectedRecord: 'PA-1736789156789-101'
    },
    {
      id: 'AUD-004',
      timestamp: '2025-01-13 09:20:15',
      user: 'Emmanuel Onifade',
      action: 'Provider Added',
      module: 'Provider Management',
      details: 'Added new provider: St. Nicholas Hospital Lagos',
      ipAddress: '192.168.1.23',
      userAgent: 'Chrome 120.0.0.0',
      severity: 'medium',
      affectedRecord: 'PRV-004'
    },
    {
      id: 'AUD-005',
      timestamp: '2025-01-12 16:30:45',
      user: 'Dr. Owolabi Adebayo',
      action: 'Claim Rejected',
      module: 'Claims Management',
      details: 'Rejected claim CLM-003 - Excessive procedures for hypertension',
      ipAddress: '192.168.1.45',
      userAgent: 'Chrome 120.0.0.0',
      severity: 'high',
      affectedRecord: 'CLM-003'
    },
    {
      id: 'AUD-006',
      timestamp: '2025-01-12 14:15:22',
      user: 'Ajayi Seyi',
      action: 'Eligibility Check',
      module: 'Call Center',
      details: 'Verified eligibility for enrollee ENR-33333',
      ipAddress: '192.168.1.89',
      userAgent: 'Chrome 120.0.0.0',
      severity: 'low',
      affectedRecord: 'ENR-33333'
    },
    {
      id: 'AUD-007',
      timestamp: '2025-01-12 11:45:10',
      user: 'Emmanuel Onifade',
      action: 'Batch Created',
      module: 'Claims Management',
      details: 'Created payment batch BATCH-SEP-2025-001 with 2 approved claims',
      ipAddress: '192.168.1.23',
      userAgent: 'Chrome 120.0.0.0',
      severity: 'high',
      affectedRecord: 'BATCH-SEP-2025-001'
    },
    {
      id: 'AUD-008',
      timestamp: '2025-01-11 15:30:18',
      user: 'Olufemi Adegbami',
      action: 'Report Generated',
      module: 'Analytics',
      details: 'Generated monthly claims analytics report for December 2024',
      ipAddress: '192.168.1.12',
      userAgent: 'Chrome 120.0.0.0',
      severity: 'medium',
      affectedRecord: 'RPT-DEC-2024'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Approved') || action.includes('Generated')) return FileText;
    if (action.includes('Rejected') || action.includes('Deleted')) return FileText;
    if (action.includes('Login') || action.includes('Logout')) return User;
    return History;
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.affectedRecord.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesUser = filters.user === 'all' || log.user === filters.user;
    const matchesAction = filters.action === 'all' || log.action.toLowerCase().includes(filters.action);
    const matchesModule = filters.module === 'all' || log.module === filters.module;
    
    return matchesSearch && matchesUser && matchesAction && matchesModule;
  });

  const handleExport = () => {
    alert('Audit trail exported to CSV successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
          <p className="text-gray-600 mt-1">Complete system activity log and compliance tracking</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Logs</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search logs..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
            <select
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="Emmanuel Onifade">Emmanuel Onifade</option>
              <option value="Dr. Owolabi Adebayo">Dr. Owolabi Adebayo</option>
              <option value="Winifred Festus">Winifred Festus</option>
              <option value="Ajayi Seyi">Ajayi Seyi</option>
              <option value="Olufemi Adegbami">Olufemi Adegbami</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Actions</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="generated">Generated</option>
              <option value="added">Added</option>
              <option value="forwarded">Forwarded</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Module</label>
            <select
              value={filters.module}
              onChange={(e) => setFilters({ ...filters, module: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Modules</option>
              <option value="Claims Management">Claims Management</option>
              <option value="Call Center">Call Center</option>
              <option value="Provider Management">Provider Management</option>
              <option value="Analytics">Analytics</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Activity Log ({filteredLogs.length} entries)</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredLogs.map((log) => {
            const ActionIcon = getActionIcon(log.action);
            return (
              <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ActionIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-gray-900">{log.action}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                          {log.severity.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{log.details}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-gray-500">
                      <div>
                        <span className="font-medium">User:</span> {log.user}
                      </div>
                      <div>
                        <span className="font-medium">Module:</span> {log.module}
                      </div>
                      <div>
                        <span className="font-medium">IP:</span> {log.ipAddress}
                      </div>
                      <div>
                        <span className="font-medium">Record:</span> {log.affectedRecord}
                      </div>
                    </div>
                  </div>
                  
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Audit Logs Found</h3>
            <p className="text-gray-600">No logs match the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditTrail;