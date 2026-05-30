import { cn } from '@/lib/utils';
import type { UserAvatarProps } from '../interfaces';

function getUserInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function UserAvatar({ name, isActive }: UserAvatarProps) {
  return (
    <div
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
        isActive ? 'bg-[#00C4B3]/15 text-[#007a70]' : 'bg-slate-100 text-slate-500',
      )}
      aria-hidden
    >
      {getUserInitials(name)}
    </div>
  );
}
