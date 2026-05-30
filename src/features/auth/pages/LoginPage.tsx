import { useIsMdUp } from '@/hooks/use-media-query';
import { useLoginForm } from '../hooks/useLoginForm';
import { AuthStyles } from '../components/AuthStyles';
import { authPageRootClass } from '../components/auth-form.classes';
import { BrandingPanel } from '../components/BrandingPanel';
import { DesktopForm } from '../components/DesktopForm';
import { MobileForm } from '../components/MobileForm';

export function LoginPage() {
  const form = useLoginForm();
  const isMdUp = useIsMdUp();

  return (
    <>
      <AuthStyles />
      <div className={authPageRootClass}>
        <BrandingPanel />
        {isMdUp ? <DesktopForm form={form} /> : <MobileForm form={form} />}
      </div>
    </>
  );
}
