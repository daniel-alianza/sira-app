import { useNavigate } from 'react-router';
import { DetectionListRow } from '@/components/DetectionListRow';
import { ACTION_STATUS_CONFIG } from '../interfaces';
import type { ToursTableSectionProps } from '../interfaces';

export function ToursTableSection({ rows, showFooter = true }: ToursTableSectionProps) {
  const navigate = useNavigate();

  if (rows.length === 0) {
    return null;
  }

  return (
    <>
      <div className="divide-y divide-slate-100">
        {rows.map((row) => {
          const status = ACTION_STATUS_CONFIG[row.status];

          return (
            <DetectionListRow
              key={row.id}
              detectionFolio={row.detectionFolio}
              walkthroughFolio={row.walkthroughFolio}
              description={row.description}
              companyName={row.companyName}
              branchName={row.branchName}
              areaName={row.areaName}
              evidencePhotoUrl={row.evidencePhotoUrl}
              resolutionPhotoUrl={row.resolutionPhotoUrl}
              detectionType={row.detectionType}
              status={status}
              footerLine={`Recorrido: ${row.tourDate} · ${row.responsible}`}
              onViewDetail={() => navigate(`/actions/${row.id}`)}
            />
          );
        })}
      </div>

      {showFooter && (
        <div className="border-t border-slate-200/90 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500 md:px-6">
          Mostrando {rows.length} detecciones
        </div>
      )}
    </>
  );
}
