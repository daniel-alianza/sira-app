import { Camera, ImageOff, UserRound } from 'lucide-react';
import { MediaImage } from '@/components/MediaImage';
import { cn } from '@/lib/utils';
import {
  dashboardCard,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';

interface EvidencePanelProps {
  readonly label: string;
  readonly personName: string;
  readonly timestamp: string;
  readonly photoUrl: string | null;
  readonly emptyLabel: string;
  readonly alt: string;
}

function EvidencePanel({
  label,
  personName,
  timestamp,
  photoUrl,
  emptyLabel,
  alt,
}: EvidencePanelProps) {
  return (
    <article className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white">
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        {photoUrl ? (
          <MediaImage
            mediaPath={photoUrl}
            alt={alt}
            className="h-full w-full object-cover"
            fallbackClassName="h-full w-full"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-slate-200/80 text-slate-500">
              <ImageOff className="size-5" />
            </div>
            <p className={cn(dashboardSubtextClass, 'text-xs')}>{emptyLabel}</p>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A2240]/90 via-[#0A2240]/40 to-transparent px-3 pb-3 pt-10">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/90">
            <Camera className="size-3" />
            {label}
          </p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-white">
            <UserRound className="size-3.5" />
            {personName}
          </p>
          <p className="mt-0.5 text-[10px] text-white/75">{timestamp}</p>
        </div>
      </div>
    </article>
  );
}

interface ActionDetailEvidenceGalleryProps {
  readonly inspectorName: string;
  readonly inspectedAt: string;
  readonly inspectorPhotoUrl: string | null;
  readonly responsibleName: string;
  readonly respondedAt: string | null;
  readonly resolutionPhotoUrl: string | null;
}

export function ActionDetailEvidenceGallery({
  inspectorName,
  inspectedAt,
  inspectorPhotoUrl,
  responsibleName,
  respondedAt,
  resolutionPhotoUrl,
}: ActionDetailEvidenceGalleryProps) {
  return (
    <section className={cn(dashboardCard(), 'overflow-hidden p-0')}>
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3.5 md:px-6 md:py-4">
        <h2 className={cn(dashboardHeadingClass, 'text-sm md:text-base')}>
          Evidencia fotográfica
        </h2>
        <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
          Comparativa del hallazgo detectado y la resolución del responsable
        </p>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
        <EvidencePanel
          label="Evidencia del inspector"
          personName={inspectorName}
          timestamp={inspectedAt}
          photoUrl={inspectorPhotoUrl}
          emptyLabel="Sin foto del hallazgo"
          alt="Evidencia fotográfica del inspector"
        />
        <EvidencePanel
          label="Evidencia del responsable"
          personName={responsibleName}
          timestamp={respondedAt ?? 'Pendiente de respuesta'}
          photoUrl={resolutionPhotoUrl}
          emptyLabel="Sin foto de resolución"
          alt="Evidencia fotográfica del responsable"
        />
      </div>
    </section>
  );
}
