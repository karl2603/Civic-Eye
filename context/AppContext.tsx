import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Report, User, UserRole, ReportStatus } from '../types';
import { MOCK_REPORTS, MOCK_USERS, VIOLATION_TYPES } from '../constants';

interface AppContextType {
  currentUser: User | null;
  reports: Report[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  addReport: (report: Omit<Report, 'id' | 'status' | 'timestamp' | 'userName' | 'userId'>) => void;
  updateReportStatus: (id: string, status: ReportStatus, points?: number, comment?: string) => void;
  getReportsByUserId: (userId: string) => Report[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  // Load from local storage on mount (simulated persistence)
  useEffect(() => {
    const storedUser = localStorage.getItem('civicEye_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        
        if (user && user.password === password) {
          setCurrentUser(user);
          localStorage.setItem('civicEye_user', JSON.stringify(user));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800); // Simulate network delay
    });
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
          reject(new Error('Email already registered'));
          return;
        }

        const newUser: User = {
          id: `u_${Date.now()}`,
          name,
          email,
          role,
          points: 0,
          password,
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        };

        setUsers((prev) => [...prev, newUser]);
        setCurrentUser(newUser);
        localStorage.setItem('civicEye_user', JSON.stringify(newUser));
        resolve();
      }, 800);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('civicEye_user');
  };

  const addReport = (reportData: Omit<Report, 'id' | 'status' | 'timestamp' | 'userName' | 'userId'>) => {
    if (!currentUser) return;

    const newReport: Report = {
      ...reportData,
      id: `rep_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      timestamp: new Date().toISOString(),
      status: 'PENDING',
    };

    setReports((prev) => [newReport, ...prev]);
  };

  const updateReportStatus = (id: string, status: ReportStatus, points = 0, comment = '') => {
    setReports((prev) =>
      prev.map((report) => {
        if (report.id === id) {
          // If approving, add points to the user who created it
          if (status === 'APPROVED' && report.status !== 'APPROVED') {
             updateUserPoints(report.userId, points);
          }
          return { ...report, status, rewardPoints: points, adminComment: comment };
        }
        return report;
      })
    );
  };

  const updateUserPoints = (userId: string, points: number) => {
    setUsers(prev => prev.map(u => {
        if (u.id === userId) {
            return { ...u, points: u.points + points };
        }
        return u;
    }));

    // If current user is the one being updated (rare in admin view, but good for consistency)
    if (currentUser?.id === userId) {
        const updatedUser = { ...currentUser, points: currentUser.points + points };
        setCurrentUser(updatedUser);
        localStorage.setItem('civicEye_user', JSON.stringify(updatedUser));
    }
  };

  const getReportsByUserId = (userId: string) => {
    return reports.filter((r) => r.userId === userId);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        reports,
        login,
        register,
        logout,
        addReport,
        updateReportStatus,
        getReportsByUserId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};