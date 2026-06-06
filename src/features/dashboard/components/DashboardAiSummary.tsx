import { Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DashboardAiSummary, DashboardKpis } from '../interfaces';
import {
  buildDashboardAiHighlightsFromKpis,
  stripFormalGreeting,
} from '../utils/dashboard-ai-summary.utils';
import { dashboardCard, dashboardHeadingClass, dashboardSubtextClass } from './dashboard-ui.classes';

const toneClasses = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-orange-200 bg-orange-50 text-orange-900',
  neutral: 'border-slate-200 bg-slate-50 text-slate-800',
};

export interface DashboardAiSummaryProps {
  readonly summary: DashboardAiSummary | undefined;
  readonly kpis: DashboardKpis | undefined;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly onRetry: () => void;
}

export function DashboardAiSummary({
  summary,
  kpis,
  isLoading,
  isError,
  onRetry,
}: DashboardAiSummaryProps) {
  const highlights = kpis ? buildDashboardAiHighlightsFromKpis(kpis) : summary?.highlights ?? [];
  const headline = summary ? stripFormalGreeting(summary.headline) : '';
  const paragraphs = summary?.paragraphs.map(stripFormalGreeting) ?? [];
  const trendNote = summary ? stripFormalGreeting(summary.trendNote) : '';
  const riskNote = summary ? stripFormalGreeting(summary.riskNote) : '';
  return (
    <div
      className={cn(
        dashboardCard(),
        'w-full overflow-hidden border-l-4 border-l-[#00C4B3]',
      )}
    >
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3.5 md:px-5 md:py-4">
        <div className="flex flex-wrap items-start justify-between gap-2 md:gap-3">
          <div className="flex min-w-0 items-center gap-2.5 md:gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#0A2240] text-[#00C4B3] md:size-10">
              <Sparkles className="size-4.5 md:size-5" />
            </div>
            <div className="min-w-0">
              <h2 className={cn(dashboardHeadingClass, 'text-base md:text-lg')}>Resumen de IA</h2>
              <p className={cn(dashboardSubtextClass, 'text-xs')}>
                {isLoading
                  ? 'Generando resumen...'
                  : summary
                    ? `Generado ${summary.generatedAt}`
                    : 'Sin resumen disponible'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 py-4 md:space-y-5 md:px-5 md:py-5">
        {isLoading ? (
          <p className={cn(dashboardSubtextClass, 'text-sm')}>
            Analizando métricas del periodo...
          </p>
        ) : null}

        {isError ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className={cn(dashboardSubtextClass, 'text-sm text-orange-700')}>
              No se pudo generar el resumen de IA.
            </p>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Reintentar
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError && summary ? (
          <>
            <p className="text-sm font-medium leading-snug text-[#0A2240] md:text-lg">
              {headline}
            </p>
            <div className="space-y-2">
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className={cn(dashboardSubtextClass, 'leading-relaxed')}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className={cn('rounded-xl border px-3 py-2 md:px-4 md:py-2.5', toneClasses[item.tone])}
                >
                  <p className="text-[10px] font-medium opacity-80 md:text-xs">{item.label}</p>
                  <p className="text-base font-semibold md:text-lg">{item.value}</p>
                </div>
              ))}
            </div>
            <p className={cn(dashboardSubtextClass, 'flex flex-wrap items-center gap-2')}>
              <TrendingUp className="size-3.5 shrink-0 text-emerald-600" />
              <span>{trendNote}</span>
              <TrendingDown className="size-3.5 shrink-0 text-orange-600" />
              <span>{riskNote}</span>
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
