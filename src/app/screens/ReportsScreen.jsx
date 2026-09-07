import React from 'react';
import { API_BASE_URL } from '../../services';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Download, Activity, PieChart, ActivitySquare, CheckCircle } from 'lucide-react';
export default function ReportsScreen() {
    const navigate = useNavigate();
    const [summary, setSummary] = useState({
        total_cases: 0,
        recovery_rate: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/reports/summary/`);
                if (!response.ok)
                    throw new Error('Failed to fetch summary data');
                const data = await response.json();
                setSummary(data);
            }
            catch (err) {
                setError('Failed to connect to the backend server. Using offline data.');
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchSummary();
    }, []);
    const handleDownload = async (format) => {
        setIsDownloading(true);
        try {
            // Simulate download or redirect to API if it exists
            window.location.href = `${API_BASE_URL}/api/reports/download/?format=${format}`;
        }
        catch (err) {
            alert("Failed to download report. Make sure the server is running.");
        }
        finally {
            setIsDownloading(false);
        }
    };
    return (<div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive insights and data analysis</p>
      </div>

      {isLoading ? (<div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>) : (<>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center text-center border border-gray-100">
              <div className="bg-blue-50 p-4 rounded-full mb-4 text-blue-600">
                <ActivitySquare className="w-12 h-12"/>
              </div>
              <p className="text-4xl font-bold text-gray-900">{summary.total_cases}</p>
              <p className="text-lg font-medium text-gray-600 mt-2">Total Cases</p>
              <p className="text-sm text-gray-500 mt-1 font-normal text-balance">Cumulative recorded cases across all regions</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center text-center border border-gray-100">
              <div className="bg-green-50 p-4 rounded-full mb-4 text-green-600">
                <CheckCircle className="w-12 h-12"/>
              </div>
              <p className="text-4xl font-bold text-gray-900">{summary.recovery_rate}%</p>
              <p className="text-lg font-medium text-gray-600 mt-2">Recovery Rate</p>
              <p className="text-sm text-gray-500 mt-1 font-normal text-balance">Average success rate of clinical recoveries</p>
            </div>
          </div>

          {/* Export Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Export Full Dataset</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="btn" onClick={() => handleDownload('csv')} disabled={isDownloading} className="p-6 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-left disabled:opacity-50">
                <PieChart className="w-8 h-8 mb-3"/>
                <h3 className="font-bold mb-1">Download CSV</h3>
                <p className="text-sm opacity-80">Raw data format</p>
              </button>

              <button className="btn" onClick={() => handleDownload('excel')} disabled={isDownloading} className="p-6 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-left disabled:opacity-50">
                <Activity className="w-8 h-8 mb-3"/>
                <h3 className="font-bold mb-1">Download Excel</h3>
                <p className="text-sm opacity-80">Spreadsheet format</p>
              </button>

              <button className="btn" onClick={() => handleDownload('pdf')} disabled={isDownloading} className="p-6 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-left disabled:opacity-50">
                <Download className="w-8 h-8 mb-3"/>
                <h3 className="font-bold mb-1">Download PDF</h3>
                <p className="text-sm opacity-80">Formatted print document</p>
              </button>
            </div>
          </div>
        </>)}
    </div>);
}
