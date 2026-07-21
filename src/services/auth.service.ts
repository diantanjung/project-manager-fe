import axios from "axios";
import { api, setAccessToken } from "../lib/axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  LoginResponse,
  RegisterResponse,
} from "../types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login", credentials);
    // Note: Refresh token is now set as HttpOnly cookie by the backend
    // Access token is stored in memory by the caller (authStore)
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>(
      "/auth/register",
      credentials
    );
    return data;
  },

  async refreshAccessToken(): Promise<{ accessToken: string }> {
    // Refresh token is sent automatically via HttpOnly cookie
    const { data } = await axios.post<{ accessToken: string }>(
      `${api.defaults.baseURL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    // Store new access token in memory
    setAccessToken(data.accessToken);
    return data;
  },

  async logout(): Promise<void> {
    // Backend will read refresh token from cookie and clear it
    await api.post("/auth/logout", {});
    // Clear in-memory access token
    setAccessToken(null);
  },
};
