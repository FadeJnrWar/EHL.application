import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Loader2, Star, Users, Award, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDefaultLogin = () => {
    setCredentials({
      email: 'emmanuel.onifade@eaglehmo.com',
      password: '1234',
    });
  };

  const handleProviderLogin = () => {
    setCredentials({
      email: 'provider@luth.edu.ng',
      password: 'provider123'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials.email, credentials.password);
      
      // Get the intended destination or default based on role
      const from = location.state?.from?.pathname || '/';
      
      // For providers, always go to provider portal
      if (credentials.email === 'provider@luth.edu.ng') {
        navigate('/provider', { replace: true });
      } else {
        // For other users, go to intended destination or dashboard
        navigate(from === '/provider' ? '/' : from, { replace: true });
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eagle-50 via-naija-50 to-gold-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-conic from-eagle-500 via-naija-500 to-gold-500"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-eagle-200 rounded-full opacity-20 animate-pulse-slow"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-naija-200 rounded-full opacity-20 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gold-200 rounded-full opacity-20 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding */}
          <div className="hidden lg:block space-y-8 animate-fade-in">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-eagle-600 to-naija-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-eagle-600 to-naija-600 bg-clip-text text-transparent">
                    Eagle HMO
                  </h1>
                  <p className="text-gold-600 font-semibold text-lg">Nigeria's Premier Healthcare</p>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Comprehensive Healthcare Management
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Empowering healthcare delivery across Nigeria with cutting-edge technology and compassionate care.
              </p>
            </div>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-eagle-100">
                <div className="w-12 h-12 bg-eagle-100 rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-eagle-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">12,847+</h3>
                <p className="text-sm text-gray-600">Active Enrollees</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-naija-100">
                <div className="w-12 h-12 bg-naija-100 rounded-lg flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-naija-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">247+</h3>
                <p className="text-sm text-gray-600">Partner Hospitals</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gold-100">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mb-3">
                  <Star className="w-6 h-6 text-gold-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">98.5%</h3>
                <p className="text-sm text-gray-600">Satisfaction Rate</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-red-100">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">24/7</h3>
                <p className="text-sm text-gray-600">Care Support</p>
              </div>
            </div>
          </div>
          
          {/* Right Side - Login Form */}
          <div className="max-w-md w-full mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 animate-slide-up">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-eagle-600 to-naija-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-eagle-600 to-naija-600 bg-clip-text text-transparent">
                  Eagle HMO
                </h1>
                <p className="text-gray-600 mt-1">Healthcare on Eagle's Wing</p>
                <p className="text-sm text-gold-600 font-medium">Management Portal</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-eagle-500 focus:border-transparent transition-all bg-white/80"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-eagle-500 focus:border-transparent transition-all pr-12 bg-white/80"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-eagle-600 to-naija-600 text-white py-3 rounded-xl hover:from-eagle-700 hover:to-naija-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center shadow-lg transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" /> Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <button
                  onClick={handleDefaultLogin}
                  className="text-sm text-eagle-600 hover:text-eagle-700 font-medium hover:underline transition-colors"
                >
                  Use Default Credentials
                </button>
                <div className="mt-2">
                  <button
                    onClick={handleProviderLogin}
                    className="text-sm text-naija-600 hover:text-naija-700 font-medium hover:underline transition-colors"
                  >
                    Provider Login (LUTH)
                  </button>
                </div>
                <div className="mt-2">
                  <button
                    onClick={() => setCredentials({
                      email: 'adebayo.olumide@zenithbank.com',
                      password: 'enrollee123'
                    })}
                    className="text-sm text-gold-600 hover:text-gold-700 font-medium hover:underline transition-colors"
                  >
                    Enrollee Login (Demo)
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Need help? Contact IT Support
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">New to Eagle HMO?</p>
                  <div className="flex flex-col space-y-2">
                    <a
                      href="/provider-registration"
                      className="text-sm text-eagle-600 hover:text-eagle-700 font-medium hover:underline transition-colors"
                    >
                      Register as Healthcare Provider
                    </a>
                    <a
                      href="/enrollee-registration"
                      className="text-sm text-naija-600 hover:text-naija-700 font-medium hover:underline transition-colors"
                    >
                      Register as Individual Member
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;