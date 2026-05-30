import { Shield } from 'lucide-react';
import type { RoleBadgeProps } from '../interfaces';

export function RoleBadge({ roleName }: RoleBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-[#0A2240]/5 px-2 py-0.5 text-xs font-medium text-[#0A2240]">
      <Shield className="size-3 shrink-0 opacity-70" />
      {roleName}
    </span>
  );
}
