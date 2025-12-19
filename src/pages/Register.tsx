/**
 * Register Page
 * AI-generated registration form with full validation
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/FormField';
import { PasswordInput } from '@/components/PasswordInput';
import { PasswordStrengthMeter } from '@/components/PasswordStrengthMeter';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { registerSchema, RegisterFormData } from '@/validations/schemas';
import { authAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      aadhaar: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setFormError(false);

    try {
      await authAPI.register({
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
      const errorMessage = 
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
        'Registration failed. Please try again.';
      
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format Aadhaar input (allow only digits, max 12)
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
                className={errors.name ? 'border-destructive' : ''}
              />
            </FormField>

            <FormField label="Email Address" error={errors.email?.message} required>
              <Input
                {...register('email')}
                type="email"
                placeholder="john@example.com"
                disabled={isLoading}
                className={errors.email ? 'border-destructive' : ''}
              />
            </FormField>

            <FormField label="Password" error={errors.password?.message} required>
              <PasswordInput
                {...register('password')}
                placeholder="••••••••"
                disabled={isLoading}
                error={!!errors.password}
              />
              <PasswordStrengthMeter password={password} />
            </FormField>

            <FormField label="Confirm Password" error={errors.confirmPassword?.message} required>
              <PasswordInput
                {...register('confirmPassword')}
                placeholder="••••••••"
                disabled={isLoading}
                error={!!errors.confirmPassword}
              />
            </FormField>

            <FormField label="Aadhaar Number" error={errors.aadhaar?.message} required>
              <Input
                {...register('aadhaar')}
                placeholder="123456789012"
                maxLength={12}
                onInput={handleAadhaarInput}
                disabled={isLoading}
                className={errors.aadhaar ? 'border-destructive' : ''}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your Aadhaar will be encrypted and stored securely
              </p>
            </FormField>

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
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
              className="font-medium text-primary hover:underline transition-colors"
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
