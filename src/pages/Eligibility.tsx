import React, { useState } from 'react';
import { Search, User, CheckCircle, XCircle, Clock } from 'lucide-react';
import EligibilitySearch from '../components/Eligibility/EligibilitySearch';
import EligibilityResults from '../components/Eligibility/EligibilityResults';
import { findEnrolleeById, enrollees } from '../data/enrollees';
import OfflineBanner from '../components/Common/OfflineBanner';

const Eligibility: React.FC = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (searchData: any) => {
    setIsLoading(true);
    
    setTimeout(() => {
      let enrollee = null;
      
      // Search by ID first
      if (searchData.enrolleeId) {
        enrollee = findEnrolleeById(searchData.enrolleeId);
      } 
      // Search by name if no ID provided
      else if (searchData.enrolleeName) {
        enrollee = enrollees.find(e => 
          e.name.toLowerCase().includes(searchData.enrolleeName.toLowerCase())
        );
      }
      
      if (enrollee) {
        setSearchResults({
          enrolleeId: enrollee.id,
          name: enrollee.name,
          gender: enrollee.gender,
          age: enrollee.age,
          dateOfBirth: enrollee.dateOfBirth,
          status: enrollee.status, // This will be 'active' or 'inactive'
          plan: `${enrollee.plan} Plan`,
          company: enrollee.company,
          effectiveDate: enrollee.effectiveDate,
          expirationDate: enrollee.expirationDate,
          phone: enrollee.phone,
          email: enrollee.email,
          // Calculate benefits based on plan and status
          copay: enrollee.status === 'inactive' ? 'N/A' : (enrollee.plan === 'Gold' ? '₦1,000' : enrollee.plan === 'Silver' ? '₦1,500' : '₦2,000'),
          deductible: enrollee.status === 'inactive' ? 'N/A' : (enrollee.plan === 'Gold' ? '₦5,000' : enrollee.plan === 'Silver' ? '₦10,000' : '₦15,000'),
          remainingDeductible: enrollee.status === 'inactive' ? 'N/A' : (enrollee.plan === 'Gold' ? '₦1,500' : enrollee.plan === 'Silver' ? '₦3,000' : '₦5,000'),
          benefitsUsed: enrollee.status === 'inactive' ? 'N/A' : (enrollee.plan === 'Gold' ? '₦45,000' : enrollee.plan === 'Silver' ? '₦25,000' : '₦15,000'),
          benefitsRemaining: enrollee.status === 'inactive' ? 'N/A' : (enrollee.plan === 'Gold' ? '₦455,000' : enrollee.plan === 'Silver' ? '₦275,000' : '₦185,000')
        });
      } else {
        setSearchResults(null);
        alert('Enrollee not found. Please check the ID or name and try again.');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <OfflineBanner />
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Enrollee Eligibility</h1>
        <p className="text-gray-600 mt-1">Check enrollee eligibility and benefit information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <EligibilitySearch onSearch={handleSearch} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2">
          <EligibilityResults results={searchResults} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Eligibility;