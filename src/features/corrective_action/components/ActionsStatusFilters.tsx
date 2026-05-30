import { cn } from '@/lib/utils';
import { ACTION_STATUS_FILTER_OPTIONS } from '../interfaces';
import type { ActionsStatusFiltersProps } from '../interfaces';

export function ActionsStatusFilters({
  statusFilter,
  onStatusFilterChange,
  counts,
}: ActionsStatusFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ACTION_STATUS_FILTER_OPTIONS.map((option) => {
        const isActive = statusFilter === option.value;
        const count = counts[option.value];

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onStatusFilterChange(option.value)}
            className={cn(
              'inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200',
              isActive
                ? 'border-[#0A2240] bg-[#0A2240] text-white shadow-sm'
                : 'border-slate-200 bg-white text-[#0A2240] shadow-sm hover:border-slate-300 hover:bg-slate-50',
            )}
            aria-pressed={isActive}
          >
            {option.label}
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600',
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
