import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  dashboardButtonPrimary,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import type { UsersPageHeaderProps } from '../interfaces';

export function UsersPageHeader({
  canManageUsers,
  canEditInspectorUsers,
  onCreateClick,
}: UsersPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className={cn(dashboardHeadingClass, 'text-2xl md:text-3xl')}>Usuarios</h1>
        <p className={cn(dashboardSubtextClass, 'mt-1')}>
          {canManageUsers
            ? 'Gestiona cuentas, roles y acceso al sistema'
            : canEditInspectorUsers
              ? 'Consulta usuarios y edita la información de inspectores'
              : 'Consulta cuentas, roles y ubicación de los responsables'}
        </p>
      </div>
      {canManageUsers && onCreateClick && (
        <button type="button" onClick={onCreateClick} className={dashboardButtonPrimary()}>
          <Plus className="size-4" />
          Nuevo usuario
        </button>
      )}
    </div>
  );
}
