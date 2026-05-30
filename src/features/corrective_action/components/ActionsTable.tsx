import { Building2, Eye, MapPin } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  ACTION_STATUS_CONFIG,
  DETECTION_TYPE_LABELS,
  DETECTION_TYPE_STYLES,
} from '@/features/tours/interfaces';
import { dashboardSubtextClass } from '@/features/dashboard/components/dashboard-ui.classes';
import type { ActionsTableProps, CorrectiveActionItem } from '../interfaces';
import { ActionsEmptyState } from './ActionsEmptyState';

function CommitmentCell({ action }: { action: CorrectiveActionItem }) {
  if (!action.currentCommitmentDate) {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
        Sin fecha compromiso
      </span>
    );
  }

  return (
    <div className="space-y-0.5">
      <p className="font-medium text-[#0A2240]">{action.currentCommitmentDate}</p>
      {action.commitmentSequence !== null && (
        <span className="inline-flex rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
          F{action.commitmentSequence}
        </span>
      )}
    </div>
  );
}

export function ActionsTable({ actions, onViewDetail }: ActionsTableProps) {
  if (actions.length === 0) {
    return <ActionsEmptyState />;
  }

  return (
    <>
      <div className="space-y-3 p-3 md:hidden">
        {actions.map((action) => {
          const status = ACTION_STATUS_CONFIG[action.status];
          return (
            <article
              key={action.id}
              className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-mono text-xs font-semibold text-[#00a896]">
                  {action.detectionFolio}
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
              <p className="mt-1 font-mono text-[10px] text-slate-500">
                Recorrido {action.walkthroughFolio}
              </p>
              <span
                className={cn(
                  'mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium',
                  DETECTION_TYPE_STYLES[action.detectionType],
                )}
              >
                {DETECTION_TYPE_LABELS[action.detectionType]}
              </span>
              <p className="mt-2 line-clamp-3 text-sm text-[#0A2240]">{action.description}</p>
              {action.correctivePlan && (
                <p className="mt-2 text-xs text-slate-600">
                  <span className="font-medium text-slate-700">Plan: </span>
                  {action.correctivePlan}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1">
                  <Building2 className="size-3 shrink-0 text-slate-400" />
                  {action.companyName}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1">
                  <MapPin className="size-3 shrink-0 text-slate-400" />
                  {action.areaName}
                </span>
              </div>
              <div className="mt-3">
                <CommitmentCell action={action} />
              </div>
              <button
                type="button"
                onClick={() => onViewDetail(action)}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A2240] px-3 py-2 text-sm font-medium text-white"
              >
                <Eye className="size-4" />
                Ver detalle
              </button>
            </article>
          );
        })}
      </div>

      <div className="hidden md:block">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
              <TableHead className="h-auto px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-600">
                Folio detección
              </TableHead>
              <TableHead className="h-auto px-3 py-3 text-xs font-medium uppercase tracking-wider text-slate-600">
                Recorrido
              </TableHead>
              <TableHead className="h-auto px-3 py-3 text-xs font-medium uppercase tracking-wider text-slate-600">
                Hallazgo
              </TableHead>
              <TableHead className="h-auto px-3 py-3 text-xs font-medium uppercase tracking-wider text-slate-600">
                Ubicación
              </TableHead>
              <TableHead className="h-auto px-3 py-3 text-xs font-medium uppercase tracking-wider text-slate-600">
                Estatus
              </TableHead>
              <TableHead className="h-auto px-3 py-3 text-xs font-medium uppercase tracking-wider text-slate-600">
                Fecha compromiso
              </TableHead>
              <TableHead className="h-auto px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-600">
                Acción
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.map((action) => {
              const status = ACTION_STATUS_CONFIG[action.status];
              return (
                <TableRow
                  key={action.id}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/80"
                >
                  <TableCell className="px-5 py-4 align-top">
                    <p className="font-mono text-xs font-medium text-[#00a896]">
                      {action.detectionFolio}
                    </p>
                    <span
                      className={cn(
                        'mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium',
                        DETECTION_TYPE_STYLES[action.detectionType],
                      )}
                    >
                      {DETECTION_TYPE_LABELS[action.detectionType]}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-4 align-top">
                    <p className="font-mono text-xs text-slate-600">{action.walkthroughFolio}</p>
                    <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
                      {action.tourDate}
                    </p>
                  </TableCell>
                  <TableCell className="max-w-[240px] px-3 py-4 align-top whitespace-normal">
                    <p className="text-sm text-[#0A2240]">{action.description}</p>
                    {action.correctivePlan && (
                      <p className="mt-1 text-xs text-slate-600">
                        <span className="font-medium">Plan: </span>
                        {action.correctivePlan}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-4 align-top whitespace-normal">
                    <p className="text-sm text-[#0A2240]">{action.companyName}</p>
                    <p className={cn(dashboardSubtextClass, 'text-xs')}>
                      {action.branchName} · {action.areaName}
                    </p>
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
                  <TableCell className="px-3 py-4 align-top whitespace-normal">
                    <CommitmentCell action={action} />
                  </TableCell>
                  <TableCell className="px-5 py-4 align-top">
                    <button
                      type="button"
                      onClick={() => onViewDetail(action)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#0A2240] shadow-sm transition-colors hover:bg-slate-50"
                    >
                      <Eye className="size-3.5" />
                      Ver detalle
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="border-t border-slate-200/90 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500 md:px-6">
        Mostrando {actions.length} acciones
      </div>
    </>
  );
}
