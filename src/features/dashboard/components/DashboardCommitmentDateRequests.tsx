import { CalendarClock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { DetectionListRow } from '@/components/DetectionListRow';
import { cn } from '@/lib/utils';
import type { DashboardCommitmentDateRequestItem } from '../interfaces';
import { dashboardCard, dashboardHeadingClass, dashboardSubtextClass } from './dashboard-ui.classes';

const statusLabels = {
  pending: { label: 'Pendiente de revisión', className: 'bg-orange-100 text-orange-800' },
  review: { label: 'En revisión admin', className: 'bg-slate-100 text-slate-800' },
};

function buildCommitmentFooterLine(request: DashboardCommitmentDateRequestItem): string {
  return `F0: ${request.initialDate} · F vigente: ${request.currentDate} · Nueva (${request.changeLabel}): ${request.requestedDate} · ${request.reason}`;
}

export interface DashboardCommitmentDateRequestsProps {
  readonly requests: readonly DashboardCommitmentDateRequestItem[];
  readonly isLoading: boolean;
}

export function DashboardCommitmentDateRequests({
  requests,
  isLoading,
}: DashboardCommitmentDateRequestsProps) {
  const navigate = useNavigate();

  function handleViewDetail(actionId: string) {
    navigate(`/actions/${actionId}`);
  }

  return (
    <div className={cn(dashboardCard(), 'overflow-hidden p-0')}>
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3.5 md:px-6 md:py-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0A2240] text-[#00C4B3]">
            <CalendarClock className="size-5" />
          </div>
          <div className="min-w-0">
            <h2 className={cn(dashboardHeadingClass, 'text-sm md:text-base')}>
              Cambios de fecha compromiso (F1, F2, F3)
            </h2>
            <p className={cn(dashboardSubtextClass, 'text-xs')}>
              F0 inicial conservada · motivo obligatorio en cada cambio
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 px-6 py-10 text-sm text-slate-500">
          <Loader2 className="size-5 animate-spin" />
          Cargando cambios de fecha…
        </div>
      ) : requests.length === 0 ? (
        <p className={cn(dashboardSubtextClass, 'px-6 py-10 text-center text-sm')}>
          Sin cambios de fecha en el periodo
        </p>
      ) : (
        <>
          <div className="divide-y divide-slate-100">
            {requests.map((request) => {
              const status = statusLabels[request.status];

              return (
                <DetectionListRow
                  key={request.id}
                  detectionFolio={request.actionFolio}
                  walkthroughFolio={request.walkthroughFolio}
                  description={request.description}
                  companyName={request.companyName}
                  branchName={request.branchName}
                  areaName={request.area}
                  evidencePhotoUrl={request.evidencePhotoUrl}
                  resolutionPhotoUrl={request.resolutionPhotoUrl}
                  status={status}
                  metaLine={`${request.companyName} · ${request.branchName} · ${request.area} · ${request.responsible}`}
                  footerLine={buildCommitmentFooterLine(request)}
                  onViewDetail={() => handleViewDetail(request.actionId)}
                />
              );
            })}
          </div>

          <div className="border-t border-slate-200/90 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500 md:px-6">
            Mostrando {requests.length} cambios de fecha
          </div>
        </>
      )}
    </div>
  );
}
