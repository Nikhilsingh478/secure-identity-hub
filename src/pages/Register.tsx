/**
 * Register Page (Register.jsx)
 * AI-generated registration form per assignment spec
 * 
 * REQUIREMENTS:
 * - Controlled inputs: name, email, password, aadhaar
 * - Client validation: all fields required, email includes @, password min 6 chars
 * - Disable submit while loading
 * - Show loading spinner inside button
 * - Show error message below form
 * - On success: Redirect to /login
 * - UI: Centered card layout, responsive, smooth fade-in on mount
 * 
 * State Model:
 * - name: string
 * - email: string
 * - password: string
 * - aadhaar: string
 * - isLoading: boolean
 * - errorMessage: string | null
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Shield, UserPlus, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/FormField';
import { PasswordInput } from '@/components/PasswordInput';
import { registerSchema, RegisterFormData } from '@/validations/schemas';
import { registerUser } from '@/services/api';
import { isAuthenticated } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Register = () => {
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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      aadhaar: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setFormError(false);

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        aadhaar: data.aadhaar,
      });

      toast({
        title: 'Registration Successful',
        description: 'Your account has been created. Please login.',
      });

      navigate('/login');
    } catch (error: unknown) {
      setFormError(true);
      const message = 
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
        'Registration failed. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Format Aadhaar input (digits only, max 12)
  const handleAadhaarInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 12);
  };

  return (
    <div className="auth-container">
      <Card className={cn('auth-card animate-fade-in', formError && 'form-shake')}>
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Enter your details to register for secure access
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Full Name" error={errors.name?.message} required>
              <Input
                {...register('name')}
                placeholder="John Doe"
                disabled={isLoading}
                className={cn(errors.name && 'border-destructive')}
              />
            </FormField>

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
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 6 characters
              </p>
            </FormField>

            <FormField label="Aadhaar Number" error={errors.aadhaar?.message} required>
              <Input
                {...register('aadhaar')}
                placeholder="123456789012"
                maxLength={12}
                onInput={handleAadhaarInput}
                disabled={isLoading}
                className={cn(errors.aadhaar && 'border-destructive')}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your Aadhaar will be encrypted and stored securely
              </p>
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
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link
              to="/login"
              className="font-medium text-primary hover:underline btn-transition"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
