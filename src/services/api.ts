/**
 * Axios API Service Layer (api.js)
 * AI-generated Axios configuration
 * 
 * STRICT REQUIREMENTS:
 * - Base URL from VITE_API_BASE_URL only
 * - JWT attached to Authorization header as: Bearer <token>
 * - Interceptor: 401/403 → remove token → redirect to /login
 * - Errors propagate to calling components (NOT caught here)
 * - Tokens/responses are NEVER logged
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getToken, removeToken } from '@/utils/auth';

// Base URL from environment ONLY - no fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - attach JWT to Authorization header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401/403
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Remove token and redirect to login
      removeToken();
      window.location.href = '/login';
    }
    // Errors propagate to calling components
    return Promise.reject(error);
  }
);

// Type definitions
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  aadhaar: string;
}

export interface LoginPayload {
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
}

/**
 * Register a new user
 * POST /api/auth/register
 */
export const registerUser = (payload: RegisterPayload) => {
  return apiClient.post('/api/auth/register', payload);
};

/**
 * Login user
 * POST /api/auth/login
 */
export const loginUser = (payload: LoginPayload) => {
  return apiClient.post<LoginResponse>('/api/auth/login', payload);
};

/**
 * Fetch user profile (protected)
 * GET /api/profile
 */
export const fetchUserProfile = () => {
  return apiClient.get<ProfileResponse>('/api/profile');
};

export default apiClient;
