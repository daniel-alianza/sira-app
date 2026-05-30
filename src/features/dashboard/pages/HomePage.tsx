import { Navigate } from 'react-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import {
  canAccessDashboard,
  getHomePathForRole,
} from '@/features/auth/utils/role-permissions';
import { DashboardPage } from './DashboardPage';

export function HomePage() {
  const roleName = useAuthStore((state) => state.user?.role?.name);

  if (!canAccessDashboard(roleName)) {
    return <Navigate to={getHomePathForRole(roleName)} replace />;
  }

  return <DashboardPage />;
}
