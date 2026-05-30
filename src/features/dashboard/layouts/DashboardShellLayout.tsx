import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { AppFooter } from '@/components/AppFooter';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { cn } from '@/lib/utils';
import { DashboardDesktopHeader } from '../components/DashboardDesktopHeader';
import { DashboardMobileHeader } from '../components/DashboardMobileHeader';
import { DashboardMobileMoreSheet } from '../components/DashboardMobileMoreSheet';
import { DashboardMobileSectionPlaceholder } from '../components/DashboardMobileSectionPlaceholder';
import { DashboardMobileTabBar } from '../components/DashboardMobileTabBar';
import type {
  DashboardMoreMenuId,
  DashboardNavId,
} from '../data/dashboard-nav.config';
import {
  dashboardMobileTabItems,
  dashboardMoreMenuItems,
  dashboardNavItems,
} from '../data/dashboard-nav.config';
import {
  getDashboardNavIdFromPath,
  getPathForDashboardNav,
} from '../data/dashboard-nav.routes';
import { canAccessDashboard } from '@/features/auth/utils/role-permissions';
import {
  filterDashboardMoreMenuItems,
  filterDashboardNavItems,
  isDashboardMoreMenuIdAllowedForRole,
  isDashboardNavIdAllowedForRole,
} from '../utils/dashboard-nav-permissions';
import {
  dashboardMobileContentClass,
  dashboardPageClass,
} from '../components/dashboard-ui.classes';

function getUserInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function DashboardShellLayout() {
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const routeNav = getDashboardNavIdFromPath(pathname);
  const activeNav: DashboardNavId = isMoreOpen ? 'reports' : routeNav;
  const [mobileSection, setMobileSection] = useState<
    DashboardNavId | DashboardMoreMenuId | null
  >(null);
  const profileInitials = getUserInitials(user?.name ?? 'Usuario');
  const displayName = user?.name?.split(' ')[0] ?? 'Usuario';
  const showMobilePlaceholder = mobileSection !== null && pathname === '/';
  const roleName = user?.role?.name;
  const visibleNavItems = filterDashboardNavItems(dashboardNavItems, roleName);
  const visibleMobileTabItems = filterDashboardNavItems(
    dashboardMobileTabItems,
    roleName,
  );
  const visibleMoreMenuItems = filterDashboardMoreMenuItems(
    dashboardMoreMenuItems,
    roleName,
  );
  const showMobileTabBar = visibleMobileTabItems.length > 1;

  function handleNavigate(id: DashboardNavId) {
    if (!isDashboardNavIdAllowedForRole(id, roleName)) {
      return;
    }

    if (id === 'reports') {
      const reportsPath = getPathForDashboardNav('reports');
      const isDesktop =
        typeof window !== 'undefined' &&
        window.matchMedia('(min-width: 768px)').matches;

      if (reportsPath && isDesktop) {
        setIsMoreOpen(false);
        setMobileSection(null);
        navigate(reportsPath);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setMobileSection(null);
      setIsMoreOpen(true);
      return;
    }

    setIsMoreOpen(false);

    const path = getPathForDashboardNav(id);
    if (path) {
      setMobileSection(null);
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setMobileSection(id);
    if (canAccessDashboard(roleName) && pathname !== '/') {
      navigate('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCloseMore() {
    setIsMoreOpen(false);
    if (isMoreOpen && mobileSection === null && pathname === '/' && canAccessDashboard(roleName)) {
      navigate('/');
    }
  }

  function handleMoreSelect(id: DashboardMoreMenuId) {
    if (!isDashboardMoreMenuIdAllowedForRole(id, roleName)) {
      return;
    }

    setIsMoreOpen(false);

    const path = getPathForDashboardNav(id as DashboardNavId);
    if (path) {
      setMobileSection(null);
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setMobileSection(id);
    if (canAccessDashboard(roleName) && pathname !== '/') {
      navigate('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div
      className={cn(
        'font-sans w-full min-w-0 touch-pan-y text-left text-[#0A2240]',
        'max-md:overscroll-y-contain',
        dashboardPageClass,
      )}
    >
      <DashboardMobileHeader
        displayName={displayName}
        profileInitials={profileInitials}
        hasUser={user !== null}
        userName={user?.name}
        userEmail={user?.email}
      />

      <div
        className={cn(
          'mx-auto w-full max-w-none',
          showMobileTabBar
            ? 'px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-3'
            : 'px-3 pb-3 pt-3',
          'sm:px-5 md:px-6 md:pb-10 lg:px-8 xl:px-10 2xl:px-12',
        )}
      >
        <DashboardDesktopHeader
          activeNav={activeNav}
          navItems={visibleNavItems}
          onNavigate={handleNavigate}
          profileInitials={profileInitials}
          hasUser={user !== null}
          userName={user?.name}
          userEmail={user?.email}
        />

        <main className='w-full [&_h1]:m-0! [&_h1]:text-black! [&_h2]:text-black! [&_h3]:text-black!'>
          {showMobilePlaceholder && (
            <DashboardMobileSectionPlaceholder
              sectionId={mobileSection}
              onBack={() =>
                handleNavigate(canAccessDashboard(roleName) ? 'dashboard' : 'actions')
              }
            />
          )}
          <div
            className={cn(
              dashboardMobileContentClass,
              showMobilePlaceholder && 'hidden md:block',
            )}
          >
            <Outlet />
          </div>
        </main>

        <div className='hidden md:block'>
          <AppFooter />
        </div>
      </div>

      {showMobileTabBar && (
        <DashboardMobileTabBar
          activeNav={activeNav}
          navItems={visibleMobileTabItems}
          onNavigate={handleNavigate}
        />
      )}
      {visibleMoreMenuItems.length > 0 && (
        <DashboardMobileMoreSheet
          open={isMoreOpen}
          menuItems={visibleMoreMenuItems}
          onClose={handleCloseMore}
          onSelect={handleMoreSelect}
        />
      )}
    </div>
  );
}
