import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import logo from '../../assets/logo.png';
export default function SplashScreen() {
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/welcome');
        }, 2500);
        return () => clearTimeout(timer);
    }, [navigate]);
    return (<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="animate-pulse mb-6">
        <img src={logo} alt="MediTrack" className="w-32 h-auto"/>
      </div>
      <h1 className="text-white text-4xl font-bold mb-2">
        MediTrack
      </h1>
      <p className="text-blue-100 text-lg">
        Comprehensive Healthcare Management System
      </p>
      <div className="mt-8">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>);
}
