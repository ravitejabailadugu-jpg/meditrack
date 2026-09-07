import React from 'react';
import { API_BASE_URL } from '../../services';
import { useState, useEffect } from 'react';
import { Moon, Globe, Save } from 'lucide-react';
export default function SettingsScreen() {
    const [settings, setSettings] = useState({
        notifications: true,
        emailAlerts: false,
        theme: 'Light',
        language: 'English'
    });
    const [activities, setActivities] = useState([]);
    const [saved, setSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    // Fetch settings and activity logs on load
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            setIsLoading(true);
            // 1. Fetch settings
            const settingsRes = await fetch(`${API_BASE_URL}/api/settings/`);
            if (settingsRes.ok) {
                const settingsData = await settingsRes.json();
                const rawLanguage = String(settingsData.language || 'english');
                setSettings(prev => ({
                    ...prev,
                    theme: settingsData.theme === 'system' ? 'Auto' : settingsData.theme === 'dark' ? 'Dark' : 'Light',
                    language: rawLanguage.charAt(0).toUpperCase() + rawLanguage.slice(1)
                }));
            }
            // 2. Fetch Activity log
            const activityRes = await fetch(`${API_BASE_URL}/api/activity-log/`);
            if (activityRes.ok) {
                const activityData = await activityRes.json();
                setActivities(activityData);
            }
        }
        catch (err) {
            console.error("Failed to load settings data", err);
            setError("Failed to load settings data from server.");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/save/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    theme: String(settings.theme || 'light').toLowerCase() === 'auto' ? 'system' : String(settings.theme || 'light').toLowerCase(),
                    language: String(settings.language || 'english').toLowerCase()
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to save settings');
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
        catch (err) {
            setError(err.message || "Failed to save settings");
        }
        finally {
            setIsSaving(false);
        }
    };
    return (<div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your application preferences</p>
      </div>

      {error && (<div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium">
          {error}
        </div>)}

      {isLoading ? (<div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>) : (<>
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="space-y-8">
              {/* Theme */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Moon className="w-6 h-6 text-blue-600"/>
                  <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
                </div>
                <div className="ml-9">
                  <p className="text-sm text-gray-600 mb-3">Theme Mode</p>
                  <div className="flex gap-3">
                    {['Light', 'Dark', 'Auto'].map((theme) => (<button className="btn" key={theme} onClick={() => setSettings({ ...settings, theme })} className={`px-6 py-2 rounded-lg font-medium transition-colors ${settings.theme === theme
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                        {theme}
                      </button>))}
                  </div>
                </div>
              </div>

              {/* Language */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-blue-600"/>
                  <h2 className="text-xl font-bold text-gray-900">Language</h2>
                </div>
                <div className="ml-9">
                  <select className="form-select" value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })} className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              {saved ? (<div className="bg-green-50 text-green-700 py-3 rounded-lg text-center font-medium">
                  Settings saved successfully!
                </div>) : (<button onClick={handleSave} disabled={isSaving} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed btn">
                  {isSaving ? (<>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>) : (<>
                      <Save className="w-5 h-5"/>
                      Save Settings
                    </>)}
                </button>)}
            </div>
          </div>
        </>)}
    </div>);
}
