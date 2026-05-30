import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Lock } from 'lucide-react';
import { BrandingHeader } from './BrandingHeader';
import { FormField } from './FormField';
import { PasswordToggle } from './PasswordToggle';
import { authFooterTextClass, authMobileInputClass, authMobileSheetClass } from './auth-form.classes';
import type { UseLoginFormReturn } from '../hooks/useLoginForm';

interface MobileFormProps {
  form: UseLoginFormReturn;
}

export function MobileForm({ form }: MobileFormProps) {
  const navigate = useNavigate();
  const {
    register, errors, touchedFields, isLoading,
    showPassword, setShowPassword,
    handleSubmit,
  } = form;

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#0A2240] md:hidden">
      <div className="flex flex-1 flex-col items-center justify-end px-6 pb-0">
        <BrandingHeader variant="mobile" />
      </div>
      <div className={authMobileSheetClass}>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              errors.email && touchedFields.email
                ? 'border-red-300/60 bg-red-50/90 focus-visible:ring-red-400/15 focus-visible:border-red-400/40'
                : '',
            )}
            placeholder="Correo electrónico"
          />

          <FormField
            icon={Lock}
            type={showPassword ? 'text' : 'password'}
            register={register('password')}
            error={errors.password?.message}
            touched={touchedFields.password}
            disabled={isLoading}
            autoComplete="current-password"
            aria-invalid={errors.password ? true : undefined}
            wrapperClassName="relative"
            iconClassName="left-4 h-5 w-5 text-[#888B8D]"
            inputClassName={cn(
              authMobileInputClass,
              errors.password && touchedFields.password
                ? 'border-red-300/60 bg-red-50/90 focus-visible:ring-red-400/15 focus-visible:border-red-400/40'
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

          {touchedFields.email && errors.email && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
          {touchedFields.password && errors.password && !errors.email && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-500">
              {errors.password.message}
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
                  Ingresando...
                </span>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
            <p className={cn(authFooterTextClass, 'text-xs')}>
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => navigate('/register')}
                className="cursor-pointer font-medium text-[#FF4D00] transition-colors hover:text-[#FF4D00]/80 focus:outline-none"
              >
                Regístrate
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
