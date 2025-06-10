import axios, { AxiosResponse, AxiosError } from 'axios';
import { Candidate, ComparisonHistory } from '../context/AppContext';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
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

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Unauthorized access detected');
    } else if (error.response?.status === 500) {
      // Handle server errors
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// Types for API responses
interface UploadResponse {
  success: boolean;
  resumeIds: string[];
  message: string;
}

interface CompareResponse {
  success: boolean;
  candidates: Candidate[];
  averageMatchScore: number;
  message: string;
}

interface ExportResponse {
  success: boolean;
  downloadUrl: string;
  fileName: string;
}

interface HistoryResponse {
  success: boolean;
  comparisons: ComparisonHistory[];
  total: number;
}

interface CandidateDetailResponse {
  success: boolean;
  candidate: Candidate;
}

// API Service Class
class ApiService {
  /**
   * Upload multiple resume files
   */
  async uploadResumes(files: File[]): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      
      files.forEach((file, index) => {
        formData.append(`resumes`, file);
      });

      const response: AxiosResponse<UploadResponse> = await apiClient.post(
        '/resumes/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // Extended timeout for file uploads
        }
      );

      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(this.handleApiError(error as AxiosError));
    }
  }

  /**
   * Compare resumes against job description
   */
  async compareResumes(resumeIds: string[], jobDescription: string, jobTitle?: string): Promise<CompareResponse> {
    try {
      const response: AxiosResponse<CompareResponse> = await apiClient.post('/compare', {
        resumeIds,
        jobDescription,
        jobTitle,
      });

      return response.data;
    } catch (error) {
      console.error('Compare error:', error);
      throw new Error(this.handleApiError(error as AxiosError));
    }
  }

  /**
   * Export results to CSV
   */
  async exportToCsv(candidates: Candidate[], jobTitle: string): Promise<ExportResponse> {
    try {
      const response: AxiosResponse<ExportResponse> = await apiClient.post('/export/csv', {
        candidates,
        jobTitle,
      });

      return response.data;
    } catch (error) {
      console.error('CSV export error:', error);
      throw new Error(this.handleApiError(error as AxiosError));
    }
  }

  /**
   * Export results to PDF
   */
  async exportToPdf(candidates: Candidate[], jobTitle: string, jobDescription: string): Promise<ExportResponse> {
    try {
      const response: AxiosResponse<ExportResponse> = await apiClient.post('/export/pdf', {
        candidates,
        jobTitle,
        jobDescription,
      });

      return response.data;
    } catch (error) {
      console.error('PDF export error:', error);
      throw new Error(this.handleApiError(error as AxiosError));
    }
  }

  /**
   * Get comparison history
   */
  async getHistory(page: number = 1, limit: number = 10): Promise<HistoryResponse> {
    try {
      const response: AxiosResponse<HistoryResponse> = await apiClient.get('/history', {
        params: { page, limit },
      });

      return response.data;
    } catch (error) {
      console.error('History fetch error:', error);
      throw new Error(this.handleApiError(error as AxiosError));
    }
  }

  /**
   * Get candidate details by ID
   */
  async getCandidateDetails(candidateId: string): Promise<CandidateDetailResponse> {
    try {
      const response: AxiosResponse<CandidateDetailResponse> = await apiClient.get(`/candidate/${candidateId}`);

      return response.data;
    } catch (error) {
      console.error('Candidate details error:', error);
      throw new Error(this.handleApiError(error as AxiosError));
    }
  }

  /**
   * Download exported file
   */
  async downloadFile(downloadUrl: string, fileName: string): Promise<void> {
    try {
      const response = await apiClient.get(downloadUrl, {
        responseType: 'blob',
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      throw new Error(this.handleApiError(error as AxiosError));
    }
  }

  /**
   * Delete comparison from history
   */
  async deleteComparison(comparisonId: string): Promise<{ success: boolean }> {
    try {
      const response: AxiosResponse<{ success: boolean }> = await apiClient.delete(`/history/${comparisonId}`);
      return response.data;
    } catch (error) {
      console.error('Delete comparison error:', error);
      throw new Error(this.handleApiError(error as AxiosError));
    }
  }

  /**
   * Check API health
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw new Error(this.handleApiError(error as AxiosError));
    }
  }

  /**
   * Handle API errors and return user-friendly messages
   */
  private handleApiError(error: AxiosError): string {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as any;
      
      switch (status) {
        case 400:
          return data?.message || 'Invalid request. Please check your input and try again.';
        case 401:
          return 'Unauthorized access. Please check your credentials.';
        case 403:
          return 'Access forbidden. You do not have permission to perform this action.';
        case 404:
          return 'Resource not found. The requested item may no longer exist.';
        case 409:
          return 'Conflict detected. The operation could not be completed due to a conflict.';
        case 413:
          return 'File too large. Please ensure files are under the size limit.';
        case 415:
          return 'Unsupported file type. Please upload PDF or DOC files only.';
        case 422:
          return data?.message || 'Validation error. Please check your input.';
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        case 500:
          return 'Server error occurred. Please try again later.';
        case 502:
        case 503:
        case 504:
          return 'Service temporarily unavailable. Please try again later.';
        default:
          return data?.message || `An error occurred (${status}). Please try again.`;
      }
    } else if (error.request) {
      // Network error
      return 'Network error. Please check your internet connection and try again.';
    } else {
      // Other error
      return error.message || 'An unexpected error occurred. Please try again.';
    }
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;

// Export types for use in components
export type {
  UploadResponse,
  CompareResponse,
  ExportResponse,
  HistoryResponse,
  CandidateDetailResponse,
};
