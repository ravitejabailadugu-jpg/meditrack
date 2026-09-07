import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Activity, CheckCircle } from 'lucide-react';
export default function ThankYouScreen() {
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigate]);
    return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="text-center max-w-md px-6">
        <div className="mb-6 relative">
          <Activity className="w-24 h-24 text-white mx-auto mb-4"/>
          <CheckCircle className="w-12 h-12 text-green-400 absolute top-0 right-1/3 animate-bounce"/>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">
          Thank You!
        </h1>
        
        <p className="text-xl text-blue-100 mb-8">
          You have been successfully logged out from the Database of Disease Status system.
        </p>
        
        <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-8">
          <p className="text-blue-100 mb-4">
            Your session has ended securely. We hope you had a productive experience managing healthcare data.
          </p>
          <p className="text-sm text-blue-200">
            Redirecting to login in 5 seconds...
          </p>
        </div>
        
        <button className="btn" onClick={() => navigate('/')} className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
          Return to Login
        </button>
      </div>
    </div>);
}
