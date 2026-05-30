import type { ReactNode } from 'react';
import { useAuthHydration } from '@/features/auth/hooks/useAuthHydration';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  useAuthHydration();
  return children;
}
