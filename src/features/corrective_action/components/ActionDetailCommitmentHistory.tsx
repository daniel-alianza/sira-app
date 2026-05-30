import { CalendarClock, Clock3, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  dashboardCard,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import type { CommitmentHistoryItem } from '../interfaces/commitment-history.interfaces';

interface ActionDetailCommitmentHistoryProps {
  readonly history: readonly CommitmentHistoryItem[];
  readonly currentCommitmentDate: string | null;
}

export function ActionDetailCommitmentHistory({
  history,
  currentCommitmentDate,
}: ActionDetailCommitmentHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <section className={cn(dashboardCard(), 'overflow-hidden p-0')}>
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 md:px-6">
        <h2 className={cn(dashboardHeadingClass, 'text-base')}>
          Historial de fechas compromiso
        </h2>
        <p className={cn(dashboardSubtextClass, 'mt-1 text-xs')}>
          {currentCommitmentDate
            ? `Fecha vigente: ${currentCommitmentDate} · `
            : ''}
          Registro de reprogramaciones y tiempos de solución por intento
        </p>
      </div>

      <ol className="divide-y divide-slate-100 px-5 py-2 md:px-6">
        {history.map((entry) => (
          <li key={entry.sequenceNumber} className="py-4 first:pt-3 last:pb-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
                    entry.isCurrent
                      ? 'bg-[#0A2240] text-white'
                      : 'bg-slate-100 text-slate-500',
                  )}
                >
                  <History className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0A2240]">
                    {entry.label}
                    {entry.isCurrent && (
                      <span className="ml-2 text-xs font-medium text-[#00a896]">
                        (vigente)
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarClock className="size-3.5" />
                    Compromiso: {entry.commitmentDate}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">Firmado: {entry.signedAt}</p>
                </div>
              </div>

              {entry.resolutionDurationLabel && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#00C4B3]/10 px-2.5 py-1 text-xs font-medium text-[#007a70]">
                  <Clock3 className="size-3.5" />
                  Solución: {entry.resolutionDurationLabel}
                </span>
              )}
            </div>

            {entry.dateChangeReason && (
              <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                <span className="font-medium text-slate-700">Motivo reprogramación: </span>
                {entry.dateChangeReason}
              </p>
            )}

            {entry.closureRejectionReason && (
              <p className="mt-2 rounded-lg border border-orange-200/90 bg-orange-50 px-3 py-2 text-xs text-orange-950">
                <span className="font-medium text-orange-900">Rechazo de cierre: </span>
                {entry.closureRejectionReason}
              </p>
            )}

            {entry.resolutionResolvedAt && (
              <p className="mt-2 text-xs text-slate-500">
                Evidencia registrada: {entry.resolutionResolvedAt}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
