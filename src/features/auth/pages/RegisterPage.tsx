import { useIsMdUp } from '@/hooks/use-media-query';
import { useRegisterForm } from '../hooks/useRegisterForm';
import { AuthStyles } from '../components/AuthStyles';
import { authPageRootClass } from '../components/auth-form.classes';
import { BrandingPanel } from '../components/BrandingPanel';
import { DesktopRegisterForm } from '../components/DesktopRegisterForm';
import { MobileRegisterForm } from '../components/MobileRegisterForm';

export function RegisterPage() {
  const form = useRegisterForm();
  const isMdUp = useIsMdUp();

  return (
    <>
      <AuthStyles />
      <div className={authPageRootClass}>
        <BrandingPanel />
        {isMdUp ? (
          <DesktopRegisterForm form={form} />
        ) : (
          <MobileRegisterForm form={form} />
        )}
      </div>
    </>
  );
}
