export interface LoginFormData {
  email: string;
  password: string;
}

export interface SessionUserRole {
  id: string;
  name: string;
}

export interface SessionUserArea {
  id: string;
  name: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: SessionUserRole;
  area?: SessionUserArea;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  error: string | null;
}

export type FormErrors = Partial<Record<keyof LoginFormData, string>>;
export type FormTouched = Partial<Record<keyof LoginFormData, boolean>>;
