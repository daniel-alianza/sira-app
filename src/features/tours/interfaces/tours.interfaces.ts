import type { CatalogSelectors } from '@/features/catalog/interfaces/catalog.interfaces';
import type { TourDetectionFormValues } from './tour-detection.schema';
import type { TourDetectionType } from './tours-table.interfaces';

export type { TourDetectionType };

export interface TourDetectionRecord {
  readonly id: string;
  readonly folio: string;
  readonly companyId: string;
  readonly companyName: string;
  readonly branchId: string;
  readonly branchName: string;
  readonly areaId: string;
  readonly areaName: string;
  readonly detectionType: TourDetectionType;
  readonly description: string;
  readonly responsibleId: string;
  readonly responsibleName: string;
  readonly evidencePhotoDataUrl?: string;
  readonly createdAt: string;
}

export interface ActiveTourSession {
  readonly id: string;
  readonly folio: string;
  readonly startedAt: string;
  readonly startedAtIso: string;
  readonly detections: TourDetectionRecord[];
}

export interface DetectionModalProps {
  readonly open: boolean;
  readonly tourFolio: string;
  readonly detectionCount: number;
  readonly catalog: CatalogSelectors | undefined;
  readonly isCatalogLoading: boolean;
  readonly responsibleOptions: readonly { value: string; label: string }[];
  readonly isResponsibleLoading: boolean;
  readonly isResponsibleError: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (values: TourDetectionFormValues) => string;
}

export interface TourSessionPanelProps {
  readonly session: ActiveTourSession;
  readonly isFinishing: boolean;
  readonly finishError: string | null;
  readonly onAddDetection: () => void;
  readonly onFinishTour: () => void;
}

export interface ApiResponse<T> {
  readonly data: T;
  readonly message: string;
  readonly error: string | null;
}

export interface CatalogLocationFieldsProps {
  readonly companyId: string;
  readonly branchId: string;
  readonly areaId: string;
  readonly catalog: CatalogSelectors;
  readonly companyError?: string;
  readonly branchError?: string;
  readonly areaError?: string;
  readonly onCompanyChange: (value: string) => void;
  readonly onBranchChange: (value: string) => void;
  readonly onAreaChange: (value: string) => void;
}
