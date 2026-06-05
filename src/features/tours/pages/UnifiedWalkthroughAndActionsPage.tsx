import { useQuery } from '@tanstack/react-query';
import { ClipboardList, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import {
  dashboardCard,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import { DETECTION_TYPE_LABELS, DETECTION_TYPE_STYLES } from '@/features/tours/interfaces';
import {
  CORRECTIVE_ACTIONS_QUERY_KEY,
  type CorrectiveActionItem,
} from '@/features/corrective_action/interfaces';
import { fetchMyCorrectiveActions } from '@/features/corrective_action/service/action.service';
import { useToursPage } from '../hooks/useToursPage';
import {
  DetectionModal,
  TourSessionPanel,
  ToursListCard,
  ToursPageHeader,
  ToursPeriodFilters,
} from '../components';

export function UnifiedWalkthroughAndActionsPage() {
  const navigate = useNavigate();
  const {
    period,
    setPeriod,
    toursList,
    catalogQuery,
    responsibleQuery,
    activeSession,
    detectionModalOpen,
    isTourActive,
    isFinishingTour,
    finishError,
    openDetectionModal,
    closeDetectionModal,
    handleDetectionSubmit,
    handleStartTour,
    handleFinishTour,
    updateDetectionEvidence,
  } = useToursPage();

  const actionsQuery = useQuery({
    queryKey: CORRECTIVE_ACTIONS_QUERY_KEY,
    queryFn: () => fetchMyCorrectiveActions(),
  });

  const allActions = actionsQuery.data ?? [];
  const pendingActions = allActions.filter(
    (a) => a.status !== 'closed' && a.status !== 'rejected',
  );

  function handleActionClick(action: CorrectiveActionItem) {
    navigate(`/actions/${action.id}`);
  }

  return (
    <div className="w-full space-y-5 md:space-y-6">
      <ToursPageHeader isTourActive={isTourActive} onStartTour={handleStartTour} />

      {activeSession && (
        <TourSessionPanel
          session={activeSession}
          isFinishing={isFinishingTour}
          finishError={finishError}
          onAddDetection={openDetectionModal}
          onFinishTour={handleFinishTour}
          onUpdateDetectionEvidence={updateDetectionEvidence}
        />
      )}

      <DetectionModal
        open={detectionModalOpen && isTourActive}
        tourFolio={activeSession?.folio ?? ''}
        detectionCount={activeSession?.detections.length ?? 0}
        catalog={catalogQuery.data}
        isCatalogLoading={catalogQuery.isLoading}
        allUsers={responsibleQuery.data}
        isAllUsersLoading={responsibleQuery.isLoading}
        isAllUsersError={responsibleQuery.isError}
        onClose={closeDetectionModal}
        onSubmit={handleDetectionSubmit}
      />

      <ToursPeriodFilters period={period} onPeriodChange={setPeriod} />

      <ToursListCard
        period={period}
        rows={toursList.rows}
        weekDayGroups={toursList.weekDayGroups}
        isLoading={toursList.isLoading}
        isError={toursList.isError}
      />

      <div className={cn(dashboardCard(), 'overflow-hidden p-0')}>
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3.5 md:px-6 md:py-4">
          <div>
            <h2 className={cn(dashboardHeadingClass, 'text-sm md:text-base')}>
              Acciones correctivas activas
            </h2>
            <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
              Seguimiento de acciones correctivas abiertas
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/actions')}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#0A2240] shadow-sm transition-colors hover:bg-slate-50"
          >
            Ver todas
          </button>
        </div>

        {actionsQuery.isLoading && (
          <div className="flex items-center justify-center gap-2 px-6 py-10 text-sm text-slate-500">
            <Loader2 className="size-5 animate-spin" />
            Cargando acciones…
          </div>
        )}

        {!actionsQuery.isLoading && !actionsQuery.isError && pendingActions.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <ClipboardList className="size-10 text-[#0A2240]/30" />
            <p className={cn(dashboardSubtextClass, 'mt-2 text-sm')}>
              Sin acciones activas
            </p>
          </div>
        )}

        {!actionsQuery.isLoading && !actionsQuery.isError && pendingActions.length > 0 && (
          <div className="divide-y divide-slate-100">
            {pendingActions.map((action: CorrectiveActionItem) => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleActionClick(action)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 md:px-6"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0A2240]/5">
                  <ClipboardList className="size-4 text-[#0A2240]/60" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#00a896]">
                      {action.detectionFolio}
                    </span>
                    <span className={cn(
                      'inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium',
                      DETECTION_TYPE_STYLES[action.detectionType],
                    )}>
                      {DETECTION_TYPE_LABELS[action.detectionType]}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-sm text-[#0A2240]">{action.description}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {action.companyName} · {action.areaName}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">{action.assignedAt}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
