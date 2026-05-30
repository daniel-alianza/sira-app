import { cn } from '@/lib/utils';
import {
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import type { ToursDayGroupHeaderProps } from '../interfaces';

export function ToursDayGroupHeader({ group }: ToursDayGroupHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/90 bg-[#0A2240]/4 px-4 py-3 md:px-6">
      <div className="flex items-center gap-2">
        <h3 className={cn(dashboardHeadingClass, 'text-sm md:text-base')}>
          {group.weekdayLabel}
        </h3>
        <span className="text-slate-300">·</span>
        <p className={cn(dashboardSubtextClass, 'text-xs md:text-sm')}>{group.tourDate}</p>
      </div>
      <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600 shadow-sm">
        {group.rows.length} {group.rows.length === 1 ? 'detección' : 'detecciones'}
      </span>
    </div>
  );
}
