import React from 'react';
import { useNavigate } from 'react-router';
import { Heart, Activity, TrendingUp } from 'lucide-react';
import logo from '../../assets/logo.png';
export default function WelcomeScreen() {
    const navigate = useNavigate();
    return (<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-2xl text-center">
        <div className="flex justify-center mb-8">
          <div className="bg-white p-6 rounded-full shadow-lg">
            <img src={logo} alt="MediTrack" className="w-24 h-auto"/>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to MediTrack
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          A comprehensive healthcare management system for tracking patient records, 
          disease status, and medical analytics in real-time.
        </p>
        
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2"/>
            <p className="text-sm text-gray-600">Live Tracking</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2"/>
            <p className="text-sm text-gray-600">Patient Care</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2"/>
            <p className="text-sm text-gray-600">Analytics</p>
          </div>
        </div>
        
        <button className="btn" onClick={() => navigate('/onboarding')} className="bg-blue-600 text-white px-12 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors shadow-lg">
          Get Started
        </button>
      </div>
    </div>);
}
