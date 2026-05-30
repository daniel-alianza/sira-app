import type { ReactNode } from 'react';
import { AuthRouteGuard } from '@/router/AuthRouteGuard';

interface GuestRouteProps {
  children: ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  return <AuthRouteGuard mode='guest'>{children}</AuthRouteGuard>;
}
