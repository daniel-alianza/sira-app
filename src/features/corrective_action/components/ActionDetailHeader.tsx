import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import type { ActionDetailHeaderProps } from '../interfaces/corrective-action-detail.interfaces';

export function ActionDetailHeader({
  detectionFolio,
  walkthroughFolio,
  onBack,
  backLabel = 'Volver a mis acciones',
}: ActionDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="-ml-2 h-8 gap-1.5 px-2 text-slate-600 hover:text-[#0A2240]"
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </Button>
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#00a896]">
            Detección asignada
          </p>
          <h1 className={cn(dashboardHeadingClass, 'mt-1 text-xl md:text-2xl')}>
            {detectionFolio}
          </h1>
          <p className={cn(dashboardSubtextClass, 'mt-1 font-mono text-xs')}>
            Recorrido {walkthroughFolio}
          </p>
        </div>
      </div>
    </div>
  );
}
