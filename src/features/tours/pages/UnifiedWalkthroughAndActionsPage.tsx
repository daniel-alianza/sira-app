import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { DetectionListRow } from '@/components/DetectionListRow';
import { cn } from '@/lib/utils';
import {
  dashboardCard,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import { ACTION_STATUS_CONFIG } from '@/features/tours/interfaces';
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
              Fotografías, detalle del hallazgo, ubicación y estatus
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
          <p className={cn(dashboardSubtextClass, 'px-6 py-12 text-center text-sm')}>
            Sin acciones activas
          </p>
        )}

        {!actionsQuery.isLoading && !actionsQuery.isError && pendingActions.length > 0 && (
          <>
            <div className="divide-y divide-slate-100">
              {pendingActions.map((action: CorrectiveActionItem) => {
                const status = ACTION_STATUS_CONFIG[action.status];

                return (
                  <DetectionListRow
                    key={action.id}
                    detectionFolio={action.detectionFolio}
                    walkthroughFolio={action.walkthroughFolio}
                    description={action.description}
                    companyName={action.companyName}
                    branchName={action.branchName}
                    areaName={action.areaName}
                    evidencePhotoUrl={action.evidencePhotoUrl}
                    resolutionPhotoUrl={action.resolutionPhotoUrl}
                    detectionType={action.detectionType}
                    status={status}
                    footerLine={`Recorrido: ${action.tourDate} · ${action.responsibleName}`}
                    onViewDetail={() => handleActionClick(action)}
                  />
                );
              })}
            </div>

            <div className="border-t border-slate-200/90 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500 md:px-6">
              Mostrando {pendingActions.length}{' '}
              {pendingActions.length === 1 ? 'acción' : 'acciones'}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
