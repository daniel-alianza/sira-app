import { create } from 'zustand';
import type { SessionUser } from '../interfaces/auth.interfaces';

interface AuthState {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  setUser: (user: SessionUser | null) => void;
  setHydrating: (isHydrating: boolean) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrating: true,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
    }),
  setHydrating: (isHydrating) => set({ isHydrating }),
  clearSession: () =>
    set({
      user: null,
      isAuthenticated: false,
      isHydrating: false,
    }),
}));
