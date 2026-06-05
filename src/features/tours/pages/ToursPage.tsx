import {
  DetectionModal,
  TourSessionPanel,
  ToursListCard,
  ToursPageHeader,
  ToursPeriodFilters,
} from '../components';
import { useToursPage } from '../hooks/useToursPage';

export function ToursPage() {
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
    </div>
  );
}
