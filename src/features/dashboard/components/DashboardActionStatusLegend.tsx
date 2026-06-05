import { cn } from '@/lib/utils';
import { ACTION_STATUS_CONFIG } from '@/features/tours/interfaces/tours.constants';
import type { CorrectiveActionStatus } from '@/features/tours/interfaces/tours-table.interfaces';
import { dashboardCard } from './dashboard-ui.classes';

const statusEntries = Object.entries(ACTION_STATUS_CONFIG) as [
  CorrectiveActionStatus,
  (typeof ACTION_STATUS_CONFIG)[CorrectiveActionStatus],
][];

interface DashboardActionStatusLegendProps {
  readonly className?: string;
}

export function DashboardActionStatusLegend({ className }: DashboardActionStatusLegendProps) {
  return (
    <aside
      className={cn(dashboardCard(), 'w-full p-4 md:p-5', className)}
      aria-label="Leyenda de estatus de acciones correctivas"
    >
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        Estatus de acciones
      </p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statusEntries.map(([statusKey, config]) => (
          <li
            key={statusKey}
            className="flex min-h-[4.5rem] flex-col justify-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2.5"
          >
            <span
              className={cn(
                'inline-flex w-fit rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
                config.className,
              )}
            >
              {config.label}
            </span>
            <p className="text-[11px] leading-snug text-slate-600">{config.shortDescription}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
