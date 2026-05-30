import { cn } from '@/lib/utils';

export const dashboardPageClass = 'min-h-dvh min-h-[100dvh] w-full bg-[#eef2f6] max-md:bg-white';

export const dashboardMobileContentClass = 'w-full space-y-4 md:space-y-8';

export const dashboardHeadingClass =
  'm-0 !font-semibold !tracking-tight !text-black dark:!text-black';

export const dashboardSubtextClass = 'text-sm text-slate-600';

export const iconHoverClass =
  'transition-transform duration-200 ease-out group-hover:scale-110';

export function dashboardCard(className?: string) {
  return cn(
    'rounded-2xl border border-slate-200/90 bg-white',
    'shadow-[0_1px_3px_rgba(10,34,64,0.08),0_4px_12px_rgba(10,34,64,0.06)]',
    className,
  );
}

export function dashboardCardInteractive(className?: string) {
  return cn(
    dashboardCard(),
    'cursor-pointer transition-all duration-200 ease-out',
    'hover:-translate-y-0.5 hover:border-slate-300',
    'hover:shadow-[0_8px_24px_rgba(10,34,64,0.12)]',
    'active:translate-y-0 active:scale-[0.99]',
    className,
  );
}

export function dashboardNavShell(className?: string) {
  return cn(
    'rounded-full border border-slate-200 bg-white',
    'shadow-[0_2px_8px_rgba(10,34,64,0.06)]',
    className,
  );
}

export function dashboardButtonPrimary(className?: string) {
  return cn(
    'inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white',
    'bg-[#0A2240] shadow-sm transition-all duration-200',
    'hover:bg-[#0f3460] hover:shadow-md',
    'active:scale-[0.98]',
    className,
  );
}

export function dashboardButtonSecondary(className?: string) {
  return cn(
    'inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200',
    'bg-white px-3 py-2 text-sm font-medium text-[#0A2240] shadow-sm',
    'transition-all duration-200',
    'hover:border-slate-300 hover:bg-slate-50 hover:shadow-md',
    'active:scale-[0.98]',
    className,
  );
}

export function dashboardInput(className?: string) {
  return cn(
    'h-9 w-full min-w-0 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0A2240]',
    'shadow-sm outline-none transition-colors duration-200',
    'hover:border-slate-300',
    'focus:border-[#00C4B3] focus:ring-2 focus:ring-[#00C4B3]/20',
    className,
  );
}
