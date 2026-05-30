import type { CorrectiveActionStatus } from '@/features/tours/interfaces';
import type { CorrectiveActionDetail } from '../interfaces';
import { formatResolutionDuration } from './format-resolution-duration';

export type ActionProgressStepState = 'completed' | 'current' | 'upcoming';

export interface ActionProgressStep {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly timestamp: string | null;
  readonly state: ActionProgressStepState;
}

function resolveClosureStep(
  status: CorrectiveActionStatus,
): Pick<ActionProgressStep, 'title' | 'description' | 'state'> {
  if (status === 'closure_review') {
    return {
      title: 'Revisión de cierre',
      description: 'El inspector valida la evidencia presentada',
      state: 'current',
    };
  }

  if (status === 'closed') {
    return {
      title: 'Acción cerrada',
      description: 'La corrección fue validada y cerrada',
      state: 'completed',
    };
  }

  if (status === 'rejected') {
    return {
      title: 'Cierre rechazado',
      description: 'La evidencia o el cierre no fue aceptado',
      state: 'current',
    };
  }

  return {
    title: 'Cierre',
    description: 'Validación final por el inspector',
    state: 'upcoming',
  };
}

function resolveResolutionStep(
  detail: CorrectiveActionDetail,
): Pick<ActionProgressStep, 'title' | 'description' | 'state' | 'timestamp'> {
  const hasResolution = Boolean(detail.resolutionPhotoUrl);
  const durationLabel = formatResolutionDuration(detail.resolutionDurationMinutes);

  if (hasResolution) {
    return {
      title: 'Hallazgo corregido',
      description: durationLabel
        ? `Tiempo de solución: ${durationLabel}`
        : 'Evidencia de resolución registrada',
      timestamp: detail.resolutionResolvedAt,
      state: 'completed',
    };
  }

  const hasCommitment = detail.commitmentSequence !== null;
  const canUploadResolution =
    hasCommitment &&
    (detail.status === 'open' ||
      detail.status === 'pending' ||
      detail.status === 'expired' ||
      detail.status === 'reopened');

  if (canUploadResolution) {
    return {
      title: 'Evidencia de resolución',
      description:
        'Sube la foto después de corregir el hallazgo para medir el tiempo de solución',
      timestamp: null,
      state: 'current',
    };
  }

  return {
    title: 'Evidencia de resolución',
    description: 'Pendiente después de implementar la corrección',
    timestamp: null,
    state: 'upcoming',
  };
}

function resolveFollowUpStep(
  status: CorrectiveActionStatus,
  commitmentDate: string | null,
  awaitingResolutionPhoto: boolean,
): Pick<ActionProgressStep, 'title' | 'description' | 'state'> {
  if (status === 'expired') {
    return {
      title: 'Plazo vencido',
      description: 'La fecha compromiso expiró; se requiere reprogramar',
      state: 'current',
    };
  }

  if (status === 'reopened') {
    return {
      title: 'Acción reabierta',
      description: 'Se requiere nueva atención del responsable',
      state: 'current',
    };
  }

  if (
    status === 'open' ||
    status === 'pending' ||
    status === 'closure_review' ||
    status === 'closed' ||
    status === 'rejected'
  ) {
    const isActiveImplementation = status === 'open' || status === 'pending';

    return {
      title: 'Implementación',
      description: commitmentDate
        ? `Compromiso vigente hasta ${commitmentDate}`
        : 'Periodo de implementación del plan correctivo',
      state: awaitingResolutionPhoto
        ? 'completed'
        : isActiveImplementation
          ? 'current'
          : 'completed',
    };
  }

  return {
    title: 'Implementación',
    description: 'Ejecución del plan correctivo acordado',
    state: 'upcoming',
  };
}

function resolveResponseStep(
  detail: CorrectiveActionDetail,
): Pick<ActionProgressStep, 'title' | 'description' | 'state' | 'timestamp'> {
  const hasResponse = detail.commitmentSequence !== null;

  if (!hasResponse) {
    return {
      title: 'Compromiso del responsable',
      description: `${detail.responsibleName} debe registrar plan, fecha y firma`,
      timestamp: null,
      state: 'current',
    };
  }

  const sequenceLabel =
    detail.commitmentSequence === 0
      ? 'Fecha compromiso (F0)'
      : `Reprogramación F${detail.commitmentSequence}`;

  return {
    title: 'Compromiso firmado',
    description: `${detail.responsibleName} · ${sequenceLabel}${
      detail.currentCommitmentDate ? ` · ${detail.currentCommitmentDate}` : ''
    }`,
    timestamp: detail.respondedAt,
    state: 'completed',
  };
}

export function buildActionProgressSteps(
  detail: CorrectiveActionDetail,
): ActionProgressStep[] {
  const responseStep = resolveResponseStep(detail);
  const resolutionStep = resolveResolutionStep(detail);
  const awaitingResolutionPhoto =
    resolutionStep.state === 'current' && !detail.resolutionPhotoUrl;
  const followUpStep = resolveFollowUpStep(
    detail.status,
    detail.currentCommitmentDate,
    awaitingResolutionPhoto,
  );
  const closureStep = resolveClosureStep(detail.status);

  const steps: ActionProgressStep[] = [
    {
      id: 'detection',
      title: 'Hallazgo detectado',
      description: `${detail.inspectorName} registró la detección`,
      timestamp: detail.inspectedAt,
      state: 'completed',
    },
    {
      id: 'assignment',
      title: 'Asignación',
      description: `Asignada a ${detail.responsibleName}`,
      timestamp: detail.assignedAt,
      state: 'completed',
    },
    {
      id: 'response',
      ...responseStep,
    },
    {
      id: 'follow-up',
      ...followUpStep,
      timestamp: null,
    },
    {
      id: 'resolution',
      ...resolutionStep,
    },
    {
      id: 'closure',
      ...closureStep,
      timestamp: detail.status === 'closed' ? detail.resolutionResolvedAt : null,
    },
  ];

  const currentIndex = steps.findIndex((step) => step.state === 'current');
  if (currentIndex === -1) {
    return steps;
  }

  return steps.map((step, index) => {
    if (index < currentIndex && step.state !== 'completed') {
      return { ...step, state: 'completed' as const };
    }
    if (index > currentIndex && step.state === 'current') {
      return { ...step, state: 'upcoming' as const };
    }
    return step;
  });
}

export function shouldShowActionProgress(detail: CorrectiveActionDetail): boolean {
  return detail.commitmentSequence !== null;
}

export interface ActionProgressEvidence {
  readonly showSignature: boolean;
  readonly showResolution: boolean;
}

export function resolveActionProgressEvidence(
  detail: CorrectiveActionDetail,
): ActionProgressEvidence {
  const hasSignature = Boolean(detail.signatureUrl);
  const hasResolution = Boolean(detail.resolutionPhotoUrl);

  return {
    showSignature: hasSignature,
    showResolution: hasResolution,
  };
}
