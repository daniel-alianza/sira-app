import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Eye, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import { MediaImage } from '@/components/MediaImage';
import {
  dashboardCard,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import { ActionsFiltersBar } from '../components/ActionsFiltersBar';
import type { ActionsQueryParams } from '../service/action.service';
import { fetchClosedCorrectiveActions } from '../service/action.service';

interface ClosedActionsPageProps {
  variant?: 'page' | 'section';
}

export function ClosedActionsPage({ variant = 'page' }: ClosedActionsPageProps) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ActionsQueryParams>({
    companyId: '',
    areaId: '',
    branchId: '',
    responsibleId: '',
  });

  const activeParams = useMemo(() => {
    const p: Record<string, string> = {};
    let hasAny = false;
    if (filters.companyId) { p.companyId = filters.companyId; hasAny = true; }
    if (filters.areaId) { p.areaId = filters.areaId; hasAny = true; }
    if (filters.branchId) { p.branchId = filters.branchId; hasAny = true; }
    if (filters.responsibleId) { p.responsibleId = filters.responsibleId; hasAny = true; }
    return hasAny ? p : undefined;
  }, [filters]);

  const query = useQuery({
    queryKey: ['corrective-actions', 'closed', activeParams],
    queryFn: () => fetchClosedCorrectiveActions(activeParams),
  });

  function setFilter(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value || '' }) as ActionsQueryParams);
  }

  function clearFilters() {
    setFilters({ companyId: '', areaId: '', branchId: '', responsibleId: '' });
  }

  const content = (
    <>
      <ActionsFiltersBar
        companyId={filters.companyId ?? ''}
        areaId={filters.areaId ?? ''}
        branchId={filters.branchId ?? ''}
        responsibleId={filters.responsibleId ?? ''}
        onCompanyChange={(v) => setFilter('companyId', v)}
        onAreaChange={(v) => setFilter('areaId', v)}
        onBranchChange={(v) => setFilter('branchId', v)}
        onResponsibleChange={(v) => setFilter('responsibleId', v)}
        onClear={clearFilters}
      />

      {query.isLoading && (
        <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-slate-500">
          <Loader2 className="size-5 animate-spin" />
          Cargando acciones cerradas…
        </div>
      )}

      {query.isError && !query.isLoading && (
        <p className="px-6 py-16 text-center text-sm text-red-600">
          No se pudieron cargar las acciones cerradas.
        </p>
      )}

      {!query.isLoading && !query.isError && (
        <>
          {(!query.data || query.data.length === 0) ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <CheckCircle2 className="size-12 text-[#00C4B3]/40" />
              <p className={cn(dashboardHeadingClass, 'mt-4 text-base')}>
                Sin acciones cerradas
              </p>
              <p className={cn(dashboardSubtextClass, 'mt-1 max-w-sm')}>
                No hay acciones correctivas cerradas en este filtro.
              </p>
            </div>
          ) : (
            <div className={cn(dashboardCard(), 'overflow-hidden p-0')}>
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-3.5 md:px-6 md:py-4">
                <h3 className={cn(dashboardHeadingClass, 'text-sm md:text-base')}>
                  Historial de cierres
                </h3>
                <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
                  {query.data.length} acción{query.data.length !== 1 ? 'es' : ''} cerrada{query.data.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {query.data.map((action) => (
                  <div
                    key={action.id}
                    className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-start md:px-6"
                  >
                    <div className="flex shrink-0 gap-2">
                      {action.evidencePhotoUrl && (
                        <div className="size-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          <MediaImage
                            mediaPath={action.evidencePhotoUrl}
                            alt="Evidencia"
                            className="size-full object-cover"
                            fallbackClassName="size-full"
                          />
                        </div>
                      )}
                      {action.resolutionPhotoUrl && (
                        <div className="size-20 overflow-hidden rounded-xl border border-[#00C4B3]/30 bg-slate-100">
                          <MediaImage
                            mediaPath={action.resolutionPhotoUrl}
                            alt="Resolución"
                            className="size-full object-cover"
                            fallbackClassName="size-full"
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#00a896]">
                          {action.detectionFolio}
                        </span>
                        <span className="rounded-full bg-[#00C4B3]/10 px-2 py-0.5 font-mono text-[10px] font-medium text-[#007a70]">
                          {action.walkthroughFolio}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-[#0A2240]">
                        {action.description}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {action.companyName} · {action.branchName} · {action.areaName}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Responsable: {action.responsibleName} · Cerrada: {action.closedAt}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/actions/${action.id}`)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#0A2240] shadow-sm transition-colors hover:bg-slate-50"
                    >
                      <Eye className="size-3.5" />
                      Ver detalle
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );

  if (variant === 'section') {
    return content;
  }

  return (
    <div className="w-full space-y-5 md:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className={cn(dashboardHeadingClass, 'text-2xl md:text-3xl')}>
            Acciones cerradas
          </h1>
          <p className={cn(dashboardSubtextClass, 'mt-1')}>
            Historial de acciones correctivas cerradas con evidencia fotográfica
          </p>
        </div>
      </div>

      {content}
    </div>
  );
}
