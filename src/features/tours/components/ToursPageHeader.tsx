import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  dashboardButtonPrimary,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import type { ToursPageHeaderProps } from '../interfaces';

export function ToursPageHeader({ isTourActive, onStartTour }: ToursPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className={cn(dashboardHeadingClass, 'text-2xl md:text-3xl')}>Recorridos</h1>
        <p className={cn(dashboardSubtextClass, 'mt-1')}>
          Detecciones de actos y condiciones inseguras con acciones correctivas asignadas
        </p>
      </div>
      {!isTourActive && (
        <button type="button" onClick={onStartTour} className={dashboardButtonPrimary()}>
          <Plus className="size-4" />
          Iniciar recorrido
        </button>
      )}
    </div>
  );
}
