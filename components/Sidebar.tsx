import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  LogOut, 
  ShieldCheck, 
  Award,
  User as UserIcon,
  Menu
} from 'lucide-react';

interface Props {
  currentView: string;
  setView: (view: string) => void;
  isMobileOpen: boolean;
  toggleMobile: () => void;
}

const Sidebar: React.FC<Props> = ({ currentView, setView, isMobileOpen, toggleMobile }) => {
  const { currentUser, logout } = useApp();

  const citizenLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'submit', label: 'Report Violation', icon: PlusCircle },
    { id: 'my-reports', label: 'My Reports', icon: FileText },
    { id: 'rewards', label: 'Rewards', icon: Award },
  ];

  const adminLinks = [
    { id: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'review-reports', label: 'Review Reports', icon: ShieldCheck },
  ];

  const links = currentUser?.role === 'ADMIN' ? adminLinks : citizenLinks;

  return (
    <>
       {/* Mobile Overlay */}
       {isMobileOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-20 md:hidden"
            onClick={toggleMobile}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-out md:translate-x-0 md:static md:inset-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl md:shadow-none flex flex-col`}>
        
        {/* Brand */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/50">
              <ShieldCheck className="text-white" size={26} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">CivicEye</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1">Traffic Reporting System</p>
          </div>
        </div>

        {/* User Profile Snippet */}
        <div className="px-6 py-6 border-b border-slate-800/50 bg-slate-900/50">
          <div className="flex items-center gap-3.5">
              <div className="relative">
                <img 
                    src={currentUser?.avatarUrl} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full border-2 border-slate-700 object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
              </div>
              <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{currentUser?.name}</p>
                  <span className="inline-block text-[10px] font-semibold text-blue-200 bg-blue-900/30 px-2 py-0.5 rounded border border-blue-800 mt-1">
                    {currentUser?.role === 'ADMIN' ? 'OFFICIAL' : 'CITIZEN'}
                  </span>
              </div>
          </div>
          {currentUser?.role === 'CITIZEN' && (
              <div className="mt-4 bg-slate-800/80 rounded-lg p-3 flex justify-between items-center border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-medium">Reputation Points</span>
                  <span className="text-sm font-bold text-amber-400 drop-shadow-sm">{currentUser.points}</span>
              </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Menu</div>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setView(link.id);
                  if (window.innerWidth < 768) toggleMobile();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 translate-x-1'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-blue-200'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500'} />
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800/50 bg-slate-900">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-xl transition-colors border border-transparent hover:border-red-900/30"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;