import axios from 'axios';
import { siraApi } from '@/api/sira-api';
import type {
  ApiResponse,
  ApiUserPublic,
  UpdateUserRequest,
  UserFormValues,
} from '../interfaces';

function getUsersErrorMessage(error: unknown, fallback: string): string {
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

export async function getUsers(): Promise<ApiUserPublic[]> {
  const { data } = await siraApi.get<ApiResponse<ApiUserPublic[]>>('/users');
  return data.data;
}

export async function updateUser(
  id: string,
  payload: UpdateUserRequest,
): Promise<ApiUserPublic> {
  try {
    const { data } = await siraApi.patch<ApiResponse<ApiUserPublic>>(
      `/users/${id}`,
      payload,
    );
    return data.data;
  } catch (error) {
    throw new Error(
      getUsersErrorMessage(error, 'No se pudo actualizar el usuario. Intenta de nuevo.'),
      { cause: error },
    );
  }
}

export async function createUser(values: UserFormValues): Promise<ApiUserPublic> {
  try {
    const { data } = await siraApi.post<ApiResponse<ApiUserPublic>>(
      '/auth/register',
      {
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.password,
        empresaId: values.companyId,
        sucursalId: values.branchId,
        areaId: values.areaId,
        roleId: values.roleId,
      },
    );
    return data.data;
  } catch (error) {
    throw new Error(
      getUsersErrorMessage(error, 'No se pudo crear el usuario. Intenta de nuevo.'),
      { cause: error },
    );
  }
}

export function buildUpdateUserPayload(values: UserFormValues): UpdateUserRequest {
  return {
    name: values.name,
    email: values.email,
    empresaId: values.companyId,
    sucursalId: values.branchId,
    areaId: values.areaId,
    roleId: values.roleId,
    isActive: values.isActive,
    ...(values.password ? { password: values.password } : {}),
  };
}
