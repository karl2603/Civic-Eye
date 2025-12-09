import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import SubmitReport from './pages/citizen/SubmitReport';
import MyReports from './pages/citizen/MyReports';
import Rewards from './pages/citizen/Rewards';
import AdminDashboard from './pages/admin/AdminDashboard';
import ReportReview from './pages/admin/ReportReview';
import { Menu } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    // Reset view when role changes or on initial load
    if (currentUser?.role === 'ADMIN') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('dashboard');
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      // Citizen Views
      case 'dashboard':
        return <CitizenDashboard />;
      case 'submit':
        return <SubmitReport onSuccess={() => setCurrentView('my-reports')} />;
      case 'my-reports':
        return <MyReports />;
      case 'rewards':
        return <Rewards />;
      
      // Admin Views
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'review-reports':
        return <ReportReview />;
      
      default:
        return <div className="p-8 text-center text-slate-500">Page not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isMobileOpen={isMobileNavOpen}
        toggleMobile={() => setIsMobileNavOpen(!isMobileNavOpen)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between md:hidden">
            <div className="flex items-center gap-3">
                 <button onClick={() => setIsMobileNavOpen(true)} className="p-2 text-slate-600">
                    <Menu size={24} />
                 </button>
                 <span className="font-bold text-lg text-slate-900">CivicEye</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                <img src={currentUser.avatarUrl} alt="User" className="w-full h-full object-cover" />
            </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {renderView()}
            </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;