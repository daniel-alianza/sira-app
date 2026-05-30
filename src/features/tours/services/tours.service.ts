import axios from 'axios';
import { siraApi } from '@/api/sira-api';
import type {
  ApiResponse,
  RegisterWalkthroughPayload,
  RegisterWalkthroughResult,
  TourCorrectiveActionRow,
  TourPeriod,
} from '../interfaces';

function getToursErrorMessage(error: unknown, fallback: string): string {
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

export async function fetchTourDetections(
  period: TourPeriod,
): Promise<TourCorrectiveActionRow[]> {
  const { data } = await siraApi.get<ApiResponse<TourCorrectiveActionRow[]>>(
    '/tours/detections',
    {
      params: { period },
    },
  );
  return data.data;
}

export async function registerWalkthrough(
  payload: RegisterWalkthroughPayload,
): Promise<RegisterWalkthroughResult> {
  try {
    const { data } = await siraApi.post<ApiResponse<RegisterWalkthroughResult>>(
      '/tours',
      payload,
    );
    return data.data;
  } catch (error) {
    throw new Error(
      getToursErrorMessage(error, 'No se pudo registrar el recorrido. Intenta de nuevo.'),
      { cause: error },
    );
  }
}
