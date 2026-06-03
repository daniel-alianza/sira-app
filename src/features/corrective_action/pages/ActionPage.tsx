import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { canRespondToActions } from '@/features/auth/utils/role-permissions';
import {
  dashboardCard,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import {
  ActionsFiltersBar,
  ActionsPageHeader,
  ActionsStatusFilters,
  ActionsTable,
} from '../components';
import { useActionsPage } from '../hooks/useActionsPage';

export function ActionPage() {
  const roleName = useAuthStore((state) => state.user?.role?.name);
  const isResponsibleView = canRespondToActions(roleName);
  const {
    statusFilter,
    setStatusFilter,
    statusCounts,
    filteredActions,
    pendingCount,
    isLoading,
    isError,
    openActionDetail,
    filters,
    setFilter,
    clearFilters,
  } = useActionsPage();

  return (
    <div className="w-full space-y-5 md:space-y-6">
      <ActionsPageHeader
        pendingCount={pendingCount}
        isResponsibleView={isResponsibleView}
      />

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

      <ActionsStatusFilters
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        counts={statusCounts}
      />

      <div className={cn(dashboardCard(), 'overflow-hidden p-0')}>
        <div className="border-b border-slate-100 bg-slate-50 px-4 py-3.5 md:px-6 md:py-4">
          <h2 className={cn(dashboardHeadingClass, 'text-sm md:text-base')}>
            {isResponsibleView ? 'Acciones asignadas' : 'Listado de acciones'}
          </h2>
          <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
            {isResponsibleView
              ? 'Solo las detecciones asignadas a ti · revisa evidencia y responde con tu plan'
              : 'Todas las acciones correctivas del sistema · consulta evidencia y seguimiento'}
          </p>        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-slate-500">
            <Loader2 className="size-5 animate-spin" />
            Cargando acciones…
          </div>
        )}

        {isError && !isLoading && (
          <p className="px-6 py-16 text-center text-sm text-red-600">
            No se pudieron cargar tus acciones correctivas. Intenta de nuevo más tarde.
          </p>
        )}

        {!isLoading && !isError && (
          <ActionsTable actions={filteredActions} onViewDetail={openActionDetail} />
        )}
      </div>
    </div>
  );
}
