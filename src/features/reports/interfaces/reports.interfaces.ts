import type { ReportsWorkbookSheet } from '../data/reports-workbook-sheets.config';

export type ReportsPeriodPreset = 'daily' | 'weekly' | 'custom';

export interface ReportsFilterOption {
  readonly value: string;
  readonly label: string;
}

export interface ReportsKpis {
  readonly totalActions: number;
  readonly openActions: number;
  readonly closedActions: number;
  readonly pendingAcceptance: number;
  readonly expiredActions: number;
  readonly closureReview: number;
  readonly rejectedClosures: number;
  readonly walkthroughsPeriod: number;
  readonly avgClosureDays: number;
}

export interface ReportsSheetCounts {
  readonly actions: number;
  readonly commitments: number;
  readonly walkthroughs: number;
  readonly detections: number;
}

export interface ReportsPreview {
  readonly period: {
    readonly from: string;
    readonly to: string;
    readonly preset: ReportsPeriodPreset;
    readonly label: string;
  };
  readonly filterOptions: {
    readonly companies: readonly ReportsFilterOption[];
    readonly areas: readonly ReportsFilterOption[];
    readonly responsibles: readonly ReportsFilterOption[];
  };
  readonly kpis: ReportsKpis;
  readonly sheetCounts: ReportsSheetCounts;
  readonly exportFileName: string;
}

export interface ReportsFiltersState {
  readonly periodPreset: ReportsPeriodPreset;
  readonly dateFrom: string;
  readonly dateTo: string;
  readonly companyId: string;
  readonly areaId: string;
  readonly responsibleId: string;
  readonly activity: string;
  readonly status: string;
}

export interface ReportsQueryParams {
  readonly periodPreset: ReportsPeriodPreset;
  readonly dateFrom?: string;
  readonly dateTo?: string;
  readonly companyId?: string;
  readonly areaId?: string;
  readonly responsibleId?: string;
  readonly status?: string;
  readonly detectionType?: 'unsafe_act' | 'unsafe_condition';
}

export interface ApiResponse<T> {
  readonly data: T;
  readonly message: string;
  readonly error: string | null;
}

export const REPORTS_ALL_FILTER_VALUE = 'all';

export const REPORTS_PREVIEW_QUERY_KEY = ['reports', 'preview'] as const;

export const emptyReportsKpis: ReportsKpis = {
  totalActions: 0,
  openActions: 0,
  closedActions: 0,
  pendingAcceptance: 0,
  expiredActions: 0,
  closureReview: 0,
  rejectedClosures: 0,
  walkthroughsPeriod: 0,
  avgClosureDays: 0,
};

export const emptyReportsSheetCounts: ReportsSheetCounts = {
  actions: 0,
  commitments: 0,
  walkthroughs: 0,
  detections: 0,
};

export interface ReportsPageHeaderProps {
  readonly periodLabel: string;
}

export interface ReportsExportPanelProps {
  readonly fileName: string;
  readonly isPreviewLoading: boolean;
  readonly isPreviewError: boolean;
  readonly isExporting: boolean;
  readonly isQueryEnabled: boolean;
  readonly totalActions: number;
  readonly exportErrorMessage: string | null;
  readonly onExportClick: () => void;
}

export interface ReportsPeriodSummaryProps {
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly errorMessage: string | null;
  readonly totalActions: number;
  readonly openActions: number;
  readonly closedActions: number;
  readonly expiredActions: number;
  readonly sheetCounts: ReportsSheetCounts;
}

export interface ReportsWorkbookPreviewProps {
  readonly sheets: readonly ReportsWorkbookSheet[];
}
