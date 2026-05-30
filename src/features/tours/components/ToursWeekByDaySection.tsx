import type { ToursWeekByDaySectionProps } from '../interfaces';
import { ToursDayGroupHeader } from './ToursDayGroupHeader';
import { ToursTableSection } from './ToursTableSection';

export function ToursWeekByDaySection({ groups }: ToursWeekByDaySectionProps) {
  const totalRows = groups.reduce((sum, group) => sum + group.rows.length, 0);

  if (groups.length === 0) {
    return null;
  }

  return (
    <>
      <div className="divide-y divide-slate-200/90">
        {groups.map((group) => (
          <section key={`${group.weekdayLabel}-${group.tourDate}`}>
            <ToursDayGroupHeader group={group} />
            <ToursTableSection rows={group.rows} showFooter={false} />
          </section>
        ))}
      </div>

      <div className="border-t border-slate-200/90 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500 md:px-6">
        Mostrando {totalRows} detecciones en {groups.length} días de la semana
      </div>
    </>
  );
}
