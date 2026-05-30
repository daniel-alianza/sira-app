import axios from 'axios';
import { siraApi } from '@/api/sira-api';
import type {
  ApiResponse,
  DashboardAiSummary,
  DashboardOverview,
  DashboardQueryParams,
} from '../interfaces';

function getDashboardErrorMessage(error: unknown, fallback: string): string {
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

export async function fetchDashboardOverview(
  params: DashboardQueryParams,
): Promise<DashboardOverview> {
  try {
    const { data } = await siraApi.get<ApiResponse<DashboardOverview>>(
      '/dashboard/overview',
      { params },
    );
    return data.data;
  } catch (error) {
    throw new Error(
      getDashboardErrorMessage(
        error,
        'No se pudo cargar el dashboard. Intenta de nuevo.',
      ),
      { cause: error },
    );
  }
}

export interface FetchDashboardAiSummaryOptions {
  readonly refresh?: boolean;
}

export async function fetchDashboardAiSummary(
  params: DashboardQueryParams,
  options?: FetchDashboardAiSummaryOptions,
): Promise<DashboardAiSummary> {
  try {
    const { data } = await siraApi.get<ApiResponse<DashboardAiSummary>>(
      '/ia/dashboard-summary',
      {
        params: {
          ...params,
          ...(options?.refresh ? { refresh: 'true' } : {}),
        },
      },
    );
    return data.data;
  } catch (error) {
    throw new Error(
      getDashboardErrorMessage(
        error,
        'No se pudo generar el resumen de IA. Intenta de nuevo.',
      ),
      { cause: error },
    );
  }
}
