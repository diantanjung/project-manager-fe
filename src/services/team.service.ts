import { api } from "../lib/axios";
import type { Team, CreateTeamData, UpdateTeamData } from "../types/team";

export interface TeamQueryParams {
    page?: number;
    limit?: number;
    search?: string;
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

export const teamService = {
    getAllTeams: async (params?: TeamQueryParams) => {
        const response = await api.get<PaginatedResponse<Team>>("/teams", { params });
        return response.data;
    },

    getTeamById: async (id: number) => {
        const response = await api.get<Team>(`/teams/${id}`);
        return response.data;
    },

    createTeam: async (data: CreateTeamData) => {
        const response = await api.post<Team>("/teams", data);
        return response.data;
    },

    updateTeam: async (id: number, data: UpdateTeamData) => {
        const response = await api.patch<Team>(`/teams/${id}`, data);
        return response.data;
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
