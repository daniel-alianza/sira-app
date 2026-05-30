import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { DashboardOperationalQueues } from '../interfaces';
import { dashboardCard, dashboardHeadingClass, dashboardSubtextClass } from './dashboard-ui.classes';

function LegendBadge({ legend }: { legend: 'Pendiente' | 'Expirado' }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
        legend === 'Pendiente'
          ? 'bg-slate-100 text-slate-700'
          : 'bg-orange-100 text-orange-800',
      )}
    >
      {legend}
    </span>
  );
}

function QueueItem({
  children,
  variant = 'default',
}: {
  children: ReactNode;
  variant?: 'default' | 'danger';
}) {
  return (
    <div
      className={cn(
        'cursor-pointer rounded-lg border p-3 transition-colors duration-200',
        'hover:bg-slate-50',
        variant === 'danger'
          ? 'border-orange-200 bg-orange-50/50 hover:bg-orange-50'
          : 'border-slate-100 bg-slate-50/50',
      )}
    >
      {children}
    </div>
  );
}

function EmptyQueueMessage({ message }: { message: string }) {
  return (
    <p className={cn(dashboardSubtextClass, 'py-4 text-center text-sm')}>
      {message}
    </p>
  );
}

export interface DashboardOperationalQueuesProps {
  readonly queues: DashboardOperationalQueues;
  readonly isLoading: boolean;
}

export function DashboardOperationalQueues({
  queues,
  isLoading,
}: DashboardOperationalQueuesProps) {
  return (
    <section className="w-full space-y-4">
      <div>
        <h2 className={cn(dashboardHeadingClass, 'text-lg')}>Colas operativas</h2>
        <p className={cn(dashboardSubtextClass, 'mt-1')}>
          Acciones que requieren atención inmediata del administrador o responsables
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        <div className={dashboardCard()}>
          <div className="border-b border-slate-100 px-4 py-3">
            <h3 className={cn(dashboardHeadingClass, 'text-sm')}>Pendientes de firma de enterado</h3>
          </div>
          <div className="space-y-3 p-4">
            {isLoading ? (
              <EmptyQueueMessage message="Cargando..." />
            ) : queues.pendingSignature.length === 0 ? (
              <EmptyQueueMessage message="Sin pendientes de firma" />
            ) : (
              queues.pendingSignature.map((item) => (
                <QueueItem key={item.id}>
                  <p className="font-mono text-xs font-medium text-[#00a896]">{item.actionFolio}</p>
                  <p className="mt-1 text-sm font-medium text-[#0A2240]">{item.responsible}</p>
                  <p className={dashboardSubtextClass}>
                    {item.area} · Compromiso: {item.commitmentDate}
                  </p>
                </QueueItem>
              ))
            )}
          </div>
        </div>

        <div className={dashboardCard()}>
          <div className="border-b border-slate-100 px-4 py-3">
            <h3 className={cn(dashboardHeadingClass, 'text-sm')}>En revisión de cierre</h3>
          </div>
          <div className="space-y-3 p-4">
            {isLoading ? (
              <EmptyQueueMessage message="Cargando..." />
            ) : queues.closureReview.length === 0 ? (
              <EmptyQueueMessage message="Sin revisiones de cierre" />
            ) : (
              queues.closureReview.map((item) => (
                <QueueItem key={item.id}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-xs font-medium text-[#00a896]">{item.actionFolio}</p>
                    <LegendBadge legend={item.legend} />
                  </div>
                  <p className="mt-1 text-sm font-medium text-[#0A2240]">{item.responsible}</p>
                  <p className={dashboardSubtextClass}>
                    {item.area} · Solicitud: {item.requestedAt}
                  </p>
                </QueueItem>
              ))
            )}
          </div>
        </div>

        <div className={dashboardCard()}>
          <div className="border-b border-orange-100 bg-orange-50/50 px-4 py-3">
            <h3 className="text-sm font-semibold text-orange-800">Expiradas sin cerrar</h3>
          </div>
          <div className="space-y-3 p-4">
            {isLoading ? (
              <EmptyQueueMessage message="Cargando..." />
            ) : queues.expiredActions.length === 0 ? (
              <EmptyQueueMessage message="Sin acciones expiradas" />
            ) : (
              queues.expiredActions.map((item) => (
                <QueueItem key={item.id} variant="danger">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-xs font-medium text-orange-700">{item.actionFolio}</p>
                    <LegendBadge legend="Expirado" />
                  </div>
                  <p className="mt-1 text-sm font-medium text-[#0A2240]">{item.responsible}</p>
                  <p className={dashboardSubtextClass}>
                    {item.area} · Venció: {item.commitmentDate} ({item.daysOverdue} días)
                  </p>
                </QueueItem>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
