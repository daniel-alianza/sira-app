import { cn } from '@/lib/utils';
import type { StatusBadgeProps } from '../interfaces';

export function StatusBadge({ isActive }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        isActive ? 'bg-[#00C4B3]/15 text-[#007a70]' : 'bg-orange-50 text-orange-700',
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          isActive ? 'bg-[#00C4B3]' : 'bg-orange-500',
        )}
      />
      {isActive ? 'Activo' : 'Inactivo'}
    </span>
  );
}
