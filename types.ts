export type UserRole = 'CITIZEN' | 'ADMIN';

export type ReportStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  avatarUrl?: string;
  password?: string;
}

export interface Report {
  id: string;
  userId: string;
  userName: string;
  violationTypes: string[]; // Changed to array
  vehicleNumber: string;
  location: string;
  description: string;
  timestamp: string; // ISO string
  status: ReportStatus;
  imageUrl: string;
  adminComment?: string;
  rewardPoints?: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  imageUrl: string;
  category: 'FUEL' | 'INSURANCE' | 'SHOPPING' | 'HEALTH' | 'TRAVEL' | 'EDUCATION' | 'SERVICES' | 'ENTERTAINMENT';
}

export interface ViolationType {
  id: string;
  label: string;
  defaultPoints: number;
}