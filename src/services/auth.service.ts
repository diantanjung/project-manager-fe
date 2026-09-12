import {
  api,
  clearStoredRefreshToken,
  getStoredRefreshToken,
  setAccessToken,
  setStoredRefreshToken,
} from "../lib/axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponseEnvelope,
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
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

  async refreshAccessToken(): Promise<RefreshTokenResponse> {
    // Refresh token is sent automatically via HttpOnly cookie. When the backend
    // also returns a refresh token in the login payload, use it as a deployment
    // fallback for browsers that do not send cross-site cookies.
    const refreshToken = getStoredRefreshToken();
    const { data } = await api.post<AuthResponseEnvelope<RefreshTokenResponse>>(
      "/auth/refresh",
      refreshToken ? { refreshToken } : {},
    );
    const authData = unwrapAuthResponse(data);
    // Store new access token in memory
    setAccessToken(authData.accessToken);
    setStoredRefreshToken(authData.refreshToken);
    return authData;
  },

  async logout(): Promise<void> {
    // Backend will read refresh token from cookie and clear it
    const refreshToken = getStoredRefreshToken();
    await api.post("/auth/logout", refreshToken ? { refreshToken } : {});
    // Clear in-memory access token
    setAccessToken(null);
    clearStoredRefreshToken();
  },
};
