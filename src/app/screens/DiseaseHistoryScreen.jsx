import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Calendar } from 'lucide-react';
export default function DiseaseHistoryScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { diseases } = useApp();
    const disease = diseases.find(d => d.id === id);
    if (!disease) {
        return (<div className="p-6 text-center">
        <p className="text-gray-500">Disease not found</p>
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
      <button className="btn" onClick={() => navigate(`/diseases/${id}`)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-5 h-5"/>
        Back to Disease Details
      </button>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Disease History</h1>
          <p className="text-gray-600">{disease.name} ({disease.id})</p>
        </div>

        {disease.history.length > 0 ? (<div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-6">
              {[...disease.history].reverse().map((entry, index) => (<div key={index} className="relative pl-16">
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600"/>
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(entry.severity)}`}>
                        {entry.severity}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Status:</span> {entry.status}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Remarks:</span> {entry.remarks}
                      </p>
                    </div>
                  </div>
                </div>))}
            </div>
          </div>) : (<div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
            <p className="text-gray-500">No history available</p>
          </div>)}
      </div>
    </div>);
}
