import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  UserCheck, 
  FileText, 
  MessageSquare, 
  CheckCircle, 
  CreditCard,
  Building2,
  Receipt,
  Shield,
  ChevronDown,
  ChevronRight,
  Users,
  DollarSign,
  FileCheck,
  Scale,
  UserPlus,
  Wifi
} from 'lucide-react';

interface NavItem {
  path?: string;
  icon: any;
  label: string;
  children?: NavItem[];
  permissions?: string[];
}

const navItems: NavItem[] = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  
  // Call Center Section
  {
    icon: MessageSquare,
    label: 'Call Center',
    permissions: ['eligibility', 'diagnoses', 'complaints', 'approvals', 'benefits'],
    children: [
      { path: '/eligibility', icon: UserCheck, label: 'Eligibility' },
      { path: '/diagnoses', icon: FileText, label: 'Diagnoses & PA' },
      { path: '/complaints', icon: MessageSquare, label: 'Complaints' },
      { path: '/approvals', icon: CheckCircle, label: 'Approvals' },
      { path: '/benefits', icon: CreditCard, label: 'Benefits' },
    ]
  },

  // Claims Section
  {
    icon: Receipt,
    label: 'Claims Management',
    permissions: ['claims'],
    children: [
      { path: '/claims', icon: Receipt, label: 'Claims Queue' },
      { path: '/claims/submitted', icon: FileCheck, label: 'Submitted Claims' },
      { path: '/claims/analytics', icon: FileCheck, label: 'Claims Analytics' },
      { path: '/claims/payments', icon: DollarSign, label: 'Payment Processing' },
    ]
  },

  // Providers Section
  {
    icon: Building2,
    label: 'Provider Management',
    permissions: ['providers'],
    children: [
      { path: '/providers', icon: Building2, label: 'Provider Directory' },
      { path: '/providers/contracts', icon: FileCheck, label: 'Contracts' },
      { path: '/providers/performance', icon: Scale, label: 'Performance' },
    ]
  },

  // Enrollment Section (Future)
  {
    icon: UserPlus,
    label: 'Enrollment',
    permissions: ['enrollment'],
    children: [
      { path: '/enrollment/members', icon: Users, label: 'Member Registration' },
      { path: '/enrollment/plans', icon: CreditCard, label: 'Plan Management' },
      { path: '/enrollment/management', icon: UserPlus, label: 'Enrollment Management' },
    ]
  },

  // Finance Section (Future)
  {
    icon: DollarSign,
    label: 'Finance',
    permissions: ['finance'],
    children: [
      { path: '/finance/billing', icon: Receipt, label: 'Billing' },
      { path: '/finance/reports', icon: FileCheck, label: 'Financial Reports' },
    ]
  },

  // Underwriting Section (Future)
  {
    icon: Scale,
    label: 'Underwriting',
    permissions: ['underwriting'],
    children: [
      { path: '/underwriting/risk', icon: Scale, label: 'Risk Assessment' },
      { path: '/underwriting/policies', icon: FileText, label: 'Policy Management' },
    ]
  },

  // Regulation Section (Future)
  {
    icon: Shield,
    label: 'Regulation',
    permissions: ['regulation'],
    children: [
      { path: '/regulation/compliance', icon: Shield, label: 'Compliance' },
      { path: '/regulation/audit', icon: FileCheck, label: 'Audit Trail' },
    ]
  },

  // System Management
  { path: '/offline-mode', icon: Wifi, label: 'Offline Mode' },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Call Center', 'Claims Management']);

  const toggleSection = (sectionLabel: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionLabel) 
        ? prev.filter(s => s !== sectionLabel)
        : [...prev, sectionLabel]
    );
  };

  const hasPermission = (item: NavItem): boolean => {
    if (!user || !user.permissions) return false;
    if (user.permissions.includes('all')) return true;
    if (!item.permissions) return true;
    return item.permissions.some(permission => 
      user.permissions.includes(permission) || user.permissions.includes('all')
    );
  };

  const getFilteredNavItems = (): NavItem[] => {
    if (!user || !user.permissions) return [];
    
    const filtered = navItems.filter(item => {
      if (item.path === '/') return true; // Dashboard always visible
      return hasPermission(item);
    });
    
    // Add Provider Portal for Super Admin
    if (user.permissions.includes('all')) {
      filtered.push({
        path: '/provider',
        icon: Building2,
        label: 'Provider Portal',
        permissions: ['all']
      });
    }
    
    return filtered;
  };

  const filteredNavItems = getFilteredNavItems();

  return (
    <div className="w-64 bg-gradient-to-b from-white to-eagle-50/30 shadow-xl border-r border-eagle-100">
      <div className="p-6 border-b border-eagle-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-eagle-600 to-naija-600 rounded-lg flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-eagle-600 to-naija-600 bg-clip-text text-transparent">Eagle HMO</h1>
            <p className="text-sm text-gold-600 font-medium">Healthcare on Eagle's Wing</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedSections.includes(item.label);
          
          if (item.children) {
            // Dropdown section
            return (
              <div key={item.label} className="mb-2">
                <button
                  onClick={() => toggleSection(item.label)}
                  className="w-full flex items-center justify-between px-6 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-eagle-50 hover:to-naija-50 hover:text-eagle-700 transition-all duration-200 rounded-l-xl mx-2"
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <NavLink key={child.path} to={child.path || '#'}>
                          {({ isActive }) => (
                            <div className={`flex items-center px-6 py-2 text-sm text-gray-600 hover:bg-gradient-to-r hover:from-eagle-50 hover:to-naija-50 hover:text-eagle-700 transition-all duration-200 rounded-l-xl mx-2 ${
                              isActive ? 'bg-gradient-to-r from-eagle-100 to-naija-100 text-eagle-700 border-r-4 border-eagle-600 shadow-md' : ''
                            }`}>
                              <ChildIcon className={`w-4 h-4 mr-3 ${isActive ? 'text-eagle-600' : ''}`} />
                              <span className="font-medium">{child.label}</span>
                            </div>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          } else {
            // Single item
            return (
              <NavLink key={item.path} to={item.path || '#'}>
                {({ isActive }) => (
                  <div className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-eagle-50 hover:to-naija-50 hover:text-eagle-700 transition-all duration-200 rounded-l-xl mx-2 ${
                    isActive ? 'bg-gradient-to-r from-eagle-100 to-naija-100 text-eagle-700 border-r-4 border-eagle-600 shadow-md' : ''
                  }`}>
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-eagle-600' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                )}
              </NavLink>
            );
          }
        })}
      </nav>
    </div>
  );
};

export default Sidebar;