import React from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_REWARDS } from '../../constants';
import { Gift } from 'lucide-react';

const Rewards: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <div className="space-y-8 pb-10">
      {/* Header / Points Balance */}
      <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                    <Gift size={14} /> Rewards Store
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Redeem Your Impact</h1>
                <p className="text-slate-400 text-lg leading-relaxed">
                    Turn your reputation points into real-world benefits. Thank you for contributing to a safer community.
                </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 min-w-[240px]">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Available Balance</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-yellow-400">{currentUser?.points}</span>
                    <span className="text-xl font-medium text-slate-300">pts</span>
                </div>
            </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            Available Rewards
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_REWARDS.map(reward => (
                <div key={reward.id} className="group bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1">
                    {/* Image Area */}
                    <div className="h-56 bg-slate-100 relative overflow-hidden">
                        <img 
                            src={reward.imageUrl} 
                            alt={reward.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute top-4 left-4">
                             <span className="bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/10 shadow-lg">
                                {reward.category}
                            </span>
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-8 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">{reward.title}</h3>
                        <p className="text-sm text-slate-500 mb-8 flex-1 leading-relaxed">{reward.description}</p>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">Cost</span>
                                <span className="text-2xl font-bold text-slate-900">{reward.pointsCost} <span className="text-sm text-slate-400 font-medium">pts</span></span>
                            </div>
                            <button 
                                disabled={(currentUser?.points || 0) < reward.pointsCost}
                                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                                    (currentUser?.points || 0) >= reward.pointsCost
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                Redeem
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Rewards;