import { cn } from '@/lib/utils';
import { UsersEmptyState } from './UsersEmptyState';
import { UsersTableRow } from './UsersTableRow';
import type { UsersTableProps } from '../interfaces';

export function UsersTable({
  users,
  totalCount,
  hasActiveFilters,
  canManageUsers,
  canEditUser,
  canToggleUserActive,
  onEdit,
  onToggleActive,
}: UsersTableProps) {
  const showActionsColumn =
    canManageUsers ||
    canToggleUserActive ||
    users.some((user) => canEditUser(user));

  if (users.length === 0) {
    return <UsersEmptyState hasSearch={hasActiveFilters} />;
  }

  return (
    <>
      <div
        className={cn(
          'hidden border-b border-slate-200/90 bg-slate-50/80 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-slate-500 lg:grid lg:gap-4 lg:px-6',
          showActionsColumn
            ? 'lg:grid-cols-[minmax(200px,2fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_100px_120px]'
            : 'lg:grid-cols-[minmax(200px,2fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_100px]',
        )}
      >
        <span>Usuario</span>
        <span>Rol</span>
        <span>Área</span>
        <span>Ubicación</span>
        <span className="text-center">Estado</span>
        {showActionsColumn && <span className="text-center">Acciones</span>}
      </div>

      <ul className="divide-y divide-slate-200/90">
        {users.map((user) => (
          <UsersTableRow
            key={user.id}
            user={user}
            canEdit={canEditUser(user)}
            canToggleActive={canToggleUserActive}
            onEdit={onEdit}
            onToggleActive={onToggleActive}
          />
        ))}
      </ul>

      <div className="border-t border-slate-200/90 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500 lg:px-6">
        Mostrando {users.length} de {totalCount} usuarios
      </div>
    </>
  );
}
