import { api } from "../lib/axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  LoginResponse,
  RegisterResponse,
} from "../types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login", credentials);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>(
      "/auth/register",
      credentials
    );
    return data;
  },

  async refreshAccessToken(): Promise<LoginResponse> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }
    const { data } = await api.post<LoginResponse>("/auth/refresh", {
      refreshToken,
    });
    localStorage.setItem("accessToken", data.accessToken);
    // Only update refresh token if backend rotates it (returns new one)
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }
    return data;
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }
    await api.post("/auth/logout", { refreshToken });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
