import React from 'react';
import { Users, FileText, MessageSquare, CheckCircle, TrendingUp, Clock, Shield, Building2, DollarSign, AlertTriangle, CreditCard } from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import RecentActivity from '../components/Dashboard/RecentActivity';
import QuickActions from '../components/Dashboard/QuickActions';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Role-based dashboard data
  const getDashboardData = () => {
    if (user?.permissions?.includes('all')) {
      // Super Admin Dashboard - Complete cross-board insights
      return {
        title: 'Executive Dashboard',
        subtitle: 'Complete system overview across all departments',
        stats: [
          {
            title: 'Active Enrollees',
            value: '12,847',
            change: '+5.2%',
            icon: Users,
            color: 'sky' as const
          },
          {
            title: 'Monthly Revenue',
            value: '₦47.3M',
            change: '+15.7%',
            icon: DollarSign,
            color: 'green' as const
          },
          {
            title: 'Claims This Month',
            value: '3,247',
            change: '+8.3%',
            icon: FileText,
            color: 'teal' as const
          },
          {
            title: 'Provider Network',
            value: '247',
            change: '+12',
            icon: Building2,
            color: 'orange' as const
          }
        ]
      };
    } else if (user?.role === 'Medical Director') {
      // Medical Director Dashboard
      return {
        title: 'Medical Director Dashboard',
        subtitle: 'Medical review and clinical oversight',
        stats: [
          {
            title: 'Pending Medical Review',
            value: '23',
            change: '+5',
            icon: FileText,
            color: 'orange' as const
          },
          {
            title: 'Approved Today',
            value: '45',
            change: '+12',
            icon: CheckCircle,
            color: 'green' as const
          },
          {
            title: 'High-Value Claims',
            value: '8',
            change: '+2',
            icon: AlertTriangle,
            color: 'sky' as const
          },
          {
            title: 'Avg Review Time',
            value: '1.8 hrs',
            change: '-0.3 hrs',
            icon: Clock,
            color: 'teal' as const
          }
        ]
      };
    } else if (user?.role === 'Claims Adjudicator') {
      // Claims Adjudicator Dashboard
      return {
        title: 'Claims Adjudicator Dashboard',
        subtitle: 'Initial claims vetting and processing',
        stats: [
          {
            title: 'Pending Vetting',
            value: '67',
            change: '+8',
            icon: FileText,
            color: 'sky' as const
          },
          {
            title: 'Processed Today',
            value: '34',
            change: '+15',
            icon: CheckCircle,
            color: 'green' as const
          },
          {
            title: 'Forwarded to Medical',
            value: '12',
            change: '+3',
            icon: AlertTriangle,
            color: 'orange' as const
          },
          {
            title: 'Processing Time',
            value: '2.1 hrs',
            change: '-0.4 hrs',
            icon: Clock,
            color: 'teal' as const
          }
        ]
      };
    } else if (user?.department === 'Call Center') {
      // Call Center Dashboard
      return {
        title: 'Call Center Dashboard',
        subtitle: 'Monitor call center operations and member services',
        stats: [
          {
            title: 'PA Codes Generated',
            value: '234',
            change: '+12.1%',
            icon: FileText,
            color: 'teal' as const
          },
          {
            title: 'Eligibility Checks',
            value: '456',
            change: '+8.5%',
            icon: Users,
            color: 'sky' as const
          },
          {
            title: 'Pending Complaints',
            value: '23',
            change: '-8.3%',
            icon: MessageSquare,
            color: 'orange' as const
          },
          {
            title: 'Approvals Today',
            value: '89',
            change: '+15.7%',
            icon: CheckCircle,
            color: 'green' as const
          }
        ]
      };
    } else if (user?.department === 'Claims') {
      // Claims Department Dashboard
      return {
        title: 'Claims Management Dashboard',
        subtitle: 'Track claims processing and provider payments',
        stats: [
          {
            title: 'Claims Under Review',
            value: '156',
            change: '+5.2%',
            icon: FileText,
            color: 'sky' as const
          },
          {
            title: 'Approved Today',
            value: '89',
            change: '+12.1%',
            icon: CheckCircle,
            color: 'green' as const
          },
          {
            title: 'Total Value Today',
            value: '₦2.4M',
            change: '+8.7%',
            icon: DollarSign,
            color: 'green' as const
          },
          {
            title: 'Avg Processing Time',
            value: '2.3 hrs',
            change: '-0.5 hrs',
            icon: Clock,
            color: 'orange' as const
          }
        ]
      };
    } else if (user?.department === 'Enrollment') {
      // Enrollment Department Dashboard
      return {
        title: 'Enrollment Dashboard',
        subtitle: 'Member registration and plan management',
        stats: [
          {
            title: 'New Enrollments',
            value: '45',
            change: '+23%',
            icon: Users,
            color: 'sky' as const
          },
          {
            title: 'Plan Renewals',
            value: '123',
            change: '+8%',
            icon: CreditCard,
            color: 'green' as const
          },
          {
            title: 'Pending Applications',
            value: '12',
            change: '-5',
            icon: Clock,
            color: 'orange' as const
          },
          {
            title: 'Conversion Rate',
            value: '87%',
            change: '+3%',
            icon: TrendingUp,
            color: 'teal' as const
          }
        ]
      };
    } else if (user?.department === 'Finance') {
      // Finance Department Dashboard
      return {
        title: 'Finance Dashboard',
        subtitle: 'Financial operations and billing management',
        stats: [
          {
            title: 'Monthly Revenue',
            value: '₦47.3M',
            change: '+15.7%',
            icon: DollarSign,
            color: 'green' as const
          },
          {
            title: 'Outstanding Premiums',
            value: '₦2.1M',
            change: '-8.2%',
            icon: AlertTriangle,
            color: 'orange' as const
          },
          {
            title: 'Payment Batches',
            value: '8',
            change: '+2',
            icon: FileText,
            color: 'sky' as const
          },
          {
            title: 'Collection Rate',
            value: '94.5%',
            change: '+2.1%',
            icon: TrendingUp,
            color: 'teal' as const
          }
        ]
      };
    } else {
      // Default dashboard for other roles
      return {
        title: 'Department Dashboard',
        subtitle: 'Your department overview',
        stats: [
          {
            title: 'Active Tasks',
            value: '12',
            change: '+2',
            icon: FileText,
            color: 'sky' as const
          },
          {
            title: 'Completed Today',
            value: '8',
            change: '+3',
            icon: CheckCircle,
            color: 'green' as const
          },
          {
            title: 'Pending Items',
            value: '4',
            change: '-1',
            icon: Clock,
            color: 'orange' as const
          },
          {
            title: 'Team Performance',
            value: '94%',
            change: '+2%',
            icon: TrendingUp,
            color: 'teal' as const
          }
        ]
      };
    }
  };

  const dashboardData = getDashboardData();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-eagle-600 to-naija-600 bg-clip-text text-transparent">{dashboardData.title}</h1>
          <p className="text-gray-600 mt-1 text-lg">{dashboardData.subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gold-600 bg-gold-50 px-3 py-2 rounded-lg">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.stats.map((stat, index) => (
          <div key={index} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 animate-slide-up" style={{animationDelay: '0.4s'}}>
          <RecentActivity />
        </div>
        <div className="animate-slide-up" style={{animationDelay: '0.5s'}}>
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;