import { MoreHorizontal, Pencil, Power, PowerOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { User } from '../interfaces';

interface UsersRowActionsMenuProps {
  readonly user: User;
  readonly canEdit: boolean;
  readonly canToggleActive: boolean;
  readonly onEdit: (user: User) => void;
  readonly onToggleActive: (user: User) => void;
}

interface ActionMenuItemProps {
  readonly icon: typeof Pencil;
  readonly label: string;
  readonly onClick: () => void;
  readonly tone?: 'default' | 'danger';
}

function ActionMenuItem({
  icon: Icon,
  label,
  onClick,
  tone = 'default',
}: ActionMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
        tone === 'danger'
          ? 'text-red-700 hover:bg-red-50'
          : 'text-[#0A2240] hover:bg-slate-100',
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </button>
  );
}

export function UsersRowActionsMenu({
  user,
  canEdit,
  canToggleActive,
  onEdit,
  onToggleActive,
}: UsersRowActionsMenuProps) {
  if (!canEdit && !canToggleActive) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-xs"
            aria-label={`Acciones para ${user.name}`}
          />
        }
      >
        <MoreHorizontal className="size-4" />
        Acciones
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-1.5">
        {canEdit && (
          <ActionMenuItem
            icon={Pencil}
            label="Editar información"
            onClick={() => onEdit(user)}
          />
        )}
        {canToggleActive && (
          <ActionMenuItem
            icon={user.isActive ? PowerOff : Power}
            label={user.isActive ? 'Desactivar usuario' : 'Activar usuario'}
            onClick={() => onToggleActive(user)}
            tone={user.isActive ? 'danger' : 'default'}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
