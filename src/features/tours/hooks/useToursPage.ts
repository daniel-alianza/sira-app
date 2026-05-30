import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useCatalogSelectors } from '@/features/catalog/hooks/useCatalogSelectors';
import { TOURS_DETECTIONS_QUERY_KEY } from '../interfaces';
import type { TourDetectionFormValues, TourPeriod } from '../interfaces';
import { registerWalkthrough } from '../services/tours.service';
import { mapSessionToRegisterPayload } from '../utils/map-session-to-register-payload';
import { useResponsibleOptions } from './useResponsibleOptions';
import { useTourSession } from './useTourSession';
import { useToursList } from './useToursList';

export function useToursPage() {
  const [period, setPeriod] = useState<TourPeriod>('day');
  const [finishError, setFinishError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const catalogQuery = useCatalogSelectors();
  const responsibleQuery = useResponsibleOptions();
  const toursList = useToursList(period);
  const {
    activeSession,
    detectionModalOpen,
    isTourActive,
    startTour,
    finishTour,
    openDetectionModal,
    closeDetectionModal,
    registerDetection,
  } = useTourSession();

  const registerWalkthroughMutation = useMutation({
    mutationFn: registerWalkthrough,
    onSuccess: async () => {
      setFinishError(null);
      finishTour();
      await queryClient.invalidateQueries({ queryKey: TOURS_DETECTIONS_QUERY_KEY });
    },
    onError: (error: Error) => {
      setFinishError(error.message);
    },
  });

  const handleDetectionSubmit = useCallback(
    (values: TourDetectionFormValues): string => {
      if (!catalogQuery.data) {
        return '';
      }
      return registerDetection(values, catalogQuery.data, responsibleQuery.options);
    },
    [catalogQuery.data, registerDetection, responsibleQuery.options],
  );

  const handleStartTour = useCallback(() => {
    setFinishError(null);
    startTour();
    openDetectionModal();
  }, [startTour, openDetectionModal]);

  const handleFinishTour = useCallback(() => {
    if (!activeSession) {
      return;
    }

    setFinishError(null);
    registerWalkthroughMutation.mutate(mapSessionToRegisterPayload(activeSession));
  }, [activeSession, registerWalkthroughMutation]);

  return {
    period,
    setPeriod,
    toursList,
    catalogQuery,
    responsibleQuery,
    activeSession,
    detectionModalOpen,
    isTourActive,
    isFinishingTour: registerWalkthroughMutation.isPending,
    finishError,
    openDetectionModal,
    closeDetectionModal,
    handleDetectionSubmit,
    handleStartTour,
    handleFinishTour,
  };
}
