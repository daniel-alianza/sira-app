import type {
  DashboardMoreMenuId,
  DashboardMoreMenuItem,
  DashboardNavId,
  DashboardNavItem,
} from '../data/dashboard-nav.config';
import { dashboardMoreMenuItems, dashboardNavItems } from '../data/dashboard-nav.config';
import {
  isNavItemAllowedForRole,
  type SessionRoleName,
} from '@/features/auth/utils/role-permissions';

export function filterDashboardNavItems(
  items: DashboardNavItem[],
  roleName?: string,
): DashboardNavItem[] {
  return items.filter((item) =>
    isNavItemAllowedForRole(item.allowedRoles, roleName as SessionRoleName),
  );
}

export function filterDashboardMoreMenuItems(
  items: DashboardMoreMenuItem[],
  roleName?: string,
): DashboardMoreMenuItem[] {
  return items.filter((item) =>
    isNavItemAllowedForRole(item.allowedRoles, roleName as SessionRoleName),
  );
}

export function isDashboardNavIdAllowedForRole(
  id: DashboardNavId,
  roleName?: string,
): boolean {
  const item = dashboardNavItems.find((navItem) => navItem.id === id);
  if (!item) {
    return false;
  }

  return isNavItemAllowedForRole(item.allowedRoles, roleName as SessionRoleName);
}

export function isDashboardMoreMenuIdAllowedForRole(
  id: DashboardMoreMenuId,
  roleName?: string,
): boolean {
  const item = dashboardMoreMenuItems.find((menuItem) => menuItem.id === id);
  if (!item) {
    return false;
  }

  return isNavItemAllowedForRole(item.allowedRoles, roleName as SessionRoleName);
}
