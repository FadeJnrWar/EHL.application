import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect providers to their portal
  if (user.role === 'Provider') {
    // Only redirect if not already on provider route
    if (!location.pathname.startsWith('/provider')) {
      return <Navigate to="/provider" replace />;
    }
  }

  // Redirect enrollees to their portal
  if (user.role === 'Enrollee') {
    // Only redirect if not already on enrollee route
    if (!location.pathname.startsWith('/enrollee')) {
      return <Navigate to="/enrollee" replace />;
    }
  }

  // Redirect non-providers away from provider portal (except Super Admin)
  if (user.role !== 'Provider' && !user.permissions?.includes('all') && location.pathname.startsWith('/provider')) {
    return <Navigate to="/" replace />;
  }

  // Redirect non-enrollees away from enrollee portal (except Super Admin)
  if (user.role !== 'Enrollee' && !user.permissions?.includes('all') && location.pathname.startsWith('/enrollee')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;