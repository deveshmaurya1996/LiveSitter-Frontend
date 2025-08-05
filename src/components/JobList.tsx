import React, { useState, useEffect } from 'react';
import { Job } from '../types';
import JobCard from './JobCard';
import JobForm from './JobForm';
import CTAButton from './ui/Button';
import JobApiService from '../services/api';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await JobApiService.getJobs(page, 10);
      if (response.success) {
        setJobs(response.data);
        setPagination(response.pagination);
      } else {
        setError('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchJobs(pagination.page);
    setRefreshing(false);
  };

  const handleJobUpdate = (updatedJob: Job) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job._id === updatedJob._id ? updatedJob : job
      )
    );
  };

  const handleJobDelete = (jobId: string) => {
    setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
    fetchJobs(pagination.page);
  };

  const handleJobCreated = () => {
    setShowForm(false);
    fetchJobs(1);
  };

  const handlePageChange = (newPage: number) => {
    fetchJobs(newPage);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <p className="text-lg font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
        <CTAButton onClick={() => fetchJobs()} variant="primary">
          Try Again
        </CTAButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-600">
            {filteredJobs.length} of {pagination.total} jobs (Page {pagination.page} of {pagination.pages})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CTAButton
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            loading={refreshing}
          >
            <RefreshCw className="h-4 w-4" />
          </CTAButton>
          <CTAButton
            onClick={() => setShowForm(true)}
            variant="primary"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Job
          </CTAButton>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs by role, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Interviewed">Interviewed</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <JobForm
              onJobCreated={handleJobCreated}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {jobs.length === 0 ? 'No jobs yet' : 'No jobs found'}
          </h3>
          <p className="text-gray-600 mb-4">
            {jobs.length === 0 
              ? 'Get started by adding your first job application.'
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
          {jobs.length === 0 && (
            <CTAButton onClick={() => setShowForm(true)} variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Job
            </CTAButton>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onJobUpdate={handleJobUpdate}
                onJobDelete={handleJobDelete}
              />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <CTAButton
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                variant="ghost"
                size="sm"
              >
                Previous
              </CTAButton>
              
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              
              <CTAButton
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                variant="ghost"
                size="sm"
              >
                Next
              </CTAButton>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobList; 