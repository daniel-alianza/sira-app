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
  {
    readonly label: string;
    readonly className: string;
    readonly shortDescription: string;
    readonly description: string;
  }
> = {
  pending_acceptance: {
    label: 'Pendiente de aceptación',
    className: 'bg-violet-100 text-violet-900 ring-violet-200/80',
    shortDescription: 'Asignada al responsable; debe aceptar y proponer plan de corrección.',
    description:
      'El inspector te asignó esta detección. Revisa la evidencia y responde con tu plan de corrección.',
  },
  open: {
    label: 'Abierta',
    className: 'bg-amber-100 text-amber-900 ring-amber-200/80',
    shortDescription: 'Aceptada por el responsable; debe ejecutar el plan en plazo.',
    description:
      'Aceptaste la acción correctiva. Estás en plazo para implementar el plan acordado.',
  },
  pending: {
    label: 'Pendiente',
    className: 'bg-orange-100 text-orange-900 ring-orange-200/80',
    shortDescription: 'En seguimiento dentro del periodo comprometido.',
    description: 'La acción está en seguimiento dentro del periodo comprometido.',
  },
  expired: {
    label: 'Expirada',
    className: 'bg-red-100 text-red-900 ring-red-200/80',
    shortDescription: 'Venció la fecha compromiso; requiere reprogramación.',
    description:
      'La fecha compromiso venció. Debes reprogramar y firmar un nuevo compromiso.',
  },
  closure_review: {
    label: 'En revisión de cierre',
    className: 'bg-sky-100 text-sky-900 ring-sky-200/80',
    shortDescription: 'Cierre en revisión por inspector o supervisor.',
    description: 'El cierre está en revisión por el inspector o supervisor.',
  },
  closed: {
    label: 'Cerrada',
    className: 'bg-[#00C4B3]/25 text-[#005c52] ring-[#00C4B3]/40',
    shortDescription: 'Acción cerrada satisfactoriamente.',
    description: 'La acción correctiva fue cerrada satisfactoriamente.',
  },
  rejected: {
    label: 'Rechazada',
    className: 'bg-rose-100 text-rose-900 ring-rose-200/80',
    shortDescription: 'Propuesta o evidencia de cierre rechazada.',
    description: 'La propuesta o evidencia de cierre fue rechazada.',
  },
  reopened: {
    label: 'Reabierta',
    className: 'bg-indigo-100 text-indigo-900 ring-indigo-200/80',
    shortDescription: 'Reabierta; requiere nueva atención del responsable.',
    description: 'La acción fue reabierta y requiere nueva atención de tu parte.',
  },
};

export const TOURS_DETECTIONS_QUERY_KEY = ['tours', 'detections'] as const;
