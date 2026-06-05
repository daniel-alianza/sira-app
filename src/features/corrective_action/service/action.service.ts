import axios from 'axios';
import { siraApi } from '@/api/sira-api';
import {
  isActionsListIsoDate,
  isActionsListUuid,
} from '../utils/actions-list-query.utils';
import type {
  ApiResponse,
  CorrectiveActionDetail,
  CorrectiveActionItem,
  RespondCorrectiveActionPayload,
  RespondCorrectiveActionResult,
  ReviewCorrectiveClosurePayload,
  ReviewCorrectiveClosureResult,
  SubmitResolutionPhotoPayload,
  SubmitResolutionPhotoResult,
} from '../interfaces';

function getActionsErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const responseMessage = error.response?.data?.message;

  if (typeof responseMessage === 'string') {
    return responseMessage;
  }

  if (Array.isArray(responseMessage) && typeof responseMessage[0] === 'string') {
    return responseMessage[0];
  }

  return error.message || fallback;
}

export interface ActionsQueryParams {
  readonly companyId?: string;
  readonly areaId?: string;
  readonly branchId?: string;
  readonly responsibleId?: string;
  readonly dateFrom?: string;
  readonly dateTo?: string;
}

function sanitizeActionsQueryParams(
  queryParams?: ActionsQueryParams,
): ActionsQueryParams | undefined {
  if (!queryParams) {
    return undefined;
  }

  const params: ActionsQueryParams = {};
  let hasAny = false;

  if (queryParams.companyId && isActionsListUuid(queryParams.companyId)) {
    params.companyId = queryParams.companyId;
    hasAny = true;
  }
  if (queryParams.areaId && isActionsListUuid(queryParams.areaId)) {
    params.areaId = queryParams.areaId;
    hasAny = true;
  }
  if (queryParams.branchId && isActionsListUuid(queryParams.branchId)) {
    params.branchId = queryParams.branchId;
    hasAny = true;
  }
  if (queryParams.responsibleId && isActionsListUuid(queryParams.responsibleId)) {
    params.responsibleId = queryParams.responsibleId;
    hasAny = true;
  }
  if (queryParams.dateFrom && isActionsListIsoDate(queryParams.dateFrom)) {
    params.dateFrom = queryParams.dateFrom;
    hasAny = true;
  }
  if (queryParams.dateTo && isActionsListIsoDate(queryParams.dateTo)) {
    params.dateTo = queryParams.dateTo;
    hasAny = true;
  }

  return hasAny ? params : undefined;
}

export async function fetchMyCorrectiveActions(
  queryParams?: ActionsQueryParams,
): Promise<CorrectiveActionItem[]> {
  try {
    const sanitizedParams = sanitizeActionsQueryParams(queryParams);

    const { data } = await siraApi.get<ApiResponse<CorrectiveActionItem[]>>(
      '/corrective-actions',
      { params: sanitizedParams },
    );
    return data.data;
  } catch (error) {
    throw new Error(
      getActionsErrorMessage(
        error,
        'No se pudieron cargar tus acciones correctivas. Intenta de nuevo.',
      ),
      { cause: error },
    );
  }
}

export async function fetchCorrectiveActionById(
  actionId: string,
): Promise<CorrectiveActionDetail> {
  try {
    const { data } = await siraApi.get<ApiResponse<CorrectiveActionDetail>>(
      `/corrective-actions/${actionId}`,
    );
    return data.data;
  } catch (error) {
    throw new Error(
      getActionsErrorMessage(
        error,
        'No se pudo cargar el detalle de la acción correctiva.',
      ),
      { cause: error },
    );
  }
}

export async function respondCorrectiveAction(
  actionId: string,
  payload: RespondCorrectiveActionPayload,
): Promise<RespondCorrectiveActionResult> {
  try {
    const { data } = await siraApi.post<ApiResponse<RespondCorrectiveActionResult>>(
      `/corrective-actions/${actionId}/respond`,
      payload,
    );
    return data.data;
  } catch (error) {
    throw new Error(
      getActionsErrorMessage(
        error,
        'No se pudo guardar tu respuesta. Intenta de nuevo.',
      ),
      { cause: error },
    );
  }
}

export interface SubmitDetectionEvidencePayload {
  readonly evidencePhotoDataUrl: string;
}

export interface SubmitDetectionEvidenceResult {
  readonly evidencePhotoUrl: string;
}

export async function submitDetectionEvidence(
  actionId: string,
  payload: SubmitDetectionEvidencePayload,
): Promise<SubmitDetectionEvidenceResult> {
  try {
    const { data } = await siraApi.post<ApiResponse<SubmitDetectionEvidenceResult>>(
      `/corrective-actions/${actionId}/detection-evidence`,
      payload,
    );
    return data.data;
  } catch (error) {
    throw new Error(
      getActionsErrorMessage(
        error,
        'No se pudo registrar la evidencia de detección. Intenta de nuevo.',
      ),
      { cause: error },
    );
  }
}

export async function submitCorrectiveResolutionPhoto(
  actionId: string,
  payload: SubmitResolutionPhotoPayload,
): Promise<SubmitResolutionPhotoResult> {
  try {
    const { data } = await siraApi.post<ApiResponse<SubmitResolutionPhotoResult>>(
      `/corrective-actions/${actionId}/resolution`,
      payload,
    );
    return data.data;
  } catch (error) {
    throw new Error(
      getActionsErrorMessage(
        error,
        'No se pudo registrar la evidencia de resolución. Intenta de nuevo.',
      ),
      { cause: error },
    );
  }
}

export async function reassignCorrectiveActionResponsible(
  actionId: string,
  newResponsibleId: string,
): Promise<void> {
  try {
    await siraApi.patch<ApiResponse<null>>(
      `/corrective-actions/${actionId}/reassign`,
      { newResponsibleId },
    );
  } catch (error) {
    throw new Error(
      getActionsErrorMessage(
        error,
        'No se pudo reasignar el responsable. Intenta de nuevo.',
      ),
      { cause: error },
    );
  }
}

export async function reviewCorrectiveClosure(
  actionId: string,
  payload: ReviewCorrectiveClosurePayload,
): Promise<ReviewCorrectiveClosureResult> {
  try {
    const { data } = await siraApi.post<ApiResponse<ReviewCorrectiveClosureResult>>(
      `/corrective-actions/${actionId}/closure-review`,
      payload,
    );
    return data.data;
  } catch (error) {
    throw new Error(
      getActionsErrorMessage(
        error,
        'No se pudo completar la revisión de cierre. Intenta de nuevo.',
      ),
      { cause: error },
    );
  }
}
