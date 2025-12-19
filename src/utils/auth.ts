/**
 * Authentication Utility Functions
 * AI-generated boilerplate for JWT token management
 * Handles localStorage operations for auth state
 */

const TOKEN_KEY = 'auth_token';
const REMEMBER_KEY = 'remember_me';

export interface AuthUser {
  name: string;
  email: string;
  aadhaar: string;
  createdAt: string;
}

/**
 * Store JWT token in localStorage
 * @param token - JWT token string
 * @param rememberMe - Whether to persist beyond session
 */
export const setToken = (token: string, rememberMe: boolean = false): void => {
  localStorage.setItem(TOKEN_KEY, token);
  if (rememberMe) {
    localStorage.setItem(REMEMBER_KEY, 'true');
  }
};

/**
 * Retrieve JWT token from localStorage
 * @returns Token string or null if not found
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove JWT token and related auth data from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REMEMBER_KEY);
};

/**
 * Check if user is authenticated (token exists)
 * @returns Boolean indicating auth status
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  // Basic JWT expiry check (decode without verification)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() < exp;
  } catch {
    // If token is malformed, consider not authenticated
    return false;
  }
};

/**
 * Check if remember me was selected
 * @returns Boolean indicating remember me status
 */
export const hasRememberMe = (): boolean => {
  return localStorage.getItem(REMEMBER_KEY) === 'true';
};

/**
 * Parse JWT payload (without verification - for display only)
 * @param token - JWT token string
 * @returns Decoded payload object or null
 */
export const parseToken = (token: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};
