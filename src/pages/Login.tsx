/**
 * Login Page (Login.jsx)
 * AI-generated login form per assignment spec
 * 
 * REQUIREMENTS:
 * - Controlled inputs: email, password
 * - On submit: Call login API, store JWT, redirect to /profile
 * - Handle: Invalid credentials, network failure
 * - Prevent multiple submissions
 * - Same UI/animation rules as Register
 * 
 * State Model:
 * - email: string
 * - password: string
 * - isLoading: boolean
 * - errorMessage: string | null
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Shield, LogIn, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/FormField';
import { PasswordInput } from '@/components/PasswordInput';
import { loginSchema, LoginFormData } from '@/validations/schemas';
import { loginUser } from '@/services/api';
import { setToken, isAuthenticated } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState(false);

  // Redirect authenticated users to /profile
  if (isAuthenticated()) {
    return <Navigate to="/profile" replace />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setFormError(false);

    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });

      // Store JWT using auth utility
      setToken(response.data.token);

      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });

      // Redirect to /profile
      navigate('/profile', { replace: true });
    } catch (error: unknown) {
      setFormError(true);
      
      // Handle network failure vs invalid credentials
      const axiosError = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
      
      let message: string;
      if (!axiosError.response) {
        message = 'Service unavailable. Please try again later.';
      } else {
        message = axiosError.response.data?.message || 'Invalid email or password.';
      }
      
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className={cn('auth-card animate-fade-in', formError && 'form-shake')}>
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Email Address" error={errors.email?.message} required>
              <Input
                {...register('email')}
                type="email"
                placeholder="john@example.com"
                disabled={isLoading}
                className={cn(errors.email && 'border-destructive')}
              />
            </FormField>

            <FormField label="Password" error={errors.password?.message} required>
              <PasswordInput
                {...register('password')}
                placeholder="••••••••"
                disabled={isLoading}
                error={!!errors.password}
              />
            </FormField>

            {/* Error message below form */}
            {errorMessage && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{errorMessage}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-6 btn-transition"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link
              to="/register"
              className="font-medium text-primary hover:underline btn-transition"
            >
              Create account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
