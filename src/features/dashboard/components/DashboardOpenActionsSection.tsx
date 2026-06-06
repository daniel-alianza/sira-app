import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { DetectionListRow } from '@/components/DetectionListRow';
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
            Acciones correctivas activas
          </h2>
          <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
            Fotografías, detalle del hallazgo, ubicación y estatus
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
        <>
          <div className="divide-y divide-slate-100">
            {actions.map((action) => {
              const statusConfig = ACTION_STATUS_CONFIG[action.status];

              return (
                <DetectionListRow
                  key={action.id}
                  detectionFolio={action.detectionFolio}
                  walkthroughFolio={action.walkthroughFolio}
                  description={action.description}
                  companyName=""
                  branchName=""
                  areaName={action.areaName}
                  evidencePhotoUrl={action.evidencePhotoUrl}
                  resolutionPhotoUrl={null}
                  status={statusConfig}
                  metaLine={`${action.responsibleName} · ${action.areaName}`}
                  onViewDetail={() => handleActionClick(action.id)}
                />
              );
            })}
          </div>

          <div className="border-t border-slate-200/90 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500 md:px-6">
            Mostrando {actions.length} {actions.length === 1 ? 'acción' : 'acciones'}
          </div>
        </>
      )}
    </div>
  );
}
