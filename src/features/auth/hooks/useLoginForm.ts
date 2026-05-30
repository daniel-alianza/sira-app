import { useState } from 'react';
import type { BaseSyntheticEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { loginUser } from '../services/auth.service';
import { getHomePathForRole } from '../utils/role-permissions';
import { useAuthStore } from '../store/auth.store';

const loginSchema = z.object({
  email: z.string().min(1, 'El correo electrónico es requerido').email('Ingresa un correo válido'),
  password: z.string().min(1, 'La contraseña es requerida').min(6, 'Mínimo 6 caracteres'),
});

type LoginFormValues = z.output<typeof loginSchema>;

export interface UseLoginFormReturn {
  register: ReturnType<typeof useForm<LoginFormValues>>['register'];
  control: ReturnType<typeof useForm<LoginFormValues>>['control'];
  errors: ReturnType<typeof useForm<LoginFormValues>>['formState']['errors'];
  touchedFields: ReturnType<typeof useForm<LoginFormValues>>['formState']['touchedFields'];
  isLoading: boolean;
  submitError: string | null;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  handleSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
}

export function useLoginForm(): UseLoginFormReturn {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null);
    setIsLoading(true);

    try {
      const response = await loginUser(values);
      setUser(response.data);
      navigate(getHomePathForRole(response.data.role?.name));
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'No se pudo iniciar sesión. Intenta de nuevo.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    control,
    errors,
    touchedFields,
    isLoading,
    submitError,
    showPassword,
    setShowPassword,
    handleSubmit: handleSubmit(onSubmit),
  };
}
