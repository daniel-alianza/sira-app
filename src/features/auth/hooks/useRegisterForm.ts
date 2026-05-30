import { useState } from 'react';
import type { BaseSyntheticEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { registerUser } from '../services/register.service';

const registerSchema = z
  .object({
    name: z.string().min(1, 'El nombre es requerido').min(2, 'Mínimo 2 caracteres'),
    email: z.string().min(1, 'El correo electrónico es requerido').email('Ingresa un correo válido'),
    password: z.string().min(1, 'La contraseña es requerida').min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
    empresaId: z.string().min(1, 'Selecciona una empresa'),
    sucursalId: z.string().min(1, 'Selecciona una sucursal'),
    areaId: z.string().min(1, 'Selecciona un área'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.output<typeof registerSchema>;

export interface UseRegisterFormReturn {
  register: ReturnType<typeof useForm<RegisterFormValues>>['register'];
  control: ReturnType<typeof useForm<RegisterFormValues>>['control'];
  errors: ReturnType<typeof useForm<RegisterFormValues>>['formState']['errors'];
  touchedFields: ReturnType<typeof useForm<RegisterFormValues>>['formState']['touchedFields'];
  isLoading: boolean;
  submitError: string | null;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setShowPassword: (value: boolean) => void;
  setShowConfirmPassword: (value: boolean) => void;
  handleSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
}

export function useRegisterForm(): UseRegisterFormReturn {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      empresaId: '',
      sucursalId: '',
      areaId: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitError(null);
    setIsLoading(true);

    try {
      await registerUser(values);
      navigate('/login');
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'No se pudo completar el registro. Intenta de nuevo.',
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
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handleSubmit: handleSubmit(onSubmit),
  };
}
