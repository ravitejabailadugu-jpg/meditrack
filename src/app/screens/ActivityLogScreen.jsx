import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Clock, User, LogIn } from 'lucide-react';
export default function ActivityLogScreen() {
    const navigate = useNavigate();
    const activities = [
        { id: 1, action: 'Logged in', timestamp: '2024-03-07 09:30 AM', ip: '192.168.1.1' },
        { id: 2, action: 'Updated patient P001', timestamp: '2024-03-07 10:15 AM', ip: '192.168.1.1' },
        { id: 3, action: 'Added new disease D007', timestamp: '2024-03-07 11:00 AM', ip: '192.168.1.1' },
        { id: 4, action: 'Generated report', timestamp: '2024-03-07 02:30 PM', ip: '192.168.1.1' },
        { id: 5, action: 'Updated profile', timestamp: '2024-03-07 03:45 PM', ip: '192.168.1.1' },
        { id: 6, action: 'Logged in', timestamp: '2024-03-06 09:00 AM', ip: '192.168.1.1' },
        { id: 7, action: 'Added new patient P005', timestamp: '2024-03-06 11:30 AM', ip: '192.168.1.1' },
    ];
    return (<div className="p-6 max-w-5xl mx-auto">
      <button className="btn" onClick={() => navigate('/profile')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-5 h-5"/>
        Back to Profile
      </button>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-8 h-8 text-blue-600"/>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
            <p className="text-gray-600">Your recent account activity</p>
          </div>
        </div>

        <div className="space-y-3">
          {activities.map((activity) => (<div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {activity.action.includes('Logged in') ? (<LogIn className="w-5 h-5 text-blue-600"/>) : (<User className="w-5 h-5 text-blue-600"/>)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3"/>
                        {activity.timestamp}
                      </span>
                      <span>IP: {activity.ip}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>))}
        </div>
      </div>
    </div>);
}
