import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, FileText, CheckCircle, AlertTriangle, Activity, ArrowUpRight, Clock, MapPin } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const AdminDashboard: React.FC = () => {
  const { reports } = useApp();

 
  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 'PENDING').length;
  const approvedReports = reports.filter(r => r.status === 'APPROVED').length;
  const rejectedReports = reports.filter(r => r.status === 'REJECTED').length;
  
  const typeCount: Record<string, number> = {};
  reports.forEach(r => {
    r.violationTypes.forEach(type => {
        typeCount[type] = (typeCount[type] || 0) + 1;
    });
  });
  const typeData = Object.keys(typeCount)
    .map(key => ({ name: key, count: typeCount[key] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const trendData = [
    { name: 'Mon', reports: 12, approved: 8 },
    { name: 'Tue', reports: 19, approved: 15 },
    { name: 'Wed', reports: 15, approved: 10 },
    { name: 'Thu', reports: 22, approved: 18 },
    { name: 'Fri', reports: 28, approved: 20 },
    { name: 'Sat', reports: 35, approved: 25 },
    { name: 'Sun', reports: 20, approved: 12 },
  ];

  const recentReports = reports.slice(0, 4);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Command Center</h1>
            <p className="text-slate-500 mt-2 text-lg">System status and real-time violation monitoring.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold bg-white px-3 py-2 rounded-lg border border-slate-200 text-emerald-600 shadow-sm animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            SYSTEM OPERATIONAL
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <FileText size={100} />
            </div>
            <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <FileText size={20} />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    Total Vol
                </span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{totalReports}</div>
            <div className="text-sm font-medium text-slate-500">Total Reports Filed</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <AlertTriangle size={100} className="text-amber-500"/>
            </div>
            <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                    <AlertTriangle size={20} />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                    Action Req
                </span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{pendingReports}</div>
            <div className="text-sm font-medium text-slate-500">Pending Review</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <CheckCircle size={100} className="text-emerald-500"/>
            </div>
            <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <CheckCircle size={20} />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    Verified
                </span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{approvedReports}</div>
            <div className="text-sm font-medium text-slate-500">Challans Issued</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Activity size={100} className="text-purple-500"/>
            </div>
            <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                    <Activity size={20} />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    98.5%
                </span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{((approvedReports / (totalReports || 1)) * 100).toFixed(1)}%</div>
            <div className="text-sm font-medium text-slate-500">Validation Rate</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Charts */}
        <div className="xl:col-span-2 space-y-8">
            {/* Trend Chart */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Traffic Violation Trends</h3>
                        <p className="text-sm text-slate-500">Weekly submission volume vs approved cases</p>
                    </div>
                    <select className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-3 py-2 outline-none">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                        <defs>
                        <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                        />
                        <Area type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorReports)" />
                        <Area type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorApproved)" />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

             {/* Type Breakdown */}
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Top Violation Types</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={typeData} layout="vertical" margin={{ left: 0, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={180} tick={{fill: '#475569', fontSize: 12, fontWeight: 600}} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Right Column: Live Feed */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-12rem)] overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Activity size={18} className="text-blue-500"/>
                    Live Activity
                 </h3>
                 <span className="text-[10px] uppercase font-bold text-slate-400">Real-time</span>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {recentReports.map(report => (
                    <div key={report.id} className="flex gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden">
                                <img src={report.imageUrl} alt="thumb" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                {report.status === 'APPROVED' ? <CheckCircle size={14} className="text-emerald-500 fill-white" /> : 
                                 report.status === 'REJECTED' ? <AlertTriangle size={14} className="text-red-500 fill-white" /> :
                                 <Clock size={14} className="text-amber-500 fill-white" />}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate mb-0.5">
                                {report.violationTypes[0]} {report.violationTypes.length > 1 && `+${report.violationTypes.length - 1}`}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium mb-1">
                                <MapPin size={10} />
                                <span className="truncate">{report.location}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-slate-400">
                                    by {report.userName.split(' ')[0]}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                    {new Date(report.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                
                <div className="p-4 text-center">
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View All Activities</button>
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;