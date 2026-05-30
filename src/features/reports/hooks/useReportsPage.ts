import { useMutation, useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { useMemo, useState } from 'react';
import { actionStatusOptions, activityTypeOptions } from '@/features/dashboard/interfaces';
import { reportsWorkbookSheets } from '../data/reports-workbook-sheets.config';
import {
  emptyReportsKpis,
  emptyReportsSheetCounts,
  REPORTS_ALL_FILTER_VALUE,
  REPORTS_PREVIEW_QUERY_KEY,
  type ReportsFiltersState,
  type ReportsPeriodPreset,
  type ReportsQueryParams,
} from '../interfaces';
import {
  downloadReportsWorkbook,
  fetchReportsPreview,
} from '../service/reports.service';

function getDefaultCustomRange(): { readonly from: string; readonly to: string } {
  const to = new Date();
  const from = subDays(to, 30);
  return {
    from: format(from, 'yyyy-MM-dd'),
    to: format(to, 'yyyy-MM-dd'),
  };
}

function buildReportsQueryParams(
  filters: ReportsFiltersState,
): ReportsQueryParams | null {
  if (filters.periodPreset === 'custom' && (!filters.dateFrom || !filters.dateTo)) {
    return null;
  }

  const params: ReportsQueryParams = {
    periodPreset: filters.periodPreset,
    ...(filters.periodPreset === 'custom'
      ? { dateFrom: filters.dateFrom, dateTo: filters.dateTo }
      : {}),
    ...(filters.companyId !== REPORTS_ALL_FILTER_VALUE
      ? { companyId: filters.companyId }
      : {}),
    ...(filters.areaId !== REPORTS_ALL_FILTER_VALUE ? { areaId: filters.areaId } : {}),
    ...(filters.responsibleId !== REPORTS_ALL_FILTER_VALUE
      ? { responsibleId: filters.responsibleId }
      : {}),
    ...(filters.status !== REPORTS_ALL_FILTER_VALUE ? { status: filters.status } : {}),
    ...(filters.activity === 'unsafe_act' || filters.activity === 'unsafe_condition'
      ? { detectionType: filters.activity }
      : {}),
  };

  return params;
}

function withAllOption(
  options: readonly { value: string; label: string }[],
  allLabel: string,
): { value: string; label: string }[] {
  return [{ value: REPORTS_ALL_FILTER_VALUE, label: allLabel }, ...options];
}

export function useReportsPage() {
  const defaultCustomRange = useMemo(() => getDefaultCustomRange(), []);
  const [filters, setFilters] = useState<ReportsFiltersState>({
    periodPreset: 'weekly',
    dateFrom: defaultCustomRange.from,
    dateTo: defaultCustomRange.to,
    companyId: REPORTS_ALL_FILTER_VALUE,
    areaId: REPORTS_ALL_FILTER_VALUE,
    responsibleId: REPORTS_ALL_FILTER_VALUE,
    activity: REPORTS_ALL_FILTER_VALUE,
    status: REPORTS_ALL_FILTER_VALUE,
  });

  const queryParams = useMemo(() => buildReportsQueryParams(filters), [filters]);
  const isQueryEnabled = queryParams !== null;

  const previewQuery = useQuery({
    queryKey: [...REPORTS_PREVIEW_QUERY_KEY, queryParams],
    queryFn: () => fetchReportsPreview(queryParams!),
    enabled: isQueryEnabled,
    staleTime: 60_000,
  });

  const exportMutation = useMutation({
    mutationFn: () => downloadReportsWorkbook(queryParams!),
    onSuccess: ({ blob, fileName }) => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      anchor.click();
      URL.revokeObjectURL(url);
    },
  });

  const preview = previewQuery.data;
  const kpis = preview?.kpis ?? emptyReportsKpis;
  const sheetCounts = preview?.sheetCounts ?? emptyReportsSheetCounts;

  const companyOptions = withAllOption(
    preview?.filterOptions.companies ?? [],
    'Todas las empresas',
  );
  const areaOptions = withAllOption(
    preview?.filterOptions.areas ?? [],
    'Todas las áreas',
  );
  const responsibleOptions = withAllOption(
    preview?.filterOptions.responsibles ?? [],
    'Todos los responsables',
  );

  function updateFilter<K extends keyof ReportsFiltersState>(
    key: K,
    value: ReportsFiltersState[K],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function setPeriodPreset(preset: ReportsPeriodPreset) {
    setFilters((current) => ({ ...current, periodPreset: preset }));
  }

  function setCustomDateRange(from: string, to: string) {
    setFilters((current) => ({
      ...current,
      periodPreset: 'custom',
      dateFrom: from,
      dateTo: to,
    }));
  }

  function handleExport() {
    if (!queryParams) {
      return;
    }
    exportMutation.mutate();
  }

  return {
    filters,
    updateFilter,
    setPeriodPreset,
    setCustomDateRange,
    periodLabel: preview?.period.label ?? '—',
    exportFileName: preview?.exportFileName ?? 'SIRA_Reportes.xlsx',
    workbookSheets: reportsWorkbookSheets,
    kpis,
    sheetCounts,
    companyOptions,
    areaOptions,
    responsibleOptions,
    statusOptions: actionStatusOptions,
    activityOptions: activityTypeOptions,
    isPreviewLoading: previewQuery.isLoading && isQueryEnabled,
    isPreviewError: previewQuery.isError,
    previewErrorMessage:
      previewQuery.error instanceof Error ? previewQuery.error.message : null,
    isQueryEnabled,
    isExporting: exportMutation.isPending,
    exportErrorMessage:
      exportMutation.error instanceof Error ? exportMutation.error.message : null,
    handleExport,
  };
}
