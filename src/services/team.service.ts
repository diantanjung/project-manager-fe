import { api } from "../lib/axios";
import type { Team, CreateTeamData, UpdateTeamData } from "../types/team";
import type { ApiResource, PaginatedResource } from "../types/api";
import { unwrapResource, withPaginationFallback } from "../types/api";

export interface TeamQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc";
}

export const teamService = {
    getAllTeams: async (params?: TeamQueryParams) => {
        const response = await api.get<PaginatedResource<Team> | { data: Team[] }>("/teams", { params });
        return withPaginationFallback(response.data, params?.limit);
    },

    getTeamById: async (id: number) => {
        const response = await api.get<ApiResource<Team>>(`/teams/${id}`);
        return unwrapResource(response.data);
    },

    createTeam: async (data: CreateTeamData) => {
        const response = await api.post<ApiResource<Team>>("/teams", data);
        return unwrapResource(response.data);
    },

    updateTeam: async (id: number, data: UpdateTeamData) => {
        const response = await api.patch<ApiResource<Team>>(`/teams/${id}`, data);
        return unwrapResource(response.data);
    },

    deleteTeam: async (id: number) => {
        await api.delete(`/teams/${id}`);
    },

    getTeamMembers: async (id: number) => {
        const response = await api.get(`/teams/${id}/members`);
        return response.data;
    },

    addTeamMember: async (teamId: number, userId: number, role: string = "member") => {
        const response = await api.post(`/teams/${teamId}/members`, { userId, role });
        return response.data;
    },

    removeTeamMember: async (teamId: number, userId: number) => {
        const response = await api.delete(`/teams/${teamId}/members/${userId}`);
        return response.data;
    },
};
