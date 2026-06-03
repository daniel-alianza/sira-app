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
import { cn } from '@/lib/utils';
import type { DashboardKpis } from '../interfaces';
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

function buildKpiItems(kpis: DashboardKpis) {
  return [
    { id: 'total', label: 'Acciones creadas', value: kpis.totalActions, icon: ClipboardList, tone: 'default' as const },
    { id: 'open', label: 'Abiertas', value: kpis.openActions, icon: FolderOpen, tone: 'default' as const },
    { id: 'closed', label: 'Cerradas', value: kpis.closedActions, icon: CheckCircle2, tone: 'success' as const },
    { id: 'pending-accept', label: 'Pend. de aceptación', value: kpis.pendingAcceptance, icon: UserX, tone: 'warning' as const },
    { id: 'expired', label: 'Expiradas', value: kpis.expiredActions, icon: AlertTriangle, tone: 'danger' as const },
    { id: 'closure-review', label: 'En rev. de cierre', value: kpis.closureReview, icon: FileSearch, tone: 'default' as const },
    { id: 'rejected', label: 'Rechazadas', value: kpis.rejectedClosures, icon: Clock, tone: 'danger' as const },
    { id: 'walkthroughs', label: 'Recorridos (periodo)', value: kpis.walkthroughsPeriod, icon: Route, tone: 'default' as const },
    { id: 'not-responded', label: 'No han contestado', value: kpis.notRespondedUsers, icon: MessageCircleOff, tone: 'warning' as const },
    { id: 'not-signed', label: 'No han firmado', value: kpis.notSignedUsers, icon: PenOff, tone: 'warning' as const },
  ];
}

export interface DashboardKpiCardsProps {
  readonly kpis: DashboardKpis;
  readonly isLoading: boolean;
}

export function DashboardKpiCards({ kpis, isLoading }: DashboardKpiCardsProps) {
  const items = buildKpiItems(kpis);

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
      {items.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <button
            key={kpi.id}
            type="button"
            className={cn(dashboardCardInteractive(), 'group w-full text-left')}
            disabled={isLoading}
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
