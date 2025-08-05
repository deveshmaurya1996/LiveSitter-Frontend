import React from 'react';
import { JobStatus } from '../types';
import { cn } from '../utils/cn';
import Badge from './ui/Badge';

interface JobHistoryProps {
  history: JobStatus[];
  className?: string;
}

const JobHistory: React.FC<JobHistoryProps> = ({ history, className }) => {
  if (!history || history.length === 0) {
    return (
      <div className={cn('text-sm text-gray-500 italic', className)}>
        No status history available
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Status History</h4>
      <div className="space-y-2">
        {history.map((entry, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md border-l-4 border-blue-500"
          >
            <div className="flex-shrink-0">
              <Badge status={entry.status as any} showIcon={false} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600">
                {new Date(entry.timestamp).toLocaleDateString()} at{' '}
                {new Date(entry.timestamp).toLocaleTimeString()}
              </p>
            </div>
            {index < history.length - 1 && (
              <div className="flex-shrink-0">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobHistory; 