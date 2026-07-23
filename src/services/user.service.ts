import { api } from "../lib/axios";
import type { User } from "../types/auth";
import type { ApiResource, PaginatedResource } from "../types/api";
import { unwrapResource, withPaginationFallback } from "../types/api";

export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    role: User["role"];
    avatarUrl?: string | null;
    isActive?: boolean;
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    password?: string;
    avatarUrl?: string | null;
    role?: User["role"];
    isActive?: boolean;
}

export interface UserQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    order?: "asc" | "desc";
}

const toUserPayload = (data: CreateUserData | UpdateUserData) => ({
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
    avatar_url: data.avatarUrl,
    is_active: data.isActive,
});

export const userService = {
    getUsers: async (params?: UserQueryParams) => {
        const response = await api.get<PaginatedResource<User>>("/users", { params });
        return withPaginationFallback(response.data, params?.limit);
    },

    createUser: async (data: CreateUserData) => {
        const response = await api.post<ApiResource<User>>("/users", toUserPayload(data));
        return unwrapResource(response.data);
    },

    updateUser: async (id: number, data: UpdateUserData) => {
        const response = await api.patch<ApiResource<User>>(`/users/${id}`, toUserPayload(data));
        return unwrapResource(response.data);
    },

    deleteUser: async (id: number) => {
        await api.delete(`/users/${id}`);
    },
};
