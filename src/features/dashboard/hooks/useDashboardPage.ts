import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { useMemo, useState } from 'react';
import {
  DASHBOARD_AI_SUMMARY_QUERY_KEY,
  DASHBOARD_ALL_FILTER_VALUE,
  DASHBOARD_OVERVIEW_QUERY_KEY,
} from '../interfaces';
import type {
  DashboardDateRangeValue,
  DashboardFiltersState,
  DashboardFilterOption,
  DashboardQueryParams,
} from '../interfaces';
import {
  fetchDashboardAiSummary,
  fetchDashboardOverview,
} from '../services/dashboard.service';

function getDefaultDateRange(): DashboardDateRangeValue {
  const to = new Date();
  const from = subDays(to, 30);

  return {
    from: format(from, 'yyyy-MM-dd'),
    to: format(to, 'yyyy-MM-dd'),
  };
}

function buildDashboardQueryParams(
  filters: DashboardFiltersState,
): DashboardQueryParams {
  const params: Record<string, string> = {
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  };

  if (filters.companyId !== DASHBOARD_ALL_FILTER_VALUE) {
    params.companyId = filters.companyId;
  }

  if (filters.areaId !== DASHBOARD_ALL_FILTER_VALUE) {
    params.areaId = filters.areaId;
  }

  if (filters.responsibleId !== DASHBOARD_ALL_FILTER_VALUE) {
    params.responsibleId = filters.responsibleId;
  }

  if (filters.status !== DASHBOARD_ALL_FILTER_VALUE) {
    params.status = filters.status;
  }

  if (
    filters.activity === 'unsafe_act' ||
    filters.activity === 'unsafe_condition'
  ) {
    params.detectionType = filters.activity;
  }

  return params as DashboardQueryParams;
}

function withAllOption(
  options: readonly DashboardFilterOption[],
  allLabel: string,
): DashboardFilterOption[] {
  return [{ value: DASHBOARD_ALL_FILTER_VALUE, label: allLabel }, ...options];
}

export function useDashboardPage() {
  const queryClient = useQueryClient();
  const defaultRange = useMemo(() => getDefaultDateRange(), []);
  const [filters, setFilters] = useState<DashboardFiltersState>({
    companyId: DASHBOARD_ALL_FILTER_VALUE,
    areaId: DASHBOARD_ALL_FILTER_VALUE,
    responsibleId: DASHBOARD_ALL_FILTER_VALUE,
    activity: DASHBOARD_ALL_FILTER_VALUE,
    status: DASHBOARD_ALL_FILTER_VALUE,
    dateFrom: defaultRange.from,
    dateTo: defaultRange.to,
  });

  const queryParams = useMemo(
    () => buildDashboardQueryParams(filters),
    [filters],
  );

  const overviewQuery = useQuery({
    queryKey: [...DASHBOARD_OVERVIEW_QUERY_KEY, queryParams],
    queryFn: () => fetchDashboardOverview(queryParams),
  });

  const aiSummaryQuery = useQuery({
    queryKey: [...DASHBOARD_AI_SUMMARY_QUERY_KEY, queryParams],
    queryFn: () => fetchDashboardAiSummary(queryParams),
    staleTime: 5 * 60 * 1000,
  });

  async function refetchAiSummary(): Promise<void> {
    const summary = await fetchDashboardAiSummary(queryParams, { refresh: true });
    queryClient.setQueryData(
      [...DASHBOARD_AI_SUMMARY_QUERY_KEY, queryParams],
      summary,
    );
  }

  const companyOptions = withAllOption(
    overviewQuery.data?.filterOptions.companies ?? [],
    'Todas las empresas',
  );
  const areaOptions = withAllOption(
    overviewQuery.data?.filterOptions.areas ?? [],
    'Todas las áreas',
  );
  const responsibleOptions = withAllOption(
    overviewQuery.data?.filterOptions.responsibles ?? [],
    'Todos',
  );

  function updateFilter<K extends keyof DashboardFiltersState>(
    key: K,
    value: DashboardFiltersState[K],
  ) {
    setFilters((current: DashboardFiltersState) => ({ ...current, [key]: value }));
  }

  function updateDateRange(value: DashboardDateRangeValue) {
    setFilters((current: DashboardFiltersState) => ({
      ...current,
      dateFrom: value.from,
      dateTo: value.to,
    }));
  }

  return {
    filters,
    updateFilter,
    updateDateRange,
    companyOptions,
    areaOptions,
    responsibleOptions,
    overview: overviewQuery.data,
    aiSummary: aiSummaryQuery.data,
    isOverviewLoading: overviewQuery.isLoading,
    isOverviewError: overviewQuery.isError,
    overviewError: overviewQuery.error,
    isAiSummaryLoading: aiSummaryQuery.isLoading,
    isAiSummaryError: aiSummaryQuery.isError,
    aiSummaryError: aiSummaryQuery.error,
    refetchOverview: overviewQuery.refetch,
    refetchAiSummary,
  };
}
