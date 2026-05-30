import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import {
  getHomePathForRole,
  isSessionRoleName,
  type SessionRoleName,
} from '@/features/auth/utils/role-permissions';

interface RoleRouteGuardProps {
  allowedRoles: SessionRoleName[];
  children: ReactNode;
}

export function RoleRouteGuard({
  allowedRoles,
  children,
}: RoleRouteGuardProps) {
  const roleName = useAuthStore((state) => state.user?.role?.name);

  if (!isSessionRoleName(roleName) || !allowedRoles.includes(roleName)) {
    return <Navigate to={getHomePathForRole(roleName)} replace />;
  }

  return children;
}
