import { ArrowLeft, Construction } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardMoreMenuId, DashboardNavId } from '../data/dashboard-nav.config';
import { dashboardMoreMenuItems, dashboardNavItems } from '../data/dashboard-nav.config';
import { dashboardCard, dashboardHeadingClass, dashboardSubtextClass } from './dashboard-ui.classes';

type MobileSectionId = DashboardNavId | DashboardMoreMenuId;

interface DashboardMobileSectionPlaceholderProps {
  sectionId: MobileSectionId;
  onBack: () => void;
}

function getSectionTitle(sectionId: MobileSectionId): string {
  const navItem = dashboardNavItems.find((item) => item.id === sectionId);
  if (navItem) {
    return navItem.label;
  }
  const moreItem = dashboardMoreMenuItems.find((item) => item.id === sectionId);
  return moreItem?.label ?? 'Sección';
}

export function DashboardMobileSectionPlaceholder({
  sectionId,
  onBack,
}: DashboardMobileSectionPlaceholderProps) {
  const title = getSectionTitle(sectionId);

  return (
    <div
      key={sectionId}
      className={cn(dashboardCard(), 'dashboard-section-enter p-6 md:hidden')}
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-5 flex cursor-pointer items-center gap-2 text-sm font-medium text-[#00a896] active:opacity-70"
      >
        <ArrowLeft className="size-4" />
        Volver al inicio
      </button>
      <div className="flex flex-col items-center py-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <Construction className="size-8" />
        </div>
        <h2 className={cn(dashboardHeadingClass, 'mt-5 text-xl')}>{title}</h2>
        <p className={cn(dashboardSubtextClass, 'mt-2 max-w-xs')}>
          Este módulo estará disponible pronto. Por ahora usa el panel de inicio para consultar el
          estado operativo.
        </p>
      </div>
    </div>
  );
}
