import { createSearchParams } from 'react-router';
import { isActionsListIsoDate } from '@/features/corrective_action/utils/actions-list-query.utils';
import { DASHBOARD_ALL_FILTER_VALUE } from '../interfaces';
import type { DashboardFiltersState } from '../interfaces';

export type DashboardKpiNavigationId =
  | 'total'
  | 'open'
  | 'closed'
  | 'pending-accept'
  | 'expired'
  | 'closure-review'
  | 'rejected'
  | 'walkthroughs'
  | 'not-responded'
  | 'not-signed';

interface DashboardKpiNavigationTarget {
  readonly pathname: string;
  readonly status?: string;
  readonly statusGroup?: 'all' | 'active';
}

const KPI_NAVIGATION_TARGETS: Record<DashboardKpiNavigationId, DashboardKpiNavigationTarget> = {
  total: { pathname: '/actions', statusGroup: 'all' },
  open: { pathname: '/actions', statusGroup: 'active' },
  closed: { pathname: '/actions', status: 'closed' },
  'pending-accept': { pathname: '/actions', status: 'pending_acceptance' },
  expired: { pathname: '/actions', status: 'expired' },
  'closure-review': { pathname: '/actions', status: 'closure_review' },
  rejected: { pathname: '/actions', status: 'rejected' },
  walkthroughs: { pathname: '/tours' },
  'not-responded': { pathname: '/actions', status: 'pending_acceptance' },
  'not-signed': { pathname: '/actions', status: 'open' },
};

export function buildDashboardKpiSearchParams(
  kpiId: DashboardKpiNavigationId,
  filters: DashboardFiltersState,
): string {
  const target = KPI_NAVIGATION_TARGETS[kpiId];
  const params: Record<string, string> = {};

  if (target.statusGroup) {
    params.statusGroup = target.statusGroup;
  }

  if (target.status) {
    params.status = target.status;
  }

  if (
    filters.companyId !== DASHBOARD_ALL_FILTER_VALUE &&
    filters.companyId.length > 0
  ) {
    params.companyId = filters.companyId;
  }

  if (filters.areaId !== DASHBOARD_ALL_FILTER_VALUE && filters.areaId.length > 0) {
    params.areaId = filters.areaId;
  }

  if (
    filters.responsibleId !== DASHBOARD_ALL_FILTER_VALUE &&
    filters.responsibleId.length > 0
  ) {
    params.responsibleId = filters.responsibleId;
  }

  if (isActionsListIsoDate(filters.dateFrom)) {
    params.dateFrom = filters.dateFrom;
  }

  if (isActionsListIsoDate(filters.dateTo)) {
    params.dateTo = filters.dateTo;
  }

  if (
    filters.activity === 'unsafe_act' ||
    filters.activity === 'unsafe_condition'
  ) {
    params.detectionType = filters.activity;
  }

  if (kpiId === 'not-signed') {
    params.queue = 'not-signed';
  }

  const query = createSearchParams(params).toString();
  return query.length > 0 ? `?${query}` : '';
}

export function buildDashboardActiveActionsSearchParams(
  filters: DashboardFiltersState,
): string {
  return buildDashboardKpiSearchParams('open', filters);
}

export function getDashboardKpiNavigationPath(kpiId: DashboardKpiNavigationId): string {
  return KPI_NAVIGATION_TARGETS[kpiId].pathname;
}
