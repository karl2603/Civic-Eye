import React from 'react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge';
import { Award, TrendingUp, AlertCircle, ArrowRight, Plus, FileText, Gift, Info } from 'lucide-react';

const CitizenDashboard: React.FC = () => {
  const { currentUser, getReportsByUserId, addReport } = useApp();
  const myReports = getReportsByUserId(currentUser?.id || '');
  
  const pendingCount = myReports.filter(r => r.status === 'PENDING').length;
  const approvedCount = myReports.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = myReports.filter(r => r.status === 'REJECTED').length;

  return (
    <div className="space-y-8 pb-10">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back, {currentUser?.name.split(' ')[0]}</h1>
            <p className="text-slate-500">Here's what's happening with your contributions.</p>
        </div>
        <div className="flex gap-3">
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Points Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/30 transition-colors duration-500"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between mb-8">
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
                <Award size={24} className="text-yellow-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider bg-white/10 px-2 py-1 rounded-lg">Reputation</span>
            </div>
            <div>
              <h2 className="text-5xl font-bold tracking-tight mb-2">{currentUser?.points}</h2>
              <p className="text-blue-200 text-sm font-medium">Total Points Earned</p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col justify-between hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <TrendingUp size={24} />
                </div>
                <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wide">Report Status</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xl font-bold text-slate-900">{approvedCount}</p>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1">Approved</p>
                </div>
                <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xl font-bold text-slate-900">{pendingCount}</p>
                    <p className="text-[10px] font-bold text-amber-600 uppercase mt-1">Pending</p>
                </div>
                <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xl font-bold text-slate-900">{rejectedCount}</p>
                    <p className="text-[10px] font-bold text-red-600 uppercase mt-1">Rejected</p>
                </div>
            </div>
        </div>

        {/* Impact Score / Actions */}
        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden flex flex-col justify-between">
             <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
             <div>
                <div className="flex items-center gap-2 mb-4">
                    <AlertCircle size={20} className="text-blue-200" />
                    <h3 className="text-blue-100 font-bold text-xs uppercase tracking-wide">Civic Impact</h3>
                </div>
                <p className="text-white text-lg font-medium leading-relaxed mb-6">
                    You've helped identify <strong className="text-yellow-300">3 critical</strong> safety hazards this month.
                </p>
             </div>
             <div className="relative z-10">
                 <div className="flex justify-between text-xs font-bold text-blue-200 mb-2">
                    <span>Impact Level</span>
                    <span>Guardian</span>
                 </div>
                 <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
                    <div className="bg-yellow-400 h-2 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]" style={{ width: '75%' }}></div>
                 </div>
             </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
                {myReports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                            <Info className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No reports yet</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">Start making a difference by submitting your first traffic violation report.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {myReports.slice(0, 5).map(report => (
                            <div key={report.id} className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-colors group cursor-default">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                                        <img src={report.imageUrl} alt="Violation" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
                                            {report.violationTypes[0]} {report.violationTypes.length > 1 && `+ ${report.violationTypes.length - 1} more`}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                            <span className="flex items-center gap-1">
                                                {new Date(report.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="truncate max-w-[180px] sm:max-w-xs">{report.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <StatusBadge status={report.status} />
                                    {report.status === 'APPROVED' && (
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">+{report.rewardPoints} pts</span>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="p-4 text-center border-t border-slate-50 bg-slate-50/30">
                            <span className="text-sm font-medium text-slate-400">Showing last 5 reports</span>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Right Column: Quick Actions & Info */}
        <div className="space-y-6">
             <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
             
             {/* Action Cards */}
             <div className="grid gap-4">
                 
                 <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                        <Gift size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Rewards Store</h3>
                    <p className="text-sm text-slate-500 mb-4">You have points available to redeem. Check out the new fuel coupons.</p>
                 </div>

                 <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                        <Info size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Did You Know?</h3>
                    <p className="text-sm text-slate-500">Reporting <span className="font-semibold text-slate-700">No Helmet</span> violations has reduced accidents by 15% in your area.</p>
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default CitizenDashboard;