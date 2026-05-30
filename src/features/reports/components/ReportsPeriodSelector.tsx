import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DashboardFilterDateRange } from '@/features/dashboard/components/DashboardFilterDateRange';
import { cn } from '@/lib/utils';
import type { ReportsPeriodPreset } from '../interfaces';

interface ReportsPeriodSelectorProps {
  readonly periodPreset: ReportsPeriodPreset;
  readonly dateFrom: string;
  readonly dateTo: string;
  readonly periodLabel: string;
  readonly onPeriodPresetChange: (preset: ReportsPeriodPreset) => void;
  readonly onCustomDateRangeChange: (from: string, to: string) => void;
}

const PRESET_OPTIONS: readonly {
  readonly id: ReportsPeriodPreset;
  readonly label: string;
}[] = [
  { id: 'daily', label: 'Diario' },
  { id: 'weekly', label: 'Semanal' },
  { id: 'custom', label: 'Personalizado' },
];

export function ReportsPeriodSelector({
  periodPreset,
  dateFrom,
  dateTo,
  periodLabel,
  onPeriodPresetChange,
  onCustomDateRangeChange,
}: ReportsPeriodSelectorProps) {
  return (
    <Card className="border-slate-200/90 shadow-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-[#0A2240]">Periodo del reporte</CardTitle>
        <CardDescription>
          Diario (hoy), semanal (semana en curso) o rango personalizado con calendario
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {PRESET_OPTIONS.map((option) => (
            <Button
              key={option.id}
              type="button"
              variant={periodPreset === option.id ? 'default' : 'outline'}
              className={cn(
                periodPreset === option.id &&
                  'bg-[#0A2240] text-white hover:bg-[#0f3460]',
              )}
              onClick={() => onPeriodPresetChange(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <p className="text-sm font-medium text-[#00a896]">{periodLabel}</p>

        {periodPreset === 'custom' && (
          <div className="max-w-md">
            <DashboardFilterDateRange
              id="reports-custom-range"
              label="Rango de fechas"
              value={{ from: dateFrom, to: dateTo }}
              onChange={({ from, to }) => onCustomDateRangeChange(from, to)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
