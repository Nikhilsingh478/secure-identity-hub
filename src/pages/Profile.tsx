/**
 * Profile Page (Profile.jsx)
 * AI-generated secure profile dashboard per assignment spec
 * 
 * REQUIREMENTS:
 * - On mount: If no token → redirect /login, fetch profile, show loading state
 * - Display: Name, Email, Aadhaar (plaintext from API only)
 * - Logout button: Clears token, redirects to /login
 * - Aadhaar must NOT be stored beyond render
 * 
 * State Model:
 * - name: string
 * - email: string
 * - aadhaar: string (only during render, from API response)
 * - isLoading: boolean
 * - errorMessage: string | null
 * 
 * Security Note:
 * - Aadhaar only exists in memory during profile render
 * - Never stored in localStorage, sessionStorage, or state beyond render
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Mail, CreditCard, LogOut, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchUserProfile, ProfileResponse } from '@/services/api';
import { removeToken, isAuthenticated } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State per assignment spec
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // If no token, redirect to /login
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await fetchUserProfile();
        const data: ProfileResponse = response.data;
        
        // Set state from API response
        setName(data.name);
        setEmail(data.email);
        setAadhaar(data.aadhaar); // Aadhaar only in memory during render
      } catch (error: unknown) {
        const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
        
        let message: string;
        if (!axiosError.response) {
          message = 'Service unavailable. Please try again later.';
        } else {
          message = axiosError.response.data?.message || 'Failed to load profile.';
        }
        
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    // Clear token
    removeToken();
    
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    
    // Redirect to /login
    navigate('/login', { replace: true });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (errorMessage) {
    return (
      <div className="auth-container">
        <Card className="auth-card animate-fade-in">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Error</h2>
            <p className="text-muted-foreground mb-4">{errorMessage}</p>
            <Button onClick={() => window.location.reload()} className="btn-transition">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <Card className="auth-card animate-fade-in">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome, {name}!
          </CardTitle>
          <CardDescription>
            Your secure profile dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Profile Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Email Address</p>
                <p className="font-medium truncate">{email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <CreditCard className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Aadhaar Number</p>
                <p className="font-medium font-mono">{aadhaar}</p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-primary">Your data is secure</p>
                <p className="text-xs text-muted-foreground">
                  All sensitive information is encrypted using AES-256-CBC
                </p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button 
            variant="outline" 
            className="w-full btn-transition"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
