import React from 'react';
import { API_BASE_URL } from '../../services';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Upload } from 'lucide-react';
const PROFILE_STORAGE_KEY = 'dds_profile_data';
export default function EditProfileScreen() {
    const { userName, setUserName } = useApp();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: userName,
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');
    // Fetch current data on load — try API first, then localStorage
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const fetchProfile = async () => {
            console.log("DDS: Starting profile fetch...");
            try {
                const response = await fetch(`${API_BASE_URL}/api/profile/`, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (response.ok) {
                    const data = await response.json();
                    console.log("DDS: Profile fetch success", data);
                    if (isMounted) {
                        setFormData({
                            name: data.name || userName,
                            phone: data.phone || ''
                        });
                    }
                }
                else {
                    console.warn("DDS: Profile fetch non-ok response", response.status);
                }
            }
            catch (err) {
                if (err.name === 'AbortError') {
                    console.error("DDS: Profile fetch timed out");
                }
                else {
                    console.error("DDS: Profile fetch error", err);
                }
                // Fallback: load from localStorage
                try {
                    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
                    if (saved) {
                        const parsed = JSON.parse(saved);
                        console.log("DDS: Loaded from localStorage fallback", parsed);
                        if (isMounted) {
                            setFormData({
                                name: parsed.name || userName,
                                phone: parsed.phone || ''
                            });
                        }
                    }
                }
                catch (storageErr) {
                    console.error("DDS: LocalStorage fallback error", storageErr);
                }
            }
            finally {
                if (isMounted) {
                    console.log("DDS: Clearing loading state");
                    setIsFetching(false);
                }
            }
        };
        fetchProfile();
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        // Always save locally first so changes persist
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({
            name: formData.name,
            phone: formData.phone
        }));
        setUserName(formData.name);
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile/update/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: formData.name, phone: formData.phone }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || data.message || 'Failed to update on server');
            }
        }
        catch {
            // Server save failed is OK — local save already succeeded above
        }
        finally {
            setIsLoading(false);
            navigate('/profile');
        }
    };
    return (<div className="p-6 max-w-3xl mx-auto">
      <button className="btn" onClick={() => navigate('/profile')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-5 h-5"/>
        Back to Profile
      </button>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Profile</h1>

        {error && (<div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium">
            {error}
          </div>)}

        {isFetching ? (<div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>) : (<form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {String(formData.name || 'U').charAt(0).toUpperCase()}
              </div>
              <button type="button" className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors btn">
                <Upload className="w-4 h-4"/>
                Change Photo
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input className="form-control" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" required/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input className="form-control" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" required/>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center btn">
                {isLoading ? (<span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>) : ('Save Changes')}
              </button>
              <button className="btn" type="button" onClick={() => navigate('/profile')} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          </form>)}
      </div>
    </div>);
}
