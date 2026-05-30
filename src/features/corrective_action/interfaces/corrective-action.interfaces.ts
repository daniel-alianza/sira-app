import type {
  CorrectiveActionStatus,
  TourDetectionType,
} from '@/features/tours/interfaces';
import type { CommitmentHistoryItem } from './commitment-history.interfaces';

export type { CorrectiveActionStatus, TourDetectionType };

export type ActionStatusFilter = CorrectiveActionStatus | 'all';

export interface CorrectiveActionItem {
  readonly id: string;
  readonly detectionFolio: string;
  readonly walkthroughFolio: string;
  readonly detectionType: TourDetectionType;
  readonly description: string;
  readonly companyName: string;
  readonly branchName: string;
  readonly areaName: string;
  readonly status: CorrectiveActionStatus;
  readonly correctivePlan: string | null;
  readonly currentCommitmentDate: string | null;
  readonly commitmentSequence: number | null;
  readonly assignedAt: string;
  readonly tourDate: string;
}

export interface CorrectiveActionDetail extends CorrectiveActionItem {
  readonly inspectorName: string;
  readonly inspectedAt: string;
  readonly responsibleName: string;
  readonly photoUrl: string | null;
  readonly photoCaption: string;
  readonly signatureUrl: string | null;
  readonly resolutionPhotoUrl: string | null;
  readonly respondedAt: string | null;
  readonly resolutionResolvedAt: string | null;
  readonly resolutionDurationMinutes: number | null;
  readonly closureRejectionReason: string | null;
  readonly commitmentHistory: readonly CommitmentHistoryItem[];
}

export interface ActionsPageHeaderProps {
  readonly pendingCount: number;
  readonly isResponsibleView: boolean;
}

export interface ActionsStatusFiltersProps {
  readonly statusFilter: ActionStatusFilter;
  readonly onStatusFilterChange: (filter: ActionStatusFilter) => void;
  readonly counts: Record<ActionStatusFilter, number>;
}

export interface ActionsTableProps {
  readonly actions: CorrectiveActionItem[];
  readonly onViewDetail: (action: CorrectiveActionItem) => void;
}

export interface RespondCorrectiveActionPayload {
  readonly correctivePlan: string;
  readonly commitmentDate: string;
  readonly signatureDataUrl: string;
  readonly changeReason?: string;
  readonly resolutionPhotoDataUrl?: string;
}

export interface RespondCorrectiveActionResult {
  readonly id: string;
  readonly status: CorrectiveActionStatus;
  readonly commitmentSequence: number;
  readonly resolutionPhotoBlobId?: string;
}

export interface SubmitResolutionPhotoPayload {
  readonly resolutionPhotoDataUrl: string;
}

export interface SubmitResolutionPhotoResult {
  readonly id: string;
  readonly status: CorrectiveActionStatus;
  readonly resolutionPhotoBlobId: string;
  readonly resolutionResolvedAt: string;
  readonly resolutionDurationMinutes: number;
}

export type CorrectiveClosureDecision = 'approve' | 'reject';

export interface ReviewCorrectiveClosurePayload {
  readonly decision: CorrectiveClosureDecision;
  readonly reviewNotes?: string;
}

export interface ReviewCorrectiveClosureResult {
  readonly id: string;
  readonly status: CorrectiveActionStatus;
  readonly decision: CorrectiveClosureDecision;
}

export interface ActionRespondModalProps {
  readonly action: CorrectiveActionItem | null;
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onSuccess?: () => void;
}

export interface ApiResponse<T> {
  readonly data: T;
  readonly message: string;
  readonly error: string | null;
}
