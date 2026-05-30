import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2, User, Mail, Lock, Building2, Layers, LayoutDashboard } from 'lucide-react';
import { useCatalogSelectors } from '@/features/catalog/hooks/useCatalogSelectors';
import { BrandingHeader } from './BrandingHeader';
import { FormField } from './FormField';
import { SelectField } from './SelectField';
import { PasswordToggle } from './PasswordToggle';
import { authMobileInputClass, authMobileSheetClass, authSelectTriggerClass } from './auth-form.classes';
import type { UseRegisterFormReturn } from '../hooks/useRegisterForm';

interface MobileRegisterFormProps {
  form: UseRegisterFormReturn;
}

export function MobileRegisterForm({ form }: MobileRegisterFormProps) {
  const navigate = useNavigate();
  const {
    register, control, errors, touchedFields, isLoading,
    showPassword, showConfirmPassword,
    setShowPassword, setShowConfirmPassword,
    handleSubmit,
  } = form;

  const { data: catalog, isLoading: isCatalogLoading } = useCatalogSelectors();

  const firstError =
    touchedFields.name && errors.name
      ? errors.name.message
      : touchedFields.email && errors.email
        ? errors.email.message
        : touchedFields.password && errors.password
          ? errors.password.message
          : touchedFields.confirmPassword && errors.confirmPassword
            ? errors.confirmPassword.message
            : null;

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#0A2240] md:hidden">
      <div className="flex flex-1 flex-col items-center justify-end px-6 pb-0">
        <BrandingHeader variant="mobile" />
      </div>
      <div className={authMobileSheetClass}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            icon={User}
            type="text"
            register={register('name')}
            error={errors.name?.message}
            touched={touchedFields.name}
            disabled={isLoading}
            autoComplete="name"
            autoCapitalize="words"
            autoCorrect="off"
            aria-invalid={errors.name ? true : undefined}
            wrapperClassName="relative"
            iconClassName="left-4 h-5 w-5 text-[#888B8D]"
            inputClassName={cn(
              authMobileInputClass,
              'pl-12',
              errors.name && touchedFields.name
                ? 'bg-red-50 focus-visible:ring-red-400/20 focus-visible:border-red-400/30'
                : '',
            )}
            placeholder="Nombre completo"
          />

          <FormField
            icon={Mail}
            type="email"
            inputMode="email"
            register={register('email')}
            error={errors.email?.message}
            touched={touchedFields.email}
            disabled={isLoading}
            autoComplete="email"
            autoCapitalize="off"
            autoCorrect="off"
            aria-invalid={errors.email ? true : undefined}
            wrapperClassName="relative"
            iconClassName="left-4 h-5 w-5 text-[#888B8D]"
            inputClassName={cn(
              authMobileInputClass,
              'pl-12',
              errors.email && touchedFields.email
                ? 'bg-red-50 focus-visible:ring-red-400/20 focus-visible:border-red-400/30'
                : '',
            )}
            placeholder="Correo electrónico"
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
              triggerClassName={cn(authSelectTriggerClass, 'py-4 pl-12 text-[15px]')}
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
              triggerClassName={cn(authSelectTriggerClass, 'py-4 pl-12 text-[15px]')}
            options={catalog?.branches}
            optionsLoading={isCatalogLoading}
          />

          <SelectField
            name="areaId"
            control={control}
            icon={LayoutDashboard}
            label="Área"
            placeholder={isCatalogLoading ? 'Cargando...' : 'Selecciona un área'}
            error={errors.areaId?.message}
            touched={touchedFields.areaId}
            disabled={isLoading}
              triggerClassName={cn(authSelectTriggerClass, 'py-4 pl-12 text-[15px]')}
            options={catalog?.areas}
            optionsLoading={isCatalogLoading}
          />

          <FormField
            icon={Lock}
            type={showPassword ? 'text' : 'password'}
            register={register('password')}
            error={errors.password?.message}
            touched={touchedFields.password}
            disabled={isLoading}
            autoComplete="new-password"
            aria-invalid={errors.password ? true : undefined}
            wrapperClassName="relative"
            iconClassName="left-4 h-5 w-5 text-[#888B8D]"
            inputClassName={cn(
              authMobileInputClass,
              'pl-12 pr-12',
              errors.password && touchedFields.password
                ? 'bg-red-50 focus-visible:ring-red-400/20 focus-visible:border-red-400/30'
                : '',
            )}
            placeholder="Contraseña"
            suffix={
              <PasswordToggle
                showPassword={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                className="right-3 rounded-xl p-2 text-[#888B8D]/70 active:text-[#FF4D00] active:bg-black/5 transition-colors duration-200"
              />
            }
          />

          <FormField
            icon={Lock}
            type={showConfirmPassword ? 'text' : 'password'}
            register={register('confirmPassword')}
            error={errors.confirmPassword?.message}
            touched={touchedFields.confirmPassword}
            disabled={isLoading}
            autoComplete="new-password"
            aria-invalid={errors.confirmPassword ? true : undefined}
            wrapperClassName="relative"
            iconClassName="left-4 h-5 w-5 text-[#888B8D]"
            inputClassName={cn(
              authMobileInputClass,
              'pl-12 pr-12',
              errors.confirmPassword && touchedFields.confirmPassword
                ? 'bg-red-50 focus-visible:ring-red-400/20 focus-visible:border-red-400/30'
                : '',
            )}
            placeholder="Confirmar contraseña"
            suffix={
              <PasswordToggle
                showPassword={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                className="right-3 rounded-xl p-2 text-[#888B8D]/70 active:text-[#FF4D00] active:bg-black/5 transition-colors duration-200"
              />
            }
          />

          {firstError && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-500">
              {firstError}
            </p>
          )}

          <div className="pt-2 space-y-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="h-auto w-full cursor-pointer rounded-xl bg-[#FF4D00] py-4 text-center text-[16px] font-semibold text-white shadow-lg shadow-[#FF4D00]/25 transition-all duration-200 ease-out active:scale-[0.98] active:shadow-md disabled:opacity-50 disabled:active:scale-100 select-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2.5">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creando cuenta...
                </span>
              ) : (
                'Crear cuenta'
              )}
            </Button>
            <p className="text-center text-xs text-[#888B8D]/70">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => navigate('/login')}
                className="cursor-pointer font-medium text-[#FF4D00] transition-colors hover:text-[#FF4D00]/80 focus:outline-none"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
