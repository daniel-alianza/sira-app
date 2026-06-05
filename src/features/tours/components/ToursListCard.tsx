import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  dashboardCard,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import type { ToursListCardProps } from '../interfaces';
import { ToursEmptyState } from './ToursEmptyState';
import { ToursTableSection } from './ToursTableSection';
import { ToursWeekByDaySection } from './ToursWeekByDaySection';

export function ToursListCard({
  period,
  rows,
  weekDayGroups,
  isLoading,
  isError,
}: ToursListCardProps) {
  const activePeriodLabel =
    period === 'day' ? 'Recorridos del día' : 'Recorridos de la semana';

  const hasRows = period === 'week' ? weekDayGroups.length > 0 : rows.length > 0;

  return (
    <div className={cn(dashboardCard(), 'overflow-hidden p-0')}>
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3.5 md:px-6 md:py-4">
        <h2 className={cn(dashboardHeadingClass, 'text-sm md:text-base')}>
          {activePeriodLabel}
        </h2>
        <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
          Fotografías, detalle del hallazgo, ubicación y estatus
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-slate-500">
          <Loader2 className="size-5 animate-spin" />
          Cargando detecciones…
        </div>
      )}

      {isError && !isLoading && (
        <p className="px-6 py-16 text-center text-sm text-red-600">
          No se pudieron cargar las detecciones. Intenta de nuevo más tarde.
        </p>
      )}

      {!isLoading && !isError && !hasRows && <ToursEmptyState period={period} />}

      {!isLoading && !isError && hasRows && (
        <>
          {period === 'week' ? (
            <ToursWeekByDaySection groups={weekDayGroups} />
          ) : (
            <ToursTableSection rows={rows} />
          )}
        </>
      )}
    </div>
  );
}
