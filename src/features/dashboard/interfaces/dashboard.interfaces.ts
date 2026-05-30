export type DashboardAiHighlightTone = 'success' | 'warning' | 'neutral';

export interface ApiResponse<T> {
  readonly data: T;
  readonly message: string;
  readonly error: string | null;
}

export interface DashboardFilterOption {
  readonly value: string;
  readonly label: string;
}

export interface DashboardQueryParams {
  readonly companyId?: string;
  readonly areaId?: string;
  readonly responsibleId?: string;
  readonly status?: string;
  readonly detectionType?: 'unsafe_act' | 'unsafe_condition';
  readonly dateFrom?: string;
  readonly dateTo?: string;
}

export interface DashboardKpis {
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

export interface DashboardAreaComplianceItem {
  readonly id: string;
  readonly name: string;
  readonly compliance: number;
  readonly nonCompliance: number;
  readonly actionsTotal: number;
  readonly expired: number;
  readonly trend: string;
}

export interface DashboardCommitmentDateRequestItem {
  readonly id: string;
  readonly actionFolio: string;
  readonly walkthroughFolio: string;
  readonly responsible: string;
  readonly area: string;
  readonly description: string;
  readonly initialDate: string;
  readonly currentDate: string;
  readonly requestedDate: string;
  readonly changeLabel: string;
  readonly reason: string;
  readonly status: 'pending' | 'review';
}

export interface DashboardQueuePendingSignatureItem {
  readonly id: string;
  readonly actionFolio: string;
  readonly responsible: string;
  readonly area: string;
  readonly assignedAt: string;
  readonly commitmentDate: string;
}

export interface DashboardQueueClosureReviewItem {
  readonly id: string;
  readonly actionFolio: string;
  readonly responsible: string;
  readonly area: string;
  readonly requestedAt: string;
  readonly legend: 'Pendiente' | 'Expirado';
}

export interface DashboardQueueExpiredActionItem {
  readonly id: string;
  readonly actionFolio: string;
  readonly responsible: string;
  readonly area: string;
  readonly commitmentDate: string;
  readonly daysOverdue: number;
}

export interface DashboardActionsTrendPoint {
  readonly month: string;
  readonly created: number;
  readonly closed: number;
  readonly expired: number;
}

export interface DashboardStatusDistributionItem {
  readonly label: string;
  readonly value: number;
  readonly color: string;
}

export interface DashboardUpcomingDueItem {
  readonly days: string;
  readonly count: number;
}

export interface DashboardCharts {
  readonly actionsTrend: readonly DashboardActionsTrendPoint[];
  readonly complianceByArea: readonly {
    readonly label: string;
    readonly compliance: number;
    readonly nonCompliance: number;
  }[];
  readonly statusDistribution: readonly DashboardStatusDistributionItem[];
  readonly upcomingDue: readonly DashboardUpcomingDueItem[];
}

export interface DashboardOperationalQueues {
  readonly pendingSignature: readonly DashboardQueuePendingSignatureItem[];
  readonly closureReview: readonly DashboardQueueClosureReviewItem[];
  readonly expiredActions: readonly DashboardQueueExpiredActionItem[];
}

export interface DashboardOverview {
  readonly period: {
    readonly from: string;
    readonly to: string;
  };
  readonly filterOptions: {
    readonly companies: readonly DashboardFilterOption[];
    readonly areas: readonly DashboardFilterOption[];
    readonly responsibles: readonly DashboardFilterOption[];
  };
  readonly kpis: DashboardKpis;
  readonly areaCompliance: readonly DashboardAreaComplianceItem[];
  readonly commitmentDateRequests: readonly DashboardCommitmentDateRequestItem[];
  readonly operationalQueues: DashboardOperationalQueues;
  readonly charts: DashboardCharts;
}

export interface DashboardAiHighlight {
  readonly label: string;
  readonly value: string;
  readonly tone: DashboardAiHighlightTone;
}

export interface DashboardAiSummary {
  readonly generatedAt: string;
  readonly headline: string;
  readonly paragraphs: readonly string[];
  readonly highlights: readonly DashboardAiHighlight[];
  readonly trendNote: string;
  readonly riskNote: string;
}

export interface DashboardFiltersState {
  readonly companyId: string;
  readonly areaId: string;
  readonly responsibleId: string;
  readonly activity: string;
  readonly status: string;
  readonly dateFrom: string;
  readonly dateTo: string;
}

export interface DashboardDateRangeValue {
  readonly from: string;
  readonly to: string;
}
