import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, FileText, Download, CheckCircle } from 'lucide-react';
export default function DownloadReportScreen() {
    const [format, setFormat] = useState('PDF');
    const [reportType, setReportType] = useState('Complete');
    const [downloaded, setDownloaded] = useState(false);
    const navigate = useNavigate();
    const handleDownload = () => {
        // Mock download
        setDownloaded(true);
        setTimeout(() => {
            setDownloaded(false);
        }, 3000);
    };
    return (<div className="p-6 max-w-3xl mx-auto">
      <button className="btn" onClick={() => navigate('/reports')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-5 h-5"/>
        Back to Reports
      </button>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600"/>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Download Report</h1>
          <p className="text-gray-600">Export your data in multiple formats</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Report Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Complete', 'Patients Only', 'Diseases Only'].map((type) => (<button className="btn" key={type} onClick={() => setReportType(type)} className={`p-4 border-2 rounded-lg transition-colors ${reportType === type
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-200 hover:border-gray-300'}`}>
                  <p className="font-medium">{type}</p>
                </button>))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Format
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['PDF', 'Excel'].map((fmt) => (<button className="btn" key={fmt} onClick={() => setFormat(fmt)} className={`p-4 border-2 rounded-lg transition-colors ${format === fmt
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-200 hover:border-gray-300'}`}>
                  <FileText className="w-6 h-6 mx-auto mb-2"/>
                  <p className="font-medium">{fmt}</p>
                </button>))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Report Details</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Type: {reportType}</li>
              <li>• Format: {format}</li>
              <li>• Generated: {new Date().toLocaleDateString()}</li>
            </ul>
          </div>

          {downloaded ? (<div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 py-3 rounded-lg">
              <CheckCircle className="w-5 h-5"/>
              <span className="font-medium">Report downloaded successfully!</span>
            </div>) : (<button onClick={handleDownload} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 btn">
              <Download className="w-5 h-5"/>
              Download Report
            </button>)}
        </div>
      </div>
    </div>);
}
