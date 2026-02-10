import { api } from "../lib/axios";
import type { User } from "../types/auth";

export interface CreateUserData {
    name: string;
    email: string;
    password?: string;
    role: User["role"];
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    password?: string;
    role?: User["role"];
}

export interface UserQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    order?: "asc" | "desc";
}

interface PaginatedResponse {
    data: User[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export const userService = {
    getUsers: async (params?: UserQueryParams) => {
        const response = await api.get<PaginatedResponse>("/users", { params });
        return response.data;
    },

    createUser: async (data: CreateUserData) => {
        const response = await api.post<User>("/users", data);
        return response.data;
    },

    updateUser: async (id: number, data: UpdateUserData) => {
        const response = await api.patch<User>(`/users/${id}`, data);
        return response.data;
    },

    deleteUser: async (id: number) => {
        await api.delete(`/users/${id}`);
    },
};
