import { useMemo } from 'react';
import type { ActionsTableProps } from '../interfaces';
import { groupActionsByWeekday } from '../utils/group-actions-by-weekday';
import { ActionsDayGroupHeader } from './ActionsDayGroupHeader';
import { ActionsTableRows } from './ActionsTableRows';

export interface ActionsWeekByDaySectionProps
  extends Omit<ActionsTableProps, 'actions'> {
  readonly actions: ActionsTableProps['actions'];
}

export function ActionsWeekByDaySection({
  actions,
  ...rowProps
}: ActionsWeekByDaySectionProps) {
  const dayGroups = useMemo(() => groupActionsByWeekday(actions), [actions]);
  const totalActions = actions.length;

  if (dayGroups.length === 0) {
    return null;
  }

  return (
    <>
      <div className="divide-y divide-slate-200/90">
        {dayGroups.map((group) => (
          <section key={`${group.weekdayLabel}-${group.tourDate}`}>
            <ActionsDayGroupHeader group={group} />
            <ActionsTableRows actions={group.actions} {...rowProps} />
          </section>
        ))}
      </div>

      <div className="border-t border-slate-200/90 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500 md:px-6">
        Mostrando {totalActions} {totalActions === 1 ? 'acción' : 'acciones'} en{' '}
        {dayGroups.length} {dayGroups.length === 1 ? 'día' : 'días'}
      </div>
    </>
  );
}
