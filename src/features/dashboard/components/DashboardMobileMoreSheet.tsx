import { useEffect, useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardMoreMenuId, DashboardMoreMenuItem } from '../data/dashboard-nav.config';
import { dashboardHeadingClass, dashboardSubtextClass } from './dashboard-ui.classes';

const SHEET_EXIT_MS = 380;

interface DashboardMobileMoreSheetProps {
  open: boolean;
  menuItems: DashboardMoreMenuItem[];
  onClose: () => void;
  onSelect: (id: DashboardMoreMenuId) => void;
}

export function DashboardMobileMoreSheet({
  open,
  menuItems,
  onClose,
  onSelect,
}: DashboardMobileMoreSheetProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      const frameId = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
      return () => cancelAnimationFrame(frameId);
    }

    setIsVisible(false);
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!isVisible && isMounted) {
      const timerId = window.setTimeout(() => setIsMounted(false), SHEET_EXIT_MS);
      return () => window.clearTimeout(timerId);
    }
    return undefined;
  }, [isVisible, isMounted]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMounted, onClose]);

  if (!isMounted) {
    return null;
  }

  const animationState = isVisible ? 'enter' : 'exit';

  return (
    <div className="fixed inset-0 z-[60] md:hidden" role="presentation">
      <button
        type="button"
        className={cn(
          'absolute inset-0 cursor-pointer bg-[#0A2240]/45 backdrop-blur-sm',
          animationState === 'enter'
            ? 'dashboard-sheet-backdrop-enter'
            : 'dashboard-sheet-backdrop-exit',
        )}
        aria-label="Cerrar menú"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-more-sheet-title"
        className={cn(
          'absolute inset-x-0 bottom-0 will-change-transform',
          'rounded-t-3xl border-t border-slate-200 bg-white text-[#0A2240]',
          'pb-[calc(1rem+env(safe-area-inset-bottom))]',
          'shadow-[0_-12px_48px_rgba(10,34,64,0.18)]',
          '[&_h2]:!m-0 [&_h2]:!text-black [&_h2]:dark:!text-black',
          animationState === 'enter'
            ? 'dashboard-sheet-panel-enter'
            : 'dashboard-sheet-panel-exit',
        )}
      >
        <div className="flex justify-center pt-3 pb-1">
          <span className="h-1 w-10 rounded-full bg-slate-200" aria-hidden />
        </div>

        <div className="flex items-center justify-between gap-3 px-5 pb-3">
          <h2
            id="dashboard-more-sheet-title"
            className={cn(dashboardHeadingClass, '!text-lg')}
          >
            Más opciones
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-black transition-transform duration-200 active:scale-90"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        <ul className="space-y-1 px-3 pb-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li
                key={item.id}
                className={cn(isVisible && 'dashboard-sheet-item-enter')}
                style={isVisible ? { animationDelay: `${120 + index * 55}ms` } : undefined}
              >
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-3.5 text-left text-black',
                    'transition-colors duration-200 active:bg-slate-100 active:scale-[0.99]',
                  )}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#0A2240]/8 text-[#0A2240]">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold !text-black">{item.label}</span>
                    <span className={cn(dashboardSubtextClass, 'block text-xs !text-slate-600')}>
                      {item.description}
                    </span>
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-slate-600" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
