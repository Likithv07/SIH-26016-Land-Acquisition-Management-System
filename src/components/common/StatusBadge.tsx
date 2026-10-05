import React from 'react';
import { AcquisitionStatus, LifecycleStageStatus, ProjectStatus } from '../../types';

interface StatusBadgeProps {
  status: string;
  type?: 'acquisition' | 'lifecycle' | 'project' | 'general';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'general',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5',
  }[size];

  // Specific color logic for Land Parcels according to prompt specs:
  // BLUE: Proposed Land
  // YELLOW: Notification Issued
  // ORANGE: Under Verification
  // PURPLE: Compensation Pending
  // GREEN: Land Acquired
  // RED: Disputed Land
  // DARK GREEN: Possession Completed
  const getBadgeStyle = () => {
    switch (status) {
      case 'Proposed':
      case 'Proposed Land':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Notification Issued':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Under Verification':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Compensation Pending':
      case 'Pending':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Land Acquired':
      case 'Approved':
      case 'Completed':
      case 'Rehabilitated':
      case 'Disbursed':
      case 'Verified':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Disputed':
      case 'Delayed':
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Possession Completed':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'In Progress':
      case 'Active':
      case 'Payment Processing':
      case 'Under Review':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border whitespace-nowrap ${sizeClasses} ${getBadgeStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {status}
    </span>
  );
};
