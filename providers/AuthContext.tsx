"use client";
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { authApi } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/client";
import {
  resolveCustomerIdFromAccessToken,
  displayNameFromAccessToken,
} from "@/lib/resolveCustomerId";

interface AuthContextType {
  isLoggedIn: boolean;
  loggedPhone: string;
  displayName: string;
  isLoading: boolean;
  token: string | null;
  login: (phone: string, password?: string) => Promise<void>;
  signup: (data: { username: string; password: string; email?: string; firstName?: string; userType?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** Milliseconds until access token `exp`, or null if JWT unreadable. */
function accessTokenExpiresAtMs(accessToken: string): number | null {
  try {
    const parts = accessToken.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as { exp?: number };
    return payload.exp != null ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedPhone, setLoggedPhone] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const logoutRef = useRef<() => void>(() => {});

  const syncDisplayName = (accessToken: string | null, phone: string) => {
    setDisplayName(displayNameFromAccessToken(accessToken, phone || null));
  };

  // Restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("p4u_token");
    const phone = localStorage.getItem("p4u_phone");

    if (savedToken && phone) {
      setIsLoggedIn(true);
      setLoggedPhone(phone);
      setToken(savedToken);
      const cid =
        localStorage.getItem("p4u_customer_id") || resolveCustomerIdFromAccessToken(savedToken);
      if (cid) localStorage.setItem("p4u_customer_id", cid);
      syncDisplayName(savedToken, phone);
    } else if (localStorage.getItem("p4u_loggedIn") === "true" && phone) {
      // Legacy local-only session
      setIsLoggedIn(true);
      setLoggedPhone(phone);
      syncDisplayName(null, phone);
    }
    setIsLoading(false);
  }, []);

  // Auto-refresh access token before Keycloak expiry (schedule from JWT `exp`, not only expires_in).
  useEffect(() => {
    if (!token) return;

    const applyTokens = (res: Awaited<ReturnType<typeof authApi.refreshToken>>) => {
      localStorage.setItem("p4u_token", res.accessToken);
      localStorage.setItem("p4u_refresh_token", res.refreshToken);
      localStorage.setItem("p4u_token_expires_in", String(res.expiresIn));
      const customerId =
        res.customerId != null && String(res.customerId).trim() !== ""
          ? String(res.customerId)
          : resolveCustomerIdFromAccessToken(res.accessToken);
      if (customerId) localStorage.setItem("p4u_customer_id", customerId);
      setToken(res.accessToken);
      const phone = localStorage.getItem("p4u_phone") || "";
      syncDisplayName(res.accessToken, phone);
    };

    const runRefresh = async (isRetryAfterNetworkFailure: boolean) => {
      const refreshToken = localStorage.getItem("p4u_refresh_token");
      if (!refreshToken) return;
      try {
        const res = await authApi.refreshToken(refreshToken);
        applyTokens(res);
      } catch (e: unknown) {
        const status = typeof e === "object" && e !== null && "status" in e ? (e as ApiError).status : -1;
        // Network / gateway down: retry once; do not clear session immediately.
        if (status === 0 && !isRetryAfterNetworkFailure) {
          setTimeout(() => {
            void runRefresh(true);
          }, 15_000);
          return;
        }
        // Refresh rejected (e.g. expired refresh token, revoked session) → logout.
        logoutRef.current();
      }
    };

    const expMs = accessTokenExpiresAtMs(token);
    const expiresInFallback = Number(localStorage.getItem("p4u_token_expires_in") || "300");
    const now = Date.now();
    let delayMs: number;
    if (expMs != null) {
      // Refresh ~45s before access token expires (Keycloak access tokens are often short, e.g. 5–15 min).
      delayMs = expMs - now - 45_000;
      if (delayMs < 5_000) delayMs = Math.min(5_000, Math.max(0, expMs - now - 5_000));
      if (expMs - now < 90_000) delayMs = 0; // &lt; 90s left: refresh immediately
    } else {
      delayMs = Math.max((expiresInFallback - 45) * 1000, 10_000);
    }

    const timeout = setTimeout(() => {
      void runRefresh(false);
    }, delayMs);

    return () => clearTimeout(timeout);
  }, [token]);

  async function login(phone: string, password?: string) {
    if (password) {
      try {
        const res = await authApi.login(phone, password);
        localStorage.setItem("p4u_token", res.accessToken);
        localStorage.setItem("p4u_refresh_token", res.refreshToken);
        localStorage.setItem("p4u_token_expires_in", String(res.expiresIn));
        localStorage.setItem("p4u_loggedIn", "true");
        localStorage.setItem("p4u_phone", phone);
        const customerId =
          res.customerId != null && String(res.customerId).trim() !== ""
            ? String(res.customerId)
            : resolveCustomerIdFromAccessToken(res.accessToken);
        if (customerId) localStorage.setItem("p4u_customer_id", customerId);
        setToken(res.accessToken);
        setIsLoggedIn(true);
        setLoggedPhone(phone);
        syncDisplayName(res.accessToken, phone);
      } catch (err: any) {
        throw new Error(err?.message ?? "Login failed");
      }
    } else {
      // OTP deferred or AuthModal already stored tokens — sync from storage
      localStorage.setItem("p4u_loggedIn", "true");
      localStorage.setItem("p4u_phone", phone);
      setIsLoggedIn(true);
      setLoggedPhone(phone);
      const existing = localStorage.getItem("p4u_token");
      if (existing) {
        setToken(existing);
        const cid =
          localStorage.getItem("p4u_customer_id") || resolveCustomerIdFromAccessToken(existing);
        if (cid) localStorage.setItem("p4u_customer_id", cid);
        syncDisplayName(existing, phone);
      } else {
        syncDisplayName(null, phone);
      }
    }
  }

  async function signup(data: { username: string; password: string; email?: string; firstName?: string; userType?: string }) {
    try {
      await authApi.signup(data);
      await login(data.username, data.password);
    } catch (err: any) {
      throw new Error(err?.message ?? "Signup failed");
    }
  }

  function logout() {
    const refreshToken = localStorage.getItem("p4u_refresh_token");
    if (refreshToken && token) {
      authApi.logout(refreshToken).catch(() => {});
    }
    setIsLoggedIn(false);
    setLoggedPhone("");
    setToken(null);
    setDisplayName("");
    localStorage.removeItem("p4u_loggedIn");
    localStorage.removeItem("p4u_phone");
    localStorage.removeItem("p4u_token");
    localStorage.removeItem("p4u_refresh_token");
    localStorage.removeItem("p4u_token_expires_in");
    localStorage.removeItem("p4u_customer_id");
  }

  logoutRef.current = logout;

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, loggedPhone, displayName, isLoading, token, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
