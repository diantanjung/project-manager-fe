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
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>(
      "/auth/register",
      credentials
    );
    return data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
