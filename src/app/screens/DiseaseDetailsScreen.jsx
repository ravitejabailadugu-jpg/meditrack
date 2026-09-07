import React from 'react';
import { API_BASE_URL } from '../../services';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Activity, User, Users, AlertTriangle, Info } from 'lucide-react';
export default function DiseaseDetailsScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { diseases: contextDiseases, patients: contextPatients } = useApp();
    const [disease, setDisease] = useState(null);
    const [diseasePatients, setDiseasePatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchDiseaseDetails = async () => {
            try {
                setLoading(true);
                const [diseaseRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/diseases/${id}/detail/`),
                ]);
                if (!diseaseRes.ok)
                    throw new Error('Failed to fetch case details from database');
                const recordData = await diseaseRes.json();
                setDisease({
                    id: recordData.record_id,
                    name: recordData.disease_name,
                    default_severity: recordData.severity,
                    description: recordData.notes
                });
                // Set the patient case info
                setDiseasePatients([{
                        patient: recordData.patient_name,
                        doctor: recordData.assigned_doctor,
                        severity: recordData.severity,
                        status: recordData.status,
                        diagnosis_date: recordData.diagnosis_date
                    }]);
                setError(null);
            }
            catch (err) {
                console.warn('Database fetch failed, falling back to local data:', err.message);
                // Fallback to local context data
                const foundDisease = contextDiseases.find(d => d.id === id || d.name === id);
                if (foundDisease) {
                    setDisease({
                        id: foundDisease.id,
                        name: foundDisease.name,
                        default_severity: foundDisease.severity,
                        description: foundDisease.notes
                    });
                    // Mock some patient records if context data matches
                    const linkedPatients = contextPatients
                        .filter(p => p.id === foundDisease.patientId)
                        .map(p => ({
                        patient: p.name,
                        doctor: foundDisease.assignedDoctor,
                        severity: foundDisease.severity,
                        status: foundDisease.status,
                        diagnosis_date: foundDisease.diagnosisDate
                    }));
                    setDiseasePatients(linkedPatients);
                    setError(null);
                }
                else {
                    setError("Could not find disease record in database or local storage.");
                }
            }
            finally {
                setLoading(false);
            }
        };
        if (id)
            fetchDiseaseDetails();
    }, [id, contextDiseases, contextPatients]);
    if (loading) {
        return (<div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Syncing disease details...</p>
      </div>);
    }
    if (error || !disease) {
        return (<div className="p-12 text-center max-w-md mx-auto">
        <div className="bg-amber-50 text-amber-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8"/>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Record Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'This disease record is not available in the database.'}</p>
        <button className="btn" onClick={() => navigate('/diseases')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Return to Disease List
        </button>
      </div>);
    }
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
    return (<div className="p-6 max-w-6xl mx-auto">
      <button className="btn" onClick={() => navigate('/diseases')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform"/>
        <span className="font-semibold">Back to Disease Management</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Activity className="w-10 h-10 text-blue-600"/>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{disease.name}</h1>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Record UID: #{disease.id}</p>
                </div>
              </div>
              <span className={`self-start px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 ${getSeverityColor(disease.default_severity || disease.severity)}`}>
                {disease.default_severity || disease.severity}
              </span>
            </div>

            <div className="pt-6 border-t border-gray-50">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info className="w-3.5 h-3.5"/>
                Clinical Overview
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg italic">
                {disease.description || "No clinical description has been recorded for this disease profile. High-level monitoring and standard protocol is advised."}
              </p>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-600"/>
                Linked Patient Cases
              </h2>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                {diseasePatients.length} Active
              </span>
            </div>

            <div className="p-6">
              {diseasePatients.length > 0 ? (<div className="space-y-4">
                  {diseasePatients.map((record, index) => (<div key={index} className="border border-gray-100 rounded-xl p-5 hover:bg-gray-50 transition-all border-l-4 border-l-blue-600">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600"/>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{record.patient}</p>
                            <p className="text-xs font-medium text-gray-400">Under: Dr. {record.doctor}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${getSeverityColor(record.severity)}`}>
                          {record.severity}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="bg-white p-2.5 rounded-lg border border-gray-50">
                          <p className="text-[9px] font-bold text-gray-300 uppercase mb-1">Status</p>
                          <p className="font-bold text-gray-600">{record.status}</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-gray-50">
                          <p className="text-[9px] font-bold text-gray-300 uppercase mb-1">Diagnosis Date</p>
                          <p className="font-bold text-gray-600">
                            {record.diagnosis_date ? new Date(record.diagnosis_date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>))}
                </div>) : (<div className="text-center py-16">
                  <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-gray-200"/>
                  </div>
                  <p className="text-gray-400 font-bold">No active cases registered</p>
                </div>)}
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-blue-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden group">
            <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500"/>
            <h3 className="text-xl font-bold mb-6 relative z-10">Quick Summary</h3>
            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Transmission Rate</p>
                <p className="text-3xl font-black">Low</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Active Clusters</p>
                <p className="text-3xl font-black">{diseasePatients.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600"/>
                Administrative
            </h3>
            <div className="space-y-3">
              <button className="btn" onClick={() => navigate('/diseases/add')} className="w-full py-4 px-4 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md active:scale-95">
                Create Global Record
              </button>
              <button disabled className="w-full py-4 px-4 bg-gray-50 text-gray-300 rounded-xl font-bold text-sm border border-gray-100 cursor-not-allowed btn">
                Download Protocol
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
