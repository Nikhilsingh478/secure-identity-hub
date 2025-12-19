/**
 * Password Strength Meter Component
 * AI-generated visual indicator for password strength
 */

import { cn } from '@/lib/utils';
import { getPasswordStrength } from '@/validations/schemas';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const strength = getPasswordStrength(password);
  
  if (!password) return null;

  const strengthConfig = {
    weak: {
      width: 'w-1/3',
      color: 'bg-destructive',
      label: 'Weak',
    },
    medium: {
      width: 'w-2/3',
      color: 'bg-warning',
      label: 'Medium',
    },
    strong: {
      width: 'w-full',
      color: 'bg-success',
      label: 'Strong',
    },
  };

  const config = strengthConfig[strength];

  return (
    <div className="mt-2 space-y-1">
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300 rounded-full',
            config.width,
            config.color
          )}
        />
      </div>
      <p className={cn(
        'text-xs font-medium',
        strength === 'weak' && 'text-destructive',
        strength === 'medium' && 'text-warning',
        strength === 'strong' && 'text-success'
      )}>
        Password strength: {config.label}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;
