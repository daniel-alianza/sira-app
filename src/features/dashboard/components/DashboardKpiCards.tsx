import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileSearch,
  FolderOpen,
  MessageCircleOff,
  PenOff,
  Route,
  UserX,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import type { DashboardFiltersState, DashboardKpis } from '../interfaces';
import {
  buildDashboardKpiSearchParams,
  getDashboardKpiNavigationPath,
  type DashboardKpiNavigationId,
} from '../data/dashboard-kpi-navigation.config';
import {
  dashboardCardInteractive,
  dashboardSubtextClass,
  iconHoverClass,
} from './dashboard-ui.classes';

const toneStyles = {
  default: 'bg-slate-100 text-[#0A2240]',
  success: 'bg-[#00C4B3]/15 text-[#007a70]',
  warning: 'bg-amber-50 text-amber-800',
  danger: 'bg-orange-50 text-orange-700',
};

interface DashboardKpiItem {
  readonly id: DashboardKpiNavigationId;
  readonly label: string;
  readonly value: number;
  readonly icon: typeof ClipboardList;
  readonly tone: keyof typeof toneStyles;
}

function buildKpiItems(kpis: DashboardKpis): DashboardKpiItem[] {
  return [
    { id: 'total', label: 'Acciones creadas', value: kpis.totalActions, icon: ClipboardList, tone: 'default' },
    { id: 'open', label: 'Abiertas', value: kpis.openActions, icon: FolderOpen, tone: 'default' },
    { id: 'closed', label: 'Cerradas', value: kpis.closedActions, icon: CheckCircle2, tone: 'success' },
    { id: 'pending-accept', label: 'Pend. de aceptación', value: kpis.pendingAcceptance, icon: UserX, tone: 'warning' },
    { id: 'expired', label: 'Expiradas', value: kpis.expiredActions, icon: AlertTriangle, tone: 'danger' },
    { id: 'closure-review', label: 'En rev. de cierre', value: kpis.closureReview, icon: FileSearch, tone: 'default' },
    { id: 'rejected', label: 'Rechazadas', value: kpis.rejectedClosures, icon: Clock, tone: 'danger' },
    { id: 'walkthroughs', label: 'Recorridos (periodo)', value: kpis.walkthroughsPeriod, icon: Route, tone: 'default' },
    { id: 'not-responded', label: 'No han contestado', value: kpis.notRespondedUsers, icon: MessageCircleOff, tone: 'warning' },
    { id: 'not-signed', label: 'No han firmado', value: kpis.notSignedUsers, icon: PenOff, tone: 'warning' },
  ];
}

export interface DashboardKpiCardsProps {
  readonly kpis: DashboardKpis;
  readonly filters: DashboardFiltersState;
  readonly isLoading: boolean;
}

export function DashboardKpiCards({ kpis, filters, isLoading }: DashboardKpiCardsProps) {
  const navigate = useNavigate();
  const items = buildKpiItems(kpis);

  function handleKpiClick(kpiId: DashboardKpiNavigationId, value: number) {
    if (isLoading || value === 0) {
      return;
    }

    const pathname = getDashboardKpiNavigationPath(kpiId);
    const search = buildDashboardKpiSearchParams(kpiId, filters);
    navigate({ pathname, search });
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
      {items.map((kpi) => {
        const Icon = kpi.icon;
        const isDisabled = isLoading || kpi.value === 0;

        return (
          <button
            key={kpi.id}
            type="button"
            onClick={() => handleKpiClick(kpi.id, kpi.value)}
            className={cn(
              dashboardCardInteractive(),
              'group w-full text-left',
              isDisabled && 'cursor-not-allowed opacity-60 hover:translate-y-0 hover:shadow-none',
            )}
            disabled={isDisabled}
          >
            <div className="space-y-2 p-3 sm:space-y-3 sm:p-4">
              <div className={cn('flex size-8 items-center justify-center rounded-lg sm:size-9', toneStyles[kpi.tone])}>
                <Icon className={cn('size-3.5 sm:size-4', iconHoverClass)} />
              </div>
              <div>
                <p className="text-xl font-semibold tabular-nums text-[#0A2240] sm:text-2xl">
                  {isLoading ? '—' : kpi.value}
                </p>
                <p className={cn(dashboardSubtextClass, 'mt-0.5 text-[11px] leading-snug sm:text-sm')}>
                  {kpi.label}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
