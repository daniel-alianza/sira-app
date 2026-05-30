import { Camera, ImageOff, UserRound } from 'lucide-react';
import { MediaImage } from '@/components/MediaImage';
import { cn } from '@/lib/utils';
import { dashboardSubtextClass } from '@/features/dashboard/components/dashboard-ui.classes';
import type { ActionDetailPhotoProps } from '../interfaces/corrective-action-detail.interfaces';

export function ActionDetailPhoto({
  photoUrl,
  photoCaption,
  inspectorName,
  inspectedAt,
}: ActionDetailPhotoProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
      <div className="relative aspect-[16/10] w-full bg-slate-100 sm:aspect-[16/9]">
        {photoUrl ? (
          <MediaImage
            mediaPath={photoUrl}
            alt="Evidencia fotográfica del inspector"
            className="h-full w-full object-cover"
            fallbackClassName="h-full w-full"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-slate-200/80 text-slate-500">
              <ImageOff className="size-6" />
            </div>
            <p className={cn(dashboardSubtextClass, 'text-sm')}>
              Sin evidencia fotográfica registrada
            </p>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A2240]/85 via-[#0A2240]/35 to-transparent px-4 pb-4 pt-16 sm:px-5 sm:pb-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90">
                <Camera className="size-3.5" />
                Evidencia del inspector
              </p>
              <p className="mt-1 text-sm text-white/80">{photoCaption}</p>
            </div>
            <div className="shrink-0 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-right backdrop-blur-sm">
              <p className="inline-flex items-center gap-1.5 text-xs font-medium text-white">
                <UserRound className="size-3.5" />
                {inspectorName}
              </p>
              <p className="mt-0.5 text-[11px] text-white/75">{inspectedAt}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
