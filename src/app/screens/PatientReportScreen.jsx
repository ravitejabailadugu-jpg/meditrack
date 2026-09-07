import React from 'react';
import { API_BASE_URL } from '../../services';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Download, Filter } from 'lucide-react';
export default function PatientReportScreen() {
    const { patients, diseases } = useApp();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [reportData, setReportData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/reports/patients/`);
                if (response.ok) {
                    const data = await response.json();
                    setReportData(data);
                }
            }
            catch (err) {
                console.error("Failed to fetch patient report:", err);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchReport();
    }, []);
    const getPatientDiseaseCount = (patientId) => {
        return diseases.filter(d => d.patientId === patientId).length;
    };
    const getDisplayData = () => {
        if (reportData && reportData.length > 0) {
            return reportData.map((rp, index) => ({
                id: rp.id || `P-${index}`,
                name: rp.name,
                age: rp.age,
                gender: rp.gender || 'Unknown',
                phone: rp.phone || 'N/A',
                diseaseCount: rp.diseases !== undefined ? rp.diseases : 0
            }));
        }
        return patients.map(p => ({
            ...p,
            diseaseCount: getPatientDiseaseCount(p.id)
        }));
    };
    const baseData = getDisplayData();
    const filteredPatients = filter === 'All'
        ? baseData
        : baseData.filter(p => p.gender === filter);
    return (<div className="p-6 max-w-7xl mx-auto">
      <button className="btn" onClick={() => navigate('/reports')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-5 h-5"/>
        Back to Reports
      </button>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Report</h1>
            <p className="text-gray-600">Comprehensive patient data overview</p>
          </div>
          <button className="btn" onClick={() => navigate('/reports/download')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4"/>
            Export
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <Filter className="w-5 h-5 text-gray-600"/>
          <div className="flex gap-2">
            {['All', 'Male', 'Female', 'Other'].map((option) => (<button className="btn" key={option} onClick={() => setFilter(option)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === option
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                {option}
              </button>))}
          </div>
        </div>

        {isLoading ? (<div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>) : (<>
            {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Patient ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Age</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Gender</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Diseases</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (<tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{patient.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{patient.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{patient.age}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{patient.gender}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{patient.phone}</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      {patient.diseaseCount} cases
                    </span>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredPatients.length} of {baseData.length} patients
        </div>
        </>)}
      </div>
    </div>);
}
