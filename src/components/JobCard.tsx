import React, { useState } from 'react';
import { Job, JobStatusType, JOB_STATUSES } from '../types';
import { Card, CardHeader, CardContent, CardFooter } from './ui/Card';
import CTAButton from './ui/Button';
import Badge from './ui/Badge';
import JobHistory from './JobHistory';
import JobApiService from '../services/api';
import { cn } from '../utils/cn';

interface JobCardProps {
  job: Job;
  onJobUpdate: (updatedJob: Job) => void;
  onJobDelete: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onJobUpdate, onJobDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusUpdate = async (newStatus: JobStatusType) => {
    if (newStatus === job.status) return;
    
    setIsUpdating(true);
    try {
      const response = await JobApiService.updateJobStatus(job._id, { status: newStatus });
      if (response.success) {
        onJobUpdate(response.data);
      }
    } catch (error) {
      console.error('Failed to update job status:', error);
      alert('Failed to update job status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    setIsDeleting(true);
    try {
      const response = await JobApiService.deleteJob(job._id);
      if (response.success) {
        onJobDelete(job._id);
      }
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('Failed to delete job. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {job.role}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {job.company}
            </p>
            {job.location && (
              <p className="text-xs text-gray-500 mb-2">
                📍 {job.location}
              </p>
            )}
            {job.salary && (
              <p className="text-xs text-gray-500 mb-2">
                💰 {job.salary}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 ml-4">
            <Badge status={job.status as JobStatusType} />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {job.description && (
          <p className="text-sm text-gray-700 mb-4">
            {job.description}
          </p>
        )}
        
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">
            Applied: {new Date(job.appliedDate).toLocaleDateString()}
          </p>
        </div>

        <JobHistory history={job.history} />
      </CardContent>

      <CardFooter>
        <div className="flex flex-wrap gap-2 w-full">
          {JOB_STATUSES.map((status) => (
            <CTAButton
              key={status}
              variant={status === job.status ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleStatusUpdate(status)}
              disabled={isUpdating || status === job.status}
              className={cn(
                status === job.status && 'ring-2 ring-blue-500',
                'text-xs'
              )}
            >
              {status}
            </CTAButton>
          ))}
          
          <div className="flex-1" />
          
          <CTAButton
            variant="danger"
            size="sm"
            onClick={handleDelete}
            loading={isDeleting}
            className="text-xs"
          >
            Delete
          </CTAButton>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobCard; 