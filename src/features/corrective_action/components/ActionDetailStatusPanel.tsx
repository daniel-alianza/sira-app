import { AlertTriangle, Building2, CalendarDays, Clock3, MapPin, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  dashboardCard,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import { ACTION_STATUS_CONFIG } from '@/features/tours/interfaces';
import type { ActionDetailStatusPanelProps } from '../interfaces/corrective-action-detail.interfaces';
import { formatResolutionDuration } from '../utils/format-resolution-duration';

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-3">
      <p className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
        <Icon className="size-3.5" />
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-[#0A2240]">{value}</p>
    </div>
  );
}

export function ActionDetailStatusPanel({
  status,
  companyName,
  branchName,
  areaName,
  tourDate,
  assignedAt,
  closureRejectionReason,
  resolutionDurationMinutes,
}: ActionDetailStatusPanelProps) {
  const statusConfig = ACTION_STATUS_CONFIG[status];
  const resolutionDurationLabel = formatResolutionDuration(resolutionDurationMinutes);

  return (
    <section className={cn(dashboardCard(), 'overflow-hidden p-0')}>
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 md:px-6">
        <h2 className={cn(dashboardHeadingClass, 'text-base')}>Estatus de la solicitud</h2>
        <p className={cn(dashboardSubtextClass, 'mt-1 text-xs')}>
          Estado actual de tu acción correctiva asignada
        </p>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        <div className="rounded-xl border border-slate-200/90 bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'inline-flex rounded-full px-3 py-1 text-sm font-medium',
                statusConfig.className,
              )}
            >
              {statusConfig.label}
            </span>
          </div>
          <p className={cn(dashboardSubtextClass, 'mt-3 text-sm leading-relaxed')}>
            {statusConfig.description}
          </p>
          {resolutionDurationLabel && (
            <div className="mt-4 flex gap-2 rounded-lg border border-[#00C4B3]/30 bg-[#00C4B3]/10 px-3 py-2.5">
              <Timer className="mt-0.5 size-4 shrink-0 text-[#007a70]" />
              <div>
                <p className="text-xs font-semibold text-[#007a70]">
                  Tiempo en solucionar (último intento)
                </p>
                <p className="mt-1 text-sm font-medium text-[#0A2240]">
                  {resolutionDurationLabel}
                </p>
              </div>
            </div>
          )}

          {closureRejectionReason && (
            <div className="mt-4 flex gap-2 rounded-lg border border-orange-200/90 bg-orange-50 px-3 py-2.5">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-orange-600" />
              <div>
                <p className="text-xs font-semibold text-orange-900">
                  Motivo del rechazo de cierre
                </p>
                <p className="mt-1 text-sm leading-relaxed text-orange-950">
                  {closureRejectionReason}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <MetaItem icon={Building2} label="Empresa" value={companyName} />
          <MetaItem icon={MapPin} label="Ubicación" value={`${branchName} · ${areaName}`} />
          <MetaItem icon={CalendarDays} label="Fecha recorrido" value={tourDate} />
          <MetaItem icon={Clock3} label="Asignada el" value={assignedAt} />
        </div>
      </div>
    </section>
  );
}
