export interface JobStatus {
  status: string;
  timestamp: Date;
}

export interface Job {
  _id: string;
  role: string;
  company: string;
  status: string | null;
  location?: string;
  salary?: string;
  description?: string;
  appliedDate: Date;
  history: JobStatus[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
  error?: string;
}

export interface CreateJobRequest {
  role: string;
  company: string;
  status?: string | null;
  location?: string;
  salary?: string;
  description?: string;
}

export interface UpdateJobStatusRequest {
  status: string;
}

export interface JobSearchQuery {
  role?: string;
  company?: string;
  status?: string;
}

export type JobStatusType = 'Applied' | 'Reviewed' | 'Interviewed' | 'Offered' | 'Rejected';

export type UserRole = 'user' | 'admin';

export const JOB_STATUSES: JobStatusType[] = [
  'Applied',
  'Reviewed', 
  'Interviewed',
  'Offered',
  'Rejected'
];

export const STATUS_COLORS: Record<JobStatusType, string> = {
  Applied: 'bg-blue-100 text-blue-800 border-blue-200',
  Reviewed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Interviewed: 'bg-purple-100 text-purple-800 border-purple-200',
  Offered: 'bg-green-100 text-green-800 border-green-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200'
};

export const STATUS_ICONS: Record<JobStatusType, string> = {
  Applied: '📝',
  Reviewed: '👀',
  Interviewed: '🤝',
  Offered: '🎉',
  Rejected: '❌'
}; 