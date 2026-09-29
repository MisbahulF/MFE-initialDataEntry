import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, type AuthUser } from "@template/shared";
import { storage } from "../utils/sastStorage";
import { getMockAccount, type BniUserAccount } from "../utils/authAccounts";

/**
 * useAuth hook — Mode bypass lokal (mock authentication)
 * Tidak memerlukan koneksi ke backend API dan database untuk mempermudah testing tim.
 */
export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const logoutStore = useAuthStore((s) => s.logout);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const hasRole = useAuthStore((s) => s.hasRole);
  const navigate = useNavigate();

  // Helper untuk sinkronisasi state user dari mock account
  const setMockUserSession = useCallback(
    (account: BniUserAccount) => {
      const mockToken = `mock-bypass-token-${account.userId}-${Date.now()}`;
      storage.store("token", mockToken);
      storage.store("authenticated", "true");
      storage.remove("bypass_logged_out");

      const authUser: AuthUser = {
        id: account.id,
        userId: account.userId,
        name: account.name,
        email: `${account.userId.toLowerCase()}@bni.co.id`,
        roles: [account.role],
        permissions: ["*"],
        branch: account.branch,
        branchCode: account.branchCode,
        roleTitle: account.roleTitle,
      };

      setUser(authUser);
      return authUser;
    },
    [setUser]
  );

  // Inisialisasi: otomatis login default (SC70629) pada first load jika belum ada user dan belum logout manual
  useEffect(() => {
    const store = useAuthStore.getState();
    const isLoggedOut = storage.retrieve("bypass_logged_out") === "true";
    if (!store.user && !isLoggedOut) {
      const defaultAcc = getMockAccount("SC70629");
      setMockUserSession(defaultAcc);
    }
    if (store.isLoading) {
      store.setLoading(false);
    }
  }, [setMockUserSession]);

  const login = useCallback(
    async (userIdOrEmail?: string, _password?: string) => {
      setLoading(true);
      try {
        const account = getMockAccount(userIdOrEmail);
        setMockUserSession(account);

        const targetRoute = account.defaultRoute || "/initial-data-entry";
        navigate(targetRoute);
      } finally {
        setLoading(false);
      }
    },
    [navigate, setLoading, setMockUserSession]
  );

  const logout = useCallback(() => {
    storage.remove("token");
    storage.remove("authenticated");
    storage.remove("user");
    storage.store("bypass_logged_out", "true");
    logoutStore();
    navigate("/login");
  }, [navigate, logoutStore]);

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
    hasPermission,
    hasRole,
  };
};

export type { AuthUser as User };
