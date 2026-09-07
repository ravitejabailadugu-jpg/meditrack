import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Database, Activity, BarChart3, ChevronRight } from 'lucide-react';
const slides = [
    {
        icon: Database,
        title: 'Centralized Patient Records',
        description: 'Maintain comprehensive patient information in one secure, accessible location. Track medical history, treatments, and outcomes efficiently.'
    },
    {
        icon: Activity,
        title: 'Live Disease Status Tracking',
        description: 'Monitor patient conditions in real-time with instant updates on disease progression, treatments, and recovery status.'
    },
    {
        icon: BarChart3,
        title: 'Severity-Based Disease Analytics',
        description: 'Get actionable insights with advanced analytics categorizing diseases by severity levels for better resource allocation.'
    }
];
export default function OnboardingScreen() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();
    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
        else {
            navigate('/login');
        }
    };
    const handleSkip = () => {
        navigate('/login');
    };
    const Icon = slides[currentSlide].icon;
    return (<div className="min-h-screen flex flex-col bg-white">
      <div className="flex justify-end p-6">
        <button onClick={handleSkip} className="text-gray-500 hover:text-gray-700 font-medium btn">
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-16">
        <div className="max-w-xl text-center">
          <div className="bg-blue-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
            <Icon className="w-16 h-16 text-blue-600"/>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {slides[currentSlide].title}
          </h2>

          <p className="text-lg text-gray-600 mb-12">
            {slides[currentSlide].description}
          </p>

          <div className="flex justify-center gap-2 mb-12">
            {slides.map((_, index) => (<div key={index} className={`h-2 rounded-full transition-all ${index === currentSlide
                ? 'w-8 bg-blue-600'
                : 'w-2 bg-gray-300'}`}/>))}
          </div>

          <button onClick={handleNext} className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2 btn">
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            <ChevronRight className="w-5 h-5"/>
          </button>
        </div>
      </div>
    </div>);
}
