import React from 'react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge';
import { MapPin, Calendar, Car, MessageSquare, Info } from 'lucide-react';

const MyReports: React.FC = () => {
  const { currentUser, getReportsByUserId } = useApp();
  const reports = getReportsByUserId(currentUser?.id || '');

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Reports</h1>
            <p className="text-slate-500 mt-1">Track the status of your submitted violations.</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="text-slate-300" size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No reports found</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">You haven't submitted any traffic violations yet. Your contributions help keep the roads safe.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row">
                
                {/* Left Thumbnail */}
                <div className="w-full md:w-64 h-48 md:h-auto shrink-0 bg-slate-100 relative group cursor-pointer">
                  <img 
                    src={report.imageUrl} 
                    alt="Evidence" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  {report.violationTypes.length > 1 && (
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
                          +{report.violationTypes.length - 1} more
                      </div>
                  )}
                </div>

                {/* Right Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  
                  {/* Top Row: Title & Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{report.violationTypes[0]}</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {report.violationTypes.slice(1).map((type, i) => (
                                <span key={i} className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{type}</span>
                            ))}
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-1">{report.description || 'No description provided.'}</p>
                    </div>
                    <StatusBadge status={report.status} />
                  </div>

                  {/* Middle Row: Meta Data */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <MapPin size={16} className="text-slate-400 shrink-0" />
                        <span className="truncate">{report.location}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Calendar size={16} className="text-slate-400 shrink-0" />
                        <span>{new Date(report.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-2.5 sm:col-span-2">
                        <Car size={16} className="text-slate-400 shrink-0" />
                        <span className="font-mono font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 text-xs tracking-wider">{report.vehicleNumber}</span>
                    </div>
                  </div>

                  {/* Bottom Row: Official Comment & Points */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                     {report.adminComment ? (
                        <div className="flex gap-3 max-w-xl">
                            <MessageSquare className="text-slate-400 mt-1 shrink-0" size={18} />
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Official Comment</p>
                                <p className="text-sm text-slate-700 italic">"{report.adminComment}"</p>
                            </div>
                        </div>
                     ) : (
                        <span className="text-sm text-slate-400 italic">No official review yet.</span>
                     )}

                     {report.status === 'APPROVED' && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 shrink-0">
                            <span className="text-xs font-bold uppercase">Reward</span>
                            <span className="font-bold">+{report.rewardPoints} pts</span>
                        </div>
                     )}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;