import { ACTION_STATUS_CONFIG } from '@/features/tours/interfaces';
import { DetectionListRow } from '@/components/DetectionListRow';
import type { ActionsTableProps } from '../interfaces';

export interface ActionsTableRowsProps
  extends Pick<
    ActionsTableProps,
    | 'onViewDetail'
    | 'showNotifyActions'
    | 'notifyingActionId'
    | 'onNotifyAction'
    | 'showDirectCloseActions'
    | 'onDirectCloseAction'
  > {
  readonly actions: ActionsTableProps['actions'];
}

export function ActionsTableRows({
  actions,
  onViewDetail,
  showNotifyActions = false,
  notifyingActionId = null,
  onNotifyAction,
  showDirectCloseActions = false,
  onDirectCloseAction,
}: ActionsTableRowsProps) {
  return (
    <div className="divide-y divide-slate-100">
      {actions.map((action) => {
        const status = ACTION_STATUS_CONFIG[action.status];

        return (
          <DetectionListRow
            key={action.id}
            detectionFolio={action.detectionFolio}
            walkthroughFolio={action.walkthroughFolio}
            description={action.description}
            companyName={action.companyName}
            branchName={action.branchName}
            areaName={action.areaName}
            evidencePhotoUrl={action.evidencePhotoUrl}
            resolutionPhotoUrl={action.resolutionPhotoUrl}
            detectionType={action.detectionType}
            status={status}
            footerLine={`Recorrido: ${action.tourDate} · ${action.responsibleName}`}
            onViewDetail={() => onViewDetail(action)}
            onNotifyUser={
              showNotifyActions && onNotifyAction
                ? () => onNotifyAction(action)
                : undefined
            }
            isNotifying={
              notifyingActionId === action.id || notifyingActionId === 'bulk'
            }
            onDirectClose={
              showDirectCloseActions &&
              onDirectCloseAction &&
              action.status !== 'closed'
                ? () => onDirectCloseAction(action)
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
