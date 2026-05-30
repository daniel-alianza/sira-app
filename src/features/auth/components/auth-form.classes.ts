import { cn } from '@/lib/utils';

export const authPageRootClass = 'auth-page flex min-h-dvh flex-col md:flex-row';

export const authFormPanelClass =
  'relative overflow-hidden bg-gradient-to-br from-[#F4F6F9] via-[#FAFBFD] to-[#FFF6F1]';

export const authFormPanelDecorClass =
  'pointer-events-none absolute inset-0 overflow-hidden';

export const authDesktopInputClass = cn(
  'h-auto w-full rounded-xl border border-[#0A2240]/10 bg-white/95 py-3 pl-10 pr-4',
  'text-sm font-medium text-[#0A2240] caret-[#FF4D00]',
  'shadow-sm shadow-[#0A2240]/5',
  'placeholder:text-[#5C6470]/60 transition-all duration-200 ease-out',
  'focus-visible:border-[#FF4D00]/40 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#FF4D00]/15',
  'disabled:opacity-50',
);

export const authMobileInputClass = cn(
  'h-auto w-full rounded-xl border border-[#0A2240]/10 bg-white/95 py-4 pl-12 pr-12',
  'text-[15px] font-medium text-[#0A2240] caret-[#FF4D00]',
  'placeholder:text-[#5C6470]/60 transition-all duration-200 ease-out',
  'focus-visible:border-[#FF4D00]/40 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#FF4D00]/15',
);

export const authSelectTriggerClass = cn(
  'h-auto rounded-xl border border-[#0A2240]/10 bg-white/95 py-3 text-sm font-medium text-[#0A2240]',
  'shadow-sm shadow-[#0A2240]/5',
  'focus-visible:border-[#FF4D00]/40 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#FF4D00]/15',
  'disabled:opacity-50 transition-all duration-200',
);

export const authHeadingClass = 'text-3xl font-bold tracking-tight text-[#0A2240]';

export const authSubheadingClass = 'mt-1.5 text-sm text-[#4A5568]';

export const authFooterTextClass = 'text-center text-sm text-[#5C6470]';

export const authMobileSheetClass =
  'animate-slide-up rounded-t-3xl border-t border-[#0A2240]/8 bg-gradient-to-b from-[#FAFBFD] to-white px-6 pb-8 pt-6 shadow-2xl shadow-[#0A2240]/10';
