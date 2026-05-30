import { CalendarDays, Route } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOUR_PERIOD_OPTIONS } from '../interfaces';
import type { ToursPeriodFiltersProps } from '../interfaces';

export function ToursPeriodFilters({ period, onPeriodChange }: ToursPeriodFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TOUR_PERIOD_OPTIONS.map((option) => {
        const isActive = period === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onPeriodChange(option.value)}
            className={cn(
              'inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200',
              isActive
                ? 'border-[#0A2240] bg-[#0A2240] text-white shadow-sm'
                : 'border-slate-200 bg-white text-[#0A2240] shadow-sm hover:border-slate-300 hover:bg-slate-50',
            )}
            aria-pressed={isActive}
          >
            {option.value === 'day' ? (
              <CalendarDays className="size-4" />
            ) : (
              <Route className="size-4" />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
