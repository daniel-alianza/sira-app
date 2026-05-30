import { cn } from '@/lib/utils';
import type { DashboardNavId, DashboardNavItem } from '../data/dashboard-nav.config';

interface DashboardMobileTabBarProps {
  activeNav: DashboardNavId;
  navItems: DashboardNavItem[];
  onNavigate: (id: DashboardNavId) => void;
}

export function DashboardMobileTabBar({
  activeNav,
  navItems,
  onNavigate,
}: DashboardMobileTabBarProps) {
  return (
    <nav
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-md md:hidden',
        'pb-[env(safe-area-inset-bottom)]',
        'shadow-[0_-4px_24px_rgba(10,34,64,0.08)]',
      )}
      aria-label="Navegación principal móvil"
    >
      <div className="flex h-16 items-stretch justify-around px-1">
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex min-h-[44px] min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1',
                'touch-manipulation transition-colors duration-200 active:scale-95',
                isActive ? 'text-[#0A2240]' : 'text-slate-400',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className={cn(
                  'flex size-9 items-center justify-center rounded-2xl transition-colors',
                  isActive ? 'bg-[#0A2240] text-white' : 'bg-transparent',
                )}
              >
                <Icon className="size-5" strokeWidth={isActive ? 2.25 : 2} />
              </span>
              <span className={cn('max-w-full truncate text-[10px] font-medium', isActive && 'font-semibold')}>
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
