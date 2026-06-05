import { Loader2, Plus, Route } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  dashboardButtonPrimary,
  dashboardButtonSecondary,
  dashboardCard,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import type { TourSessionPanelProps } from '../interfaces';
import { TourSessionDetectionCard } from './TourSessionDetectionCard';

export function TourSessionPanel({
  session,
  isFinishing,
  finishError,
  onAddDetection,
  onFinishTour,
  onUpdateDetectionEvidence,
}: TourSessionPanelProps) {
  return (
    <div className={cn(dashboardCard(), 'overflow-hidden p-0')}>
      <div className="border-b border-slate-200/90 bg-[#0A2240] px-4 py-4 text-white md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#00C4B3]">
              <Route className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/70">
                Recorrido en curso
              </p>
              <p className="mt-0.5 font-mono text-lg font-semibold text-white">
                {session.folio}
              </p>
              <p className="mt-0.5 text-xs text-white/80">Iniciado {session.startedAt}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onAddDetection}
              disabled={isFinishing}
              className={cn(dashboardButtonPrimary(), 'disabled:opacity-50')}
            >
              <Plus className="size-4" />
              Agregar detección
            </button>
            <button
              type="button"
              onClick={onFinishTour}
              disabled={isFinishing}
              className={cn(
                dashboardButtonSecondary(),
                'border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/20 disabled:opacity-50',
              )}
            >
              {isFinishing && <Loader2 className="size-4 animate-spin" />}
              Finalizar recorrido
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 md:px-6">
        {finishError && (
          <p className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {finishError}
          </p>
        )}

        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className={cn(dashboardHeadingClass, 'text-sm')}>
            Detecciones del recorrido ({session.detections.length})
          </h3>
        </div>

        {session.detections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center">
            <p className={cn(dashboardSubtextClass, 'text-sm')}>
              Aún no hay detecciones. Usa{' '}
              <span className="font-medium text-[#0A2240]">Agregar detección</span> para registrar
              hallazgos; en cada una puedes elegir empresa, sucursal y área distintas.
            </p>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {session.detections.map((detection) => (
              <li key={detection.id}>
                <TourSessionDetectionCard
                  detection={detection}
                  onUpdateEvidence={onUpdateDetectionEvidence}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
