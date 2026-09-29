import { useAuthStore } from '../stores/useAuthStore';

/**
 * Hook auth — sekarang langsung dari Zustand store,
 * tidak perlu SharedContext/Provider lagi.
 */
export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const logoutStore = useAuthStore((s) => s.logout);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const hasRole = useAuthStore((s) => s.hasRole);

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    setUser,
    setLoading,
    logout: logoutStore,
    hasPermission,
    hasRole,
  };
};
