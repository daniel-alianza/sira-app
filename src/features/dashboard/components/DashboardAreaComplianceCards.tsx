import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardAreaComplianceItem } from '../interfaces';
import {
  dashboardCardInteractive,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from './dashboard-ui.classes';

function getComplianceTone(compliance: number): string {
  if (compliance >= 85) return 'text-emerald-700';
  if (compliance >= 75) return 'text-[#0A2240]';
  return 'text-orange-700';
}

export interface DashboardAreaComplianceCardsProps {
  readonly areas: readonly DashboardAreaComplianceItem[];
  readonly avgClosureDays: number;
  readonly isLoading: boolean;
}

export function DashboardAreaComplianceCards({
  areas,
  avgClosureDays,
  isLoading,
}: DashboardAreaComplianceCardsProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className={cn(dashboardHeadingClass, 'text-lg')}>Cumplimiento por área recorrida</h2>
          <p className={cn(dashboardSubtextClass, 'mt-1')}>
            {areas.length > 0
              ? `${areas.length} área${areas.length === 1 ? '' : 's'} con acciones en el periodo`
              : 'Sin acciones por área en el periodo seleccionado'}
          </p>
        </div>
        <p className={dashboardSubtextClass}>
          Tiempo promedio de cierre:{' '}
          <span className="font-semibold text-[#0A2240]">
            {isLoading ? '—' : `${avgClosureDays} días`}
          </span>
        </p>
      </div>

      {isLoading ? (
        <p className={cn(dashboardSubtextClass, 'text-sm')}>Cargando cumplimiento por área...</p>
      ) : areas.length === 0 ? (
        <p className={cn(dashboardSubtextClass, 'text-sm')}>
          No hay datos de cumplimiento para los filtros actuales.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {areas.map((area) => {
            const trendPositive = area.trend.startsWith('+');
            const trendNeutral = area.trend === '—';

            return (
              <button
                key={area.id}
                type="button"
                className={cn(dashboardCardInteractive(), 'w-full text-left')}
              >
                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={cn(dashboardHeadingClass, 'text-base')}>{area.name}</h3>
                    {!trendNeutral ? (
                      <span
                        className={cn(
                          'text-xs font-medium',
                          trendPositive ? 'text-emerald-600' : 'text-orange-600',
                        )}
                      >
                        {area.trend}
                      </span>
                    ) : null}
                  </div>
                  <p className={dashboardSubtextClass}>
                    {area.actionsTotal} acciones · {area.expired} expiradas
                  </p>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className={dashboardSubtextClass}>Cumplimiento</p>
                      <p className={cn('text-3xl font-semibold tabular-nums', getComplianceTone(area.compliance))}>
                        {area.compliance}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={dashboardSubtextClass}>No cumplimiento</p>
                      <p className="text-2xl font-semibold tabular-nums text-orange-600">
                        {area.nonCompliance}%
                      </p>
                    </div>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#00C4B3]"
                      style={{ width: `${area.compliance}%` }}
                    />
                  </div>
                  <div className="flex justify-between gap-2 text-xs text-slate-600">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="size-3.5" />
                      Cerradas a tiempo
                    </span>
                    <span className="flex items-center gap-1 text-orange-600">
                      <XCircle className="size-3.5" />
                      Incumplidas
                    </span>
                    {area.expired > 8 ? (
                      <span className="flex items-center gap-1 text-orange-600">
                        <AlertTriangle className="size-3.5" />
                        Crítico
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
