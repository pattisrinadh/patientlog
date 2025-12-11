import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  Menu, 
  X, 
  Stethoscope,
  Activity
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/patients', label: 'Patients', icon: <Users size={20} /> },
    { path: '/appointments', label: 'Appointments', icon: <Calendar size={20} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:flex-shrink-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Activity className="text-teal-600 mr-3" size={28} />
          <span className="text-xl font-bold text-slate-800">PatientLog</span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100">
          <div className="flex items-center px-4 py-3 text-slate-500">
            <Stethoscope size={20} className="mr-3" />
            <span className="text-sm font-medium">Clinic Staff</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-4 ml-auto">
             <div className="hidden md:flex flex-col text-right mr-2">
                <span className="text-sm font-semibold text-slate-800">Dr. Emily Chen</span>
                <span className="text-xs text-slate-500">Chief Physician</span>
             </div>
             <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border border-teal-200">
                EC
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;