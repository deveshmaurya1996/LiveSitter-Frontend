import axios, { AxiosResponse } from 'axios';
import { 
  Job, 
  ApiResponse, 
  CreateJobRequest, 
  UpdateJobStatusRequest, 
  JobSearchQuery 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface StatisticsResponse {
  success: boolean;
  data: Array<{
    status: string;
    count: number;
  }>;
}

export interface ActivityResponse {
  success: boolean;
  data: Array<{
    jobId: string;
    role: string;
    company: string;
    status: string;
    timestamp: string;
  }>;
}

export class JobApiService {
  static async getJobs(page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc'): Promise<PaginatedResponse<Job>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Job>>('/jobs', {
        params: { page, limit, sortBy, sortOrder }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      throw new Error('Failed to fetch jobs');
    }
  }

  static async getJobById(id: string): Promise<ApiResponse<Job>> {
    try {
      const response = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch job:', error);
      throw new Error('Failed to fetch job');
    }
  }

  static async createJob(jobData: CreateJobRequest): Promise<ApiResponse<Job>> {
    try {
      const response = await apiClient.post<ApiResponse<Job>>('/jobs', jobData);
      return response.data;
    } catch (error) {
      console.error('Failed to create job:', error);
      throw new Error('Failed to create job');
    }
  }

  static async updateJobStatus(id: string, statusData: UpdateJobStatusRequest): Promise<ApiResponse<Job>> {
    try {
      const response = await apiClient.put<ApiResponse<Job>>(`/jobs/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Failed to update job status:', error);
      throw new Error('Failed to update job status');
    }
  }

  static async updateJob(id: string, jobData: Partial<CreateJobRequest>): Promise<ApiResponse<Job>> {
    try {
      const response = await apiClient.put<ApiResponse<Job>>(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      console.error('Failed to update job:', error);
      throw new Error('Failed to update job');
    }
  }

  static async deleteJob(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete job:', error);
      throw new Error('Failed to delete job');
    }
  }

  static async searchJobs(query: JobSearchQuery, page = 1, limit = 10): Promise<PaginatedResponse<Job>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Job>>('/jobs/search', {
        params: { ...query, page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search jobs:', error);
      throw new Error('Failed to search jobs');
    }
  }

  static async getStatusStatistics(): Promise<StatisticsResponse> {
    try {
      const response = await apiClient.get<StatisticsResponse>('/jobs/statistics');
      return response.data;
    } catch (error) {
      console.error('Failed to get status statistics:', error);
      throw new Error('Failed to get status statistics');
    }
  }

  static async getRecentActivity(limit = 10): Promise<ActivityResponse> {
    try {
      const response = await apiClient.get<ActivityResponse>('/jobs/activity', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get recent activity:', error);
      throw new Error('Failed to get recent activity');
    }
  }
}

export const healthCheck = async (): Promise<ApiResponse<{ message: string; timestamp: string; environment: string }>> => {
  try {
    const response = await apiClient.get<ApiResponse<{ message: string; timestamp: string; environment: string }>>('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw new Error('Health check failed');
  }
};

export default JobApiService; 