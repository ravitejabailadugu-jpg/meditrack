import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Stethoscope } from 'lucide-react';
import { useApp } from '../context/AppContext';
export default function RoleSelectionScreen() {
    const [selectedRole, setSelectedRole] = useState('');
    const navigate = useNavigate();
    const { setUserRole } = useApp();
    const roles = [
        {
            id: 'doctor',
            name: 'Doctor',
            icon: Stethoscope,
            description: 'Access to patient records, disease management, and medical reports'
        }
    ];
    const handleContinue = () => {
        if (selectedRole) {
            setUserRole('Doctor');
            navigate('/login');
        }
    };
    return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Select Your Role
          </h1>
          <p className="text-lg text-gray-600">
            Choose how you'll be using the system
          </p>
        </div>

        <div className="grid md:grid-cols-1 max-w-xl mx-auto gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (<button className="btn" key={role.id} onClick={() => setSelectedRole(role.id)} className={`bg-white p-8 rounded-xl text-left transition-all ${selectedRole === role.id
                    ? 'ring-4 ring-blue-600 shadow-xl'
                    : 'hover:shadow-lg'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${selectedRole === role.id ? 'bg-blue-600' : 'bg-blue-100'}`}>
                  <Icon className={`w-8 h-8 ${selectedRole === role.id ? 'text-white' : 'text-blue-600'}`}/>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {role.name}
                </h3>
                <p className="text-gray-600">
                  {role.description}
                </p>
              </button>);
        })}
        </div>

        <div className="text-center">
          <button onClick={handleContinue} disabled={!selectedRole} className="bg-blue-600 text-white px-12 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed btn">
            Continue
          </button>
        </div>
      </div>
    </div>);
}
