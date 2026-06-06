import { useAuthStore } from '@/features/auth/store/auth.store';
import { cn } from '@/lib/utils';
import { DashboardAiSummary } from '../components/DashboardAiSummary';
import { DashboardAreaComplianceCards } from '../components/DashboardAreaComplianceCards';
import { DashboardChartsSection } from '../components/DashboardChartsSection';
import { DashboardCommitmentDateRequests } from '../components/DashboardCommitmentDateRequests';
import { DashboardActionStatusLegend } from '../components/DashboardActionStatusLegend';
import { DashboardFilters } from '../components/DashboardFilters';
import { DashboardKpiCards } from '../components/DashboardKpiCards';
import { DashboardOpenActionsSection } from '../components/DashboardOpenActionsSection';
import { DashboardOperationalQueues } from '../components/DashboardOperationalQueues';
import { dashboardHeadingClass } from '../components/dashboard-ui.classes';
import { useDashboardPage } from '../hooks/useDashboardPage';
import { emptyDashboardKpis } from '../interfaces';

export function DashboardPage() {
  const user = useAuthStore(state => state.user);
  const displayName = user?.name?.split(' ')[0] ?? 'Usuario';
  const dashboard = useDashboardPage();
  const kpis = dashboard.overview?.kpis ?? emptyDashboardKpis;
  const charts = dashboard.overview?.charts ?? {
    actionsTrend: [],
    complianceByArea: [],
    statusDistribution: [],
    upcomingDue: [],
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 md:mb-6 md:flex-row md:items-start md:justify-between md:gap-6">
        <h1
          className={cn(
            dashboardHeadingClass,
            'hidden shrink-0 !text-3xl max-md:!text-2xl md:block',
          )}
        >
          Hola, {displayName}
        </h1>
        <DashboardActionStatusLegend className="min-w-0 md:max-w-[min(100%,52rem)] md:flex-1" />
      </div>

      <DashboardFilters
        companyId={dashboard.filters.companyId}
        areaId={dashboard.filters.areaId}
        responsibleId={dashboard.filters.responsibleId}
        activity={dashboard.filters.activity}
        status={dashboard.filters.status}
        dateRange={{ from: dashboard.filters.dateFrom, to: dashboard.filters.dateTo }}
        companyOptions={dashboard.companyOptions}
        areaOptions={dashboard.areaOptions}
        responsibleOptions={dashboard.responsibleOptions}
        onCompanyChange={(value) => dashboard.updateFilter('companyId', value)}
        onAreaChange={(value) => dashboard.updateFilter('areaId', value)}
        onResponsibleChange={(value) => dashboard.updateFilter('responsibleId', value)}
        onActivityChange={(value) => dashboard.updateFilter('activity', value)}
        onStatusChange={(value) => dashboard.updateFilter('status', value)}
        onDateRangeChange={dashboard.updateDateRange}
        firstWalkthroughDate={dashboard.overview?.firstWalkthroughDate ?? null}
        onApplyFromFirstWalkthrough={() => {
          const firstDate = dashboard.overview?.firstWalkthroughDate;
          if (firstDate) {
            dashboard.applyDateRangeFromFirstWalkthrough(firstDate);
          }
        }}
      />

      <DashboardKpiCards
        kpis={kpis}
        filters={dashboard.filters}
        isLoading={dashboard.isOverviewLoading}
      />

      <section className='flex w-full flex-col gap-3 md:gap-4'>
        <DashboardAiSummary
          summary={dashboard.aiSummary}
          kpis={dashboard.overview?.kpis}
          isLoading={dashboard.isAiSummaryLoading}
          isError={dashboard.isAiSummaryError}
          onRetry={() => {
            void dashboard.refetchAiSummary();
          }}
        />
        <DashboardOpenActionsSection
          actions={dashboard.overview?.openActions ?? []}
          filters={dashboard.filters}
          isLoading={dashboard.isOverviewLoading}
        />
        <DashboardCommitmentDateRequests
          requests={dashboard.overview?.commitmentDateRequests ?? []}
          isLoading={dashboard.isOverviewLoading}
        />
        <DashboardChartsSection
          charts={charts}
          isLoading={dashboard.isOverviewLoading}
        />
      </section>

      <DashboardOperationalQueues
        queues={dashboard.overview?.operationalQueues}
        isLoading={dashboard.isOverviewLoading}
      />
      <DashboardAreaComplianceCards
        areas={dashboard.overview?.areaCompliance ?? []}
        avgClosureDays={kpis.avgClosureDays}
        isLoading={dashboard.isOverviewLoading}
      />
    </>
  );
}
