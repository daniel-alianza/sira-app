import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReportsPeriodSummaryProps, ReportsSheetCounts } from '../interfaces';

interface SummaryMetricProps {
  readonly label: string;
  readonly value: number;
  readonly accentClass: string;
}

function SummaryMetric({ label, value, accentClass }: SummaryMetricProps) {
  return (
    <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={cn('mt-1 text-xl font-semibold tabular-nums', accentClass)}>
        {value}
      </p>
    </div>
  );
}

function SheetCountBadge({
  label,
  count,
}: {
  readonly label: string;
  readonly count: number;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
      <span className="font-medium">{label}</span>
      <span className="tabular-nums text-[#0A2240]">{count}</span>
    </span>
  );
}

function SheetCountsRow({ sheetCounts }: { readonly sheetCounts: ReportsSheetCounts }) {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      <SheetCountBadge label="Acciones" count={sheetCounts.actions} />
      <SheetCountBadge label="Compromisos" count={sheetCounts.commitments} />
      <SheetCountBadge label="Recorridos" count={sheetCounts.walkthroughs} />
      <SheetCountBadge label="Detecciones" count={sheetCounts.detections} />
    </div>
  );
}

export function ReportsPeriodSummary({
  isLoading,
  isError,
  errorMessage,
  totalActions,
  openActions,
  closedActions,
  expiredActions,
  sheetCounts,
}: ReportsPeriodSummaryProps) {
  return (
    <Card className="border-slate-200/90 shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#0A2240]">Vista previa del periodo</CardTitle>
        <CardDescription>
          Datos desde la API según periodo y filtros activos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="size-4 animate-spin" />
            Cargando vista previa…
          </div>
        )}

        {isError && !isLoading && (
          <p className="text-sm text-red-600" role="alert">
            {errorMessage ?? 'No se pudo cargar la vista previa.'}
          </p>
        )}

        {!isLoading && !isError && (
          <>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <SummaryMetric
                label="Total acciones"
                value={totalActions}
                accentClass="text-[#0A2240]"
              />
              <SummaryMetric
                label="Abiertas"
                value={openActions}
                accentClass="text-[#00a896]"
              />
              <SummaryMetric
                label="Cerradas"
                value={closedActions}
                accentClass="text-emerald-700"
              />
              <SummaryMetric
                label="Vencidas"
                value={expiredActions}
                accentClass="text-[#FF4D00]"
              />
            </div>
            <SheetCountsRow sheetCounts={sheetCounts} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
