export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "admin" | "productOwner" | "projectManager" | "teamMember";
  isActive?: boolean;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken?: string; // Optional - now sent via HttpOnly cookie
  tokenType?: string;
  expiresIn?: number;
}

export type RegisterResponse = LoginResponse;

export type AuthResponseEnvelope<T> = T | { data: T };

export interface AuthError {
  message: string;
}
