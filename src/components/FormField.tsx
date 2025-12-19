/**
 * Form Field Component
 * AI-generated reusable form field with label and error
 */

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField = ({ label, error, required, children, className }: FormFieldProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-destructive animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
