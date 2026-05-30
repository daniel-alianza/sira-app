import axios from 'axios';
import { siraApi } from '@/api/sira-api';
import type {
  ApiResponse,
  RegisterFormData,
  RegisteredUser,
} from '../interfaces/register.interfaces';

function getRegisterErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'No se pudo completar el registro. Intenta de nuevo.';
  }

  const responseMessage = error.response?.data?.message;

  if (typeof responseMessage === 'string') {
    return responseMessage;
  }

  if (Array.isArray(responseMessage) && typeof responseMessage[0] === 'string') {
    return responseMessage[0];
  }

  return error.message || 'No se pudo completar el registro. Intenta de nuevo.';
}

export async function registerUser(
  payload: RegisterFormData,
): Promise<ApiResponse<RegisteredUser>> {
  try {
    const { data } = await siraApi.post<ApiResponse<RegisteredUser>>(
      '/auth/register',
      payload,
    );
    return data;
  } catch (error) {
    throw new Error(getRegisterErrorMessage(error), { cause: error });
  }
}
