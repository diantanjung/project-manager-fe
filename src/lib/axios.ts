import axios, { AxiosError } from "axios";
import type { ApiValidationError } from "../types/api";
import type { AuthResponseEnvelope } from "../types/auth";

// In-memory access token storage (secure - not accessible via XSS)
let accessToken: string | null = null;

const normalizeBaseURL = (url?: string) => {
  const fallback = "http://localhost:8000";
  const trimmed = (url || fallback).replace(/\/+$/, "");

  if (trimmed.endsWith("/api/v1")) {
    return trimmed;
  }

  if (trimmed.endsWith("/api")) {
    return `${trimmed}/v1`;
  }

  return `${trimmed}/api/v1`;
};

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export class ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status?: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export const api = axios.create({
  baseURL: normalizeBaseURL(import.meta.env.VITE_API_URL),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send HttpOnly cookies with requests
});

const toApiError = (error: AxiosError<ApiValidationError>) => {
  const status = error.response?.status;
  const message = error.response?.data?.message || error.message;
  return new ApiError(message, status, error.response?.data?.errors);
};

const emitHandledApiError = (error: ApiError) => {
  if ([403, 409, 422, 429].includes(error.status ?? 0)) {
    window.dispatchEvent(
      new CustomEvent("api:error", {
        detail: {
          status: error.status,
          message: error.message,
          errors: error.errors,
        },
      }),
    );
  }
};

const unwrapResponseEnvelope = <T>(response: AuthResponseEnvelope<T>): T => {
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

// Request interceptor - attach access token from memory
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

interface PromiseQueueItem {
  resolve: (value: string | null) => void;
  reject: (reason?: unknown) => void;
}

let isRefreshing = false;
let failedQueue: PromiseQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token is sent automatically via HttpOnly cookie
        const { data } = await axios.post<AuthResponseEnvelope<{ accessToken: string }>>(
          `${api.defaults.baseURL}/auth/refresh`,
          {}, // Empty body - refresh token is in cookie
          { withCredentials: true }
        );

        const newAccessToken = unwrapResponseEnvelope(data).accessToken;

        // Store new access token in memory
        accessToken = newAccessToken;

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear in-memory token
        accessToken = null;
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const apiError = toApiError(error);
    emitHandledApiError(apiError);
    return Promise.reject(apiError);
  }
);
