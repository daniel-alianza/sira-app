import type { TourDetectionType } from './tours-table.interfaces';

export interface RegisterWalkthroughDetectionPayload {
  readonly folio: string;
  readonly companyId: string;
  readonly branchId: string;
  readonly areaId: string;
  readonly detectionType: TourDetectionType;
  readonly description: string;
  readonly responsibleId: string;
  readonly evidencePhotoDataUrl?: string;
}

export interface RegisterWalkthroughPayload {
  readonly folio: string;
  readonly startedAt: string;
  readonly detections: readonly RegisterWalkthroughDetectionPayload[];
}

export interface RegisterWalkthroughResult {
  readonly id: string;
  readonly folio: string;
  readonly status: 'completed';
  readonly detectionsCount: number;
  readonly finishedAt: string;
}
