/**
 * Protected Route Component
 * AI-generated route guard for authenticated pages
 * 
 * Access Rules:
 * - Unauthenticated user → /profile: Redirect to /login
 * - Expired/invalid token: Auto logout + redirect to /login
 */

import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    // Redirect to login - deterministic, no flicker
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
