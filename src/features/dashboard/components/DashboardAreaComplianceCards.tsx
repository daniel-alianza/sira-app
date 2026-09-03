import { AlertTriangle, CheckCircle2, XCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardAreaComplianceItem, DashboardAreaUserStats } from '../interfaces';
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

function UserStatsRow({ user }: { readonly user: DashboardAreaUserStats }) {
  const totalOpen = user.open + user.pending + user.pendingAcceptance + user.inReview + user.expired + user.reopened;
  
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50/50 p-3 text-xs">
      <div className="mb-2 flex items-center gap-2">
        <User className="size-3.5 text-slate-600" />
        <span className="font-medium text-slate-900">
          {user.userName}
          {totalOpen > 0 && (
            <span className="ml-1.5 text-orange-600">
              ({totalOpen} pendiente{totalOpen !== 1 ? 's' : ''})
            </span>
          )}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-600">
        <div className="flex justify-between">
          <span>Abiertas:</span>
          <span className="font-medium text-slate-900">{user.open}</span>
        </div>
        <div className="flex justify-between">
          <span>Pendientes:</span>
          <span className="font-medium text-slate-900">{user.pending}</span>
        </div>
        <div className="flex justify-between">
          <span>Pend. aceptación:</span>
          <span className="font-medium text-slate-900">{user.pendingAcceptance}</span>
        </div>
        <div className="flex justify-between">
          <span>En revisión:</span>
          <span className="font-medium text-slate-900">{user.inReview}</span>
        </div>
        <div className="flex justify-between">
          <span>Expiradas:</span>
          <span className={cn('font-medium', user.expired > 0 ? 'text-orange-600' : 'text-slate-900')}>
            {user.expired}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Cerradas:</span>
          <span className="font-medium text-emerald-600">{user.closed}</span>
        </div>
        <div className="flex justify-between">
          <span>Rechazadas:</span>
          <span className={cn('font-medium', user.rejected > 0 ? 'text-red-600' : 'text-slate-900')}>
            {user.rejected}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Reabiertas:</span>
          <span className={cn('font-medium', user.reopened > 0 ? 'text-orange-600' : 'text-slate-900')}>
            {user.reopened}
          </span>
        </div>
      </div>
    </div>
  );
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
          <h2 className={cn(dashboardHeadingClass, 'text-lg')}>Avance por área</h2>
          <p className={cn(dashboardSubtextClass, 'mt-1')}>
            {areas.length > 0
              ? `${areas.length} área${areas.length === 1 ? '' : 's'} en las que tienes acceso`
              : 'Sin áreas disponibles en el periodo seleccionado'}
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
        <p className={cn(dashboardSubtextClass, 'text-sm')}>Cargando avance por área...</p>
      ) : areas.length === 0 ? (
        <p className={cn(dashboardSubtextClass, 'text-sm')}>
          No hay datos de áreas para los filtros actuales.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {areas.map((area) => {
            const trendPositive = area.trend.startsWith('+');
            const trendNeutral = area.trend === '—';
            const hasUsers = area.users && area.users.length > 0;

            return (
              <div
                key={area.id}
                className={cn(dashboardCardInteractive(), 'w-full')}
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

                  {hasUsers && (
                    <>
                      <div className="border-t border-slate-200 pt-3">
                        <p className={cn(dashboardSubtextClass, 'mb-2 text-xs font-medium')}>
                          Usuarios ({area.users.length})
                        </p>
                      </div>
                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {area.users.map((user) => (
                          <UserStatsRow key={user.userId} user={user} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
