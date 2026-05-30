import type { ActionStatusFilter } from './corrective-action.interfaces';

export const CORRECTIVE_ACTIONS_QUERY_KEY = ['corrective-actions', 'mine'] as const;

export function getCorrectiveActionDetailQueryKey(actionId: string) {
  return ['corrective-actions', 'detail', actionId] as const;
}

export const ACTION_STATUS_FILTER_OPTIONS: {
  readonly value: ActionStatusFilter;
  readonly label: string;
}[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending_acceptance', label: 'Pendiente de aceptación' },
  { value: 'open', label: 'Abiertas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'expired', label: 'Expiradas' },
  { value: 'closure_review', label: 'En revisión' },
  { value: 'closed', label: 'Cerradas' },
];
