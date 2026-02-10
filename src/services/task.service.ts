import { api } from "../lib/axios";
import type { Task, CreateTaskData, UpdateTaskData, TaskQueryParams } from "../types/task";

interface PaginatedResponse {
    data: Task[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export const taskService = {
    getTasks: async (projectId: number, params?: TaskQueryParams) => {
        const response = await api.get<PaginatedResponse>(`/projects/${projectId}/tasks`, { params });
        return response.data;
    },

    createTask: async (data: CreateTaskData) => {
        const response = await api.post<Task>("/tasks", data);
        return response.data;
    },

    updateTask: async (id: number, data: UpdateTaskData) => {
        const response = await api.patch<Task>(`/tasks/${id}`, data);
        return response.data;
    },

    deleteTask: async (id: number) => {
        await api.delete(`/tasks/${id}`);
    },

    updateTaskStatus: async (id: number, status: Task["status"], position?: number) => {
        const response = await api.patch<Task>(`/tasks/${id}/status`, { status, position });
        return response.data;
    }
};
