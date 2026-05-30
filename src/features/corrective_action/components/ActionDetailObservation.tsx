import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  dashboardCard,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import {
  DETECTION_TYPE_LABELS,
  DETECTION_TYPE_STYLES,
} from '@/features/tours/interfaces';
import type { ActionDetailObservationProps } from '../interfaces/corrective-action-detail.interfaces';

export function ActionDetailObservation({
  detectionType,
  description,
}: ActionDetailObservationProps) {
  return (
    <section className={cn(dashboardCard(), 'p-5 md:p-6')}>
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0A2240]/5 text-[#0A2240]">
          <FileText className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className={cn(dashboardHeadingClass, 'text-base')}>Observación del inspector</h2>
            <span
              className={cn(
                'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                DETECTION_TYPE_STYLES[detectionType],
              )}
            >
              {DETECTION_TYPE_LABELS[detectionType]}
            </span>
          </div>
          <p className={cn(dashboardSubtextClass, 'mt-3 text-sm leading-relaxed text-[#0A2240]')}>
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
