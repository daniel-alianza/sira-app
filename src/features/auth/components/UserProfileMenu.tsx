import { useEffect, useRef, useState } from 'react';
import { Loader2, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLogout } from '../hooks/useLogout';

interface UserProfileMenuProps {
  profileInitials: string;
  userName?: string;
  userEmail?: string;
  hasUser: boolean;
  triggerClassName?: string;
  initialsClassName?: string;
}

export function UserProfileMenu({
  profileInitials,
  userName,
  userEmail,
  hasUser,
  triggerClassName,
  initialsClassName,
}: UserProfileMenuProps) {
  const { logout, isLoggingOut } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function handleToggle() {
    setIsOpen((prev) => !prev);
  }

  async function handleLogout() {
    setIsOpen(false);
    await logout();
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Menú de perfil"
        className={triggerClassName}
      >
        {hasUser ? (
          <span className={cn('font-bold !text-black', initialsClassName)}>{profileInitials}</span>
        ) : (
          <User className="size-4.5 text-black" />
        )}
      </button>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            'absolute right-0 z-50 mt-2 min-w-[220px] overflow-hidden rounded-xl',
            'border border-slate-200 bg-white shadow-[0_8px_30px_rgba(10,34,64,0.12)]',
            'animate-in fade-in zoom-in-95 duration-200',
          )}
        >
          {hasUser && (
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="truncate text-sm font-semibold !text-black">{userName ?? 'Usuario'}</p>
              {userEmail && (
                <p className="mt-0.5 truncate text-xs text-slate-600">{userEmail}</p>
              )}
            </div>
          )}

          <button
            type="button"
            role="menuitem"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className={cn(
              'flex w-full cursor-pointer items-center gap-2.5 px-4 py-3 text-left text-sm font-medium',
              'text-[#0A2240] transition-colors hover:bg-slate-50 active:bg-slate-100',
              'disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            {isLoggingOut ? (
              <Loader2 className="size-4 shrink-0 animate-spin" />
            ) : (
              <LogOut className="size-4 shrink-0" />
            )}
            <span className="!text-black">{isLoggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
