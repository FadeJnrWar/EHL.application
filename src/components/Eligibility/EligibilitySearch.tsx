import React, { useState } from 'react';
import { Search, User } from 'lucide-react';

interface EligibilitySearchProps {
  onSearch: (data: any) => void;
  isLoading: boolean;
}

const EligibilitySearch: React.FC<EligibilitySearchProps> = ({ onSearch, isLoading }) => {
  const [searchData, setSearchData] = useState({
    enrolleeId: '',
    enrolleeName: ''
  });

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
          <input
            type="text"
            value={searchData.enrolleeId}
            onChange={(e) => setSearchData({ ...searchData, enrolleeId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="Enter enrollee ID"
          />
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

        <button
          type="submit"
          disabled={isLoading || (!searchData.enrolleeId && !searchData.enrolleeName)}
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
      </form>
    </div>
  );
};

export default EligibilitySearch;