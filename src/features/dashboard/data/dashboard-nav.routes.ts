import type { DashboardNavId } from './dashboard-nav.config';

export const dashboardNavPaths: Partial<Record<DashboardNavId, string>> = {
  dashboard: '/',
  walkthroughs: '/tours',
  users: '/users',
  actions: '/actions',
  reports: '/reports',
};

export function getDashboardNavIdFromPath(pathname: string): DashboardNavId {
  if (pathname.startsWith('/actions')) {
    return 'actions';
  }

  if (pathname.startsWith('/reports')) {
    return 'reports';
  }

  const match = Object.entries(dashboardNavPaths).find(
    ([, path]) => path === pathname,
  );
  if (match) {
    return match[0] as DashboardNavId;
  }
  return 'dashboard';
}

export function getPathForDashboardNav(id: DashboardNavId): string | undefined {
  return dashboardNavPaths[id];
}
