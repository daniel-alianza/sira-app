import { useCallback, useState } from 'react';
import type { CatalogSelectors } from '@/features/catalog/interfaces/catalog.interfaces';
import type {
  ActiveTourSession,
  TourDetectionFormValues,
  TourDetectionRecord,
} from '../interfaces';
import type { CatalogSelectOption } from '@/features/users/utils/catalog-select-options';
import { generateUniqueId } from '@/lib/generate-unique-id';
import { resolveCatalogLabel } from '../utils/catalog-labels';
import {
  createDetectionFolio,
  createWalkthroughFolio,
  formatTourTimestamp,
} from '../utils/tour-folio';

function resolveResponsibleName(
  options: readonly CatalogSelectOption[],
  responsibleId: string,
): string {
  return options.find((option) => option.value === responsibleId)?.label ?? '—';
}

interface UseTourSessionResult {
  readonly activeSession: ActiveTourSession | null;
  readonly detectionModalOpen: boolean;
  readonly isTourActive: boolean;
  readonly startTour: () => void;
  readonly finishTour: () => void;
  readonly openDetectionModal: () => void;
  readonly closeDetectionModal: () => void;
  readonly registerDetection: (
    values: TourDetectionFormValues,
    catalog: CatalogSelectors,
    responsibleOptions: readonly CatalogSelectOption[],
  ) => string;
}

export function useTourSession(): UseTourSessionResult {
  const [activeSession, setActiveSession] = useState<ActiveTourSession | null>(null);
  const [detectionModalOpen, setDetectionModalOpen] = useState(false);

  const startTour = useCallback(() => {
    const startedAtDate = new Date();
    setActiveSession({
      id: generateUniqueId(),
      folio: createWalkthroughFolio(),
      startedAt: formatTourTimestamp(startedAtDate),
      startedAtIso: startedAtDate.toISOString(),
      detections: [],
    });
  }, []);

  const finishTour = useCallback(() => {
    setActiveSession(null);
    setDetectionModalOpen(false);
  }, []);

  const openDetectionModal = useCallback(() => {
    setDetectionModalOpen(true);
  }, []);

  const closeDetectionModal = useCallback(() => {
    setDetectionModalOpen(false);
  }, []);

  const registerDetection = useCallback(
    (
      values: TourDetectionFormValues,
      catalog: CatalogSelectors,
      responsibleOptions: readonly CatalogSelectOption[],
    ): string => {
      const detectionFolio = createDetectionFolio();
      const detection: TourDetectionRecord = {
        id: generateUniqueId(),
        folio: detectionFolio,
        companyId: values.companyId,
        companyName: resolveCatalogLabel(catalog.companies, values.companyId),
        branchId: values.branchId,
        branchName: resolveCatalogLabel(catalog.branches, values.branchId),
        areaId: values.areaId,
        areaName: resolveCatalogLabel(catalog.areas, values.areaId),
        detectionType: values.detectionType,
        description: values.description,
        responsibleId: values.responsibleId,
        responsibleName: resolveResponsibleName(responsibleOptions, values.responsibleId),
        evidencePhotoDataUrl: values.evidencePhotoDataUrl,
        createdAt: formatTourTimestamp(new Date()),
      };

      setActiveSession((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          detections: [...current.detections, detection],
        };
      });

      return detectionFolio;
    },
    [],
  );

  return {
    activeSession,
    detectionModalOpen,
    isTourActive: activeSession !== null,
    startTour,
    finishTour,
    openDetectionModal,
    closeDetectionModal,
    registerDetection,
  };
}
