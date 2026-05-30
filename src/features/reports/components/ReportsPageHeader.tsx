import { FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import type { ReportsPageHeaderProps } from '../interfaces';

export function ReportsPageHeader({ periodLabel }: ReportsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className={cn(dashboardHeadingClass, 'text-2xl md:text-3xl')}>
          Reportes
        </h1>
        <p className={cn(dashboardSubtextClass, 'mt-1')}>
          Exporta un libro Excel con varias hojas según los filtros del periodo
        </p>
        <p className="mt-2 text-xs font-medium text-[#00a896]">{periodLabel}</p>
      </div>
      <div
        className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm sm:self-auto"
        aria-hidden
      >
        <FileSpreadsheet className="size-4 shrink-0 text-[#0A2240]" />
        <span>Un archivo · 5 hojas</span>
      </div>
    </div>
  );
}
