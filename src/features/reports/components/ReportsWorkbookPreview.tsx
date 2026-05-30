import { cn } from '@/lib/utils';
import { dashboardCard, dashboardSubtextClass } from '@/features/dashboard/components/dashboard-ui.classes';
import type { ReportsWorkbookPreviewProps } from '../interfaces';

export function ReportsWorkbookPreview({ sheets }: ReportsWorkbookPreviewProps) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-[#0A2240]">Contenido del libro</h2>
        <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
          Sin imágenes: se exportan indicadores Sí/No (firma, evidencias, cierre, plazo)
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {sheets.map((sheet, index) => {
          const Icon = sheet.icon;
          return (
            <li
              key={sheet.id}
              className={cn(dashboardCard(), 'flex gap-3 p-4 md:p-5')}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0A2240]/8 text-[#0A2240]">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500">
                  Hoja {index + 1}
                </p>
                <h3 className="text-sm font-semibold text-[#0A2240]">{sheet.name}</h3>
                <p className={cn(dashboardSubtextClass, 'mt-1 text-xs leading-relaxed')}>
                  {sheet.description}
                </p>
                <ul className="mt-2.5 space-y-1">
                  {sheet.highlights.map((item) => (
                    <li
                      key={item}
                      className="text-xs text-slate-600 before:mr-1.5 before:text-[#00a896] before:content-['•']"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
