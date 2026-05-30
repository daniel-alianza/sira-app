export type TourPeriod = 'day' | 'week';

export type TourDetectionType = 'unsafe_act' | 'unsafe_condition';

export type CorrectiveActionStatus =
  | 'pending_acceptance'
  | 'open'
  | 'pending'
  | 'expired'
  | 'closure_review'
  | 'closed'
  | 'rejected'
  | 'reopened';

export interface TourCorrectiveActionRow {
  readonly id: string;
  readonly walkthroughFolio: string;
  readonly detectionFolio: string;
  readonly detectionType: TourDetectionType;
  readonly status: CorrectiveActionStatus;
  readonly responsible: string;
  readonly area: string;
  readonly tourDate: string;
  readonly weekdayLabel: string;
  readonly weekdayOrder: number;
  readonly commitmentDate: string | null;
}

export interface TourDayGroup {
  readonly weekdayLabel: string;
  readonly tourDate: string;
  readonly rows: TourCorrectiveActionRow[];
}

export interface ToursTableSectionProps {
  readonly rows: TourCorrectiveActionRow[];
  readonly showFooter?: boolean;
}

export interface ToursWeekByDaySectionProps {
  readonly groups: TourDayGroup[];
}

export interface ToursDayGroupHeaderProps {
  readonly group: TourDayGroup;
}

export interface CommitmentDateCellProps {
  readonly date: string | null;
}

export interface ToursPeriodFiltersProps {
  readonly period: TourPeriod;
  readonly onPeriodChange: (period: TourPeriod) => void;
}

export interface ToursListCardProps {
  readonly period: TourPeriod;
  readonly rows: TourCorrectiveActionRow[];
  readonly weekDayGroups: TourDayGroup[];
  readonly isLoading: boolean;
  readonly isError: boolean;
}

export interface ToursPageHeaderProps {
  readonly isTourActive: boolean;
  readonly onStartTour: () => void;
}

export interface ToursEmptyStateProps {
  readonly period: TourPeriod;
}
