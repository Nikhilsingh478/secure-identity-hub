/**
 * Zod Validation Schemas
 * AI-generated validation rules for form inputs
 * Full validation including Aadhaar format
 */

import { z } from 'zod';

// Name validation: 2-100 characters, letters and spaces only
const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// Email validation: standard email format
const emailSchema = z
  .string()
  .trim()
  .email('Please enter a valid email address')
  .max(255, 'Email must be less than 255 characters');

// Password validation: min 8 chars, 1 uppercase, 1 lowercase, 1 number
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Aadhaar validation: exactly 12 digits
const aadhaarSchema = z
  .string()
  .regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits');

/**
 * Registration Form Schema
 */
export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    aadhaar: aadhaarSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Login Form Schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Password strength calculator
 * Returns: 'weak' | 'medium' | 'strong'
 */
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (!password) return 'weak';
  
  let score = 0;
  
  // Length checks
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character type checks
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
};
