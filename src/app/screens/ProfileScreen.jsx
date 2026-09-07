import React from 'react';
import { API_BASE_URL } from '../../services';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { User, Phone, Briefcase, Edit, LogOut, Clock } from 'lucide-react';
const PROFILE_STORAGE_KEY = 'dds_profile_data';
export default function ProfileScreen() {
    const { userName, setUserName, userRole } = useApp();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [profileData, setProfileData] = useState({
        name: userName,
        phone: '',
        role: userRole,
        joinDate: 'January 2024'
    });
    useEffect(() => {
        fetchProfile();
    }, []);
    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile/`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to load profile');
            }
            setProfileData(prev => ({
                ...prev,
                name: data.name || prev.name,
                phone: data.phone || prev.phone,
                role: data.role || prev.role
            }));
            // Keep global context in sync
            if (data.name)
                setUserName(data.name);
        }
        catch (err) {
            setError(err.message || 'Could not connect to server');
            // Fallback: load from localStorage
            try {
                const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setProfileData(prev => ({
                        ...prev,
                        name: parsed.name || prev.name,
                        phone: parsed.phone || prev.phone,
                    }));
                    if (parsed.name)
                        setUserName(parsed.name);
                }
            }
            catch {
                // ignore parsing errors, treat as no saved data
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleLogout = async () => {
        try {
            await fetch(`${API_BASE_URL}/api/logout/`, {
                method: 'POST',
            });
            // Clear user data and navigate
            setUserName('');
            navigate('/login'); // Redirect to login instead of thank-you
        }
        catch (err) {
            console.error("Logout failed:", err);
            navigate('/login');
        }
    };
    return (<div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      {error && (<div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium">
          {error}
        </div>)}

      {isLoading ? (<div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>) : (<>
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{profileData.name}</h2>
                  <p className="text-gray-600">{profileData.role}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-gray-400"/>
                    <span className="text-sm text-gray-600">Member since {profileData.joinDate}</span>
                  </div>
                </div>
              </div>
              <button className="btn" onClick={() => navigate('/profile/edit')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4"/>
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-gray-600"/>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{profileData.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-gray-600"/>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-medium text-gray-900">{profileData.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600"/>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 gap-4 mt-6">
            <button onClick={handleLogout} className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow group btn">
              <LogOut className="w-8 h-8 text-red-600 mb-3 group-hover:scale-110 transition-transform"/>
              <h3 className="font-bold text-gray-900 mb-1">Logout</h3>
              <p className="text-sm text-gray-600">Sign out of your account</p>
            </button>
          </div>
        </>)}
    </div>);
}
