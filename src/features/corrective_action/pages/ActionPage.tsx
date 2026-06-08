import { Loader2, Bell } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/store/auth.store';
import {
  canDirectCloseSheActions,
  canRespondToActions,
  canReviewActionClosure,
} from '@/features/auth/utils/role-permissions';
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
  ActionDirectCloseModal,
} from '../components';
import type { CorrectiveActionItem } from '../interfaces';
import { useActionsPage } from '../hooks/useActionsPage';
import { useActionsNotify } from '../hooks/useActionsNotify';

export function ActionPage() {
  const roleName = useAuthStore((state) => state.user?.role?.name);
  const areaName = useAuthStore((state) => state.user?.area?.name);
  const isResponsibleView = canRespondToActions(roleName);
  const canNotifyUsers = canReviewActionClosure(roleName);
  const canDirectClose = canDirectCloseSheActions(areaName);
  const [directCloseAction, setDirectCloseAction] = useState<CorrectiveActionItem | null>(
    null,
  );
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
    listQueue,
  } = useActionsPage();
  const showNotifyActions =
    canNotifyUsers &&
    (listQueue === 'not-signed' || statusFilter === 'pending_acceptance');
  const {
    notifyAction,
    notifyAllActions,
    notifyingActionId,
    isNotifying,
    feedbackMessage,
    feedbackTone,
  } = useActionsNotify({ enabled: showNotifyActions });

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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className={cn(dashboardHeadingClass, 'text-sm md:text-base')}>
                {showNotifyActions
                  ? 'Responsables sin firma de enterado'
                  : isResponsibleView
                    ? 'Acciones asignadas'
                    : 'Listado de acciones'}
              </h2>
              <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
                {showNotifyActions
                  ? 'Fotografías, detalle del hallazgo, ubicación y estatus · notifica a responsables sin firma'
                  : 'Fotografías, detalle del hallazgo, ubicación y estatus'}
              </p>
            </div>

            {showNotifyActions && filteredActions.length > 0 && (
              <button
                type="button"
                onClick={() => notifyAllActions(filteredActions)}
                disabled={isNotifying}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900 shadow-sm transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {notifyingActionId === 'bulk' ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Bell className="size-3.5" />
                )}
                Notificar a todos
              </button>
            )}
          </div>

          {feedbackMessage && (
            <p
              className={cn(
                'mt-3 rounded-lg px-3 py-2 text-xs font-medium',
                feedbackTone === 'success'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-red-50 text-red-700',
              )}
            >
              {feedbackMessage}
            </p>
          )}
        </div>

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
          <ActionsTable
            actions={filteredActions}
            onViewDetail={openActionDetail}
            showNotifyActions={showNotifyActions}
            notifyingActionId={notifyingActionId}
            onNotifyAction={notifyAction}
            showDirectCloseActions={canDirectClose}
            onDirectCloseAction={setDirectCloseAction}
          />
        )}
      </div>

      <ActionDirectCloseModal
        actionId={directCloseAction?.id ?? null}
        detectionFolio={directCloseAction?.detectionFolio ?? ''}
        open={directCloseAction !== null}
        onClose={() => setDirectCloseAction(null)}
      />
    </div>
  );
}
