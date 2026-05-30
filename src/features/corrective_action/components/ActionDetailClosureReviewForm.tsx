import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import {
  dashboardButtonPrimary,
  dashboardButtonSecondary,
  dashboardCard,
  dashboardHeadingClass,
  dashboardInput,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import type { CorrectiveActionStatus } from '@/features/tours/interfaces';
import {
  CORRECTIVE_ACTIONS_QUERY_KEY,
  getCorrectiveActionDetailQueryKey,
} from '../interfaces';
import type { CorrectiveClosureDecision } from '../interfaces';
import { reviewCorrectiveClosure } from '../service/action.service';
import { formatResolutionDuration } from '../utils/format-resolution-duration';

interface ActionDetailClosureReviewFormProps {
  readonly actionId: string;
  readonly status: CorrectiveActionStatus;
  readonly resolutionDurationMinutes: number | null;
  readonly hasResolutionPhoto: boolean;
}

export function ActionDetailClosureReviewForm({
  actionId,
  status,
  resolutionDurationMinutes,
  hasResolutionPhoto,
}: ActionDetailClosureReviewFormProps) {
  const queryClient = useQueryClient();
  const [reviewNotes, setReviewNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingDecision, setPendingDecision] = useState<CorrectiveClosureDecision | null>(
    null,
  );

  const showForm = status === 'closure_review' && hasResolutionPhoto;

  const reviewMutation = useMutation({
    mutationFn: (decision: CorrectiveClosureDecision) =>
      reviewCorrectiveClosure(actionId, {
        decision,
        reviewNotes: decision === 'reject' ? reviewNotes.trim() : undefined,
      }),
    onSuccess: async () => {
      setFormError(null);
      setPendingDecision(null);
      await queryClient.invalidateQueries({ queryKey: CORRECTIVE_ACTIONS_QUERY_KEY });
      await queryClient.invalidateQueries({
        queryKey: getCorrectiveActionDetailQueryKey(actionId),
      });
    },
    onError: () => {
      setPendingDecision(null);
    },
  });

  if (!showForm) {
    return null;
  }

  const isSubmitting = reviewMutation.isPending;
  const submitError =
    formError ??
    (reviewMutation.isError && reviewMutation.error instanceof Error
      ? reviewMutation.error.message
      : null);
  const durationLabel = formatResolutionDuration(resolutionDurationMinutes);

  function handleReview(decision: CorrectiveClosureDecision) {
    setFormError(null);

    if (decision === 'reject' && !reviewNotes.trim()) {
      setFormError('Indica el motivo del rechazo para el responsable');
      return;
    }

    setPendingDecision(decision);
    reviewMutation.mutate(decision);
  }

  return (
    <section className={cn(dashboardCard(), 'overflow-hidden p-0')}>
      <div className="border-b border-slate-100 bg-[#0A2240]/5 px-5 py-4 md:px-6">
        <h2 className={cn(dashboardHeadingClass, 'text-base')}>Revisión de cierre</h2>
        <p className={cn(dashboardSubtextClass, 'mt-1 text-xs')}>
          Valida la evidencia del responsable y cierra la acción o solicita corrección
          {durationLabel ? ` · Tiempo de solución: ${durationLabel}` : ''}
        </p>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        <div className="space-y-1.5">
          <Label htmlFor="closure-reviewNotes">Motivo de rechazo (si aplica)</Label>
          <textarea
            id="closure-reviewNotes"
            rows={3}
            value={reviewNotes}
            onChange={(event) => setReviewNotes(event.target.value)}
            disabled={isSubmitting}
            placeholder="Describe qué debe corregir el responsable si rechazas el cierre"
            className={cn(dashboardInput(), 'h-auto min-h-[80px] resize-y py-2')}
          />
        </div>

        {submitError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{submitError}</p>
        )}

        {reviewMutation.isSuccess && (
          <p className="rounded-lg border border-[#00C4B3]/30 bg-[#00C4B3]/10 px-3 py-2 text-sm text-[#007a70]">
            {reviewMutation.data?.decision === 'approve'
              ? 'Acción cerrada correctamente.'
              : 'Cierre rechazado. La acción fue reabierta para el responsable.'}
          </p>
        )}

        <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => handleReview('reject')}
            disabled={isSubmitting}
            className={cn(
              dashboardButtonSecondary(),
              'inline-flex items-center justify-center gap-2 border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50',
            )}
          >
            {isSubmitting && pendingDecision === 'reject' ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <XCircle className="size-4" />
            )}
            Rechazar cierre
          </button>
          <button
            type="button"
            onClick={() => handleReview('approve')}
            disabled={isSubmitting}
            className={cn(dashboardButtonPrimary(), 'inline-flex items-center justify-center gap-2')}
          >
            {isSubmitting && pendingDecision === 'approve' ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            Aprobar y cerrar
          </button>
        </div>
      </div>
    </section>
  );
}
