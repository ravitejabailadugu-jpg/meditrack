import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Search, Plus, User, Phone, MapPin } from 'lucide-react';
export default function PatientListScreen() {
    const { patients: contextPatients } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const loading = false; // Data is handled by AppContext
    const error = null;
    const filteredPatients = contextPatients.filter(patient => {
        try {
            const name = String(patient.name || '').toLowerCase();
            const id = String(patient.id || '').toLowerCase();
            const sTerm = String(searchTerm || '').toLowerCase();
            return name.includes(sTerm) || id.includes(sTerm);
        }
        catch (e) {
            console.error("Filter error for patient:", patient, e);
            return false;
        }
    });
    const getPatientDiseaseCount = (patientId) => {
        // For now we'll return 0 as the standard patient API doesn't include counts
        return 0;
    };
    return (<div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h1>
          <p className="text-gray-600">Manage all patient records</p>
        </div>
        <button className="btn" onClick={() => navigate('/patients/add')} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5"/>
          Add Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
          <input className="form-control" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search patients by name or ID..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"/>
        </div>
      </div>

      {loading && (<div className="text-center py-12 text-gray-500">
          Loading patients...
        </div>)}

      {error && (<div className="text-center py-12 text-red-500">
          Error: {error}
        </div>)}

      {/* Patient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (<div key={patient.id} onClick={() => navigate(`/patients/${patient.id}`)} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600"/>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-500">{patient.id}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4"/>
                {patient.age} years • {patient.gender}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4"/>
                {patient.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4"/>
                {patient.address}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Diseases</span>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  {getPatientDiseaseCount(patient.id)}
                </span>
              </div>
            </div>
          </div>))}
      </div>

      {!loading && !error && filteredPatients.length === 0 && (<div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
          <p className="text-gray-500">No patients found</p>
        </div>)}
    </div>);
}
