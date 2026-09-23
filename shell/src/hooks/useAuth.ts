import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, type AuthUser, getApiUrl } from "@template/shared";
import { storage } from "../utils/sastStorage";

/**
 * useAuth hook — Mengelola autentikasi pengguna secara riil terhubung ke API backend.
 * Autentikasi terhubung langsung ke API server.
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

  // Inisialisasi: pastikan loading diselesaikan hanya sekali saat mount
  useEffect(() => {
    if (useAuthStore.getState().isLoading) {
      useAuthStore.getState().setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const authApiUrl = getApiUrl("auth");
        const response = await fetch(`${authApiUrl}/Auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          const err: any = new Error(
            errData?.message ||
              `Login gagal (${response.status}: ${response.statusText})`
          );
          err.status = response.status;
          throw err;
        }

        const data = await response.json();
        const token = data.token || data.Token;
        if (!token) {
          throw new Error("Respon server tidak menyertakan token otentikasi.");
        }

        storage.store("token", token);
        storage.store("authenticated", "true");

        // Ambil profil user dari endpoint riil
        let authUser: AuthUser;
        const profileRes = await fetch(`${authApiUrl}/Auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).catch(() => null);

        if (profileRes && profileRes.ok) {
          const p = await profileRes.json();
          authUser = {
            id: p.id || p.userId || email,
            email: p.email || email,
            name: p.name || email,
            roles: Array.isArray(p.roles) ? p.roles : [p.role || "user"],
            permissions: p.permissions || [],
            branch: p.branch || "",
            branchCode: p.branchCode || "",
            roleTitle: p.roleTitle || "",
            userId: p.userId || email,
          };
        } else {
          // Fallback ke data payload login jika endpoint terpisah tidak disediakan
          authUser = {
            id: data.id || data.userId || email,
            email: data.email || email,
            name: data.name || email,
            roles: Array.isArray(data.roles) ? data.roles : [data.role || "user"],
            permissions: data.permissions || [],
            branch: data.branch || "",
            branchCode: data.branchCode || "",
            roleTitle: data.roleTitle || "",
            userId: data.userId || email,
          };
        }

        setUser(authUser);

        // Arahkan ke rute berdasarkan role riil
        const primaryRole = (authUser.roles?.[0] || "").toLowerCase();
        let targetRoute = "/initial-data-entry";
        if (
          primaryRole.includes("de") ||
          primaryRole.includes("entry") ||
          primaryRole.includes("processing")
        ) {
          targetRoute = "/data-entry";
        } else if (primaryRole.includes("ca")) {
          targetRoute = "/credit-analyst";
        }

        navigate(targetRoute);
      } finally {
        setLoading(false);
      }
    },
    [navigate, setLoading, setUser]
  );

  const logout = useCallback(() => {
    storage.remove("token");
    storage.remove("authenticated");
    storage.remove("user");
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
