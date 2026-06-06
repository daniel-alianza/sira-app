import type { CorrectiveActionStatus, TourDetectionType } from '@/features/tours/interfaces';
import type { ActionsQueryParams } from '../service/action.service';
import type { ActionStatusFilter, ActionsListStatusGroup, ActionsListQueue } from '../interfaces';
import {
  isActionsListIsoDate,
  isActionsListUuid,
} from './actions-list-query.utils';

const ACTIVE_STATUSES: readonly CorrectiveActionStatus[] = [
  'open',
  'pending',
  'reopened',
];

const VALID_STATUSES: readonly CorrectiveActionStatus[] = [
  'pending_acceptance',
  'open',
  'pending',
  'expired',
  'closure_review',
  'closed',
  'rejected',
  'reopened',
];

function isCorrectiveActionStatus(value: string): value is CorrectiveActionStatus {
  return (VALID_STATUSES as readonly string[]).includes(value);
}

function isActionsListStatusGroup(value: string): value is ActionsListStatusGroup {
  return value === 'all' || value === 'active';
}

function isActionsListQueue(value: string): value is ActionsListQueue {
  return value === 'not-signed';
}

export interface ParsedActionsListSearchParams {
  readonly statusFilter: ActionStatusFilter;
  readonly statusGroup: ActionsListStatusGroup | null;
  readonly filters: ActionsQueryParams;
  readonly detectionType: TourDetectionType | null;
  readonly listQueue: ActionsListQueue | null;
}

function readOptionalParam(
  searchParams: URLSearchParams,
  key: string,
): string | undefined {
  const value = searchParams.get(key);
  if (value === null || value.length === 0) {
    return undefined;
  }
  return value;
}

export function parseActionsListSearchParams(
  searchParams: URLSearchParams,
): ParsedActionsListSearchParams {
  const filters: Record<string, string> = {};

  const companyId = readOptionalParam(searchParams, 'companyId');
  const areaId = readOptionalParam(searchParams, 'areaId');
  const branchId = readOptionalParam(searchParams, 'branchId');
  const responsibleId = readOptionalParam(searchParams, 'responsibleId');
  const dateFrom = readOptionalParam(searchParams, 'dateFrom');
  const dateTo = readOptionalParam(searchParams, 'dateTo');
  const statusParam = readOptionalParam(searchParams, 'status');
  const statusGroupParam = readOptionalParam(searchParams, 'statusGroup');
  const detectionTypeParam = readOptionalParam(searchParams, 'detectionType');
  const queueParam = readOptionalParam(searchParams, 'queue');

  if (companyId && isActionsListUuid(companyId)) {
    filters.companyId = companyId;
  }
  if (areaId && isActionsListUuid(areaId)) {
    filters.areaId = areaId;
  }
  if (branchId && isActionsListUuid(branchId)) {
    filters.branchId = branchId;
  }
  if (responsibleId && isActionsListUuid(responsibleId)) {
    filters.responsibleId = responsibleId;
  }
  if (dateFrom && isActionsListIsoDate(dateFrom)) {
    filters.dateFrom = dateFrom;
  }
  if (dateTo && isActionsListIsoDate(dateTo)) {
    filters.dateTo = dateTo;
  }

  const statusGroup =
    statusGroupParam && isActionsListStatusGroup(statusGroupParam)
      ? statusGroupParam
      : null;

  let statusFilter: ActionStatusFilter = 'all';

  if (statusGroup === 'active') {
    statusFilter = 'all';
  } else if (statusParam && isCorrectiveActionStatus(statusParam)) {
    statusFilter = statusParam;
  }

  const detectionType =
    detectionTypeParam === 'unsafe_act' || detectionTypeParam === 'unsafe_condition'
      ? detectionTypeParam
      : null;

  const listQueue =
    queueParam && isActionsListQueue(queueParam) ? queueParam : null;

  return {
    statusFilter,
    statusGroup,
    filters: filters as ActionsQueryParams,
    detectionType,
    listQueue,
  };
}

export function filterActionsByStatusGroup<T extends { readonly status: CorrectiveActionStatus }>(
  actions: readonly T[],
  statusGroup: ActionsListStatusGroup | null,
): T[] {
  if (statusGroup !== 'active') {
    return [...actions];
  }

  return actions.filter((action) => ACTIVE_STATUSES.includes(action.status));
}
