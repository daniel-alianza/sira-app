import { useEffect } from 'react';
import { getCurrentUser } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';

export function useAuthHydration(): void {
  const setUser = useAuthStore((state) => state.setUser);
  const setHydrating = useAuthStore((state) => state.setHydrating);

  useEffect(() => {
    let isMounted = true;

    async function hydrateSession() {
      try {
        const user = await getCurrentUser();
        if (isMounted) {
          setUser(user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setHydrating(false);
        }
      }
    }

    hydrateSession();

    return () => {
      isMounted = false;
    };
  }, [setHydrating, setUser]);
}
