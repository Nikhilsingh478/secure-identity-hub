/**
 * Login Page
 * AI-generated login form with validation and remember me
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, LogIn } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/FormField';
import { PasswordInput } from '@/components/PasswordInput';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { loginSchema, LoginFormData } from '@/validations/schemas';
import { authAPI } from '@/services/api';
import { setToken, hasRememberMe } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(false);

  // Get redirect URL from location state
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/profile';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: hasRememberMe(),
    },
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setFormError(false);

    try {
      const response = await authAPI.login({
        email: data.email,
        password: data.password,
      });

      // Store token with remember me preference
      setToken(response.data.token, data.rememberMe);

      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });

      navigate(from, { replace: true });
    } catch (error: unknown) {
      setFormError(true);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Invalid email or password. Please try again.';

      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage,
      });
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
            </FormField>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setValue('rememberMe', checked === true)}
                disabled={isLoading}
              />
              <label
                htmlFor="rememberMe"
                className="text-sm font-medium text-muted-foreground cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
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
              className="font-medium text-primary hover:underline transition-colors"
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
