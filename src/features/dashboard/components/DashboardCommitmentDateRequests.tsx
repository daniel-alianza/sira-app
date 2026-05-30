import { CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardCommitmentDateRequestItem } from '../interfaces';
import { dashboardCard, dashboardHeadingClass, dashboardSubtextClass } from './dashboard-ui.classes';

const statusLabels = {
  pending: { label: 'Pendiente de revisión', className: 'bg-orange-100 text-orange-800' },
  review: { label: 'En revisión admin', className: 'bg-slate-100 text-slate-800' },
};

export interface DashboardCommitmentDateRequestsProps {
  readonly requests: readonly DashboardCommitmentDateRequestItem[];
  readonly isLoading: boolean;
}

export function DashboardCommitmentDateRequests({
  requests,
  isLoading,
}: DashboardCommitmentDateRequestsProps) {
  return (
    <div className={cn(dashboardCard(), 'overflow-hidden')}>
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3.5 md:px-5 md:py-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0A2240] text-[#00C4B3]">
            <CalendarClock className="size-5" />
          </div>
          <div className="min-w-0">
            <h2 className={cn(dashboardHeadingClass, 'text-sm md:text-base')}>
              Cambios de fecha compromiso (F1, F2, F3)
            </h2>
            <p className={cn(dashboardSubtextClass, 'text-xs')}>
              F0 inicial conservada · motivo obligatorio en cada cambio
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className={cn(dashboardSubtextClass, 'p-6 text-center text-sm')}>Cargando...</p>
      ) : requests.length === 0 ? (
        <p className={cn(dashboardSubtextClass, 'p-6 text-center text-sm')}>
          Sin cambios de fecha en el periodo
        </p>
      ) : (
        <>
          <div className="space-y-3 p-3 md:hidden">
            {requests.map((request) => {
              const status = statusLabels[request.status];
              return (
                <article
                  key={request.id}
                  className="cursor-pointer rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 active:bg-slate-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-mono text-xs font-semibold text-[#00a896]">{request.actionFolio}</p>
                    <span
                      className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium', status.className)}
                    >
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-[#0A2240]">{request.responsible}</p>
                  <p className="text-xs text-slate-600">{request.area}</p>
                  <p className="mt-2 line-clamp-2 text-xs text-slate-600">{request.description}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded-lg bg-white p-2">
                      <p className="text-slate-500">F vigente</p>
                      <p className="font-medium text-[#0A2240]">{request.currentDate}</p>
                    </div>
                    <div className="rounded-lg bg-white p-2">
                      <p className="text-slate-500">Nueva ({request.changeLabel})</p>
                      <p className="font-medium text-emerald-700">{request.requestedDate}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">{request.reason}</p>
                </article>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-600">
                  <th className="px-5 py-3">Folio acción</th>
                  <th className="px-3 py-3">Recorrido</th>
                  <th className="px-3 py-3">Responsable / Área</th>
                  <th className="px-3 py-3">F0 inicial</th>
                  <th className="px-3 py-3">F vigente</th>
                  <th className="px-3 py-3">Nueva fecha</th>
                  <th className="px-3 py-3">Cambio</th>
                  <th className="px-3 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => {
                  const status = statusLabels[request.status];
                  return (
                    <tr
                      key={request.id}
                      className="cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-mono text-xs font-medium text-[#00a896]">{request.actionFolio}</p>
                        <p className="mt-1 max-w-[200px] text-xs text-slate-600">{request.description}</p>
                      </td>
                      <td className="px-3 py-4 font-mono text-xs text-slate-500">{request.walkthroughFolio}</td>
                      <td className="px-3 py-4">
                        <p className="font-medium text-[#0A2240]">{request.responsible}</p>
                        <p className={dashboardSubtextClass}>{request.area}</p>
                      </td>
                      <td className="px-3 py-4 text-slate-600">{request.initialDate}</td>
                      <td className="px-3 py-4 text-[#0A2240]">{request.currentDate}</td>
                      <td className="px-3 py-4 font-medium text-emerald-700">{request.requestedDate}</td>
                      <td className="px-3 py-4">
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-800">
                          {request.changeLabel}
                        </span>
                        <p className="mt-1 max-w-[160px] text-xs text-slate-600">{request.reason}</p>
                      </td>
                      <td className="px-3 py-4">
                        <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium', status.className)}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
