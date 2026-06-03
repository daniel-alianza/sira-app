import type {
  CorrectiveActionStatus,
  TourDetectionType,
} from '@/features/tours/interfaces';

export interface ActionDetailHeaderProps {
  readonly detectionFolio: string;
  readonly walkthroughFolio: string;
  readonly onBack: () => void;
  readonly backLabel?: string;
}

export interface ActionDetailPhotoProps {
  readonly photoUrl: string | null;
  readonly photoCaption: string;
  readonly inspectorName: string;
  readonly inspectedAt: string;
}

export interface ActionDetailObservationProps {
  readonly detectionType: TourDetectionType;
  readonly description: string;
}

export interface ActionDetailStatusPanelProps {
  readonly status: CorrectiveActionStatus;
  readonly companyName: string;
  readonly branchName: string;
  readonly areaName: string;
  readonly tourDate: string;
  readonly assignedAt: string;
  readonly closureRejectionReason?: string | null;
  readonly resolutionDurationMinutes?: number | null;
}
