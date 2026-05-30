import type { LucideIcon } from 'lucide-react';
import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  Route,
  Settings,
  Users,
} from 'lucide-react';
import type { SessionRoleName } from '@/features/auth/utils/role-permissions';
import {
  ROLE_ADMINISTRATOR,
  ROLE_INSPECTOR,
  ROLE_RESPONSIBLE,
} from '@/features/auth/utils/role-permissions';

export type DashboardNavId =
  | 'dashboard'
  | 'walkthroughs'
  | 'actions'
  | 'reports'
  | 'users';

export interface DashboardNavItem {
  id: DashboardNavId;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  showInMobileTab: boolean;
  allowedRoles?: SessionRoleName[];
}

export const dashboardNavItems: DashboardNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    shortLabel: 'Inicio',
    icon: LayoutDashboard,
    showInMobileTab: true,
    allowedRoles: [ROLE_ADMINISTRATOR, ROLE_INSPECTOR],
  },
  {
    id: 'walkthroughs',
    label: 'Recorridos',
    shortLabel: 'Recorridos',
    icon: Route,
    showInMobileTab: true,
    allowedRoles: [ROLE_ADMINISTRATOR, ROLE_INSPECTOR],
  },
  {
    id: 'actions',
    label: 'Acciones',
    shortLabel: 'Acciones',
    icon: ClipboardList,
    showInMobileTab: true,
    allowedRoles: [ROLE_ADMINISTRATOR, ROLE_INSPECTOR, ROLE_RESPONSIBLE],
  },
  {
    id: 'reports',
    label: 'Reportes',
    shortLabel: 'Más',
    icon: FileText,
    showInMobileTab: true,
    allowedRoles: [ROLE_ADMINISTRATOR, ROLE_INSPECTOR],
  },
  {
    id: 'users',
    label: 'Usuarios',
    shortLabel: 'Usuarios',
    icon: Users,
    showInMobileTab: false,
    allowedRoles: [ROLE_ADMINISTRATOR],
  },
];

export const dashboardMobileTabItems = dashboardNavItems.filter(
  (item) => item.showInMobileTab,
);

export type DashboardMoreMenuId = 'reports' | 'users' | 'settings';

export interface DashboardMoreMenuItem {
  id: DashboardMoreMenuId;
  label: string;
  description: string;
  icon: LucideIcon;
  allowedRoles?: SessionRoleName[];
}

export const dashboardMoreMenuItems: DashboardMoreMenuItem[] = [
  {
    id: 'reports',
    label: 'Reportes',
    description: 'Consultas y exportación de datos',
    icon: FileText,
    allowedRoles: [ROLE_ADMINISTRATOR, ROLE_INSPECTOR],
  },
  {
    id: 'users',
    label: 'Usuarios',
    description: 'Gestión de accesos y roles',
    icon: Users,
    allowedRoles: [ROLE_ADMINISTRATOR],
  },
  {
    id: 'settings',
    label: 'Ajustes',
    description: 'Preferencias de la cuenta',
    icon: Settings,
    allowedRoles: [ROLE_ADMINISTRATOR, ROLE_INSPECTOR],
  },
];
