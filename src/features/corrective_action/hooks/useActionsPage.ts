import { useNavigate, useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CORRECTIVE_ACTIONS_QUERY_KEY } from '../interfaces';
import type {
  ActionStatusFilter,
  ActionsListStatusGroup,
  CorrectiveActionItem,
} from '../interfaces';
import type { TourDetectionType } from '@/features/tours/interfaces';
import type { ActionsQueryParams } from '../service/action.service';
import { fetchMyCorrectiveActions } from '../service/action.service';
import {
  filterActionsByStatusGroup,
  parseActionsListSearchParams,
} from '../utils/parse-actions-list-search-params';

function countByStatus(
  actions: CorrectiveActionItem[],
): Record<ActionStatusFilter, number> {
  const counts: Record<ActionStatusFilter, number> = {
    all: actions.length,
    pending_acceptance: 0,
    open: 0,
    pending: 0,
    expired: 0,
    closure_review: 0,
    closed: 0,
    rejected: 0,
    reopened: 0,
  };

  for (const action of actions) {
    counts[action.status] += 1;
  }

  return counts;
}

const FILTER_INITIAL: ActionsQueryParams = {
  companyId: '',
  areaId: '',
  branchId: '',
  responsibleId: '',
};

function buildApiQueryParams(
  filters: ActionsQueryParams,
): ActionsQueryParams | undefined {
  const params: ActionsQueryParams = {};
  let hasAny = false;

  if (filters.companyId) {
    params.companyId = filters.companyId;
    hasAny = true;
  }
  if (filters.areaId) {
    params.areaId = filters.areaId;
    hasAny = true;
  }
  if (filters.branchId) {
    params.branchId = filters.branchId;
    hasAny = true;
  }
  if (filters.responsibleId) {
    params.responsibleId = filters.responsibleId;
    hasAny = true;
  }
  if (filters.dateFrom) {
    params.dateFrom = filters.dateFrom;
    hasAny = true;
  }
  if (filters.dateTo) {
    params.dateTo = filters.dateTo;
    hasAny = true;
  }

  return hasAny ? params : undefined;
}

export function useActionsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<ActionStatusFilter>('all');
  const [statusGroup, setStatusGroup] = useState<ActionsListStatusGroup | null>(null);
  const [detectionTypeFilter, setDetectionTypeFilter] = useState<TourDetectionType | null>(
    null,
  );
  const [filters, setFilters] = useState<ActionsQueryParams>(FILTER_INITIAL);

  useEffect(() => {
    const parsed = parseActionsListSearchParams(searchParams);
    setStatusFilter(parsed.statusFilter);
    setStatusGroup(parsed.statusGroup);
    setDetectionTypeFilter(parsed.detectionType);
    setFilters({
      ...FILTER_INITIAL,
      ...parsed.filters,
    });
  }, [searchParams]);

  const activeParams = useMemo(() => buildApiQueryParams(filters), [filters]);

  const actionsQuery = useQuery({
    queryKey: [...CORRECTIVE_ACTIONS_QUERY_KEY, activeParams],
    queryFn: () => fetchMyCorrectiveActions(activeParams),
  });

  const allActions = actionsQuery.data ?? [];

  const statusCounts = useMemo(() => countByStatus(allActions), [allActions]);

  const filteredActions = useMemo(() => {
    let result =
      statusFilter === 'all'
        ? allActions
        : allActions.filter((action) => action.status === statusFilter);

    if (detectionTypeFilter) {
      result = result.filter((action) => action.detectionType === detectionTypeFilter);
    }

    return filterActionsByStatusGroup(result, statusGroup);
  }, [allActions, statusFilter, statusGroup, detectionTypeFilter]);

  const pendingCount = statusCounts.pending_acceptance;

  const updateStatusFilter = useCallback(
    (next: ActionStatusFilter) => {
      setSearchParams(
        (current) => {
          const nextParams = new URLSearchParams(current);

          if (next === 'all') {
            nextParams.delete('status');
          } else {
            nextParams.set('status', next);
          }

          return nextParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  function openActionDetail(action: CorrectiveActionItem) {
    navigate(`/actions/${action.id}`);
  }

  function setFilter(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value || '' }) as ActionsQueryParams);
  }

  function clearFilters() {
    setSearchParams({}, { replace: true });
    setFilters(FILTER_INITIAL);
    setStatusGroup(null);
    setStatusFilter('all');
    setDetectionTypeFilter(null);
  }

  return {
    statusFilter,
    setStatusFilter: updateStatusFilter,
    statusGroup,
    statusCounts,
    filteredActions,
    pendingCount,
    isLoading: actionsQuery.isLoading,
    isError: actionsQuery.isError,
    openActionDetail,
    filters,
    setFilter,
    clearFilters,
  };
}
