import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { DashboardCharts, DashboardComplianceByAreaChartItem } from '../interfaces';
import { dashboardCard, dashboardHeadingClass, dashboardSubtextClass } from './dashboard-ui.classes';

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={dashboardCard()}>
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className={cn(dashboardHeadingClass, 'text-sm')}>{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ActionsTrendChart({
  data,
}: {
  readonly data: DashboardCharts['actionsTrend'];
}) {
  const maxValue = Math.max(
    1,
    ...data.flatMap((point) => [point.created, point.closed, point.expired]),
  );
  const width = 340;
  const height = 160;
  const padding = { top: 16, right: 12, bottom: 28, left: 12 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  function getY(value: number): number {
    return padding.top + chartHeight - (value / maxValue) * chartHeight;
  }

  function getX(index: number): number {
    if (data.length <= 1) {
      return padding.left + chartWidth / 2;
    }
    return padding.left + (index / (data.length - 1)) * chartWidth;
  }

  function buildPath(key: 'created' | 'closed' | 'expired'): string {
    if (data.length === 0) {
      return '';
    }
    return data
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(point[key])}`)
      .join(' ');
  }

  if (data.length === 0) {
    return (
      <p className={cn(dashboardSubtextClass, 'py-8 text-center text-sm')}>
        Sin datos en el periodo seleccionado
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full max-h-[200px]">
        {[0.25, 0.5, 0.75, 1].map((tick) => (
          <line
            key={tick}
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + chartHeight * (1 - tick)}
            y2={padding.top + chartHeight * (1 - tick)}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
          />
        ))}
        <path d={buildPath('created')} fill="none" stroke="#0A2240" strokeWidth="2" />
        <path d={buildPath('closed')} fill="none" stroke="#00C4B3" strokeWidth="2" />
        <path d={buildPath('expired')} fill="none" stroke="#FF4D00" strokeWidth="2" strokeDasharray="4 3" />
        {data.map((point, index) => (
          <text
            key={`${point.month}-${index}`}
            x={getX(index)}
            y={height - 6}
            textAnchor="middle"
            className="fill-slate-500 text-[10px]"
          >
            {point.month}
          </text>
        ))}
      </svg>
      <div className={cn(dashboardSubtextClass, 'flex flex-wrap justify-center gap-4')}>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#0A2240]" />
          Creadas
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#00C4B3]" />
          Cerradas
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#FF4D00]" />
          Expiradas
        </span>
      </div>
    </div>
  );
}

function getComplianceBarColor(compliance: number): string {
  if (compliance >= 85) {
    return 'bg-emerald-500';
  }
  if (compliance >= 75) {
    return 'bg-[#00C4B3]';
  }
  return 'bg-orange-500';
}

function getComplianceTextColor(compliance: number): string {
  if (compliance >= 85) {
    return 'text-emerald-700';
  }
  if (compliance >= 75) {
    return 'text-[#007a70]';
  }
  return 'text-orange-700';
}

function AreaCompliancePercentChart({
  data,
}: {
  readonly data: readonly DashboardComplianceByAreaChartItem[];
}) {
  if (data.length === 0) {
    return (
      <p className={cn(dashboardSubtextClass, 'py-8 text-center text-sm')}>
        Sin áreas con acciones en el periodo
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className={cn(dashboardSubtextClass, 'text-xs')}>
        Porcentaje de acciones cerradas sobre el total por área en el periodo filtrado.
      </p>
      <ul className="space-y-3.5">
        {data.map((item) => (
          <li key={item.label} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-sm font-medium text-[#0A2240]">
                {item.label}
              </span>
              <span
                className={cn(
                  'shrink-0 text-lg font-semibold tabular-nums',
                  getComplianceTextColor(item.compliance),
                )}
              >
                {item.compliance}%
              </span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  'absolute inset-y-0 left-0 rounded-full transition-[width]',
                  getComplianceBarColor(item.compliance),
                )}
                style={{ width: `${item.compliance}%` }}
              />
            </div>
            <p className={cn(dashboardSubtextClass, 'text-[11px]')}>
              {item.closedActions} de {item.actionsTotal} acciones cerradas
              {item.nonCompliance > 0 ? ` · ${item.nonCompliance}% pendiente de cierre` : ''}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusDonutChart({
  data,
}: {
  readonly data: DashboardCharts['statusDistribution'];
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let rotation = 0;

  if (total === 0) {
    return (
      <p className={cn(dashboardSubtextClass, 'py-8 text-center text-sm')}>
        Sin acciones en el periodo
      </p>
    );
  }

  const segments = data.map((item) => {
    const strokeLength = (item.value / total) * circumference;
    const segment = { ...item, strokeLength, rotation };
    rotation += strokeLength;
    return segment;
  });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
      <div className="relative size-36 shrink-0">
        <svg viewBox="0 0 128 128" className="size-full -rotate-90">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="16" />
          {segments.map((segment) => (
            <circle
              key={segment.label}
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="16"
              strokeDasharray={`${segment.strokeLength} ${circumference - segment.strokeLength}`}
              strokeDashoffset={-segment.rotation}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-[#0A2240]">{total}</span>
          <span className={dashboardSubtextClass}>Acciones</span>
        </div>
      </div>
      <ul className="space-y-2 text-left">
        {data.map((item) => (
          <li key={item.label} className="flex items-center gap-2.5 text-sm">
            <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-slate-700">{item.label}</span>
            <span className="ml-auto font-medium tabular-nums text-[#0A2240]">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UpcomingDueChart({
  data,
}: {
  readonly data: DashboardCharts['upcomingDue'];
}) {
  const maxCount = Math.max(1, ...data.map((item) => item.count));

  return (
    <div className="space-y-4 pt-2">
      {data.map((item) => (
        <div key={item.days} className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-[#0A2240]">Vencen en {item.days}</span>
            <span className="tabular-nums text-slate-600">{item.count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#0A2240]"
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export interface DashboardChartsSectionProps {
  readonly charts: DashboardCharts;
  readonly isLoading: boolean;
}

export function DashboardChartsSection({ charts, isLoading }: DashboardChartsSectionProps) {
  if (isLoading) {
    return (
      <section className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:gap-5">
        {['Acciones', 'Vencimientos', 'Cumplimiento', 'Estatus'].map((title) => (
          <ChartCard key={title} title={title}>
            <p className={cn(dashboardSubtextClass, 'py-8 text-center text-sm')}>Cargando...</p>
          </ChartCard>
        ))}
      </section>
    );
  }

  return (
    <section className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:gap-5">
      <ChartCard title="Acciones creadas, cerradas y expiradas">
        <ActionsTrendChart data={charts.actionsTrend} />
      </ChartCard>
      <ChartCard title="Próximos vencimientos (F vigente)">
        <UpcomingDueChart data={charts.upcomingDue} />
      </ChartCard>
      <ChartCard title="Cumplimiento por área recorrida">
        <AreaCompliancePercentChart data={charts.complianceByArea} />
        <div className={cn(dashboardSubtextClass, 'mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px]')}>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            ≥ 85% cumplimiento
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#00C4B3]" />
            75–84%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-orange-500" />
            &lt; 75%
          </span>
        </div>
      </ChartCard>
      <ChartCard title="Distribución por estatus de acción">
        <StatusDonutChart data={charts.statusDistribution} />
      </ChartCard>
    </section>
  );
}
