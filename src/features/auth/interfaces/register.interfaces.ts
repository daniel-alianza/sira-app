export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  empresaId: string;
  sucursalId: string;
  areaId: string;
}

export type RegisterFormValues = RegisterFormData;

export interface RegisteredUser {
  id?: string;
  name: string;
  email: string;
  companyId: string;
  areaId: string;
  branchId: string;
  roleId?: string;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  error: string | null;
}

export type RegisterErrors = Partial<Record<keyof RegisterFormData, string>>;
export type RegisterTouched = Partial<Record<keyof RegisterFormData, boolean>>;
