import { Camera } from 'lucide-react';
import { MediaImage } from '@/components/MediaImage';
import { cn } from '@/lib/utils';
import {
  dashboardCard,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';

interface ActionDetailResolutionPhotoProps {
  readonly resolutionPhotoUrl: string | null;
}

export function ActionDetailResolutionPhoto({
  resolutionPhotoUrl,
}: ActionDetailResolutionPhotoProps) {
  if (!resolutionPhotoUrl) {
    return null;
  }

  return (
    <section className={cn(dashboardCard(), 'overflow-hidden p-0')}>
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3.5 md:px-6 md:py-4">
        <h2 className={cn(dashboardHeadingClass, 'inline-flex items-center gap-2 text-sm md:text-base')}>
          <Camera className="size-4 text-[#00a896]" />
          Foto de resolución
        </h2>
        <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
          Evidencia enviada por el responsable al responder la acción
        </p>
      </div>
      <div className="relative aspect-[16/10] w-full bg-slate-100 sm:aspect-[16/9]">
        <MediaImage
          mediaPath={resolutionPhotoUrl}
          alt="Foto de resolución del responsable"
          className="h-full w-full object-cover"
          fallbackClassName="h-full w-full"
        />
      </div>
    </section>
  );
}
