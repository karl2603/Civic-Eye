import React from 'react';
import { ReportStatus } from '../types';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface Props {
  status: ReportStatus;
}

const StatusBadge: React.FC<Props> = ({ status }) => {
  switch (status) {
    case 'APPROVED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle size={14} className="text-emerald-700" />
          Approved
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
          <XCircle size={14} className="text-red-700" />
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <Clock size={14} className="text-amber-700" />
          Pending
        </span>
      );
  }
};

export default StatusBadge;