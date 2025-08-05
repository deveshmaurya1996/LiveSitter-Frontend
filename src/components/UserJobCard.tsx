import React, { useState } from 'react';
import { Job, JobStatusType } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';
import CTAButton from './ui/Button';
import Badge from './ui/Badge';
import { MapPin, DollarSign, Calendar, Send, CheckCircle } from 'lucide-react';
import JobApiService from '../services/api';

interface UserJobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
  onJobUpdate: (updatedJob: Job) => void;
}

const UserJobCard: React.FC<UserJobCardProps> = ({ job, onApply, onJobUpdate }) => {
  const [isApplying, setIsApplying] = useState(false);
  
  const hasApplied = job.status && ['Applied', 'Reviewed', 'Interviewed', 'Offered', 'Rejected'].includes(job.status);

  const handleApply = async () => {
    if (hasApplied) return;
    
    setIsApplying(true);
    try {
      const response = await JobApiService.updateJobStatus(job._id, { status: 'Applied' });
      if (response.success) {
        onJobUpdate(response.data);
        onApply(job._id);
      }
    } catch (error) {
      console.error('Failed to apply for job:', error);
      alert('Failed to apply for job. Please try again.');
    } finally {
      setIsApplying(false);
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
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {job.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{job.location}</span>
                </div>
              )}
              {job.salary && (
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{job.salary}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(job.appliedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 ml-4">
            <Badge status={job.status as JobStatusType | null} />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {job.description && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {job.description}
          </p>
        )}
        
        <div className="flex justify-end">
          {hasApplied ? (
            <CTAButton
              variant="success"
              size="sm"
              disabled={true}
              className="flex items-center space-x-2 cursor-not-allowed"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Applied</span>
            </CTAButton>
          ) : (
            <CTAButton
              variant="primary"
              size="sm"
              onClick={handleApply}
              loading={isApplying}
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Apply Now</span>
            </CTAButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserJobCard; 