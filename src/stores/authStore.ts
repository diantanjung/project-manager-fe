import { create } from "zustand";
import type { User } from "../types/auth";
import { setAccessToken } from "../lib/axios";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, userData: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse stored user data", e);
        return null;
      }
    }
    return null;
  })(),
  // Check if we have a stored user - will attempt refresh on first API call
  isAuthenticated: !!localStorage.getItem("user"),
  isLoading: false,
  login: (accessToken: string, userData: User) => {
    // Store access token in memory (not localStorage - secure from XSS)
    setAccessToken(accessToken);
    // Only persist user data (non-sensitive)
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData, isAuthenticated: true });
  },
  logout: () => {
    // Clear in-memory access token
    setAccessToken(null);
    // Clear persisted user data
    localStorage.removeItem("user");
    set({ user: null, isAuthenticated: false });
  },
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
