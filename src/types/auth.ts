export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "productOwner" | "projectManager" | "teamMember";
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
}

export type RegisterResponse = User;

export interface AuthError {
  message: string;
}
