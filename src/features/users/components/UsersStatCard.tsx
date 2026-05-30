import { cn } from '@/lib/utils';
import {
  dashboardCard,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import type { UsersStatCardProps } from '../interfaces';

const toneStyles = {
  default: 'bg-slate-100 text-[#0A2240]',
  success: 'bg-[#00C4B3]/15 text-[#007a70]',
  muted: 'bg-orange-50 text-orange-700',
};

export function UsersStatCard({ label, value, icon: Icon, tone }: UsersStatCardProps) {
  return (
    <div className={cn(dashboardCard(), 'p-4')}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={cn(dashboardSubtextClass, 'text-xs')}>{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-[#0A2240]">{value}</p>
        </div>
        <div className={cn('flex size-9 items-center justify-center rounded-lg', toneStyles[tone])}>
          <Icon className="size-4" />
        </div>
      </div>
    </div>
  );
}
