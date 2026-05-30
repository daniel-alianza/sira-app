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

export async function fetchMyCorrectiveActions(): Promise<CorrectiveActionItem[]> {
  try {
    const { data } = await siraApi.get<ApiResponse<CorrectiveActionItem[]>>(
      '/corrective-actions',
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
