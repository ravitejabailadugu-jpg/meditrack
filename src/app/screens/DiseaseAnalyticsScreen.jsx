import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
export default function DiseaseAnalyticsScreen() {
    const { diseases } = useApp();
    const navigate = useNavigate();
    const severityData = [
        { name: 'Mild', value: diseases.filter(d => (d.severity || d.default_severity) === 'Mild').length, color: '#10b981' },
        { name: 'Moderate', value: diseases.filter(d => (d.severity || d.default_severity) === 'Moderate').length, color: '#f59e0b' },
        { name: 'Severe', value: diseases.filter(d => (d.severity || d.default_severity) === 'Severe').length, color: '#ef4444' }
    ];
    // Count diseases by name
    const diseaseCount = {};
    diseases.forEach(d => {
        const name = d.name || d.disease_name || 'Unnamed';
        diseaseCount[name] = (diseaseCount[name] || 0) + 1;
    });
    const topDiseases = Object.entries(diseaseCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    return (<div className="p-6 max-w-7xl mx-auto">
      <button className="btn" onClick={() => navigate('/reports')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-5 h-5"/>
        Back to Reports
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Disease Analytics</h1>
        <p className="text-gray-600">Advanced insights into disease patterns and trends</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Mild Cases</span>
            <TrendingUp className="w-5 h-5 text-green-600"/>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {diseases.filter(d => (d.severity || d.default_severity) === 'Mild').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {diseases.length > 0 ? ((diseases.filter(d => (d.severity || d.default_severity) === 'Mild').length / diseases.length) * 100).toFixed(1) : 0}% of total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Moderate Cases</span>
            <TrendingUp className="w-5 h-5 text-amber-600"/>
          </div>
          <p className="text-3xl font-bold text-amber-600">
            {diseases.filter(d => (d.severity || d.default_severity) === 'Moderate').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {diseases.length > 0 ? ((diseases.filter(d => (d.severity || d.default_severity) === 'Moderate').length / diseases.length) * 100).toFixed(1) : 0}% of total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Severe Cases</span>
            <TrendingUp className="w-5 h-5 text-red-600"/>
          </div>
          <p className="text-3xl font-bold text-red-600">
            {diseases.filter(d => (d.severity || d.default_severity) === 'Severe').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {diseases.length > 0 ? ((diseases.filter(d => (d.severity || d.default_severity) === 'Severe').length / diseases.length) * 100).toFixed(1) : 0}% of total
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Severity Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={severityData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                {severityData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color}/>))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top 5 Diseases</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topDiseases}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="name"/>
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Cases"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>);
}
