import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import { OfflineProvider } from './contexts/OfflineContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Eligibility from './pages/Eligibility';
import Diagnoses from './pages/Diagnoses';
import Complaints from './pages/Complaints';
import Approvals from './pages/Approvals';
import Benefits from './pages/Benefits';
import Providers from './pages/Providers';
import Claims from './pages/Claims';
import Login from './pages/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ClaimsAnalytics from './pages/ClaimsAnalytics';
import PaymentProcessing from './pages/PaymentProcessing';
import ProviderContracts from './pages/ProviderContracts';
import ProviderPerformance from './pages/ProviderPerformance';
import MemberRegistration from './pages/MemberRegistration';
import PlanManagement from './pages/PlanManagement';
import Billing from './pages/Billing';
import FinancialReports from './pages/FinancialReports';
import RiskAssessment from './pages/RiskAssessment';
import PolicyManagement from './pages/PolicyManagement';
import Compliance from './pages/Compliance';
import AuditTrail from './pages/AuditTrail';
import SubmittedClaims from './pages/SubmittedClaims';
import ProviderPortal from './pages/ProviderPortal';
import ProviderRegistration from './pages/ProviderRegistration';
import EnrolleeRegistration from './pages/EnrolleeRegistration';
import OfflineMode from './pages/OfflineMode';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <OfflineProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/provider-registration" element={<ProviderRegistration />} />
              <Route path="/enrollee-registration" element={<EnrolleeRegistration />} />
              <Route path="/provider" element={
                <ProtectedRoute>
                  <ProviderPortal />
                </ProtectedRoute>
              } />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="eligibility" element={<Eligibility />} />
                <Route path="diagnoses" element={<Diagnoses />} />
                <Route path="complaints" element={<Complaints />} />
                <Route path="approvals" element={<Approvals />} />
                <Route path="benefits" element={<Benefits />} />
                <Route path="providers" element={<Providers />} />
                <Route path="claims" element={<Claims />} />
                <Route path="claims/submitted" element={<SubmittedClaims />} />
                <Route path="claims/analytics" element={<ClaimsAnalytics />} />
                <Route path="claims/payments" element={<PaymentProcessing />} />
                <Route path="providers/contracts" element={<ProviderContracts />} />
                <Route path="providers/performance" element={<ProviderPerformance />} />
                <Route path="enrollment/members" element={<MemberRegistration />} />
                <Route path="enrollment/plans" element={<PlanManagement />} />
                <Route path="enrollment/management" element={<EnrollmentManagement />} />
                <Route path="finance/billing" element={<Billing />} />
                <Route path="finance/reports" element={<FinancialReports />} />
                <Route path="underwriting/risk" element={<RiskAssessment />} />
                <Route path="underwriting/policies" element={<PolicyManagement />} />
                <Route path="regulation/compliance" element={<Compliance />} />
                <Route path="regulation/audit" element={<AuditTrail />} />
                <Route path="offline-mode" element={<OfflineMode />} />
              </Route>
            </Routes>
          </Router>
        </OfflineProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;