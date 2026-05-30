import { ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';

export function ActionsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-[#0A2240]/5">
        <ClipboardList className="size-8 text-[#0A2240]/60" />
      </div>
      <h3 className={cn(dashboardHeadingClass, 'mt-4 text-base')}>
        Sin acciones en este filtro
      </h3>
      <p className={cn(dashboardSubtextClass, 'mt-1 max-w-sm')}>
        Prueba otro estatus o espera nuevas asignaciones desde un recorrido.
      </p>
    </div>
  );
}
