import { ACTION_STATUS_CONFIG } from '@/features/tours/interfaces';
import { DetectionListRow } from '@/components/DetectionListRow';
import type { ActionsTableProps } from '../interfaces';
import { ActionsEmptyState } from './ActionsEmptyState';

function formatCommitmentFooter(
  currentCommitmentDate: string | null,
  commitmentSequence: number | null,
): string {
  if (!currentCommitmentDate) {
    return 'Sin fecha de compromiso';
  }

  const sequenceLabel =
    commitmentSequence !== null ? ` · F${commitmentSequence}` : '';

  return `Compromiso: ${currentCommitmentDate}${sequenceLabel}`;
}

export function ActionsTable({ actions, onViewDetail }: ActionsTableProps) {
  if (actions.length === 0) {
    return <ActionsEmptyState />;
  }

  return (
    <>
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
              footerLine={formatCommitmentFooter(
                action.currentCommitmentDate,
                action.commitmentSequence,
              )}
              onViewDetail={() => onViewDetail(action)}
            />
          );
        })}
      </div>

      <div className="border-t border-slate-200/90 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500 md:px-6">
        Mostrando {actions.length} acciones
      </div>
    </>
  );
}
