import { cn } from '@/lib/utils';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react';

interface PasswordToggleProps {
  showPassword: boolean;
  onToggle: () => void;
  className?: string;
}

export function PasswordToggle({ showPassword, onToggle, className }: PasswordToggleProps) {
  const Icon: LucideIcon = showPassword ? EyeOff : Eye;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'absolute top-1/2 -translate-y-1/2 cursor-pointer text-[#898A8D] transition-colors duration-200 disabled:cursor-not-allowed',
        className,
      )}
      tabIndex={-1}
      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
    >
      <Icon className="size-full" />
    </button>
  );
}
