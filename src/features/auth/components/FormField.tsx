import { type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormFieldProps {
  icon: LucideIcon;
  register: UseFormRegisterReturn;
  label?: string;
  error?: string;
  touched?: boolean;
  suffix?: ReactNode;
  disabled?: boolean;
  type?: string;
  id?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode'];
  autoCapitalize?: string;
  autoCorrect?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  containerClassName?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
  errorClassName?: string;
}

export function FormField({
  icon: Icon,
  register: fieldRegister,
  label,
  error,
  touched: isTouched,
  suffix,
  disabled,
  type,
  id,
  placeholder,
  autoComplete,
  inputMode,
  autoCapitalize,
  autoCorrect,
  'aria-invalid': ariaInvalid,
  containerClassName,
  wrapperClassName,
  inputClassName,
  iconClassName,
  errorClassName,
}: FormFieldProps) {
  return (
    <div className={containerClassName}>
      {label && (
        <Label htmlFor={id} className="mb-1.5 block text-xs font-semibold tracking-wide text-[#4A5568] uppercase">
          {label}
        </Label>
      )}
      <div className={cn('relative', wrapperClassName)}>
        <Icon
          className={cn(
            'pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#898A8D]/60 transition-colors duration-200',
            iconClassName,
            'group-focus-within:text-[#FF4D00]',
          )}
        />
        <Input
          {...fieldRegister}
          id={id}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          aria-invalid={ariaInvalid}
          className={inputClassName}
        />
        {suffix}
      </div>
      {error && isTouched && (
        <p className={cn('mt-1.5 text-xs text-red-400', errorClassName)}>
          {error}
        </p>
      )}
    </div>
  );
}
