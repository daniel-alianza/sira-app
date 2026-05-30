import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import type { UsersEmptyStateProps } from '../interfaces';

export function UsersEmptyState({ hasSearch }: UsersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-[#0A2240]/5">
        <Users className="size-8 text-[#0A2240]/60" />
      </div>
      <h3 className={cn(dashboardHeadingClass, 'mt-4 text-base')}>
        {hasSearch ? 'Sin resultados' : 'No hay usuarios'}
      </h3>
      <p className={cn(dashboardSubtextClass, 'mt-1 max-w-xs')}>
        {hasSearch
          ? 'Prueba con otro término de búsqueda o limpia los filtros.'
          : 'Crea el primer usuario para empezar a gestionar el acceso al sistema.'}
      </p>
    </div>
  );
}
