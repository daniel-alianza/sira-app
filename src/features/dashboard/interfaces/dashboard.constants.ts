import type { DashboardKpis } from './dashboard.interfaces';

export const DASHBOARD_OVERVIEW_QUERY_KEY = ['dashboard', 'overview'] as const;
export const DASHBOARD_AI_SUMMARY_QUERY_KEY = ['dashboard', 'ai-summary'] as const;

export const DASHBOARD_ALL_FILTER_VALUE = 'all';

export const actionStatusOptions = [
  { value: DASHBOARD_ALL_FILTER_VALUE, label: 'Todos los estatus' },
  { value: 'pending_acceptance', label: 'Pendiente de aceptación' },
  { value: 'open', label: 'Abierta' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'expired', label: 'Expirada' },
  { value: 'closure_review', label: 'En revisión de cierre' },
  { value: 'closed', label: 'Cerrada' },
  { value: 'rejected', label: 'Rechazada' },
  { value: 'reopened', label: 'Reabierta' },
] as const;

export const activityTypeOptions = [
  { value: DASHBOARD_ALL_FILTER_VALUE, label: 'Todas las actividades' },
  { value: 'unsafe_condition', label: 'Condición insegura' },
  { value: 'unsafe_act', label: 'Acto inseguro' },
] as const;

export const emptyDashboardKpis: DashboardKpis = {
  totalActions: 0,
  openActions: 0,
  closedActions: 0,
  pendingAcceptance: 0,
  expiredActions: 0,
  closureReview: 0,
  rejectedClosures: 0,
  walkthroughsPeriod: 0,
  avgClosureDays: 0,
  notRespondedUsers: 0,
  notSignedUsers: 0,
};
