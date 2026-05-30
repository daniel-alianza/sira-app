import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  dashboardButtonPrimary,
  dashboardCard,
  dashboardHeadingClass,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import { userFormSchema } from '../interfaces';
import type { UserFormValues, UserModalProps } from '../interfaces';
import {
  toCatalogSelectOptions,
  withSelectedCatalogOption,
} from '../utils/catalog-select-options';

export function UserModal({
  mode,
  user,
  open,
  onClose,
  catalog,
  roles,
  onSubmit,
}: UserModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const defaultValues: UserFormValues = useMemo(
    () => ({
      mode,
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
      isActive: user?.isActive ?? true,
      companyId: user?.company?.id ?? '',
      areaId: user?.area?.id ?? '',
      branchId: user?.branch?.id ?? '',
      roleId: user?.role?.id ?? '',
    }),
    [mode, user],
  );

  const companyItems = useMemo(
    () =>
      withSelectedCatalogOption(
        toCatalogSelectOptions(catalog.companies),
        user?.company?.id ?? '',
        user?.company?.name,
      ),
    [catalog.companies, user?.company?.id, user?.company?.name],
  );

  const branchItems = useMemo(
    () =>
      withSelectedCatalogOption(
        toCatalogSelectOptions(catalog.branches),
        user?.branch?.id ?? '',
        user?.branch?.name,
      ),
    [catalog.branches, user?.branch?.id, user?.branch?.name],
  );

  const areaItems = useMemo(
    () =>
      withSelectedCatalogOption(
        toCatalogSelectOptions(catalog.areas),
        user?.area?.id ?? '',
        user?.area?.name,
      ),
    [catalog.areas, user?.area?.id, user?.area?.name],
  );

  const roleItems = useMemo(
    () =>
      withSelectedCatalogOption(
        toCatalogSelectOptions(roles),
        user?.role?.id ?? '',
        user?.role?.name,
      ),
    [roles, user?.role?.id, user?.role?.name],
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      setApiError(null);
    }
  }, [open, defaultValues, reset]);

  const handleFormSubmit = useCallback(
    async (values: UserFormValues) => {
      setApiError(null);
      try {
        await onSubmit(values);
        onClose();
      } catch (err: unknown) {
        if (err instanceof Error) {
          setApiError(err.message);
        } else {
          setApiError('Ocurrió un error inesperado');
        }
      }
    },
    [onSubmit, onClose],
  );

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2240]/40 p-4 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={cn(
          dashboardCard('relative w-full max-w-lg overflow-hidden p-0'),
          'animate-in fade-in-0 slide-in-from-bottom-4 zoom-in-95 duration-200',
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200/90 bg-slate-50/80 px-6 py-4">
          <div>
            <h2 className={cn(dashboardHeadingClass, 'text-lg')}>
              {mode === 'create' ? 'Nuevo usuario' : 'Editar usuario'}
            </h2>
            <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
              {mode === 'create'
                ? 'Completa los datos para registrar un usuario'
                : 'Actualiza la información del usuario'}
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Cerrar">
            <X className="size-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="max-h-[60vh] space-y-5 overflow-y-auto px-6 py-5">
            {apiError && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertTriangle className="size-4 shrink-0" />
                {apiError}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Nombre completo"
                {...register('name')}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                {...register('email')}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">
                Contraseña{' '}
                {mode === 'edit' && (
                  <span className="font-normal text-muted-foreground">
                    (dejar vacío para mantener)
                  </span>
                )}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={mode === 'create' ? 'Contraseña' : 'Nueva contraseña'}
                {...register('password')}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-4 rounded-xl border border-slate-200/90 bg-slate-50/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Organización
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="companyId">Compañía</Label>
                  <Controller
                    name="companyId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        items={companyItems}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar compañía" />
                        </SelectTrigger>
                        <SelectContent>
                          {companyItems.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.companyId && (
                    <p className="text-xs text-destructive">{errors.companyId.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="branchId">Sucursal</Label>
                  <Controller
                    name="branchId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        items={branchItems}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar sucursal" />
                        </SelectTrigger>
                        <SelectContent>
                          {branchItems.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.branchId && (
                    <p className="text-xs text-destructive">{errors.branchId.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="areaId">Área</Label>
                  <Controller
                    name="areaId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        items={areaItems}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar área" />
                        </SelectTrigger>
                        <SelectContent>
                          {areaItems.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.areaId && (
                    <p className="text-xs text-destructive">{errors.areaId.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="roleId">Rol</Label>
                  <Controller
                    name="roleId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        items={roleItems}
                        onValueChange={field.onChange}
                        disabled={roleItems.length === 0}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              roleItems.length > 0
                                ? 'Seleccionar rol'
                                : 'Sin roles disponibles'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {roleItems.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.roleId && (
                    <p className="text-xs text-destructive">{errors.roleId.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200/90 px-4 py-3">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={field.value}
                      onClick={() => field.onChange(!field.value)}
                      className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                        field.value ? 'bg-primary' : 'bg-input',
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200',
                          field.value ? 'translate-x-5' : 'translate-x-0',
                        )}
                      />
                    </button>
                    <Label
                      className="cursor-pointer"
                      onClick={() => field.onChange(!field.value)}
                    >
                      Usuario activo
                    </Label>
                  </>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-200/90 bg-slate-50/50 px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(dashboardButtonPrimary(), 'disabled:opacity-50')}
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {mode === 'create' ? 'Crear usuario' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
