import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  branch?: string;
  branchCode?: string;
  roleTitle?: string;
  userId?: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,

      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (isLoading) => set((state) => state.isLoading === isLoading ? state : { isLoading }),

      logout: () => set({ user: null, isLoading: false }),

      isAuthenticated: () => get().user !== null,

      hasPermission: (permission) => {
        const perms = get().user?.permissions;
        if (!perms) return false;
        if (perms.includes('*')) return true;
        return perms.includes(permission);
      },

      hasRole: (role) => {
        const roles = get().user?.roles;
        if (!roles) return false;
        return roles.includes(role) || roles.includes('admin');
      },
    }),
    {
      name: 'bni-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
