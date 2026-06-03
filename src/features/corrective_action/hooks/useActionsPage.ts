import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { CORRECTIVE_ACTIONS_QUERY_KEY } from '../interfaces';
import type {
  ActionStatusFilter,
  CorrectiveActionItem,
} from '../interfaces';
import type { ActionsQueryParams } from '../service/action.service';
import { fetchMyCorrectiveActions } from '../service/action.service';

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
  status: undefined,
  dateFrom: undefined,
  dateTo: undefined,
};

export function useActionsPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<ActionStatusFilter>('all');
  const [filters, setFilters] = useState<ActionsQueryParams>(FILTER_INITIAL);

  const activeParams = useMemo(() => {
    const p: Record<string, string> = {};
    let hasAny = false;

    if (filters.companyId) { p.companyId = filters.companyId; hasAny = true; }
    if (filters.areaId) { p.areaId = filters.areaId; hasAny = true; }
    if (filters.branchId) { p.branchId = filters.branchId; hasAny = true; }
    if (filters.responsibleId) { p.responsibleId = filters.responsibleId; hasAny = true; }

    return hasAny ? (p as ActionsQueryParams) : undefined;
  }, [filters]);

  const actionsQuery = useQuery({
    queryKey: [...CORRECTIVE_ACTIONS_QUERY_KEY, activeParams],
    queryFn: () => fetchMyCorrectiveActions(activeParams),
  });

  const allActions = actionsQuery.data ?? [];

  const statusCounts = useMemo(() => countByStatus(allActions), [allActions]);

  const filteredActions = useMemo(() => {
    if (statusFilter === 'all') {
      return allActions;
    }
    return allActions.filter((action) => action.status === statusFilter);
  }, [allActions, statusFilter]);

  const pendingCount = statusCounts.pending_acceptance;

  function openActionDetail(action: CorrectiveActionItem) {
    navigate(`/actions/${action.id}`);
  }

  function setFilter(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value || '' }) as ActionsQueryParams);
  }

  function clearFilters() {
    setFilters(FILTER_INITIAL);
  }

  return {
    statusFilter,
    setStatusFilter,
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
