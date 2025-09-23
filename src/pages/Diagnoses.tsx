import React, { useState } from 'react';
import { Upload, Search, FileText, Check } from 'lucide-react';
import DiagnosisUpload from '../components/Diagnoses/DiagnosisUpload';
import PACodeGenerator from '../components/Diagnoses/PACodeGenerator';
import DiagnosisHistory from '../components/Diagnoses/DiagnosisHistory';
import OfflineBanner from '../components/Common/OfflineBanner';

const Diagnoses: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');

  const tabs = [
    { id: 'upload', label: 'Upload Diagnoses', icon: Upload },
    { id: 'generate', label: 'Generate PA Code', icon: FileText },
    { id: 'history', label: 'History', icon: Search }
  ];

  return (
    <div className="space-y-6">
      <OfflineBanner />
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Diagnoses & PA Management</h1>
        <p className="text-gray-600 mt-1">Upload enrollee diagnoses and generate Prior Authorization codes</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-sky-600 text-sky-700'
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

        <div className="p-6">
          {activeTab === 'upload' && <DiagnosisUpload />}
          {activeTab === 'generate' && <PACodeGenerator />}
          {activeTab === 'history' && <DiagnosisHistory />}
        </div>
      </div>
    </div>
  );
};

export default Diagnoses;