import React from 'react';
import { API_BASE_URL } from '../../services';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
export default function EditPatientScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        age: '',
        gender: 'Male',
        phone: '',
        address: ''
    });
    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/patients/${id}/`);
                if (!response.ok)
                    throw new Error('Failed to fetch patient details');
                const data = await response.json();
                setFormData({
                    id: data.id.toString(),
                    name: data.name,
                    age: data.age.toString(),
                    gender: data.gender,
                    phone: data.phone_number || data.phone || '',
                    address: data.address
                });
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        };
        if (id)
            fetchPatient();
    }, [id]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/patients/${id}/update/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    age: parseInt(formData.age),
                    gender: formData.gender,
                    phone_number: formData.phone,
                    address: formData.address
                })
            });
            if (!response.ok)
                throw new Error('Failed to update patient');
            navigate(`/patients/${id}`);
        }
        catch (err) {
            console.error(err);
            alert('Error updating patient');
        }
        finally {
            setSubmitting(false);
        }
    };
    if (loading) {
        return (<div className="p-6 text-center">
        <p className="text-gray-500">Loading patient data...</p>
      </div>);
    }
    if (error) {
        return (<div className="p-6 text-center">
        <p className="text-red-500">{error || 'Patient not found'}</p>
      </div>);
    }
    return (<div className="p-6 max-w-3xl mx-auto">
      <button className="btn" onClick={() => navigate(`/patients/${id}`)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-5 h-5"/>
        Back to Patient Details
      </button>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Patient</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID
              </label>
              <input type="text" value={formData.id} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 form-control"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input className="form-control" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" required/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input className="form-control" type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" required/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select className="form-select" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input className="form-control" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" required/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input className="form-control" type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" required/>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 btn">
              {submitting ? 'Updating...' : 'Update Patient'}
            </button>
            <button className="btn" type="button" onClick={() => navigate(`/patients/${id}`)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>);
}
