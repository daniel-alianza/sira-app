import type { ActionsTableProps } from '../interfaces';
import { ActionsEmptyState } from './ActionsEmptyState';
import { ActionsWeekByDaySection } from './ActionsWeekByDaySection';

export function ActionsTable({
  actions,
  onViewDetail,
  showNotifyActions = false,
  notifyingActionId = null,
  onNotifyAction,
  showDirectCloseActions = false,
  onDirectCloseAction,
}: ActionsTableProps) {
  if (actions.length === 0) {
    return <ActionsEmptyState />;
  }

  return (
    <ActionsWeekByDaySection
      actions={actions}
      onViewDetail={onViewDetail}
      showNotifyActions={showNotifyActions}
      notifyingActionId={notifyingActionId}
      onNotifyAction={onNotifyAction}
      showDirectCloseActions={showDirectCloseActions}
      onDirectCloseAction={onDirectCloseAction}
    />
  );
}
