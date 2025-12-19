/**
 * Validation Schemas
 * AI-generated validation rules per assignment spec
 * 
 * Validation Rules:
 * - All fields required
 * - Email must include '@'
 * - Password min 6 chars
 */

import { z } from 'zod';

/**
 * Registration Form Schema
 * Fields: name, email, password, aadhaar
 */
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .refine((val) => val.includes('@'), 'Email must include @'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  aadhaar: z
    .string()
    .min(1, 'Aadhaar is required')
    .regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Login Form Schema
 * Fields: email, password
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .refine((val) => val.includes('@'), 'Email must include @'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
