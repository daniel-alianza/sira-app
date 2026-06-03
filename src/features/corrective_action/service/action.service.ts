import axios from 'axios';
import { siraApi } from '@/api/sira-api';
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
  TourDetectionType,
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
  readonly status?: string;
  readonly dateFrom?: string;
  readonly dateTo?: string;
}

export async function fetchMyCorrectiveActions(
  queryParams?: ActionsQueryParams,
): Promise<CorrectiveActionItem[]> {
  try {
    const params: Record<string, string> = {};

    if (queryParams?.companyId) params.companyId = queryParams.companyId;
    if (queryParams?.areaId) params.areaId = queryParams.areaId;
    if (queryParams?.branchId) params.branchId = queryParams.branchId;
    if (queryParams?.responsibleId) params.responsibleId = queryParams.responsibleId;
    if (queryParams?.status) params.status = queryParams.status;
    if (queryParams?.dateFrom) params.dateFrom = queryParams.dateFrom;
    if (queryParams?.dateTo) params.dateTo = queryParams.dateTo;

    const { data } = await siraApi.get<ApiResponse<CorrectiveActionItem[]>>(
      '/corrective-actions',
      { params },
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

export interface ClosedActionSummaryRow {
  readonly id: string;
  readonly detectionFolio: string;
  readonly walkthroughFolio: string;
  readonly detectionType: TourDetectionType;
  readonly description: string;
  readonly responsibleName: string;
  readonly companyName: string;
  readonly branchName: string;
  readonly areaName: string;
  readonly closedAt: string;
  readonly evidencePhotoUrl: string | null;
  readonly resolutionPhotoUrl: string | null;
}

export async function fetchClosedCorrectiveActions(
  queryParams?: ActionsQueryParams,
): Promise<ClosedActionSummaryRow[]> {
  try {
    const params: Record<string, string> = {};

    if (queryParams?.companyId) params.companyId = queryParams.companyId;
    if (queryParams?.areaId) params.areaId = queryParams.areaId;
    if (queryParams?.branchId) params.branchId = queryParams.branchId;
    if (queryParams?.responsibleId) params.responsibleId = queryParams.responsibleId;
    if (queryParams?.dateFrom) params.dateFrom = queryParams.dateFrom;
    if (queryParams?.dateTo) params.dateTo = queryParams.dateTo;

    const { data } = await siraApi.get<ApiResponse<ClosedActionSummaryRow[]>>(
      '/corrective-actions/closed',
      { params },
    );
    return data.data;
  } catch (error) {
    throw new Error(
      getActionsErrorMessage(
        error,
        'No se pudieron cargar las acciones cerradas.',
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
