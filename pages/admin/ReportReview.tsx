import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Report } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import { VIOLATION_TYPES } from '../../constants';
import { X, Check, Search, MapPin, MessageSquare, FileText, Maximize2, ShieldAlert, Lock, ChevronRight, AlertOctagon, ArrowLeft } from 'lucide-react';

const ReportReview: React.FC = () => {
  const { reports, updateReportStatus } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const selectedReport = reports.find(r => r.id === selectedReportId) || null;
  const [comment, setComment] = useState('');
  const [points, setPoints] = useState(0);
  const filteredReports = reports.filter(r => filter === 'ALL' || r.status === filter);

  useEffect(() => {
    if (selectedReport) {
      const calculatedPoints = selectedReport.violationTypes.reduce((sum, type) => {
          const typeDef = VIOLATION_TYPES.find(v => v.label === type);
          return sum + (typeDef?.defaultPoints || 0);
      }, 0);

      setPoints(selectedReport.rewardPoints || calculatedPoints);
      setComment(selectedReport.adminComment || '');
    }
  }, [selectedReportId, selectedReport?.status]); 

  const handleOpenReport = (report: Report) => {
    setSelectedReportId(report.id);
  };

  const handleAction = (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedReport) return;

    const currentIndex = filteredReports.findIndex(r => r.id === selectedReport.id);
    let nextId: string | null = null;
    
    if (filteredReports.length > 1) {
        if (filter !== 'ALL' && filter !== status) {
             if (currentIndex === filteredReports.length - 1) {
                nextId = filteredReports[currentIndex - 1].id;
             } else {
                nextId = filteredReports[currentIndex + 1].id;
             }
        } else {
            if (currentIndex < filteredReports.length - 1) {
                 nextId = filteredReports[currentIndex + 1].id;
            } else if (currentIndex > 0) {
                 nextId = filteredReports[currentIndex - 1].id;
            }
        }
    }

   
    updateReportStatus(selectedReport.id, status, status === 'APPROVED' ? points : 0, comment);

    
    if (nextId) {
        setSelectedReportId(nextId);
    } else {
        setSelectedReportId(null);
    }
  };

  return (
    <div className="h-[calc(100dvh-8rem)] md:h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-4 lg:gap-6 pb-2">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* Sidebar List Section - Hidden on mobile if report selected */}
      <div className={`w-full lg:w-[400px] flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden shrink-0 h-full ${selectedReportId ? 'hidden lg:flex' : 'flex'}`}>
        {/* Filter Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900 text-lg">Case Queue</h2>
                <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{filteredReports.length}</span>
            </div>
            
            <div className="flex gap-1 p-1 bg-slate-200/60 rounded-xl">
                {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((f) => (
                    <button
                        key={f}
                        onClick={() => { setFilter(f as any); setSelectedReportId(null); }}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wide ${
                            filter === f 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                        }`}
                    >
                        {f === 'ALL' ? 'All' : f}
                    </button>
                ))}
            </div>
        </div>
        
        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
            {filteredReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <FileText size={32} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium">No reports found in this filter.</p>
                </div>
            ) : (
                filteredReports.map(report => (
                    <div 
                        key={report.id}
                        onClick={() => handleOpenReport(report)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all group flex gap-3 ${
                            selectedReportId === report.id 
                            ? 'bg-blue-50 border-blue-200 shadow-sm' 
                            : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                        }`}
                    >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-lg bg-slate-200 shrink-0 overflow-hidden relative">
                            <img src={report.imageUrl} alt="thumb" className="w-full h-full object-cover" />
                            {report.status !== 'PENDING' && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    {report.status === 'APPROVED' ? <Check size={16} className="text-white"/> : <X size={16} className="text-white"/>}
                                </div>
                            )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex justify-between items-start mb-0.5">
                                <h3 className={`font-bold text-xs truncate pr-2 leading-tight ${selectedReportId === report.id ? 'text-blue-700' : 'text-slate-900'}`}>
                                    {report.violationTypes[0]} {report.violationTypes.length > 1 && `+${report.violationTypes.length - 1}`}
                                </h3>
                                <span className="text-[9px] font-mono text-slate-400 shrink-0">{new Date(report.timestamp).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate mb-1">{report.location}</p>
                            <div className="flex items-center justify-between">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-slate-600 border border-slate-200">{report.vehicleNumber}</span>
                                {selectedReportId === report.id && <ChevronRight size={14} className="text-blue-500" />}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* Main Workspace (Detail Section) - Hidden on mobile if no report selected */}
      <div className={`flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-col relative h-full ${selectedReportId ? 'flex' : 'hidden lg:flex'}`}>
        {selectedReport ? (
            <div className="flex flex-col h-full">
                {/* Workspace Header */}
                <div className="px-4 md:px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10 shrink-0">
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* Mobile Back Button */}
                        <button 
                            onClick={() => setSelectedReportId(null)}
                            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg active:scale-95 transition-transform"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div className="bg-slate-100 p-2 rounded-lg text-slate-500 hidden sm:block">
                             <ShieldAlert size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h2 className="text-base md:text-lg font-bold text-slate-900 leading-none">Case Verification</h2>
                                <span className="font-mono text-[10px] md:text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">#{selectedReport.id.slice(-6)}</span>
                            </div>
                            <p className="text-[10px] md:text-xs text-slate-500 truncate max-w-[150px] sm:max-w-none">Review evidence and adjudicate violation.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right mr-2 hidden sm:block">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Status</div>
                            <StatusBadge status={selectedReport.status} />
                        </div>
                        <div className="sm:hidden">
                            <StatusBadge status={selectedReport.status} />
                        </div>
                    </div>
                </div>

                
                <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative no-scrollbar">
                    
                    
                    <div className="w-full lg:w-7/12 h-auto lg:h-full shrink-0 bg-slate-50/50 lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col no-scrollbar">
                        
                        
                        <div className="p-4 md:p-6 pb-0">
                            <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner relative group h-full min-h-[250px] lg:min-h-[300px] flex items-center justify-center">
                                <img 
                                    src={selectedReport.imageUrl} 
                                    alt="Evidence" 
                                    className="w-full h-full object-contain"
                                />
                                {/* Overlay Controls */}
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                                    <div className="text-white">
                                        <p className="text-xs font-mono opacity-70 mb-1">EVIDENCE_ID: ...{selectedReport.id.slice(-4)}</p>
                                        <p className="text-xs font-bold"><MapPin size={12} className="inline mr-1"/> {selectedReport.location}</p>
                                    </div>
                                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2 rounded-lg transition-colors">
                                        <Maximize2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                      
                        <div className="p-4 md:p-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Incident Details</h3>
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                                <div className="p-3 md:p-4 flex flex-col md:flex-row gap-3 md:gap-4">
                                    <div className="flex gap-4">
                                        <AlertOctagon className="text-red-500 shrink-0 mt-0.5" size={18} />
                                        <div>
                                            <label className="text-xs text-slate-500 font-medium">Violation Types</label>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {selectedReport.violationTypes.map((type, idx) => (
                                                    <span key={idx} className="bg-red-50 text-red-700 border border-red-100 text-xs px-2 py-0.5 rounded font-bold">
                                                        {type}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 md:p-4 flex gap-3 md:gap-4">
                                    <div className="w-5 flex justify-center text-slate-400 shrink-0 mt-0.5 font-bold text-sm">#</div>
                                    <div>
                                        <label className="text-xs text-slate-500 font-medium">Vehicle Registration</label>
                                        <div className="font-mono font-bold text-slate-900 text-lg bg-yellow-100/50 px-2 rounded inline-block border border-yellow-200 text-yellow-800">
                                            {selectedReport.vehicleNumber}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 md:p-4 flex gap-3 md:gap-4">
                                    <FileText className="text-slate-400 shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <label className="text-xs text-slate-500 font-medium">Reporter Description</label>
                                        <div className="text-sm text-slate-700 leading-relaxed">
                                            "{selectedReport.description || 'No description provided.'}"
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Action Console */}
                    {/* Mobile: h-auto (scrolls with parent). Desktop: h-full flex flex-col. */}
                    <div className="w-full lg:w-5/12 h-auto lg:h-full bg-white flex flex-col border-l border-slate-100 shadow-xl shadow-slate-200/50 z-20">
                        
                        <div className="p-4 md:p-6 lg:flex-1 lg:overflow-y-auto no-scrollbar">
                            {/* Reporter Profile */}
                             <div className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6 md:mb-8">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm shrink-0">
                                    {selectedReport.userName.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs text-slate-400 font-medium">Submitted by</div>
                                    <div className="font-bold text-slate-900 text-sm truncate">{selectedReport.userName}</div>
                                </div>
                                <div className="ml-auto text-right shrink-0">
                                    <div className="text-xs text-slate-400 font-medium">Time</div>
                                    <div className="font-mono text-xs font-bold text-slate-700">
                                        {new Date(selectedReport.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                             </div>

                             {/* Decision Form */}
                             <div key={selectedReport.id} className="space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-4 w-1 bg-blue-500 rounded-full"></div>
                                    <h3 className="font-bold text-slate-900">Adjudication</h3>
                                </div>

                                {selectedReport.status === 'PENDING' ? (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                Official Comment <span className="text-red-400">*</span>
                                            </label>
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Justification..."
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-24 md:h-32 resize-none transition-all focus:bg-white"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                    Total Points
                                                </label>
                                                <div className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                                    Combined Violations
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={points}
                                                    onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                                                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">Pts</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 animate-in fade-in duration-300">
                                        <div className="flex items-start gap-3 mb-4">
                                            <MessageSquare size={16} className="text-slate-400 mt-1" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Official Remarks</p>
                                                <p className="text-sm text-slate-800 italic">"{selectedReport.adminComment || 'No remarks recorded.'}"</p>
                                            </div>
                                        </div>
                                        {selectedReport.status === 'APPROVED' && (
                                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                                                <span className="text-xs font-bold text-slate-500 uppercase">Points Awarded:</span>
                                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                                    +{selectedReport.rewardPoints}
                                                </span>
                                            </div>
                                        )}
                                        {selectedReport.status === 'REJECTED' && (
                                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                                                <span className="text-xs font-bold text-slate-500 uppercase">Status:</span>
                                                <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                                    REJECTED
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                             </div>
                        </div>

                        {/* Sticky Action Footer */}
                        {selectedReport.status === 'PENDING' ? (
                            <div className="sticky bottom-0 lg:static p-4 md:p-6 bg-white border-t border-slate-100 shrink-0 z-30">
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleAction('REJECTED')}
                                        className="group flex items-center justify-center gap-2 py-3 bg-white border-2 border-red-100 text-red-600 rounded-xl font-bold hover:bg-red-50 hover:border-red-200 transition-all active:scale-95"
                                    >
                                        <X size={18} className="group-hover:scale-110 transition-transform" />
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleAction('APPROVED')}
                                        className="group flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 active:scale-95"
                                    >
                                        <Check size={18} className="group-hover:scale-110 transition-transform" />
                                        Approve
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="sticky bottom-0 lg:static p-4 md:p-6 bg-slate-50 border-t border-slate-200 shrink-0 text-center z-30">
                                <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
                                    <Lock size={12} />
                                    This record is archived and read-only.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/30 text-center p-8">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100 relative">
                    <div className="absolute inset-0 bg-blue-50 rounded-full animate-ping opacity-20"></div>
                    <Search size={40} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Select a Case</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Choose a report from the queue on the left to begin verification and adjudication.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ReportReview;