import { Bell, Eye, ImageOff, Loader2, ShieldCheck } from 'lucide-react';
import { MediaImage } from '@/components/MediaImage';
import { cn } from '@/lib/utils';
import {
  DETECTION_TYPE_LABELS,
  DETECTION_TYPE_STYLES,
  type TourDetectionType,
} from '@/features/tours/interfaces';

export interface DetectionListRowProps {
  readonly detectionFolio: string;
  readonly walkthroughFolio: string;
  readonly description: string;
  readonly companyName: string;
  readonly branchName: string;
  readonly areaName: string;
  readonly evidencePhotoUrl: string | null;
  readonly resolutionPhotoUrl: string | null;
  readonly detectionType?: TourDetectionType;
  readonly status?: { readonly label: string; readonly className: string };
  readonly metaLine?: string;
  readonly footerLine?: string;
  readonly onViewDetail?: () => void;
  readonly onNotifyUser?: () => void;
  readonly isNotifying?: boolean;
  readonly onDirectClose?: () => void;
}

interface ListPhotoThumbProps {
  readonly mediaPath: string | null;
  readonly alt: string;
  readonly variant: 'evidence' | 'resolution';
}

function ListPhotoThumb({ mediaPath, alt, variant }: ListPhotoThumbProps) {
  const borderClassName =
    variant === 'resolution' ? 'border-[#00C4B3]/30' : 'border-slate-200';

  return (
    <div
      className={cn(
        'size-20 shrink-0 overflow-hidden rounded-xl border bg-slate-100',
        borderClassName,
      )}
    >
      {mediaPath ? (
        <MediaImage
          mediaPath={mediaPath}
          alt={alt}
          className="size-full object-cover"
          fallbackClassName="size-full"
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <ImageOff className="size-5 text-slate-300" />
        </div>
      )}
    </div>
  );
}

export function DetectionListRow({
  detectionFolio,
  walkthroughFolio,
  description,
  companyName,
  branchName,
  areaName,
  evidencePhotoUrl,
  resolutionPhotoUrl,
  detectionType,
  status,
  metaLine,
  footerLine,
  onViewDetail,
  onNotifyUser,
  isNotifying = false,
  onDirectClose,
}: DetectionListRowProps) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-start md:px-6">
      <div className="flex shrink-0 gap-2">
        <ListPhotoThumb
          mediaPath={evidencePhotoUrl}
          alt="Evidencia de detección"
          variant="evidence"
        />
        <ListPhotoThumb
          mediaPath={resolutionPhotoUrl}
          alt="Foto de corrección"
          variant="resolution"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-semibold text-[#00a896]">
            {detectionFolio}
          </span>
          <span className="rounded-full bg-[#00C4B3]/10 px-2 py-0.5 font-mono text-[10px] font-medium text-[#007a70]">
            {walkthroughFolio}
          </span>
          {detectionType && (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-medium',
                DETECTION_TYPE_STYLES[detectionType],
              )}
            >
              {DETECTION_TYPE_LABELS[detectionType]}
            </span>
          )}
          {status && (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-medium',
                status.className,
              )}
            >
              {status.label}
            </span>
          )}
        </div>

        <p className="mt-1 line-clamp-2 text-sm text-[#0A2240]">{description}</p>

        <p className="mt-1 text-xs text-slate-500">
          {metaLine ?? `${companyName} · ${branchName} · ${areaName}`}
        </p>

        {footerLine && (
          <p className="mt-0.5 text-xs text-slate-400">{footerLine}</p>
        )}
      </div>

      {(onViewDetail || onNotifyUser || onDirectClose) && (
        <div className="inline-flex shrink-0 flex-col gap-2 self-start sm:flex-row sm:flex-wrap">
          {onDirectClose && (
            <button
              type="button"
              onClick={onDirectClose}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#0A2240]/20 bg-[#0A2240]/5 px-3 py-1.5 text-xs font-medium text-[#0A2240] shadow-sm transition-colors hover:bg-[#0A2240]/10"
            >
              <ShieldCheck className="size-3.5" />
              Cierre directo SHE
            </button>
          )}
          {onNotifyUser && (
            <button
              type="button"
              onClick={onNotifyUser}
              disabled={isNotifying}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900 shadow-sm transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isNotifying ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Bell className="size-3.5" />
              )}
              Notificar al usuario
            </button>
          )}
          {onViewDetail && (
            <button
              type="button"
              onClick={onViewDetail}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#0A2240] shadow-sm transition-colors hover:bg-slate-50"
            >
              <Eye className="size-3.5" />
              Ver detalle
            </button>
          )}
        </div>
      )}
    </div>
  );
}
