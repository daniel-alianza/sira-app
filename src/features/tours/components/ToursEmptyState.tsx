import { Route } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import type { ToursEmptyStateProps } from '../interfaces';

export function ToursEmptyState({ period }: ToursEmptyStateProps) {
  const message =
    period === 'day'
      ? 'No hay detecciones registradas hoy. Inicia un recorrido para agregar hallazgos.'
      : 'No hay detecciones registradas esta semana.';

  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-[#0A2240]/5">
        <Route className="size-8 text-[#0A2240]/60" />
      </div>
      <h3 className={cn(dashboardHeadingClass, 'mt-4 text-base')}>Sin detecciones</h3>
      <p className={cn(dashboardSubtextClass, 'mt-1 max-w-sm')}>{message}</p>
    </div>
  );
}
