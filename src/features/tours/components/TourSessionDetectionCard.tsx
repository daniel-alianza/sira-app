import { useEffect, useState } from 'react';
import { Building2, Camera, MapPin, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActionResolutionPhotoUpload } from '@/features/corrective_action/components/ActionResolutionPhotoUpload';
import {
  DETECTION_TYPE_LABELS,
  DETECTION_TYPE_STYLES,
} from '../interfaces';
import type { TourDetectionRecord } from '../interfaces';

interface TourSessionDetectionCardProps {
  readonly detection: TourDetectionRecord;
  readonly onUpdateEvidence: (detectionId: string, evidencePhotoDataUrl: string) => void;
}

export function TourSessionDetectionCard({
  detection,
  onUpdateEvidence,
}: TourSessionDetectionCardProps) {
  const [isEditingEvidence, setIsEditingEvidence] = useState(!detection.evidencePhotoDataUrl);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    detection.evidencePhotoDataUrl ?? null,
  );
  const [pendingDataUrl, setPendingDataUrl] = useState<string | null>(null);

  const hasEvidence = Boolean(detection.evidencePhotoDataUrl);

  useEffect(() => {
    if (detection.evidencePhotoDataUrl) {
      setPreviewUrl(detection.evidencePhotoDataUrl);
      setIsEditingEvidence(false);
      setPendingDataUrl(null);
    }
  }, [detection.evidencePhotoDataUrl, detection.id]);

  function handlePhotoChange(dataUrl: string | null, nextPreviewUrl: string | null) {
    setPendingDataUrl(dataUrl);
    setPreviewUrl(nextPreviewUrl);
  }

  function handleSaveEvidence() {
    if (!pendingDataUrl) {
      return;
    }

    onUpdateEvidence(detection.id, pendingDataUrl);
    setIsEditingEvidence(false);
    setPendingDataUrl(null);
  }

  return (
    <article className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-mono text-xs font-semibold text-[#00a896]">{detection.folio}</p>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[10px] font-medium',
            DETECTION_TYPE_STYLES[detection.detectionType],
          )}
        >
          {DETECTION_TYPE_LABELS[detection.detectionType]}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-[#0A2240]">{detection.description}</p>
      <p className="mt-2 text-sm font-medium text-[#0A2240]">{detection.responsibleName}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-600">
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1">
          <Building2 className="size-3 shrink-0 text-slate-400" />
          {detection.companyName}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1">
          <MapPin className="size-3 shrink-0 text-slate-400" />
          {detection.branchName}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1">
          <ShieldAlert className="size-3 shrink-0 text-slate-400" />
          {detection.areaName}
        </span>
      </div>

      <div className="mt-3 border-t border-slate-100 pt-3">
        {hasEvidence && !isEditingEvidence ? (
          <div className="space-y-2">
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <img
                src={previewUrl ?? detection.evidencePhotoDataUrl}
                alt="Evidencia de detección"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsEditingEvidence(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0A2240] underline-offset-2 hover:underline"
            >
              <Camera className="size-3.5" />
              Cambiar foto de evidencia
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {!hasEvidence && (
              <p className="text-xs text-amber-800">
                Sin foto de evidencia. Súbela antes de finalizar el recorrido.
              </p>
            )}
            <ActionResolutionPhotoUpload
              title="Foto de evidencia"
              description="JPG, PNG o WEBP · máx. 5 MB"
              previewAlt="Vista previa de evidencia"
              helperText={null}
              previewUrl={previewUrl}
              onChange={handlePhotoChange}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSaveEvidence}
                disabled={!pendingDataUrl}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A2240] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
              >
                <Camera className="size-3.5" />
                Guardar foto
              </button>
              {hasEvidence && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingEvidence(false);
                    setPendingDataUrl(null);
                    setPreviewUrl(detection.evidencePhotoDataUrl ?? null);
                  }}
                  className="text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="mt-2 text-[10px] text-slate-400">{detection.createdAt}</p>
    </article>
  );
}
