import { useState } from 'react';
import { useNavigate } from 'react-router';
import { logoutUser } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';

export interface UseLogoutReturn {
  logout: () => Promise<void>;
  isLoggingOut: boolean;
}

export function useLogout(): UseLogoutReturn {
  const navigate = useNavigate();
  const clearSession = useAuthStore((state) => state.clearSession);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);

    try {
      await logoutUser();
    } catch {
      // Limpia la sesión local aunque falle la red; la cookie se invalida cuando el API responde.
    } finally {
      clearSession();
      navigate('/login', { replace: true });
      setIsLoggingOut(false);
    }
  }

  return { logout, isLoggingOut };
}
