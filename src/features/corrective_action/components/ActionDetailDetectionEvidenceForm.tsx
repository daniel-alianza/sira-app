import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Camera, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  dashboardButtonPrimary,
  dashboardCard,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import {
  CORRECTIVE_ACTIONS_QUERY_KEY,
  getCorrectiveActionDetailQueryKey,
} from '../interfaces';
import { TOURS_DETECTIONS_QUERY_KEY } from '@/features/tours/interfaces';
import { submitDetectionEvidence } from '../service/action.service';
import { ActionResolutionPhotoUpload } from './ActionResolutionPhotoUpload';

interface ActionDetailDetectionEvidenceFormProps {
  readonly actionId: string;
}

export function ActionDetailDetectionEvidenceForm({
  actionId,
}: ActionDetailDetectionEvidenceFormProps) {
  const queryClient = useQueryClient();
  const [evidencePhotoDataUrl, setEvidencePhotoDataUrl] = useState<string | null>(null);
  const [evidencePreviewUrl, setEvidencePreviewUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const evidenceMutation = useMutation({
    mutationFn: (payload: { evidencePhotoDataUrl: string }) =>
      submitDetectionEvidence(actionId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CORRECTIVE_ACTIONS_QUERY_KEY });
      await queryClient.invalidateQueries({
        queryKey: getCorrectiveActionDetailQueryKey(actionId),
      });
      await queryClient.invalidateQueries({ queryKey: TOURS_DETECTIONS_QUERY_KEY });
      setEvidencePhotoDataUrl(null);
      setEvidencePreviewUrl(null);
    },
  });

  const isSubmitting = evidenceMutation.isPending;
  const submitError =
    formError ??
    (evidenceMutation.isError && evidenceMutation.error instanceof Error
      ? evidenceMutation.error.message
      : null);

  function handleEvidenceChange(dataUrl: string | null, previewUrl: string | null) {
    setEvidencePhotoDataUrl(dataUrl);
    setEvidencePreviewUrl(previewUrl);
  }

  function handleSubmit() {
    setFormError(null);

    if (!evidencePhotoDataUrl) {
      setFormError('Selecciona una imagen antes de guardar');
      return;
    }

    evidenceMutation.mutate({ evidencePhotoDataUrl });
  }

  return (
    <section className={cn(dashboardCard(), 'overflow-hidden p-0')}>
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3.5 md:px-6 md:py-4">
        <h2 className={cn(dashboardHeadingClass, 'text-sm md:text-base')}>
          Subir evidencia del hallazgo
        </h2>
        <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
          Registraste la detección sin foto; súbela aquí para completar el expediente
        </p>
      </div>

      <div className="space-y-4 p-4 md:p-6">
        <ActionResolutionPhotoUpload
          title="Foto de evidencia"
          description="JPG, PNG o WEBP · máx. 5 MB"
          previewAlt="Vista previa de evidencia de detección"
          helperText={null}
          previewUrl={evidencePreviewUrl}
          onChange={handleEvidenceChange}
        />

        {submitError && (
          <p className="text-sm text-destructive">{submitError}</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={cn(dashboardButtonPrimary(), 'disabled:opacity-50')}
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Camera className="size-4" />
          )}
          Guardar evidencia
        </button>
      </div>
    </section>
  );
}
