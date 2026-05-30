import { cn } from '@/lib/utils';
import { dashboardMobileContentClass } from '@/features/dashboard/components/dashboard-ui.classes';
import {
  ReportsExportPanel,
  ReportsFiltersCard,
  ReportsPageHeader,
  ReportsPeriodSelector,
  ReportsPeriodSummary,
  ReportsWorkbookPreview,
} from '../components';
import { useReportsPage } from '../hooks';

export function ReportsPage() {
  const reports = useReportsPage();

  return (
    <div className={cn(dashboardMobileContentClass, 'w-full')}>
      <ReportsPageHeader periodLabel={reports.periodLabel} />

      <ReportsPeriodSelector
        periodPreset={reports.filters.periodPreset}
        dateFrom={reports.filters.dateFrom}
        dateTo={reports.filters.dateTo}
        periodLabel={reports.periodLabel}
        onPeriodPresetChange={reports.setPeriodPreset}
        onCustomDateRangeChange={reports.setCustomDateRange}
      />

      <ReportsFiltersCard
        filters={reports.filters}
        companyOptions={reports.companyOptions}
        areaOptions={reports.areaOptions}
        responsibleOptions={reports.responsibleOptions}
        statusOptions={reports.statusOptions}
        activityOptions={reports.activityOptions}
        onFilterChange={reports.updateFilter}
      />

      {!reports.isQueryEnabled && (
        <p
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          role="status"
        >
          Selecciona un rango completo en el calendario para el periodo personalizado.
        </p>
      )}

      <ReportsPeriodSummary
        isLoading={reports.isPreviewLoading}
        isError={reports.isPreviewError}
        errorMessage={reports.previewErrorMessage}
        totalActions={reports.kpis.totalActions}
        openActions={reports.kpis.openActions}
        closedActions={reports.kpis.closedActions}
        expiredActions={reports.kpis.expiredActions}
        sheetCounts={reports.sheetCounts}
      />

      <ReportsExportPanel
        fileName={reports.exportFileName}
        isPreviewLoading={reports.isPreviewLoading}
        isPreviewError={reports.isPreviewError}
        isExporting={reports.isExporting}
        isQueryEnabled={reports.isQueryEnabled}
        totalActions={reports.kpis.totalActions}
        exportErrorMessage={reports.exportErrorMessage}
        onExportClick={reports.handleExport}
      />

      <ReportsWorkbookPreview sheets={reports.workbookSheets} />
    </div>
  );
}
