import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { dashboardSubtextClass } from '@/features/dashboard/components/dashboard-ui.classes';
import {
  ACTION_STATUS_CONFIG,
  DETECTION_TYPE_LABELS,
  DETECTION_TYPE_STYLES,
} from '../interfaces';
import type { ToursTableSectionProps } from '../interfaces';
import { CommitmentDateCell } from './CommitmentDateCell';

export function ToursTableSection({ rows, showFooter = true }: ToursTableSectionProps) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-3 p-3 md:hidden">
        {rows.map((row) => {
          const status = ACTION_STATUS_CONFIG[row.status];
          return (
            <article
              key={row.id}
              className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-mono text-xs font-semibold text-[#00a896]">
                  {row.detectionFolio}
                </p>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium',
                    status.className,
                  )}
                >
                  {status.label}
                </span>
              </div>
              <p className="mt-1 font-mono text-[10px] text-slate-500">{row.walkthroughFolio}</p>
              <span
                className={cn(
                  'mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium',
                  DETECTION_TYPE_STYLES[row.detectionType],
                )}
              >
                {DETECTION_TYPE_LABELS[row.detectionType]}
              </span>
              <p className="mt-2 text-sm font-medium text-[#0A2240]">{row.responsible}</p>
              <p className={dashboardSubtextClass}>{row.area}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-lg bg-white p-2">
                  <p className="text-slate-500">Fecha recorrido</p>
                  <p className="font-medium text-[#0A2240]">{row.tourDate}</p>
                </div>
                <div className="rounded-lg bg-white p-2">
                  <p className="text-slate-500">Fecha compromiso</p>
                  {row.commitmentDate ? (
                    <p className="font-medium text-[#0A2240]">{row.commitmentDate}</p>
                  ) : (
                    <p className="font-medium text-slate-500">Pendiente</p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden md:block">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
              <TableHead className="h-auto px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-600">
                Folio recorrido
              </TableHead>
              <TableHead className="h-auto px-3 py-3 text-xs font-medium uppercase tracking-wider text-slate-600">
                Folio detección
              </TableHead>
              <TableHead className="h-auto px-3 py-3 text-xs font-medium uppercase tracking-wider text-slate-600">
                Tipo
              </TableHead>
              <TableHead className="h-auto px-3 py-3 text-xs font-medium uppercase tracking-wider text-slate-600">
                Estatus
              </TableHead>
              <TableHead className="h-auto px-3 py-3 text-xs font-medium uppercase tracking-wider text-slate-600">
                Responsable
              </TableHead>
              <TableHead className="h-auto px-3 py-3 text-xs font-medium uppercase tracking-wider text-slate-600">
                Fecha recorrido
              </TableHead>
              <TableHead className="h-auto px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-600">
                Fecha compromiso
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const status = ACTION_STATUS_CONFIG[row.status];
              return (
                <TableRow
                  key={row.id}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/80"
                >
                  <TableCell className="px-5 py-4 align-top">
                    <p className="font-mono text-xs font-medium text-slate-600">
                      {row.walkthroughFolio}
                    </p>
                  </TableCell>
                  <TableCell className="px-3 py-4 align-top">
                    <p className="font-mono text-xs font-medium text-[#00a896]">
                      {row.detectionFolio}
                    </p>
                  </TableCell>
                  <TableCell className="px-3 py-4 align-top">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                        DETECTION_TYPE_STYLES[row.detectionType],
                      )}
                    >
                      {DETECTION_TYPE_LABELS[row.detectionType]}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-4 align-top">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                        status.className,
                      )}
                    >
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-4 align-top">
                    <p className="font-medium text-[#0A2240]">{row.responsible}</p>
                    <p className={cn(dashboardSubtextClass, 'text-xs')}>{row.area}</p>
                  </TableCell>
                  <TableCell className="px-3 py-4 align-top text-[#0A2240]">
                    {row.tourDate}
                  </TableCell>
                  <TableCell className="px-5 py-4 align-top whitespace-normal">
                    <CommitmentDateCell date={row.commitmentDate} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {showFooter && (
        <div className="border-t border-slate-200/90 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500 md:px-6">
          Mostrando {rows.length} detecciones
        </div>
      )}
    </>
  );
}
