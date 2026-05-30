import axios from 'axios';
import { siraApi } from '@/api/sira-api';
import type {
  ApiResponse,
  LoginFormData,
  SessionUser,
} from '../interfaces/auth.interfaces';

function getAuthErrorMessage(error: unknown, fallback: string): string {
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

export async function loginUser(
  payload: LoginFormData,
): Promise<ApiResponse<SessionUser>> {
  try {
    const { data } = await siraApi.post<ApiResponse<SessionUser>>(
      '/auth/login',
      payload,
    );
    return data;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error, 'No se pudo iniciar sesión. Intenta de nuevo.'), {
      cause: error,
    });
  }
}

export async function logoutUser(): Promise<ApiResponse<null>> {
  try {
    const { data } = await siraApi.post<ApiResponse<null>>('/auth/logout');
    return data;
  } catch (error) {
    throw new Error(
      getAuthErrorMessage(error, 'No se pudo cerrar sesión. Intenta de nuevo.'),
      { cause: error },
    );
  }
}

export async function getCurrentUser(): Promise<SessionUser> {
  const { data } = await siraApi.get<ApiResponse<SessionUser>>('/auth/me');
  return data.data;
}
