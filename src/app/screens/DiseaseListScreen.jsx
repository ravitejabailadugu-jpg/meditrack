import React from 'react';
import { API_BASE_URL } from '../../services';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import { Search, Plus, Activity, AlertTriangle } from 'lucide-react';
export default function DiseaseListScreen() {
    const { diseases: contextDiseases } = useApp();
    const [diseases, setDiseases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const filterParam = params.get('filter');
        if (filterParam) {
            if (['Low', 'Medium', 'High', 'Critical'].includes(filterParam)) {
                setSeverityFilter(filterParam);
            }
            else {
                setStatusFilter(filterParam);
            }
        }
    }, [location]);
    useEffect(() => {
        const fetchDiseases = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/diseases/`);
                if (!response.ok)
                    throw new Error('Failed to fetch diseases');
                const data = await response.json();
                // Map backend PatientDisease record to frontend expected format
                const mapped = data.map((d) => ({
                    ...d,
                    id: d.record_id,
                    name: d.disease_name || 'Unnamed Disease',
                    patientName: d.patient_name || 'Anonymous'
                }));
                setDiseases(mapped);
            }
            catch (err) {
                setError(err.message || 'Failed to fetch diseases from the backend server.');
            }
            finally {
                setLoading(false);
            }
        };
        fetchDiseases();
    }, [contextDiseases]);
    const getDiseaseSeverity = (disease) => {
        return disease.default_severity || disease.severity || 'Unknown';
    };
    const filteredDiseases = diseases.filter(disease => {
        try {
            const severity = getDiseaseSeverity(disease);
            const name = String(disease.name || 'Unnamed Disease').toLowerCase();
            const sTerm = String(searchTerm || '').toLowerCase();
            const matchesSearch = name.includes(sTerm);
            const matchesSeverity = severityFilter === 'All' || severity === severityFilter;
            let matchesStatus = true;
            const status = String(disease.status || '').toLowerCase();
            const sFilter = String(statusFilter || '').toLowerCase();
            if (sFilter === 'active') {
                matchesStatus = !['recovered', 'cured'].includes(status);
            }
            else if (sFilter === 'critical') {
                matchesStatus = status === 'critical' || severity === 'Severe';
            }
            else if (sFilter === 'recovering') {
                matchesStatus = status === 'recovering';
            }
            else if (sFilter !== 'all') {
                matchesStatus = status === sFilter;
            }
            return matchesSearch && matchesSeverity && matchesStatus;
        }
        catch (e) {
            console.error("Filter error for disease:", disease, e);
            return false;
        }
    });
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Low':
            case 'Mild': return 'bg-green-100 text-green-700 border-green-300';
            case 'Medium':
            case 'Moderate': return 'bg-amber-100 text-amber-700 border-amber-300';
            case 'High': return 'bg-orange-100 text-orange-700 border-orange-300';
            case 'Critical':
            case 'Severe': return 'bg-red-100 text-red-700 border-red-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };
    return (<div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Disease Management</h1>
          <p className="text-gray-600">Track and manage all disease records</p>
        </div>
        <button className="btn" onClick={() => navigate('/diseases/add')} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5"/>
          Add Disease
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            <input className="form-control" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search diseases by name..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"/>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 mr-4">
              <span className="text-sm text-gray-500 font-medium">Status:</span>
              <select className="form-select" value={statusFilter} onChange={(e) => {
            setStatusFilter(e.target.value);
            // Update URL to remove filter param if changed manually
            navigate('/diseases', { replace: true });
        }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Critical">Critical</option>
                <option value="Recovering">Recovering</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 border-l pl-4">
              <span className="text-sm text-gray-500 font-medium">Severity:</span>
              <div className="flex flex-wrap gap-2">
                {['All', 'Low', 'Medium', 'High', 'Critical'].map((severity) => (<button className="btn" key={severity} onClick={() => {
                setSeverityFilter(severity);
                navigate('/diseases', { replace: true });
            }} className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${severityFilter === severity
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    {severity}
                  </button>))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (<div className="text-center py-12 text-gray-500 flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
          Loading diseases...
        </div>)}

      {/* Disease List */}
      {!loading && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDiseases.map((disease) => {
                const severity = getDiseaseSeverity(disease);
                return (<div key={disease.id} onClick={() => navigate(`/diseases/${disease.id}`)} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <Activity className="w-6 h-6 text-blue-600"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-gray-900 text-lg truncate">{disease.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getSeverityColor(severity)}`}>
                        {severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">ID: #{disease.id}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <AlertTriangle className="w-4 h-4 text-gray-400"/>
                      <span>Severity level: {severity}</span>
                    </div>
                  </div>
                </div>
              </div>);
            })}
        </div>)}

      {!loading && filteredDiseases.length === 0 && (<div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
          <p className="text-gray-500 font-medium">No records found matching your criteria</p>
        </div>)}
    </div>);
}
