import { api } from "../lib/axios";
import type { Team, TeamMember, CreateTeamData, UpdateTeamData } from "../types/team";
import type { ApiResource, PaginatedResource } from "../types/api";
import { unwrapResource, withPaginationFallback } from "../types/api";

export interface TeamQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc";
}

type TeamMemberResponse = {
    id: number;
    name?: string;
    email?: string;
    userId?: number;
    user_id?: number;
    userName?: string;
    user_name?: string;
    userEmail?: string;
    user_email?: string;
    role?: string;
    joinedAt?: string;
    joined_at?: string;
    membership?: {
        role?: string;
        joinedAt?: string;
        joined_at?: string;
    };
};

const unwrapTeamMembers = (resource: TeamMemberResponse[] | { data: TeamMemberResponse[] }) => {
    if (Array.isArray(resource)) {
        return resource;
    }

    return resource.data;
};

const toTeamMember = (member: TeamMemberResponse): TeamMember => ({
    id: member.id,
    userId: member.userId ?? member.user_id ?? member.id,
    userName: member.userName ?? member.user_name ?? member.name ?? "",
    userEmail: member.userEmail ?? member.user_email ?? member.email ?? "",
    role: member.role ?? member.membership?.role ?? "member",
    joinedAt: member.joinedAt ?? member.joined_at ?? member.membership?.joinedAt ?? member.membership?.joined_at ?? "",
});

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
        const response = await api.get<TeamMemberResponse[] | { data: TeamMemberResponse[] }>(`/teams/${id}/members`);
        return unwrapTeamMembers(response.data).map(toTeamMember);
    },

    addTeamMember: async (teamId: number, userId: number, role: string = "member") => {
        const response = await api.post(`/teams/${teamId}/members`, { user_id: userId, role });
        return response.data;
    },

    removeTeamMember: async (teamId: number, userId: number) => {
        const response = await api.delete(`/teams/${teamId}/members/${userId}`);
        return response.data;
    },
};
