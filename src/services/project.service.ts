import { api } from "../lib/axios";
import type { Project, CreateProjectData, UpdateProjectData } from "../types/project";
import type { ApiResource, PaginatedResource } from "../types/api";
import { unwrapResource } from "../types/api";

export interface ProjectQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    teamId?: number;
    sortBy?: string;
    order?: "asc" | "desc";
}

const toProjectPayload = (data: CreateProjectData | UpdateProjectData) => ({
    name: data.name,
    description: data.description,
    owner_id: data.ownerId,
});

export const projectService = {
    getAllProjects: async (params?: ProjectQueryParams) => {
        const response = await api.get<PaginatedResource<Project>>("/projects", { params });
        return response.data;
    },

    getProjectById: async (id: number) => {
        const response = await api.get<ApiResource<Project>>(`/projects/${id}`);
        return unwrapResource(response.data);
    },

    createProject: async (data: CreateProjectData) => {
        const response = await api.post<ApiResource<Project>>("/projects", toProjectPayload(data));
        return unwrapResource(response.data);
    },

    updateProject: async (id: number, data: UpdateProjectData) => {
        const response = await api.patch<ApiResource<Project>>(`/projects/${id}`, toProjectPayload(data));
        return unwrapResource(response.data);
    },

    deleteProject: async (id: number) => {
        await api.delete(`/projects/${id}`);
    },
};
