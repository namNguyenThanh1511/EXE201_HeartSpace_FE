import { create } from "zustand";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

import { getAuthCookieConfig } from "@/config/cookie-config";
import { User } from "@/services/api/user-service";
import apiService from "@/services/api/core";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  syncAuthState: () => void;
  parseToken: (token: string) => User | null;
}

// Hàm parse JWT token
const parseJwtToken = (token: string): User | null => {
  try {
    // JWT token có format: header.payload.signature
    const base64Url = token.split(".")[1];
    if (!base64Url) {
      console.error("[AuthStore] Invalid JWT token format");
      return null;
    }

    // Chuyển base64Url sang base64 thông thường
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // Decode base64
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const payload = JSON.parse(jsonPayload);

    // Map JWT payload sang User interface
    const user: User = {
      // FIX: Prioritize 'nameid' (standard .NET Identity Claim for User ID)
      id: payload.nameid || payload.sub || payload.id || payload.userId,
      email: payload.email, // FIX: Prioritize 'fullName' or 'unique_name' for the user name
      name: payload.fullName || payload.name || payload.username || payload.unique_name,
      role: payload.role || payload.roles?.[0] || "client",
      avatar: payload.avatar || payload.picture, // Thêm các trường khác tùy theo cấu trúc JWT của bạn
      ...payload,
    };

    console.log("[AuthStore] Parsed user from token:", user);
    return user;
  } catch (error) {
    console.error("[AuthStore] Error parsing JWT token:", error);
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, _get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setToken: (token) => {
    if (token) {
      setCookie("auth-token", token, getAuthCookieConfig());
      apiService.setAuthToken(token);

      // Tự động parse user từ token khi set token
      const user = parseJwtToken(token);
      if (user) {
        set({ token, user, isAuthenticated: true });
      } else {
        set({ token, isAuthenticated: true });
      }
    } else {
      // Use same config for deletion as for setting
      const cookieConfig = getAuthCookieConfig();
      deleteCookie("auth-token", {
        path: cookieConfig.path,
        domain: cookieConfig.domain,
        secure: cookieConfig.secure,
      });
      apiService.setAuthToken(null);

      set({
        token: null,
        user: null,
        isAuthenticated: false,
      });
    }
  },

  setUser: (user) => set({ user }),

  login: (token, user) => {
    setCookie("auth-token", token, getAuthCookieConfig());
    apiService.setAuthToken(token);

    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    // Use same config for deletion as for setting
    const cookieConfig = getAuthCookieConfig();
    deleteCookie("auth-token", {
      path: cookieConfig.path,
      domain: cookieConfig.domain,
      secure: cookieConfig.secure,
    });
    apiService.setAuthToken(null);

    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },

  syncAuthState: () => {
    if (typeof window !== "undefined") {
      const cookieToken = getCookie("auth-token");
      set((state) => {
        const storeHasToken = !!state.token;
        const cookieHasToken = !!cookieToken;

        if (storeHasToken !== cookieHasToken) {
          if (cookieHasToken) {
            // Set the API token immediately when syncing from cookie
            apiService.setAuthToken(cookieToken as string);

            // Parse user từ token khi sync
            const user = parseJwtToken(cookieToken as string);

            return {
              token: cookieToken as string,
              user,
              isAuthenticated: true,
            };
          } else {
            // Clear API token when no cookie
            apiService.setAuthToken(null);
            return {
              token: null,
              user: null,
              isAuthenticated: false,
            };
          }
        }

        // Ensure API service has the token even if store state doesn't change
        if (storeHasToken && state.token) {
          apiService.setAuthToken(state.token);
        }

        return {
          isAuthenticated: storeHasToken,
        };
      });
    }
  },

  parseToken: (token: string) => {
    return parseJwtToken(token);
  },
}));

// Initialize auth state from storage with better SSR handling
const initializeAuth = () => {
  if (typeof window !== "undefined") {
    const state = useAuthStore.getState();
    const cookieToken = getCookie("auth-token");

    console.log("[AuthStore] Initializing auth:", {
      cookieToken: cookieToken ? "present" : "missing",
      storeToken: state.token ? "present" : "missing",
      isAuthenticated: state.isAuthenticated,
    });

    // Primary logic: Cookie is the source of truth
    if (cookieToken) {
      // Cookie exists - ensure store is in sync
      if (!state.token || state.token !== cookieToken) {
        console.log("[AuthStore] Syncing store from cookie");
        apiService.setAuthToken(cookieToken as string);

        // Parse user từ token
        const user = state.parseToken(cookieToken as string);
        if (user) {
          state.setToken(cookieToken as string);
          state.setUser(user);
        } else {
          state.setToken(cookieToken as string);
        }
      } else {
        // Store already has correct token, just ensure API service has it
        apiService.setAuthToken(cookieToken as string);
      }
    } else {
      // No cookie - clear everything
      if (state.token || state.isAuthenticated) {
        console.log("[AuthStore] No cookie found, clearing auth state");
        state.logout();
      }
    }

    // Listen for logout events from API service
    const handleLogout = () => {
      console.log("[AuthStore] Logout event received");
      state.logout();
    };

    window.addEventListener("logout", handleLogout);

    // Cleanup listener on page unload
    window.addEventListener("beforeunload", () => {
      window.removeEventListener("logout", handleLogout);
    });
  }
};

// Use multiple initialization strategies for better reliability
if (typeof window !== "undefined") {
  // Immediate initialization for client-side
  if (document.readyState === "complete") {
    initializeAuth();
  } else {
    // Wait for DOM ready
    document.addEventListener("DOMContentLoaded", initializeAuth);
    // Also use setTimeout as fallback
    setTimeout(initializeAuth, 0);
  }
}
