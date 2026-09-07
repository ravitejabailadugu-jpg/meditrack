import React from 'react';
import { API_BASE_URL } from '../../services';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';
export default function AddDiseaseScreen() {
    const location = useLocation();
    const preSelectedPatientId = location.state?.patientId || '';
    const [formData, setFormData] = useState({
        id: `D${String(Date.now()).slice(-3)}`,
        patientId: preSelectedPatientId,
        name: '',
        diagnosisDate: new Date().toISOString().split('T')[0],
        severity: 'Mild',
        assignedDoctor: '',
        notes: '',
        status: 'Diagnosed'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { addDisease, patients } = useApp();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/patients/assign-disease/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient_id: formData.patientId,
                    disease_name: formData.name,
                    diagnosis_date: formData.diagnosisDate,
                    severity: formData.severity,
                    status: formData.status,
                    assigned_doctor: formData.assignedDoctor,
                    notes: formData.notes
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to assign disease');
            }
            addDisease({
                ...formData,
                history: [
                    {
                        date: formData.diagnosisDate,
                        status: formData.status,
                        severity: formData.severity,
                        remarks: 'Initial diagnosis'
                    }
                ]
            });
            navigate('/diseases');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<div className="p-6 max-w-3xl mx-auto">
      <button className="btn" onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-5 h-5"/>
        Back
      </button>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Disease (v2)</h1>
        <p className="text-gray-500 mb-6 font-medium">Patients found in database: {patients.length}</p>

        {error && (<div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
            {error}
          </div>)}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disease ID
              </label>
              <input className="form-control" type="text" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" required/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Patient ({patients.length} available)
              </label>
              <select className="form-select" value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" required>
                <option value="">Select a patient</option>
                {patients.map((patient) => (<option key={patient.id} value={patient.id}>
                    {patient.name} ({patient.id})
                  </option>))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disease Name
              </label>
              <input className="form-control" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="Enter disease name" required/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnosis Date
              </label>
              <input className="form-control" type="date" value={formData.diagnosisDate} onChange={(e) => setFormData({ ...formData, diagnosisDate: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" required/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <select className="form-select" value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Doctor
              </label>
              <input className="form-control" type="text" value={formData.assignedDoctor} onChange={(e) => setFormData({ ...formData, assignedDoctor: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="Enter doctor name" required/>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea className="form-control" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" rows={4} placeholder="Enter additional notes" required/>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 btn">
              {isSubmitting ? 'Saving...' : 'Save Disease'}
            </button>
            <button className="btn" type="button" onClick={() => navigate(-1)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>);
}
