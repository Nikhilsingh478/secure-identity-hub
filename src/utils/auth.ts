/**
 * Authentication Utility (auth.js)
 * AI-generated boilerplate for JWT token management
 * 
 * Functions:
 * - setToken(token): stores token in localStorage
 * - getToken(): returns token or null
 * - removeToken(): removes token
 * - isAuthenticated(): returns true if token exists
 * 
 * Rules:
 * - No external libraries
 * - No side effects beyond localStorage
 * - JWT is NEVER logged to console
 */

const TOKEN_KEY = 'auth_token';

/**
 * Store JWT token in localStorage
 * @param token - JWT token string
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Retrieve JWT token from localStorage
 * @returns Token string or null if not found
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated (token exists)
 * Note: True authentication is derived from token existence + API 200 response
 * @returns Boolean indicating if token exists
 */
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};
