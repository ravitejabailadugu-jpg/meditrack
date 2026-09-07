import React from 'react';
import { API_BASE_URL } from '../../services';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';
export default function UpdateDiseaseStatusScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { diseases, updateDisease } = useApp();
    const disease = diseases.find(d => d.id === id);
    const [formData, setFormData] = useState({
        status: disease?.status || '',
        severity: disease?.severity || 'Mild',
        remarks: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    if (!disease) {
        return (<div className="p-6 text-center">
        <p className="text-gray-500">Disease not found</p>
      </div>);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/patients/disease/${id}/update/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: formData.status,
                    severity: formData.severity
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update disease status');
            }
            // Update context if desired
            const updatedDisease = {
                ...disease,
                status: formData.status,
                severity: formData.severity,
                history: [
                    ...disease.history,
                    {
                        date: new Date().toISOString(),
                        status: formData.status,
                        severity: formData.severity,
                        remarks: formData.remarks
                    }
                ]
            };
            updateDisease(updatedDisease);
            navigate(`/diseases/${id}`);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<div className="p-6 max-w-3xl mx-auto">
      <button className="btn" onClick={() => navigate(`/diseases/${id}`)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-5 h-5"/>
        Back to Disease Details
      </button>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Disease Status</h1>
        <p className="text-gray-600 mb-6">{disease.name} ({disease.id})</p>

        {error && (<div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
            {error}
          </div>)}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Status
            </label>
            <input className="form-control" type="text" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="e.g., Under Treatment, Recovering, Stable" required/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity Level
            </label>
            <select className="form-select" value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks / Notes
            </label>
            <textarea className="form-control" value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" rows={4} placeholder="Enter any additional remarks or observations" required/>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 btn">
              {isSubmitting ? 'Saving...' : 'Save Update'}
            </button>
            <button className="btn" type="button" onClick={() => navigate(`/diseases/${id}`)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>);
}
