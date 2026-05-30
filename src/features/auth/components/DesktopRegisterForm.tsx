import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2, User, Mail, Lock, Building2, Layers, LayoutDashboard } from 'lucide-react';
import { useCatalogSelectors } from '@/features/catalog/hooks/useCatalogSelectors';
import { FormField } from './FormField';
import { SelectField } from './SelectField';
import { PasswordToggle } from './PasswordToggle';
import {
  authDesktopInputClass,
  authFormPanelClass,
  authFormPanelDecorClass,
  authHeadingClass,
  authSelectTriggerClass,
  authSubheadingClass,
} from './auth-form.classes';
import type { UseRegisterFormReturn } from '../hooks/useRegisterForm';

interface DesktopRegisterFormProps {
  form: UseRegisterFormReturn;
}

export function DesktopRegisterForm({ form }: DesktopRegisterFormProps) {
  const navigate = useNavigate();
  const {
    register, control, errors, touchedFields, isLoading,
    showPassword, showConfirmPassword,
    setShowPassword, setShowConfirmPassword,
    handleSubmit,
  } = form;

  const { data: catalog, isLoading: isCatalogLoading } = useCatalogSelectors();

  const withError = (field: 'name' | 'email' | 'password' | 'confirmPassword') =>
    errors[field] && touchedFields[field]
      ? 'border-red-300/60 bg-red-50/90 focus-visible:border-red-400/40 focus-visible:ring-red-400/15'
      : '';

  return (
    <div
      className={cn(
        'hidden h-dvh w-full items-center justify-center overflow-y-auto md:flex md:w-[58%] lg:w-[55%] xl:w-[52%]',
        authFormPanelClass,
      )}
    >
      <div className={authFormPanelDecorClass} aria-hidden>
        <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-[#FF4D00]/[0.07]" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#00C4B3]/[0.08]" />
      </div>
      <div className="relative z-10 w-full max-w-[560px] px-8 py-10">
        <div className="animate-scale-in mb-8">
          <h1 className={authHeadingClass}>Crear cuenta</h1>
          <p className={authSubheadingClass}>
            Completa tus datos para registrarte en el sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            <FormField
              icon={User}
              label="Nombre completo"
              type="text"
              register={register('name')}
              error={errors.name?.message}
              touched={touchedFields.name}
              disabled={isLoading}
              autoComplete="name"
              autoCapitalize="words"
              autoCorrect="off"
              aria-invalid={errors.name ? true : undefined}
              containerClassName="animate-fade-in stagger-1"
              wrapperClassName="group"
              iconClassName="left-3.5 text-[#888B8D]/60 group-focus-within:text-[#FF4D00]"
              inputClassName={cn(authDesktopInputClass, withError('name'))}
              placeholder="Tu nombre completo"
            />

            <FormField
              icon={Mail}
              label="Correo electrónico"
              type="email"
              register={register('email')}
              error={errors.email?.message}
              touched={touchedFields.email}
              disabled={isLoading}
              autoComplete="email"
              autoCapitalize="off"
              autoCorrect="off"
              aria-invalid={errors.email ? true : undefined}
              containerClassName="animate-fade-in stagger-2"
              wrapperClassName="group"
              iconClassName="left-3.5 text-[#888B8D]/60 group-focus-within:text-[#FF4D00]"
              inputClassName={cn(authDesktopInputClass, withError('email'))}
              placeholder="tu@correo.com"
            />

            <SelectField
              name="empresaId"
              control={control}
              icon={Building2}
              label="Empresa"
              placeholder={isCatalogLoading ? 'Cargando...' : 'Selecciona una empresa'}
              error={errors.empresaId?.message}
              touched={touchedFields.empresaId}
              disabled={isLoading}
              triggerClassName={cn(authSelectTriggerClass, 'pl-10')}
              options={catalog?.companies}
              optionsLoading={isCatalogLoading}
            />

            <SelectField
              name="sucursalId"
              control={control}
              icon={Layers}
              label="Sucursal"
              placeholder={isCatalogLoading ? 'Cargando...' : 'Selecciona una sucursal'}
              error={errors.sucursalId?.message}
              touched={touchedFields.sucursalId}
              disabled={isLoading}
              triggerClassName={cn(authSelectTriggerClass, 'pl-10')}
              options={catalog?.branches}
              optionsLoading={isCatalogLoading}
            />

            <div className="col-span-2">
              <SelectField
                name="areaId"
                control={control}
                icon={LayoutDashboard}
                label="Área"
                placeholder={isCatalogLoading ? 'Cargando...' : 'Selecciona un área'}
                error={errors.areaId?.message}
                touched={touchedFields.areaId}
                disabled={isLoading}
                triggerClassName={cn(authSelectTriggerClass, 'pl-10')}
                options={catalog?.areas}
                optionsLoading={isCatalogLoading}
              />
            </div>

            <FormField
              icon={Lock}
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              register={register('password')}
              error={errors.password?.message}
              touched={touchedFields.password}
              disabled={isLoading}
              autoComplete="new-password"
              aria-invalid={errors.password ? true : undefined}
              containerClassName="animate-fade-in"
              wrapperClassName="group"
              iconClassName="left-3.5 text-[#888B8D]/60 group-focus-within:text-[#FF4D00]"
              inputClassName={cn(authDesktopInputClass, 'pl-10 pr-11', withError('password'))}
              placeholder="••••••••"
              suffix={
                <PasswordToggle
                  showPassword={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                  className="right-2.5 rounded-lg p-1.5 text-[#888B8D]/50 hover:text-[#FF4D00] hover:bg-black/5 focus:outline-none transition-colors duration-200"
                />
              }
            />

            <FormField
              icon={Lock}
              label="Confirmar contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              register={register('confirmPassword')}
              error={errors.confirmPassword?.message}
              touched={touchedFields.confirmPassword}
              disabled={isLoading}
              autoComplete="new-password"
              aria-invalid={errors.confirmPassword ? true : undefined}
              containerClassName="animate-fade-in"
              wrapperClassName="group"
              iconClassName="left-3.5 text-[#888B8D]/60 group-focus-within:text-[#FF4D00]"
              inputClassName={cn(authDesktopInputClass, 'pl-10 pr-11', withError('confirmPassword'))}
              placeholder="••••••••"
              suffix={
                <PasswordToggle
                  showPassword={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="right-2.5 rounded-lg p-1.5 text-[#888B8D]/50 hover:text-[#FF4D00] hover:bg-black/5 focus:outline-none transition-colors duration-200"
                />
              }
            />
          </div>

          <div className="animate-fade-in pt-2 space-y-4">
            <div className="grid grid-cols-2 gap-x-5">
              <Button
                type="submit"
                disabled={isLoading}
                className="h-auto w-full cursor-pointer rounded-xl bg-[#FF4D00] py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF4D00]/20 transition-all duration-200 ease-out hover:bg-[#FF4D00]/90 hover:shadow-xl hover:shadow-[#FF4D00]/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg disabled:active:scale-100 focus-visible:ring-2 focus-visible:ring-[#FF4D00]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFBFD]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Creando...
                  </span>
                ) : (
                  'Crear cuenta'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => navigate('/login')}
                className="h-auto w-full cursor-pointer rounded-xl border border-[#0A2240]/10 bg-transparent py-3 text-sm font-semibold text-[#0A2240]/70 transition-all duration-200 hover:bg-[#0A2240]/5 hover:text-[#0A2240] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
              >
                Inicia sesión
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
