import { Building2, MapPin, Pencil, Power, PowerOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoleBadge } from './RoleBadge';
import { StatusBadge } from './StatusBadge';
import { UserAvatar } from './UserAvatar';
import type { UsersTableRowProps } from '../interfaces';

export function UsersTableRow({ user, onEdit, onToggleActive }: UsersTableRowProps) {
  return (
    <li className="group px-4 py-4 transition-colors duration-200 hover:bg-slate-50/80 lg:grid lg:grid-cols-[minmax(200px,2fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_100px_88px] lg:items-center lg:gap-4 lg:px-6 lg:py-3.5">
      <div className="flex items-start justify-between gap-3 lg:contents">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <UserAvatar name={user.name} isActive={user.isActive} />
          <div className="min-w-0">
            <p className="truncate font-medium text-[#0A2240]">{user.name}</p>
            <p className="truncate text-sm text-slate-500">{user.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 lg:hidden">
              {user.role?.name && <RoleBadge roleName={user.role.name} />}
              <StatusBadge isActive={user.isActive} />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(user)}
            aria-label="Editar usuario"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onToggleActive(user)}
            aria-label={user.isActive ? 'Desactivar usuario' : 'Activar usuario'}
          >
            {user.isActive ? <PowerOff className="size-4" /> : <Power className="size-4" />}
          </Button>
        </div>
      </div>

      <div className="mt-3 hidden lg:block">
        {user.role?.name ? (
          <RoleBadge roleName={user.role.name} />
        ) : (
          <span className="text-sm text-slate-400">—</span>
        )}
      </div>

      <p className="mt-2 hidden truncate text-sm text-slate-600 lg:mt-0 lg:block">
        {user.area?.name ?? '—'}
      </p>

      <div className="mt-2 hidden space-y-0.5 lg:mt-0 lg:block">
        <p className="flex items-center gap-1 truncate text-sm text-slate-600">
          <MapPin className="size-3 shrink-0 text-slate-400" />
          {user.branch?.name ?? '—'}
        </p>
        <p className="flex items-center gap-1 truncate text-xs text-slate-500">
          <Building2 className="size-3 shrink-0 text-slate-400" />
          {user.company?.name ?? '—'}
        </p>
      </div>

      <div className="mt-3 hidden justify-center lg:mt-0 lg:flex">
        <StatusBadge isActive={user.isActive} />
      </div>

      <div className="mt-3 hidden items-center justify-center gap-0.5 lg:mt-0 lg:flex lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onEdit(user)}
          aria-label="Editar usuario"
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onToggleActive(user)}
          aria-label={user.isActive ? 'Desactivar usuario' : 'Activar usuario'}
        >
          {user.isActive ? <PowerOff className="size-4" /> : <Power className="size-4" />}
        </Button>
      </div>

      <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-sm text-slate-600 lg:hidden">
        {user.role?.name && (
          <p className="flex items-center gap-1.5">
            <Shield className="size-3.5 shrink-0 text-slate-400" />
            {user.role.name}
          </p>
        )}
        <p className="flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0 text-slate-400" />
          {user.branch?.name ?? '—'} · {user.company?.name ?? '—'}
        </p>
        <p>{user.area?.name ?? '—'}</p>
      </div>
    </li>
  );
}
