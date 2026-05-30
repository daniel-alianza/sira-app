import { ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  dashboardCard,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import type { ActionsPageHeaderProps } from '../interfaces';

export function ActionsPageHeader({
  pendingCount,
  isResponsibleView,
}: ActionsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className={cn(dashboardHeadingClass, 'text-2xl md:text-3xl')}>
          {isResponsibleView ? 'Mis acciones correctivas' : 'Acciones correctivas'}
        </h1>
        <p className={cn(dashboardSubtextClass, 'mt-1')}>
          {isResponsibleView
            ? 'Solo las detecciones donde eres responsable: plan de corrección, firma y fecha compromiso'
            : 'Consulta todas las acciones correctivas registradas en el sistema'}
        </p>
      </div>

      {isResponsibleView && pendingCount > 0 && (
        <div
          className={cn(
            dashboardCard(),
            'flex items-center gap-3 border-violet-200/80 bg-violet-50/80 px-4 py-3',
          )}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <ClipboardList className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-violet-900">
              {pendingCount} {pendingCount === 1 ? 'acción pendiente' : 'acciones pendientes'}
            </p>
            <p className={cn(dashboardSubtextClass, 'text-xs')}>Requieren tu respuesta y firma</p>
          </div>
        </div>
      )}
    </div>
  );
}
