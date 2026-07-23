import { api, setAccessToken } from "../lib/axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponseEnvelope,
  LoginResponse,
  RegisterResponse,
} from "../types/auth";

const unwrapAuthResponse = <T>(response: AuthResponseEnvelope<T>): T => {
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    response.data &&
    typeof response.data === "object"
  ) {
    return response.data as T;
  }

  return response as T;
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<AuthResponseEnvelope<LoginResponse>>("/auth/login", credentials);
    // Note: Refresh token is now set as HttpOnly cookie by the backend
    // Access token is stored in memory by the caller (authStore)
    return unwrapAuthResponse(data);
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const { data } = await api.post<AuthResponseEnvelope<RegisterResponse>>("/auth/register", credentials);
    return unwrapAuthResponse(data);
  },

  async refreshAccessToken(): Promise<{ accessToken: string }> {
    // Refresh token is sent automatically via HttpOnly cookie
    const { data } = await api.post<AuthResponseEnvelope<{ accessToken: string }>>("/auth/refresh", {});
    const authData = unwrapAuthResponse(data);
    // Store new access token in memory
    setAccessToken(authData.accessToken);
    return authData;
  },

  async logout(): Promise<void> {
    // Backend will read refresh token from cookie and clear it
    await api.post("/auth/logout", {});
    // Clear in-memory access token
    setAccessToken(null);
  },
};
