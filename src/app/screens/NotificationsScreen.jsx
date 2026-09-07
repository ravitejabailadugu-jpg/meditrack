import React from 'react';
import { API_BASE_URL } from '../../services';
import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Check, Trash2, X, Info } from 'lucide-react';
export default function NotificationsScreen() {
    const { notifications: contextNotifications, markNotificationRead: contextMarkRead, deleteNotification: contextDelete } = useApp();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const fetchNotifications = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/notifications/`);
            if (!response.ok)
                throw new Error('Failed to connect to notification server');
            const data = await response.json();
            setNotifications(data);
            setError('');
        }
        catch (err) {
            console.warn('Database notifications failed, using local sync:', err.message);
            // Fallback to context notifications
            const mapped = contextNotifications.map(n => ({
                id: n.id,
                message: n.message,
                is_read: n.read,
                created_at: n.timestamp
            }));
            setNotifications(mapped);
        }
        finally {
            setIsLoading(false);
        }
    }, [contextNotifications]);
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);
    const markNotificationRead = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/notifications/${id}/read/`, {
                method: 'PATCH',
            });
            if (response.ok) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
                contextMarkRead(id);
            }
            else {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
                contextMarkRead(id);
            }
        }
        catch (err) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            contextMarkRead(id);
        }
    };
    const deleteNotification = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/notifications/${id}/delete/`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setNotifications(prev => prev.filter(n => n.id !== id));
                contextDelete(id);
            }
            else {
                setNotifications(prev => prev.filter(n => n.id !== id));
                contextDelete(id);
            }
        }
        catch (err) {
            setNotifications(prev => prev.filter(n => n.id !== id));
            contextDelete(id);
        }
    };
    const clearAllNotifications = async () => {
        setNotifications([]);
        // In a real app, you'd call a bulk delete endpoint
    };
    const formatTime = (timestamp) => {
        try {
            const date = new Date(timestamp);
            const now = new Date();
            const diff = now.getTime() - date.getTime();
            const mins = Math.floor(diff / (1000 * 60));
            const hours = Math.floor(diff / (1000 * 60 * 60));
            if (isNaN(date.getTime()))
                return 'Recently';
            if (mins < 1)
                return 'Just now';
            if (mins < 60)
                return `${mins}m ago`;
            if (hours < 24)
                return `${hours}h ago`;
            return date.toLocaleDateString();
        }
        catch (e) {
            return 'Recently';
        }
    };
    return (<div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600"/>
            System Notifications
          </h1>
          <p className="text-gray-500 font-medium">Real-time alerts for patient and disease updates</p>
        </div>
        {notifications.length > 0 && (<button onClick={clearAllNotifications} className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100 btn">
            <Trash2 className="w-4 h-4"/>
            Clear All
          </button>)}
      </div>

      {isLoading ? (<div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Updating notifications...</p>
        </div>) : notifications.length > 0 ? (<div className="grid gap-3">
          {notifications.map((notification) => (<div key={notification.id} className={`group relative overflow-hidden transition-all duration-300 rounded-2xl border ${notification.is_read
                    ? 'bg-white border-gray-100 opacity-75'
                    : 'bg-blue-50/50 border-blue-100 shadow-sm'}`}>
              <div className="p-5 flex items-start gap-4">
                <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${notification.is_read ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-200'}`}>
                  <Info className="w-6 h-6"/>
                </div>

                <div className="flex-1 min-w-0 pr-12">
                  <div className="flex items-center gap-2 mb-1">
                    {!notification.is_read && (<span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>)}
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {formatTime(notification.created_at)}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${notification.is_read ? 'text-gray-600' : 'text-gray-900 font-bold'}`}>
                    {notification.message}
                  </p>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  {!notification.is_read && (<button className="btn" onClick={() => markNotificationRead(notification.id)} className="p-2 bg-white text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl shadow-sm border border-blue-50 transition-all" title="Mark as read">
                      <Check className="w-4 h-4 stroke-[3]"/>
                    </button>)}
                  <button className="btn" onClick={() => deleteNotification(notification.id)} className="p-2 bg-white text-red-500 hover:bg-red-500 hover:text-white rounded-xl shadow-sm border border-red-50 transition-all" title="Delete notification">
                    <X className="w-4 h-4 stroke-[3]"/>
                  </button>
                </div>
              </div>
            </div>))}
        </div>) : (<div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-20 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="w-10 h-10 text-gray-200"/>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No active alerts</h3>
          <p className="text-gray-500 max-w-xs mx-auto">Everything is up to date! New patient and disease updates will appear here.</p>
        </div>)}
    </div>);
}
