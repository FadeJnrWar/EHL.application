import React, { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { generatePACode } from '../../utils/icd10Validator';

const PACodeGenerator: React.FC = () => {
  const [paCode, setPaCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const newCode = generatePACode();
    setPaCode(newCode);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(paCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-teal-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Generate PA Code</h3>
        <p className="text-gray-600">Create a new Prior Authorization code</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 text-center">
        {paCode ? (
          <div className="space-y-4">
            <div className="bg-white border-2 border-teal-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Generated PA Code</p>
              <p className="text-2xl font-bold text-teal-600 font-mono">{paCode}</p>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        ) : (
          <p className="text-gray-500 mb-4">No PA code generated yet</p>
        )}

        <button
          onClick={handleGenerate}
          className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors font-medium"
        >
          Generate New PA Code
        </button>
      </div>
    </div>
  );
};

export default PACodeGenerator;