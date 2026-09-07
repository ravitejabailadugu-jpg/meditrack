import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { LayoutDashboard, Users, Activity, FileText, Settings, User, MessageCircle, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import logo from '../../assets/logo.png';
const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'Diseases', path: '/diseases', icon: Activity },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Profile', path: '/profile', icon: User },
];
export default function MainLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userName, userRole, notifications } = useApp();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;
    const handleLogout = () => {
        navigate('/thank-you');
    };
    return (<div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-gray-200">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <img src={logo} alt="MediTrack" className="h-10 w-auto"/>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (<Link key={item.name} to={item.path} className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'}`}>
                  <Icon className="w-5 h-5 mr-3"/>
                  {item.name}
                  {item.name === 'Notifications' && unreadCount > 0 && (<span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>)}
                </Link>);
        })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {String(userName || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors btn">
              <LogOut className="w-5 h-5 mr-3"/>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (<div className="lg:hidden fixed inset-0 z-50 bg-gray-900/50" onClick={() => setSidebarOpen(false)}>
          <aside className="fixed inset-y-0 left-0 w-64 bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                <div className="flex items-center">
                  <img src={logo} alt="MediTrack" className="h-8 w-auto"/>
                </div>
                <button className="btn" onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6 text-gray-500"/>
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (<Link key={item.name} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'}`}>
                      <Icon className="w-5 h-5 mr-3"/>
                      {item.name}
                      {item.name === 'Notifications' && unreadCount > 0 && (<span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>)}
                    </Link>);
            })}
              </nav>

              <div className="p-4 border-t border-gray-200">
                <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors btn">
                  <LogOut className="w-5 h-5 mr-3"/>
                  Logout
                </button>
              </div>
            </div>
          </aside>
        </div>)}

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar for mobile */}
        <header className="lg:hidden flex items-center h-16 px-4 bg-white border-b border-gray-200">
          <button className="btn" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-600"/>
          </button>
          <div className="flex items-center ml-4">
            <img src={logo} alt="MediTrack" className="h-8 w-auto"/>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* Floating help chat button */}
      <button className="btn" onClick={() => setShowChat(!showChat)} className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-40">
        <MessageCircle className="w-6 h-6"/>
      </button>

      {/* Help chat overlay */}
      {showChat && (<div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl z-40 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Help Chat</h3>
            <button className="btn" onClick={() => setShowChat(false)}>
              <X className="w-5 h-5 text-gray-500"/>
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-gray-100 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-700">Hello! How can I help you today?</p>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <input type="text" placeholder="Type your message..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent form-control"/>
          </div>
        </div>)}
    </div>);
}
