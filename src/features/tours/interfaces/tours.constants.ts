import type { CorrectiveActionStatus, TourDetectionType, TourPeriod } from './tours-table.interfaces';

export const TOUR_PERIOD_OPTIONS: {
  readonly value: TourPeriod;
  readonly label: string;
  readonly description: string;
}[] = [
  { value: 'day', label: 'Hoy', description: 'Recorridos del día' },
  { value: 'week', label: 'Esta semana', description: 'Recorridos de la semana' },
];

export const DETECTION_TYPE_LABELS: Record<TourDetectionType, string> = {
  unsafe_act: 'Acto inseguro',
  unsafe_condition: 'Condición insegura',
};

export const DETECTION_TYPE_STYLES: Record<TourDetectionType, string> = {
  unsafe_act: 'bg-rose-50 text-rose-800',
  unsafe_condition: 'bg-amber-50 text-amber-800',
};

export const DETECTION_TYPE_SELECT_OPTIONS = [
  { value: 'unsafe_act' as const, label: 'Acto inseguro' },
  { value: 'unsafe_condition' as const, label: 'Condición insegura' },
];

export const ACTION_STATUS_CONFIG: Record<
  CorrectiveActionStatus,
  { readonly label: string; readonly className: string }
> = {
  pending_acceptance: {
    label: 'Pendiente de aceptación',
    className: 'bg-violet-50 text-violet-800',
  },
  open: { label: 'Abierta', className: 'bg-amber-50 text-amber-800' },
  pending: { label: 'Pendiente', className: 'bg-orange-50 text-orange-800' },
  expired: { label: 'Expirada', className: 'bg-red-50 text-red-800' },
  closure_review: {
    label: 'En revisión de cierre',
    className: 'bg-slate-100 text-slate-800',
  },
  closed: { label: 'Cerrada', className: 'bg-[#00C4B3]/15 text-[#007a70]' },
  rejected: { label: 'Rechazada', className: 'bg-red-50 text-red-800' },
  reopened: { label: 'Reabierta', className: 'bg-indigo-50 text-indigo-800' },
};

export const TOURS_DETECTIONS_QUERY_KEY = ['tours', 'detections'] as const;
