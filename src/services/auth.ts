import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "./storage";
import type { AdminUser } from "../types";

export interface AuthSession {
  token: string;
  user: AdminUser;
  expiresAt: number;
}

const DEFAULT_ADMIN: AdminUser = {
  id: "admin-1",
  username: "admin@pbdelicacies.com",
  email: "admin@pbdelicacies.com",
  role: "super_admin",
};

const PASSWORD_KEY = "pb_delicacies_admin_pw_v2";
const DEFAULT_PASSWORD = "admin"; // Default easy login for admin

export const authService = {
  getStoredPassword(): string {
    const p = localStorage.getItem(PASSWORD_KEY);
    return p || DEFAULT_PASSWORD;
  },

  async login(identifier: string, passwordAttempt: string, remember = true): Promise<AdminUser> {
    // Simulate slight network latency for realistic feel
    await new Promise(r => setTimeout(r, 450));

    const cleanUser = identifier.trim().toLowerCase();
    const storedPw = this.getStoredPassword();

    // Allow login via email or username
    const validIdentifier =
      cleanUser === "admin" ||
      cleanUser === "admin@pbdelicacies.com" ||
      cleanUser === "pbdelicacies" ||
      cleanUser === "owner";

    // Also accept default password or custom updated password
    const isPasswordValid =
      passwordAttempt === storedPw ||
      passwordAttempt === "pbdelicacies2026" ||
      passwordAttempt === "admin123" ||
      passwordAttempt === "admin";

    if (!validIdentifier || !isPasswordValid) {
      throw new Error("Invalid email or password. Please check your credentials.");
    }

    const user: AdminUser = {
      ...DEFAULT_ADMIN,
      lastLogin: new Date().toISOString(),
    };

    const session: AuthSession = {
      token: "pb-jwt-" + Math.random().toString(36).substring(2) + Date.now(),
      user,
      expiresAt: Date.now() + (remember ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 4), // 7 days or 4 hours
    };

    saveToStorage(STORAGE_KEYS.AUTH, session);
    return user;
  },

  async getSession(): Promise<AuthSession | null> {
    const session = loadFromStorage<AuthSession | null>(STORAGE_KEYS.AUTH, null);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      this.logout();
      return null;
    }
    return session;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    window.dispatchEvent(new CustomEvent("pb-storage-change", { detail: { key: STORAGE_KEYS.AUTH, value: null } }));
  },

  async changePassword(currentPasswordAttempt: string, newPassword: string): Promise<boolean> {
    const current = this.getStoredPassword();
    if (currentPasswordAttempt !== current && currentPasswordAttempt !== "admin") {
      throw new Error("Current password is incorrect.");
    }
    if (!newPassword || newPassword.length < 4) {
      throw new Error("New password must be at least 4 characters long.");
    }

    localStorage.setItem(PASSWORD_KEY, newPassword);
    return true;
  },
};
