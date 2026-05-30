import axios from 'axios';
import { siraApi } from '@/api/sira-api';
import type { ApiResponse, ReportsPreview, ReportsQueryParams } from '../interfaces';

function getReportsErrorMessage(error: unknown, fallback: string): string {
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

export async function fetchReportsPreview(
  params: ReportsQueryParams,
): Promise<ReportsPreview> {
  try {
    const { data } = await siraApi.get<ApiResponse<ReportsPreview>>(
      '/reports/preview',
      { params },
    );
    return data.data;
  } catch (error) {
    throw new Error(
      getReportsErrorMessage(
        error,
        'No se pudo cargar la vista previa de reportes.',
      ),
      { cause: error },
    );
  }
}

export async function downloadReportsWorkbook(
  params: ReportsQueryParams,
): Promise<{ readonly blob: Blob; readonly fileName: string }> {
  try {
    const response = await siraApi.get<Blob>('/reports/export', {
      params,
      responseType: 'blob',
    });

    const disposition = response.headers['content-disposition'];
    const fileNameMatch =
      typeof disposition === 'string'
        ? disposition.match(/filename="([^"]+)"/)
        : null;
    const fileName = fileNameMatch?.[1] ?? 'SIRA_Reportes.xlsx';

    return {
      blob: response.data,
      fileName,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const parsed = JSON.parse(text) as { message?: string };
        if (typeof parsed.message === 'string') {
          throw new Error(parsed.message, { cause: error });
        }
      } catch {
        // fall through
      }
    }

    throw new Error(
      getReportsErrorMessage(error, 'No se pudo descargar el reporte Excel.'),
      { cause: error },
    );
  }
}
