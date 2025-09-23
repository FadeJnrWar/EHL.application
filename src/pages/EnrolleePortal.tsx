import React, { useState, useEffect } from 'react';
import { Shield, User, MapPin, CreditCard, FileText, Phone, Mail, Clock, Building2, Navigation, Download, Star, AlertTriangle, CheckCircle, LogOut, Wifi, WifiOff, Heart, Calendar, DollarSign, Search, Filter, Eye, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';
import { enrollees } from '../data/enrollees';

const EnrolleePortal: React.FC = () => {
  const { user, logout } = useAuth();
  const { isOnline, saveFormData, getFormData } = useOffline();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [nearbyProviders, setNearbyProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [showContactForm, setShowContactForm] = useState(false);

  // Get enrollee data based on logged in user
  const enrolleeData = enrollees.find(e => e.email === user?.email) || {
    id: 'ENR-DEMO',
    name: user?.name || 'Demo User',
    gender: 'Male',
    age: 30,
    company: 'Demo Company',
    plan: 'Gold',
    status: 'active',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    dateOfBirth: '1994-01-01',
    phone: '+234-801-234-5678',
    email: user?.email || 'demo@company.com'
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'status', label: 'Enrollment Status', icon: Shield },
    { id: 'hospitals', label: 'Find Hospitals', icon: MapPin },
    { id: 'benefits', label: 'My Benefits', icon: CreditCard },
    { id: 'claims', label: 'My Claims', icon: FileText },
    { id: 'support', label: 'Support', icon: Phone }
  ];

  // Mock nearby providers data
  const providersData = [
    {
      id: 'PRV-001',
      name: 'Lagos University Teaching Hospital (LUTH)',
      distance: '2.3 km',
      address: 'Idi-Araba, Lagos',
      phone: '+234-801-234-5678',
      email: 'admin@luth.edu.ng',
      services: ['Emergency Care', 'Surgery', 'Cardiology', 'Neurology'],
      rating: 4.8,
      availability: '24/7',
      tier: 'Tier 1'
    },
    {
      id: 'PRV-002',
      name: 'National Hospital Abuja',
      distance: '5.1 km',
      address: 'Central Business District, Abuja',
      phone: '+234-809-876-5432',
      email: 'info@nationalhospital.gov.ng',
      services: ['Emergency Care', 'Pediatrics', 'Maternity'],
      rating: 4.6,
      availability: '24/7',
      tier: 'Tier 1'
    },
    {
      id: 'PRV-003',
      name: 'Reddington Hospital',
      distance: '3.7 km',
      address: 'Victoria Island, Lagos',
      phone: '+234-701-345-6789',
      email: 'contact@reddingtonhospital.com',
      services: ['Diagnostics', 'Wellness', 'Specialist Care'],
      rating: 4.7,
      availability: 'Mon-Sat 8AM-6PM',
      tier: 'Tier 2'
    }
  ];

  // Mock claims data
  const claimsData = [
    {
      id: 'CLM-001',
      paCode: 'PA-1736789456789-123',
      provider: 'Lagos University Teaching Hospital',
      diagnosis: 'Malaria Treatment',
      amount: 42000,
      status: 'paid',
      submissionDate: '2025-01-10',
      paymentDate: '2025-01-15',
      paidAmount: 42000
    },
    {
      id: 'CLM-002',
      paCode: 'PA-1736789356789-456',
      provider: 'National Hospital Abuja',
      diagnosis: 'Diabetes Management',
      amount: 28500,
      status: 'approved',
      submissionDate: '2025-01-11',
      paymentDate: null,
      paidAmount: null
    }
  ];

  // Mock benefits data
  const benefitsData = {
    plan: enrolleeData.plan,
    annualLimit: enrolleeData.plan === 'Gold' ? 1000000 : enrolleeData.plan === 'Silver' ? 500000 : 200000,
    used: 70500,
    remaining: enrolleeData.plan === 'Gold' ? 929500 : enrolleeData.plan === 'Silver' ? 429500 : 129500,
    copay: enrolleeData.plan === 'Gold' ? 1000 : enrolleeData.plan === 'Silver' ? 1500 : 2000,
    deductible: enrolleeData.plan === 'Gold' ? 5000 : enrolleeData.plan === 'Silver' ? 10000 : 15000,
    services: {
      'Consultation': { limit: 50000, used: 15000 },
      'Laboratory': { limit: 100000, used: 25000 },
      'Medication': { limit: 200000, used: 30500 },
      'Surgery': { limit: 500000, used: 0 }
    }
  };

  useEffect(() => {
    // Get user location for nearby hospitals
    if (navigator.geolocation && activeTab === 'hospitals') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setNearbyProviders(providersData);
        },
        (error) => {
          console.log('Location access denied, showing all providers');
          setNearbyProviders(providersData);
        }
      );
    }
  }, [activeTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOnline) {
      saveFormData('enrollee_support', { timestamp: new Date().toISOString() });
      alert('You are offline. Your support request has been saved and will be sent when connection is restored.');
    } else {
      alert('Support request submitted successfully! We will contact you within 24 hours.');
    }
    setShowContactForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eagle-50 via-naija-50 to-gold-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-eagle-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop"
                alt="Eagle HMO Logo" 
                className="w-12 h-12 rounded-xl shadow-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-12 h-12 bg-gradient-to-br from-eagle-600 to-naija-600 rounded-xl flex items-center justify-center shadow-lg hidden">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-eagle-600 to-naija-600 bg-clip-text text-transparent">
                  Eagle HMO
                </h1>
                <p className="text-gold-600 font-semibold">Member Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Online/Offline Status */}
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{enrolleeData.name}</p>
                  <p className="text-xs text-gold-600">{enrolleeData.id}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-eagle-600 to-naija-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-medium text-white">
                    {enrolleeData.name.charAt(0)}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 flex items-center space-x-1"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-eagle-600 text-eagle-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-eagle-100 to-naija-100 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-eagle-600 to-naija-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {enrolleeData.name}! 👋
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Your health is our priority. Healthcare on Eagle's Wing.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-eagle-600" />
                  <span className="text-gray-700">Plan: {enrolleeData.plan}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-naija-600" />
                  <span className="text-gray-700">{enrolleeData.company}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gold-600" />
                  <span className="text-gray-700">Valid until {enrolleeData.expirationDate}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-eagle-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Plan Status</p>
                    <p className="text-2xl font-bold text-eagle-600">Active</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-naija-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Benefits Used</p>
                    <p className="text-2xl font-bold text-naija-600">₦{benefitsData.used.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gold-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Claims This Year</p>
                    <p className="text-2xl font-bold text-gold-600">{claimsData.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Nearby Hospitals</p>
                    <p className="text-2xl font-bold text-green-600">{providersData.length}</p>
                  </div>
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('hospitals')}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-eagle-50 to-eagle-100 rounded-lg hover:from-eagle-100 hover:to-eagle-200 transition-all"
                >
                  <MapPin className="w-6 h-6 text-eagle-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Find Hospital</p>
                    <p className="text-sm text-gray-600">Locate nearby providers</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('benefits')}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-naija-50 to-naija-100 rounded-lg hover:from-naija-100 hover:to-naija-200 transition-all"
                >
                  <CreditCard className="w-6 h-6 text-naija-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">View Benefits</p>
                    <p className="text-sm text-gray-600">Check coverage details</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('support')}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gold-50 to-gold-100 rounded-lg hover:from-gold-100 hover:to-gold-200 transition-all"
                >
                  <Phone className="w-6 h-6 text-gold-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Get Support</p>
                    <p className="text-sm text-gray-600">Contact our team</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enrollment Status Tab */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Enrollment Status</h2>
                <div className={`px-4 py-2 rounded-full border ${getStatusColor(enrolleeData.status)}`}>
                  <span className="font-medium">{enrolleeData.status.toUpperCase()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Full Name:</span>
                      <span className="font-medium text-gray-900">{enrolleeData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enrollee ID:</span>
                      <span className="font-medium text-gray-900">{enrolleeData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium text-gray-900">{enrolleeData.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium text-gray-900">{enrolleeData.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="font-medium text-gray-900">{enrolleeData.dateOfBirth}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Plan Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan Type:</span>
                      <span className="font-medium text-gray-900">{enrolleeData.plan} Plan</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Company:</span>
                      <span className="font-medium text-gray-900">{enrolleeData.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Effective Date:</span>
                      <span className="font-medium text-gray-900">{enrolleeData.effectiveDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expiration Date:</span>
                      <span className="font-medium text-gray-900">{enrolleeData.expirationDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Limit:</span>
                      <span className="font-medium text-gray-900">₦{benefitsData.annualLimit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital ID Card */}
              <div className="mt-8 bg-gradient-to-r from-eagle-600 to-naija-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Digital ID Card</h3>
                    <p className="text-lg">{enrolleeData.name}</p>
                    <p className="text-sm opacity-90">{enrolleeData.id}</p>
                    <p className="text-sm opacity-90">{enrolleeData.plan} Plan</p>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-2">
                      <Shield className="w-8 h-8 text-eagle-600" />
                    </div>
                    <p className="text-xs opacity-75">Valid until</p>
                    <p className="text-sm font-medium">{enrolleeData.expirationDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Find Hospitals Tab */}
        {activeTab === 'hospitals' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Nearby Hospitals</h2>
              
              {/* Location Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Location (Optional)
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Enter your address or postal code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500"
                  />
                  <button
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            setUserLocation({
                              lat: position.coords.latitude,
                              lng: position.coords.longitude
                            });
                            alert('Location detected! Showing nearby hospitals.');
                          },
                          () => alert('Location access denied. Showing all hospitals.')
                        );
                      }
                    }}
                    className="px-4 py-3 bg-eagle-600 text-white rounded-lg hover:bg-eagle-700 transition-colors flex items-center space-x-2"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Use My Location</span>
                  </button>
                </div>
              </div>

              {/* Providers List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyProviders.map((provider) => (
                  <div key={provider.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                        <p className="text-sm text-gray-600">{provider.distance} away</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        provider.tier === 'Tier 1' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {provider.tier}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{provider.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{provider.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{provider.availability}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">{provider.rating}/5.0</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {provider.services.slice(0, 3).map((service, index) => (
                          <span key={index} className="px-2 py-1 bg-eagle-100 text-eagle-800 text-xs rounded-full">
                            {service}
                          </span>
                        ))}
                        {provider.services.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{provider.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedProvider(provider)}
                        className="flex-1 bg-eagle-600 text-white py-2 rounded-lg hover:bg-eagle-700 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Navigation className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Benefits Tab */}
        {activeTab === 'benefits' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Benefits</h2>
              
              {/* Plan Overview */}
              <div className="bg-gradient-to-r from-eagle-50 to-naija-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Annual Limit</p>
                    <p className="text-2xl font-bold text-eagle-600">₦{benefitsData.annualLimit.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Used This Year</p>
                    <p className="text-2xl font-bold text-naija-600">₦{benefitsData.used.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Remaining</p>
                    <p className="text-2xl font-bold text-green-600">₦{benefitsData.remaining.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Copay</p>
                    <p className="text-2xl font-bold text-gold-600">₦{benefitsData.copay.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Service Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Service Utilization</h3>
                {Object.entries(benefitsData.services).map(([service, data]: [string, any]) => {
                  const percentage = calculateUsagePercentage(data.used, data.limit);
                  return (
                    <div key={service} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">{service}</span>
                        <span className="text-sm text-gray-600">
                          ₦{data.used.toLocaleString()} / ₦{data.limit.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            percentage >= 90 ? 'bg-red-500' : percentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{percentage}% used</span>
                        <span className="text-gray-600">₦{(data.limit - data.used).toLocaleString()} remaining</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Download Benefits Guide */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download Benefits Guide</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Claims Tab */}
        {activeTab === 'claims' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Claims History</h2>
              
              <div className="space-y-4">
                {claimsData.map((claim) => (
                  <div key={claim.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{claim.diagnosis}</h3>
                        <p className="text-gray-600">Claim: {claim.id} | PA: {claim.paCode}</p>
                        <p className="text-sm text-gray-500">Provider: {claim.provider}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getClaimStatusColor(claim.status)}`}>
                        {claim.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Submission Date</p>
                        <p className="font-medium text-gray-900">{claim.submissionDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Claim Amount</p>
                        <p className="font-medium text-gray-900">₦{claim.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        {claim.status === 'paid' ? (
                          <>
                            <p className="text-sm text-gray-600">Payment Date</p>
                            <p className="font-medium text-green-600">{claim.paymentDate}</p>
                            <p className="text-sm text-green-600">Paid: ₦{claim.paidAmount?.toLocaleString()}</p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-gray-600">Status</p>
                            <p className="font-medium text-gray-900">Processing</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>
              
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-eagle-50 rounded-lg">
                  <Phone className="w-8 h-8 text-eagle-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Call Center</h3>
                  <p className="text-eagle-600 font-bold text-lg">09020006666</p>
                  <p className="text-sm text-gray-600">24/7 Support Line</p>
                </div>
                
                <div className="text-center p-6 bg-naija-50 rounded-lg">
                  <Mail className="w-8 h-8 text-naija-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Claims Support</h3>
                  <p className="text-naija-600 font-medium">claims@eaglehmo.com</p>
                  <p className="text-sm text-gray-600">Claims inquiries</p>
                </div>
                
                <div className="text-center p-6 bg-gold-50 rounded-lg">
                  <Mail className="w-8 h-8 text-gold-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">General Support</h3>
                  <p className="text-gold-600 font-medium">callcenter@eaglehmo.com</p>
                  <p className="text-sm text-gray-600">General inquiries</p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Send us a message</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500">
                        <option>General Inquiry</option>
                        <option>Claims Issue</option>
                        <option>Provider Access</option>
                        <option>Billing Question</option>
                        <option>Technical Support</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500">
                        <option>Normal</option>
                        <option>High</option>
                        <option>Urgent</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-500 h-32 resize-none"
                      placeholder="Describe your issue or question..."
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-eagle-600 text-white px-6 py-3 rounded-lg hover:bg-eagle-700 transition-colors font-medium"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Provider Details Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{selectedProvider.name}</h2>
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedProvider.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedProvider.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedProvider.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedProvider.availability}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Services Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.services.map((service, index) => (
                      <span key={index} className="px-3 py-1 bg-eagle-100 text-eagle-800 text-sm rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="flex-1 bg-eagle-600 text-white py-3 rounded-lg hover:bg-eagle-700 transition-colors">
                  Get Directions
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                  Call Hospital
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrolleePortal;