import { Bell, Settings } from 'lucide-react';
import grupoFgLogo from '@/assets/grupo-fg-logo.png';
import { UserProfileMenu } from '@/features/auth/components/UserProfileMenu';
import { cn } from '@/lib/utils';
import type { DashboardNavId, DashboardNavItem } from '../data/dashboard-nav.config';
import { dashboardButtonSecondary, dashboardNavShell } from './dashboard-ui.classes';

interface DashboardDesktopHeaderProps {
  activeNav: DashboardNavId;
  navItems: DashboardNavItem[];
  onNavigate: (id: DashboardNavId) => void;
  profileInitials: string;
  hasUser: boolean;
  userName?: string;
  userEmail?: string;
}

export function DashboardDesktopHeader({
  activeNav,
  navItems,
  onNavigate,
  profileInitials,
  hasUser,
  userName,
  userEmail,
}: DashboardDesktopHeaderProps) {
  return (
    <header className="hidden flex-col gap-4 py-6 md:flex md:py-8 lg:flex-row lg:items-center lg:justify-between">
      <a
        href="/"
        className="flex shrink-0 items-center rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition-shadow duration-200 hover:shadow-md"
        aria-label="Grupo FG - SIRA"
      >
        <img src={grupoFgLogo} alt="Grupo FG" className="h-9 w-auto object-contain lg:h-10" />
      </a>

      <nav
        className={cn(
          dashboardNavShell(),
          'flex max-w-full flex-1 flex-wrap items-center justify-center gap-0.5 p-1.5 lg:mx-4',
        )}
        aria-label="Navegación principal"
      >
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                'cursor-pointer rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 lg:px-4',
                isActive
                  ? 'bg-[#0A2240] text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#0A2240]',
              )}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="flex shrink-0 items-center justify-end gap-2">
        <button type="button" className={cn(dashboardButtonSecondary(), 'h-11 px-4')}>
          <Settings className="size-4 shrink-0" />
          <span className="hidden lg:inline">Ajustes</span>
        </button>
        <button
          type="button"
          className={cn(dashboardButtonSecondary(), 'relative size-11 justify-center p-0')}
          aria-label="Notificaciones"
        >
          <Bell className="size-4.5" />
          <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-[#FF4D00] ring-2 ring-white" />
        </button>
        <UserProfileMenu
          profileInitials={profileInitials}
          userName={userName}
          userEmail={userEmail}
          hasUser={hasUser}
          triggerClassName={cn(dashboardButtonSecondary(), 'size-11 justify-center p-0')}
          initialsClassName="text-xs font-semibold"
        />
      </div>
    </header>
  );
}
