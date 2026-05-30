import type { RouteObject } from 'react-router';
import { Outlet } from 'react-router';
import { HomePage } from '@/features/dashboard/pages/HomePage';
import { DashboardShellLayout } from '@/features/dashboard/layouts/DashboardShellLayout';
import { UsersPage } from '@/features/users/pages/UsersPage';
import { AuthRouteGuard } from '@/router/AuthRouteGuard';
import { RoleRouteGuard } from '@/router/RoleRouteGuard';
import {
  ROLE_ADMINISTRATOR,
  ROLE_INSPECTOR,
  ROLE_RESPONSIBLE,
} from '@/features/auth/utils/role-permissions';
import { ToursPage } from '@/features/tours/pages/ToursPage';
import { ActionPage } from '@/features/corrective_action/pages/ActionPage';
import { ActionDetailPage } from '@/features/corrective_action/pages/ActionDetailPage';
import { ReportsPage } from '@/features/reports/pages/ReportsPage';

export const ProtectedRouter: RouteObject[] = [
  {
    path: '/',
    element: <AuthRouteGuard mode='protected' />,
    children: [
      {
        element: <DashboardShellLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'users',
            element: (
              <RoleRouteGuard allowedRoles={[ROLE_ADMINISTRATOR]}>
                <UsersPage />
              </RoleRouteGuard>
            ),
          },
          {
            path: 'tours',
            element: (
              <RoleRouteGuard
                allowedRoles={[ROLE_ADMINISTRATOR, ROLE_INSPECTOR]}
              >
                <ToursPage />
              </RoleRouteGuard>
            ),
          },
          {
            path: 'reports',
            element: (
              <RoleRouteGuard
                allowedRoles={[ROLE_ADMINISTRATOR, ROLE_INSPECTOR]}
              >
                <ReportsPage />
              </RoleRouteGuard>
            ),
          },
          {
            path: 'actions',
            element: (
              <RoleRouteGuard
                allowedRoles={[
                  ROLE_ADMINISTRATOR,
                  ROLE_INSPECTOR,
                  ROLE_RESPONSIBLE,
                ]}
              >
                <Outlet />
              </RoleRouteGuard>
            ),
            children: [
              {
                index: true,
                element: <ActionPage />,
              },
              {
                path: ':actionId',
                element: <ActionDetailPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];
