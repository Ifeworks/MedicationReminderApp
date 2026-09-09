import React, { createContext, useContext, useEffect, useState } from "react";
import type { AdminUser } from "../types";
import { authService } from "../services/auth";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  loading: boolean;
  login: (identifier: string, pass: string, remember?: boolean) => Promise<AdminUser>;
  logout: () => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await authService.getSession();
        if (session) {
          setCurrentUser(session.user);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkSession();

    // Listen for storage events (e.g. logout in other tab)
    const handleStorage = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.key === "pb_delicacies_admin_auth_v2") {
        checkSession();
      }
    };
    window.addEventListener("pb-storage-change", handleStorage);
    return () => window.removeEventListener("pb-storage-change", handleStorage);
  }, []);

  const login = async (identifier: string, pass: string, remember = true): Promise<AdminUser> => {
    const user = await authService.login(identifier, pass, remember);
    setCurrentUser(user);
    return user;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setCurrentUser(null);
  };

  const changePassword = async (oldPass: string, newPass: string): Promise<boolean> => {
    return authService.changePassword(oldPass, newPass);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated: !!currentUser,
        currentUser,
        loading,
        login,
        logout,
        changePassword,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return ctx;
}
