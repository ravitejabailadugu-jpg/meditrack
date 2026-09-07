import React from 'react';
import { API_BASE_URL } from '../../services';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Users, Activity, AlertTriangle, HeartPulse } from 'lucide-react';
export default function DashboardScreen() {
    const { diseases } = useApp();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        total_cases: 0,
        active_cases: 0,
        critical_cases: 0,
        recovering_cases: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/dashboard/`);
                if (!response.ok)
                    throw new Error('Failed to fetch dashboard data');
                const data = await response.json();
                setDashboardData(data);
            }
            catch (err) {
                setError('Failed to connect to backend server. Ensure it is running to view live dashboard data.');
                setError(err.message || 'Failed to connect to server');
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchDashboard();
    }, []);
    const metrics = [
        {
            title: 'Total Cases',
            value: dashboardData.total_cases,
            icon: Users,
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            filter: 'All'
        },
        {
            title: 'Active Cases',
            value: dashboardData.active_cases,
            icon: Activity,
            color: 'bg-orange-500',
            textColor: 'text-orange-600',
            filter: 'Active'
        },
        {
            title: 'Critical Cases',
            value: dashboardData.critical_cases,
            icon: AlertTriangle,
            color: 'bg-red-500',
            textColor: 'text-red-600',
            filter: 'Critical'
        },
        {
            title: 'Recovering Cases',
            value: dashboardData.recovering_cases,
            icon: HeartPulse,
            color: 'bg-green-500',
            textColor: 'text-green-600',
            filter: 'Recovering'
        }
    ];
    return (<div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of disease status and patient statistics</p>
      </div>

      {error && (<div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium">
          {error}
        </div>)}

      {isLoading ? (<div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>) : (<>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric) => {
                const Icon = metric.icon;
                return (<div key={metric.title} className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/diseases?filter=${metric.filter}`)}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${metric.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white"/>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{metric.title}</p>
                  <p className={`text-3xl font-bold ${metric.textColor}`}>{metric.value}</p>
                </div>);
            })}
          </div>
        </>)}
    </div>);
}
