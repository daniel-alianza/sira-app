import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { MediaImage } from '@/components/MediaImage';
import { cn } from '@/lib/utils';
import { ACTION_STATUS_CONFIG } from '@/features/tours/interfaces/tours.constants';
import type { DashboardFiltersState, DashboardOpenActionItem } from '../interfaces';
import { buildDashboardActiveActionsSearchParams } from '../data/dashboard-kpi-navigation.config';
import {
  dashboardCard,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from './dashboard-ui.classes';

export interface DashboardOpenActionsSectionProps {
  readonly actions: readonly DashboardOpenActionItem[];
  readonly filters: DashboardFiltersState;
  readonly isLoading: boolean;
}

export function DashboardOpenActionsSection({
  actions,
  filters,
  isLoading,
}: DashboardOpenActionsSectionProps) {
  const navigate = useNavigate();

  function handleViewAll() {
    navigate({
      pathname: '/actions',
      search: buildDashboardActiveActionsSearchParams(filters),
    });
  }

  function handleActionClick(actionId: string) {
    navigate(`/actions/${actionId}`);
  }

  return (
    <div className={cn(dashboardCard(), 'overflow-hidden p-0')}>
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3.5 md:px-6 md:py-4">
        <div>
          <h2 className={cn(dashboardHeadingClass, 'text-sm md:text-base')}>
            Acciones abiertas
          </h2>
          <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
            Seguimiento con evidencia fotográfica del hallazgo
          </p>
        </div>
        <button
          type="button"
          onClick={handleViewAll}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#0A2240] shadow-sm transition-colors hover:bg-slate-50"
        >
          Ver todas
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 px-6 py-10 text-sm text-slate-500">
          <Loader2 className="size-5 animate-spin" />
          Cargando acciones…
        </div>
      )}

      {!isLoading && actions.length === 0 && (
        <p className={cn(dashboardSubtextClass, 'px-6 py-10 text-center text-sm')}>
          No hay acciones abiertas en el periodo seleccionado.
        </p>
      )}

      {!isLoading && actions.length > 0 && (
        <div className="divide-y divide-slate-100">
          {actions.map((action) => {
            const statusConfig = ACTION_STATUS_CONFIG[action.status];

            return (
              <button
                key={action.id}
                type="button"
                onClick={() => handleActionClick(action.id)}
                className="flex w-full cursor-pointer items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-slate-50 md:px-6"
              >
                <div className="flex shrink-0 gap-2">
                  {action.evidencePhotoUrl ? (
                    <div className="size-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                      <MediaImage
                        mediaPath={action.evidencePhotoUrl}
                        alt="Evidencia del hallazgo"
                        className="size-full object-cover"
                        fallbackClassName="size-full"
                      />
                    </div>
                  ) : (
                    <div className="flex size-20 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-[10px] text-slate-400">
                      Sin foto
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#00a896]">
                      {action.detectionFolio}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600">
                      {action.walkthroughFolio}
                    </span>
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium',
                        statusConfig.className,
                      )}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-[#0A2240]">{action.description}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {action.responsibleName} · {action.areaName}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
