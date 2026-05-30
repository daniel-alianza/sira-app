import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Lock } from 'lucide-react';
import { FormField } from './FormField';
import { PasswordToggle } from './PasswordToggle';
import {
  authDesktopInputClass,
  authFooterTextClass,
  authFormPanelClass,
  authFormPanelDecorClass,
  authHeadingClass,
  authSubheadingClass,
} from './auth-form.classes';
import type { UseLoginFormReturn } from '../hooks/useLoginForm';

interface DesktopFormProps {
  form: UseLoginFormReturn;
}

export function DesktopForm({ form }: DesktopFormProps) {
  const navigate = useNavigate();
  const {
    register, errors, touchedFields, isLoading,
    showPassword, setShowPassword,
    handleSubmit,
  } = form;

  return (
    <div
      className={cn(
        'hidden h-dvh w-full items-center justify-center md:flex md:w-[58%] lg:w-[55%] xl:w-[52%]',
        authFormPanelClass,
      )}
    >
      <div className={authFormPanelDecorClass} aria-hidden>
        <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-[#FF4D00]/[0.07]" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#00C4B3]/[0.08]" />
      </div>
      <div className="relative z-10 w-full max-w-[440px] px-8">
        <div className="animate-scale-in mb-8">
          <h1 className={authHeadingClass}>Inicia sesión</h1>
          <p className={authSubheadingClass}>
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            containerClassName="animate-fade-in stagger-1"
            wrapperClassName="group"
            iconClassName="left-3.5 text-[#888B8D]/60 group-focus-within:text-[#FF4D00]"
            inputClassName={cn(
              authDesktopInputClass,
              errors.email && touchedFields.email
                ? 'border-red-300/60 bg-red-50/90 focus-visible:border-red-400/40 focus-visible:ring-red-400/15'
                : '',
            )}
            placeholder="tu@correo.com"
          />

          <FormField
            icon={Lock}
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            register={register('password')}
            error={errors.password?.message}
            touched={touchedFields.password}
            disabled={isLoading}
            autoComplete="current-password"
            aria-invalid={errors.password ? true : undefined}
            containerClassName="animate-fade-in stagger-2"
            wrapperClassName="group"
            iconClassName="left-3.5 text-[#888B8D]/60 group-focus-within:text-[#FF4D00]"
            inputClassName={cn(
              authDesktopInputClass,
              'pl-10 pr-11',
              errors.password && touchedFields.password
                ? 'border-red-300/60 bg-red-50/90 focus-visible:border-red-400/40 focus-visible:ring-red-400/15'
                : '',
            )}
            placeholder="••••••••"
            suffix={
              <PasswordToggle
                showPassword={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                className="right-2.5 rounded-lg p-1.5 text-[#888B8D]/50 hover:text-[#FF4D00] hover:bg-black/5 focus:outline-none transition-colors duration-200"
              />
            }
          />

          <div className="animate-fade-in stagger-3 pt-1 space-y-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="h-auto w-full cursor-pointer rounded-xl bg-[#FF4D00] py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF4D00]/20 transition-all duration-200 ease-out hover:bg-[#FF4D00]/90 hover:shadow-xl hover:shadow-[#FF4D00]/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg disabled:active:scale-100 focus-visible:ring-2 focus-visible:ring-[#FF4D00]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFBFD]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Ingresando...
                </span>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
            <p className={authFooterTextClass}>
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => navigate('/register')}
                className="cursor-pointer font-semibold text-[#FF4D00] transition-colors hover:text-[#FF4D00]/80 focus:outline-none focus:underline"
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
