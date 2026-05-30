import { Bell } from 'lucide-react';
import grupoFgLogo from '@/assets/grupo-fg-logo.png';
import { UserProfileMenu } from '@/features/auth/components/UserProfileMenu';
import { cn } from '@/lib/utils';
import { dashboardButtonSecondary } from './dashboard-ui.classes';

interface DashboardMobileHeaderProps {
  displayName: string;
  profileInitials: string;
  hasUser: boolean;
  userName?: string;
  userEmail?: string;
}

export function DashboardMobileHeader({
  displayName,
  profileInitials,
  hasUser,
  userName,
  userEmail,
}: DashboardMobileHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md',
        'pt-[env(safe-area-inset-top)] md:hidden',
      )}
    >
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        <a href="/" className="flex min-w-0 shrink-0 items-center" aria-label="Grupo FG - SIRA">
          <img src={grupoFgLogo} alt="Grupo FG" className="h-8 w-auto object-contain" />
        </a>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-semibold text-[#0A2240]">SIRA</p>
          <p className="truncate text-[10px] text-slate-500">Hola, {displayName}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            className={cn(dashboardButtonSecondary(), 'relative size-10 justify-center p-0')}
            aria-label="Notificaciones"
          >
            <Bell className="size-4.5" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-[#FF4D00] ring-2 ring-white" />
          </button>
          <UserProfileMenu
            profileInitials={profileInitials}
            userName={userName}
            userEmail={userEmail}
            hasUser={hasUser}
            triggerClassName={cn(dashboardButtonSecondary(), 'size-10 justify-center p-0')}
            initialsClassName="text-[10px]"
          />
        </div>
      </div>
    </header>
  );
}
