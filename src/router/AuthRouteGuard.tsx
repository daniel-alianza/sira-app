import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { getHomePathForRole } from '@/features/auth/utils/role-permissions';

interface AuthRouteGuardProps {
  mode: 'guest' | 'protected';
  children?: ReactNode;
}

export function AuthRouteGuard({ mode, children }: AuthRouteGuardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const roleName = useAuthStore((state) => state.user?.role?.name);

  if (isHydrating) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0A2240] text-white">
        Cargando sesión...
      </div>
    );
  }

  if (mode === 'protected') {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <Outlet />;
  }

  if (isAuthenticated) {
    return <Navigate to={getHomePathForRole(roleName)} replace />;
  }

  return children;
}
