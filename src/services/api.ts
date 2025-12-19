/**
 * API Service Layer
 * AI-generated Axios configuration and API endpoints
 * Ready to connect to backend when available
 */

import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { getToken, removeToken } from '@/utils/auth';

// API base URL - will be replaced when backend is ready
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create Axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - attach JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Type definitions for API responses
export interface ApiError {
  error: boolean;
  message: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  aadhaar: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ProfileResponse {
  name: string;
  email: string;
  aadhaar: string;
  createdAt: string;
}

/**
 * Auth API Endpoints
 */
export const authAPI = {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  register: async (data: RegisterRequest): Promise<AxiosResponse<{ message: string }>> => {
    return apiClient.post('/api/auth/register', data);
  },

  /**
   * Login user
   * POST /api/auth/login
   */
  login: async (data: LoginRequest): Promise<AxiosResponse<LoginResponse>> => {
    return apiClient.post('/api/auth/login', data);
  },
};

/**
 * Profile API Endpoints
 */
export const profileAPI = {
  /**
   * Get user profile (protected route)
   * GET /api/profile
   */
  getProfile: async (): Promise<AxiosResponse<ProfileResponse>> => {
    return apiClient.get('/api/profile');
  },
};

export default apiClient;
