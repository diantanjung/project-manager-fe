import { create } from "zustand";
import type { User } from "../types/auth";
import { setAccessToken } from "../lib/axios";
import { authService } from "../services/auth.service";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasInitialized: boolean;
  initializeAuth: () => Promise<void>;
  login: (accessToken: string, userData: User) => void;
  updateUser: (userData: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch (error) {
    console.error("Failed to parse stored user data", error);
    localStorage.removeItem("user");
    return null;
  }
};

const storedUser = getStoredUser();
let initializeAuthPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: storedUser,
  isAuthenticated: !!storedUser,
  isLoading: !!storedUser,
  hasInitialized: !storedUser,
  initializeAuth: async () => {
    const { hasInitialized, user } = get();

    if (hasInitialized) {
      return;
    }

    if (initializeAuthPromise) {
      return initializeAuthPromise;
    }

    if (!user) {
      set({ isAuthenticated: false, isLoading: false, hasInitialized: true });
      return;
    }

    initializeAuthPromise = (async () => {
      try {
        await authService.refreshAccessToken();
        set({ isAuthenticated: true });
      } catch {
        setAccessToken(null);
        localStorage.removeItem("user");
        set({ user: null, isAuthenticated: false });
      } finally {
        initializeAuthPromise = null;
        set({ isLoading: false, hasInitialized: true });
      }
    })();

    return initializeAuthPromise;
  },
  login: (accessToken: string, userData: User) => {
    // Store access token in memory (not localStorage - secure from XSS)
    setAccessToken(accessToken);
    // Only persist user data (non-sensitive)
    localStorage.setItem("user", JSON.stringify(userData));
    set({
      user: userData,
      isAuthenticated: true,
      isLoading: false,
      hasInitialized: true,
    });
  },
  updateUser: (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData });
  },
  logout: () => {
    // Clear in-memory access token
    setAccessToken(null);
    // Clear persisted user data
    localStorage.removeItem("user");
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hasInitialized: true,
    });
  },
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
