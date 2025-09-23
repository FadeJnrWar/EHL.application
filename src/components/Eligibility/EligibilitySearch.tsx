import React, { useState } from 'react';
import { Search, User } from 'lucide-react';
import { enrollees } from '../../data/enrollees';

interface EligibilitySearchProps {
  onSearch: (data: any) => void;
  isLoading: boolean;
}

const EligibilitySearch: React.FC<EligibilitySearchProps> = ({ onSearch, isLoading }) => {
  const [searchData, setSearchData] = useState({
    enrolleeId: '',
    enrolleeName: '',
    enrolleePhone: ''
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredEnrollees, setFilteredEnrollees] = useState<any[]>([]);

  const handleEnrolleeIdChange = (value: string) => {
    setSearchData({ ...searchData, enrolleeId: value });
    
    if (value.length > 0) {
      const filtered = enrollees.filter(enrollee => 
        enrollee.id.toLowerCase().includes(value.toLowerCase()) ||
        enrollee.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredEnrollees(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
      setFilteredEnrollees([]);
      setSearchData({
        enrolleeId: '',
        enrolleeName: '',
        enrolleePhone: ''
      });
    }
  };

  const selectEnrollee = (enrollee: any) => {
    setSearchData({
      enrolleeId: enrollee.id,
      enrolleeName: enrollee.name,
      enrolleePhone: enrollee.phone
    });
    setShowDropdown(false);
  };

  const updateEnrolleePhone = (enrolleeId: string, newPhone: string) => {
    console.log(`Updating phone for ${enrolleeId} to ${newPhone}`);
    alert(`Phone number updated for enrollee ${enrolleeId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
          <Search className="w-5 h-5 text-sky-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Search Enrollee</h2>
          <p className="text-sm text-gray-600">Find enrollee by ID or personal details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enrollee ID
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchData.enrolleeId}
              onChange={(e) => handleEnrolleeIdChange(e.target.value)}
              onFocus={() => searchData.enrolleeId && setShowDropdown(true)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Enter enrollee ID or name"
            />
            
            {showDropdown && filteredEnrollees.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredEnrollees.map((enrollee) => (
                  <div
                    key={enrollee.id}
                    onClick={() => selectEnrollee(enrollee)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{enrollee.name}</p>
                        <p className="text-sm text-gray-600">{enrollee.id} • {enrollee.gender}, {enrollee.age}y</p>
                        <p className="text-xs text-gray-500">{enrollee.company}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          enrollee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {enrollee.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 my-4">OR</div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enrollee Name
          </label>
          <input
            type="text"
            value={searchData.enrolleeName}
            onChange={(e) => setSearchData({ ...searchData, enrolleeName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="Enter enrollee name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="flex space-x-2">
            <input
              type="tel"
              value={searchData.enrolleePhone}
              onChange={(e) => setSearchData({ ...searchData, enrolleePhone: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="+234-xxx-xxx-xxxx"
            />
            {searchData.enrolleeId && searchData.enrolleePhone && (
              <button
                type="button"
                onClick={() => updateEnrolleePhone(searchData.enrolleeId, searchData.enrolleePhone)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Update
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || (!searchData.enrolleeId && !searchData.enrolleeName) || !searchData.enrolleePhone}
          className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Check Eligibility</span>
            </>
          )}
        </button>
        
        {!searchData.enrolleePhone && (
          <p className="text-sm text-red-600 text-center">Phone number is required for eligibility check</p>
        )}
      </form>
    </div>
  );
};

export default EligibilitySearch;