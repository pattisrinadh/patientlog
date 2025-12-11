import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Calendar, 
  Activity, 
  FileText, 
  TrendingUp, 
  Clock 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StorageService } from '../services/storageService';
import { Appointment, Visit } from '../types';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <TrendingUp size={16} className="text-emerald-500 mr-1" />
      <span className="text-emerald-500 font-medium">{trend}</span>
      <span className="text-slate-400 ml-1">vs last month</span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    visitsToday: 0,
    activePrescriptions: 0,
    pendingAppointments: 0
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);

  // Mock data for the chart since we don't have historical data generation in this demo
  const chartData = [
    { name: 'Jan', visits: 65 },
    { name: 'Feb', visits: 59 },
    { name: 'Mar', visits: 80 },
    { name: 'Apr', visits: 81 },
    { name: 'May', visits: 56 },
    { name: 'Jun', visits: 55 },
    { name: 'Jul', visits: 40 },
  ];

  useEffect(() => {
    StorageService.init();
    setStats(StorageService.getStats());
    
    // Get recent appointments
    const appointments = StorageService.getAppointments();
    setRecentAppointments(appointments.slice(0, 5)); // Just take first 5 for demo

    // Get recent visits
    const visits = StorageService.getVisits();
    setRecentVisits(visits.slice(0, 5));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, here's what's happening at the clinic today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Patients" 
          value={stats.totalPatients} 
          icon={Users} 
          color="bg-blue-500" 
          trend="+12%"
        />
        <StatCard 
          title="Visits Today" 
          value={stats.visitsToday} 
          icon={Activity} 
          color="bg-teal-500" 
          trend="+5%"
        />
        <StatCard 
          title="Appointments" 
          value={stats.pendingAppointments} 
          icon={Calendar} 
          color="bg-indigo-500" 
          trend="+2%"
        />
        <StatCard 
          title="Prescriptions" 
          value={stats.activePrescriptions} 
          icon={FileText} 
          color="bg-rose-500" 
          trend="+8%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Patient Visits Overview</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="visits" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side List - Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Upcoming Appointments</h3>
          <div className="space-y-4">
            {recentAppointments.length > 0 ? (
              recentAppointments.map(apt => (
                <div key={apt.id} className="flex items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{apt.reason}</h4>
                    <p className="text-xs text-slate-500">{apt.date} at {apt.time}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No upcoming appointments.</p>
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100">
             <button className="w-full py-2 text-sm text-teal-600 font-medium hover:bg-teal-50 rounded-lg transition-colors">
                View All Schedule
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;