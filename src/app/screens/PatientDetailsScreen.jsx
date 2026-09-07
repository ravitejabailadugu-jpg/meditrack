import React from 'react';
import { API_BASE_URL } from '../../services';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, User, Phone, MapPin, Calendar, Edit, Plus, Activity, Trash2 } from 'lucide-react';
export default function PatientDetailsScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { patients: contextPatients, diseases: contextDiseases } = useApp();
    const [patient, setPatient] = useState(null);
    const [patientDiseases, setPatientDiseases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                setLoading(true);
                const [patientRes, historyRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/patients/${id}/`),
                    fetch(`${API_BASE_URL}/api/patients/${id}/history/`)
                ]);
                if (!patientRes.ok)
                    throw new Error('Failed to fetch patient details');
                const patientData = await patientRes.json();
                setPatient(patientData);
                if (historyRes.ok) {
                    const historyData = await historyRes.json();
                    // Merge history data with patientData.diseases to get record_id
                    const mergedDiseases = patientData.diseases?.map((d) => {
                        const historyItem = historyData.find((h) => h.disease === d.disease_name);
                        return {
                            ...historyItem,
                            record_id: d.record_id,
                            disease: d.disease_name,
                            status: d.status,
                            severity: d.severity
                        };
                    }) || [];
                    setPatientDiseases(mergedDiseases);
                }
                setError(null);
            }
            catch (err) {
                console.error('Fetch error:', err);
                setError('Patient not found in database or failed to connect to backend.');
            }
            finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchPatientData();
        }
    }, [id, contextPatients, contextDiseases]);
    if (loading) {
        return (<div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Fetching patient records...</p>
      </div>);
    }
    if (error || !patient) {
        return (<div className="p-12 text-center max-w-md mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8"/>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Patient Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'The patient record you are looking for does not exist.'}</p>
        <button className="btn" onClick={() => navigate('/patients')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Return to Patient List
        </button>
      </div>);
    }
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Low':
            case 'Mild': return 'bg-green-100 text-green-700 border-green-200';
            case 'Medium':
            case 'Moderate': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Severe':
            case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };
    const handleDeletePatient = async () => {
        if (window.confirm("Are you sure you want to delete this patient and all related records?")) {
            try {
                const res = await fetch(`${API_BASE_URL}/api/patients/${id}/delete/`, {
                    method: 'DELETE',
                });
                if (res.ok) {
                    navigate('/patients');
                }
                else {
                    alert('Failed to delete patient from database');
                }
            }
            catch (err) {
                alert('Could not connect to database to delete patient');
            }
        }
    };
    const handleDeleteDisease = async (recordId) => {
        if (window.confirm("Are you sure you want to delete this disease record?")) {
            try {
                const res = await fetch(`${API_BASE_URL}/api/patients/disease/${recordId}/delete/`, {
                    method: 'DELETE',
                });
                if (res.ok) {
                    setPatientDiseases(prev => prev.filter(d => d.record_id !== recordId));
                }
                else {
                    alert('Failed to delete disease record');
                }
            }
            catch (err) {
                alert('An error occurred while deleting the disease record');
            }
        }
    };
    return (<div className="p-6 max-w-7xl mx-auto">
      <button className="btn" onClick={() => navigate('/patients')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group transition-colors">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform"/>
        <span className="font-medium">Back to Patients</span>
      </button>

      {/* Patient Summary Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center">
              <User className="w-12 h-12 text-blue-600"/>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold text-gray-900">{patient.name}</h1>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Active</span>
              </div>
              <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Patient UID: #{patient.id}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button className="btn" onClick={() => navigate(`/patients/${id}/edit`)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-5 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-all">
              <Edit className="w-4 h-4"/>
              Edit Profile
            </button>
            <button onClick={handleDeletePatient} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-all btn">
              <Trash2 className="w-4 h-4"/>
              Delete Record
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <User className="w-3.5 h-3.5"/>
                Demographics
            </p>
            <p className="text-lg font-bold text-gray-800">{patient.age} Years • {patient.gender}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5"/>
                Contact Information
            </p>
            <p className="text-lg font-bold text-gray-800">{patient.phone_number || patient.phone || 'No Contact'}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5"/>
                Primary Address
            </p>
            <p className="text-lg font-bold text-gray-800 truncate">{patient.address || 'No Address'}</p>
          </div>
        </div>
      </div>

      {/* Disease Records Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Activity className="w-7 h-7 text-blue-600"/>
                Clinical Disease Records
            </h2>
            <p className="text-gray-400 font-medium mt-1">Medical history and current diagnoses</p>
          </div>
          <div className="flex gap-3">
            <button className="btn" onClick={() => navigate(`/patients/${id}/history`)} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold text-sm bg-gray-50 px-4 py-2 rounded-lg transition-all">
              <Calendar className="w-4 h-4"/>
              Full History
            </button>
            <button className="btn" onClick={() => navigate('/diseases/add', { state: { patientId: id } })} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md">
              <Plus className="w-4 h-4 stroke-[3]"/>
              New Diagnosis
            </button>
          </div>
        </div>

        {patientDiseases.length > 0 ? (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {patientDiseases.map((disease, index) => (<div key={index} onClick={() => disease.record_id && navigate(`/diseases/${disease.record_id}`)} className="group relative border border-gray-100 bg-gray-50/50 rounded-2xl p-6 hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>

                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-xl group-hover:text-blue-600 transition-colors mb-1">
                        {disease.disease || disease.name}
                    </h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Calendar className="w-3 h-3"/>
                        Diagnosed: {disease.diagnosis_date || disease.date ? new Date(disease.diagnosis_date || disease.date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border-2 ${getSeverityColor(disease.severity)}`}>
                      {disease.severity}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 mb-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Status</span>
                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{disease.status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Attending</span>
                        <span className="text-sm font-bold text-gray-700">Dr. {disease.assigned_doctor || 'N/A'}</span>
                    </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="btn" onClick={(e) => { e.stopPropagation(); navigate(`/diseases/${disease.record_id}/update-status`); }} className="flex-1 text-xs font-bold bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Update
                    </button>
                    <button className="btn" onClick={(e) => { e.stopPropagation(); handleDeleteDisease(disease.record_id); }} className="flex-1 text-xs font-bold bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100">
                      Remove
                    </button>
                </div>
              </div>))}
          </div>) : (<div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Activity className="w-10 h-10 text-gray-200"/>
            </div>
            <p className="text-gray-400 font-bold text-lg">No clinical disease records found for this patient</p>
            <p className="text-gray-400 text-sm mt-1">Start by adding a new diagnosis for the patient.</p>
          </div>)}
      </div>
    </div>);
}
