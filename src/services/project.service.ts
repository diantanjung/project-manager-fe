import { api } from "../lib/axios";
import type { Project, CreateProjectData, UpdateProjectData } from "../types/project";

export interface ProjectQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    teamId?: number;
    sortBy?: string;
    order?: "asc" | "desc";
}

interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export const projectService = {
    getAllProjects: async (params?: ProjectQueryParams) => {
        const response = await api.get<PaginatedResponse<Project>>("/projects", { params });
        return response.data;
    },

    getProjectById: async (id: number) => {
        const response = await api.get<Project>(`/projects/${id}`);
        return response.data;
    },

    createProject: async (data: CreateProjectData) => {
        const response = await api.post<Project>("/projects", data);
        return response.data;
    },

    updateProject: async (id: number, data: UpdateProjectData) => {
        const response = await api.patch<Project>(`/projects/${id}`, data);
        return response.data;
    },

    deleteProject: async (id: number) => {
        await api.delete(`/projects/${id}`);
    },
};
