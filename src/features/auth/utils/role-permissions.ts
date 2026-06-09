export const ROLE_ADMINISTRATOR = 'Administrador';
export const ROLE_INSPECTOR = 'Inspector';
export const ROLE_RESPONSIBLE = 'Responsable';

export const APP_ROLE_NAMES = [
  ROLE_ADMINISTRATOR,
  ROLE_INSPECTOR,
  ROLE_RESPONSIBLE,
] as const;

export type SessionRoleName = (typeof APP_ROLE_NAMES)[number];

export function isSessionRoleName(value?: string): value is SessionRoleName {
  return APP_ROLE_NAMES.includes(value as SessionRoleName);
}

export function canAccessUsers(roleName?: string): boolean {
  return roleName === ROLE_ADMINISTRATOR || roleName === ROLE_INSPECTOR;
}

export function canManageUsers(roleName?: string): boolean {
  return roleName === ROLE_ADMINISTRATOR;
}

export function canCreateUsers(roleName?: string): boolean {
  return roleName === ROLE_ADMINISTRATOR || roleName === ROLE_INSPECTOR;
}

export function canEditInspectorUsers(roleName?: string): boolean {
  return roleName === ROLE_ADMINISTRATOR || roleName === ROLE_INSPECTOR;
}

export function canFullyEditUsers(roleName?: string): boolean {
  return roleName === ROLE_ADMINISTRATOR || roleName === ROLE_INSPECTOR;
}

export function canEditUser(
  sessionRoleName: string | undefined,
  _targetRoleName: string | undefined,
): boolean {
  return canFullyEditUsers(sessionRoleName);
}

export function canToggleUserActive(roleName?: string): boolean {
  return canFullyEditUsers(roleName);
}

import { SHE_AREA_NAME } from '@/features/corrective_action/interfaces/she-area.constants';

export function canDirectCloseSheActions(areaName?: string): boolean {
  return areaName === SHE_AREA_NAME;
}

export function canEditUsers(roleName?: string): boolean {
  return canAccessUsers(roleName);
}

export function canAccessTours(roleName?: string): boolean {
  return roleName === ROLE_ADMINISTRATOR || roleName === ROLE_INSPECTOR;
}

export function canAccessActions(roleName?: string): boolean {
  return (
    roleName === ROLE_ADMINISTRATOR ||
    roleName === ROLE_INSPECTOR ||
    roleName === ROLE_RESPONSIBLE
  );
}

export function canRespondToActions(roleName?: string): boolean {
  return roleName === ROLE_RESPONSIBLE;
}

export function canReviewActionClosure(roleName?: string): boolean {
  return roleName === ROLE_ADMINISTRATOR || roleName === ROLE_INSPECTOR;
}

export function canAccessDashboard(roleName?: string): boolean {
  return roleName === ROLE_ADMINISTRATOR || roleName === ROLE_INSPECTOR;
}

export function canAccessReports(roleName?: string): boolean {
  return canAccessDashboard(roleName);
}

export function getHomePathForRole(roleName?: string): string {
  if (roleName === ROLE_RESPONSIBLE) {
    return '/actions';
  }

  return '/';
}

export function isNavItemAllowedForRole(
  allowedRoles: SessionRoleName[] | undefined,
  roleName?: string,
): boolean {
  if (!isSessionRoleName(roleName)) {
    return false;
  }

  if (!allowedRoles) {
    return true;
  }

  return allowedRoles.includes(roleName);
}
