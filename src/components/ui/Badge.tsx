import React from 'react';
import { cn } from '../../utils/cn';
import { JobStatusType, STATUS_COLORS, STATUS_ICONS } from '../../types';

interface BadgeProps {
  status: JobStatusType | null | undefined;
  className?: string;
  showIcon?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ status, className, showIcon = true }) => {
  if (!status) {
    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
          'bg-gray-100 text-green-600 border-gray-300',
          className
        )}
      >
        New Job
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        STATUS_COLORS[status],
        className
      )}
    >
      {showIcon && <span className="mr-1">{STATUS_ICONS[status]}</span>}
      {status}
    </span>
  );
};

export default Badge; 