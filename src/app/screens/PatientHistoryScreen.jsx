import React from 'react';
import { API_BASE_URL } from '../../services';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Calendar, Activity } from 'lucide-react';
export default function PatientHistoryScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [historyEvents, setHistoryEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const [patientRes, historyRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/patients/${id}/`),
                    fetch(`${API_BASE_URL}/api/patients/${id}/history/`)
                ]);
                if (!patientRes.ok || !historyRes.ok) {
                    throw new Error('Failed to fetch patient history');
                }
                const patientData = await patientRes.json();
                setPatient(patientData);
                const historyData = await historyRes.json();
                // Sort by diagnosis date descending
                const sortedHistory = historyData.sort((a, b) => new Date(b.diagnosis_date || 0).getTime() - new Date(a.diagnosis_date || 0).getTime());
                setHistoryEvents(sortedHistory);
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        };
        if (id)
            fetchHistory();
    }, [id]);
    if (loading) {
        return (<div className="p-6 text-center">
        <p className="text-gray-500">Loading history...</p>
      </div>);
    }
    if (error || !patient) {
        return (<div className="p-6 text-center">
        <p className="text-red-500">{error || 'Patient not found'}</p>
      </div>);
    }
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Mild': return 'bg-green-100 text-green-700 border-green-300';
            case 'Moderate': return 'bg-amber-100 text-amber-700 border-amber-300';
            case 'Severe': return 'bg-red-100 text-red-700 border-red-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };
    return (<div className="p-6 max-w-4xl mx-auto">
      <button className="btn" onClick={() => navigate(`/patients/${id}`)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-5 h-5"/>
        Back to Patient Details
      </button>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient History</h1>
          <p className="text-gray-600">{patient.name} ({patient.id})</p>
        </div>

        {historyEvents.length > 0 ? (<div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-6">
              {historyEvents.map((event, index) => (<div key={index} className="relative pl-16">
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600"/>
                        <span className="text-sm font-medium text-gray-900">
                          {event.diagnosis_date ? new Date(event.diagnosis_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }) : 'Unknown Date'}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(event.severity)}`}>
                        {event.severity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-blue-600"/>
                      <span className="font-medium text-gray-900">{event.disease}</span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Status:</span> {event.status}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Assigned Doctor:</span> {event.assigned_doctor}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Last Updated:</span> {event.updated_at ? new Date(event.updated_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>))}
            </div>
          </div>) : (<div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
            <p className="text-gray-500">No history available for this patient</p>
          </div>)}
      </div>
    </div>);
}
