import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Camera, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import {
  dashboardButtonPrimary,
  dashboardCard,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import type { CorrectiveActionStatus } from '@/features/tours/interfaces';
import {
  CORRECTIVE_ACTIONS_QUERY_KEY,
  getCorrectiveActionDetailQueryKey,
} from '../interfaces';
import { submitCorrectiveResolutionPhoto } from '../service/action.service';
import { ActionResolutionPhotoUpload } from './ActionResolutionPhotoUpload';

interface ActionDetailResolutionFormProps {
  readonly actionId: string;
  readonly status: CorrectiveActionStatus;
  readonly respondedAt: string | null;
}

const RESOLUTION_STATUSES: readonly CorrectiveActionStatus[] = [
  'open',
  'pending',
  'expired',
  'reopened',
];

export function ActionDetailResolutionForm({
  actionId,
  status,
  respondedAt,
}: ActionDetailResolutionFormProps) {
  const queryClient = useQueryClient();
  const [resolutionPhotoDataUrl, setResolutionPhotoDataUrl] = useState<string | null>(
    null,
  );
  const [resolutionPreviewUrl, setResolutionPreviewUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const canSubmitResolution = RESOLUTION_STATUSES.includes(status);

  const resolutionMutation = useMutation({
    mutationFn: (payload: { resolutionPhotoDataUrl: string }) =>
      submitCorrectiveResolutionPhoto(actionId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CORRECTIVE_ACTIONS_QUERY_KEY });
      await queryClient.invalidateQueries({
        queryKey: getCorrectiveActionDetailQueryKey(actionId),
      });
    },
  });

  if (!canSubmitResolution) {
    return null;
  }

  const isSubmitting = resolutionMutation.isPending;
  const submitError =
    formError ??
    (resolutionMutation.isError && resolutionMutation.error instanceof Error
      ? resolutionMutation.error.message
      : null);

  function handleResolutionPhotoChange(dataUrl: string | null, previewUrl: string | null) {
    setResolutionPhotoDataUrl(dataUrl);
    setResolutionPreviewUrl(previewUrl);
  }

  function handleSubmit() {
    setFormError(null);

    if (!resolutionPhotoDataUrl) {
      setFormError('Sube la foto de resolución después de corregir el hallazgo');
      return;
    }

    resolutionMutation.mutate({ resolutionPhotoDataUrl });
  }

  return (
    <section className={cn(dashboardCard(), 'overflow-hidden p-0')}>
      <div className="border-b border-slate-100 bg-[#00C4B3]/10 px-5 py-4 md:px-6">
        <h2 className={cn(dashboardHeadingClass, 'text-base')}>
          Evidencia de resolución
        </h2>
        <p className={cn(dashboardSubtextClass, 'mt-1 text-xs')}>
          Paso 2: cuando hayas corregido el hallazgo, sube la foto para registrar el
          tiempo de solución
          {respondedAt ? ` · Compromiso firmado ${respondedAt}` : ''}
        </p>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        <div className="space-y-1.5">
          <Label>Foto de resolución</Label>
          <ActionResolutionPhotoUpload
            title="Subir foto del hallazgo corregido"
            description="JPG, PNG o WEBP · máx. 5 MB"
            previewAlt="Vista previa de la resolución del hallazgo"
            previewUrl={resolutionPreviewUrl}
            onChange={handleResolutionPhotoChange}
            disabled={isSubmitting}
          />
        </div>

        {submitError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{submitError}</p>
        )}

        {resolutionMutation.isSuccess && (
          <p className="rounded-lg border border-[#00C4B3]/30 bg-[#00C4B3]/10 px-3 py-2 text-sm text-[#007a70]">
            Evidencia registrada. La acción pasó a revisión de cierre por el inspector.
          </p>
        )}

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || resolutionMutation.isSuccess}
            className={cn(dashboardButtonPrimary(), 'inline-flex items-center gap-2 px-5 py-2.5')}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Enviando evidencia…
              </>
            ) : (
              <>
                <Camera className="size-4" />
                Registrar resolución
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
