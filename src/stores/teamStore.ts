import { create } from "zustand";
import { teamService } from "../services/team.service";
import type { TeamQueryParams } from "../services/team.service";
import type { Team, CreateTeamData, UpdateTeamData } from "../types/team";

interface TeamState {
    teams: Team[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
    filters: TeamQueryParams;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchTeams: () => Promise<void>;
    setFilters: (filters: Partial<TeamQueryParams>) => void;
    setParams: (params: { page?: number; filters?: TeamQueryParams }) => void;
    createTeam: (data: CreateTeamData) => Promise<Team | undefined>;
    updateTeam: (id: number, data: UpdateTeamData) => Promise<Team | undefined>;
    deleteTeam: (id: number) => Promise<void>;
    setError: (error: string | null) => void;
}

export const useTeamStore = create<TeamState>((set, get) => ({
    teams: [],
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 10,
    filters: {},
    isLoading: false,
    error: null,

    fetchTeams: async () => {
        const { page, limit, filters } = get();
        set({ isLoading: true, error: null });
        try {
            const response = await teamService.getAllTeams({ ...filters, page, limit });
            set({
                teams: response.data,
                total: response.pagination.totalItems,
                page: response.pagination.page,
                totalPages: response.pagination.totalPages,
                isLoading: false,
            });
        } catch (err: unknown) {
            const message = (err as any).response?.data?.message || "Failed to fetch teams";
            set({ error: message, isLoading: false });
        }
    },

    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
            page: 1, // Reset to first page on filter change
        }));
        get().fetchTeams();
    },

    setParams: ({ page, filters }) => {
        set((state) => ({
            page: page ?? state.page,
            filters: { ...state.filters, ...filters },
        }));
        get().fetchTeams();
    },

    createTeam: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const newTeam = await teamService.createTeam(data);
            await get().fetchTeams();
            return newTeam;
        } catch (err: unknown) {
            const message = (err as any).response?.data?.message || "Failed to create team";
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    updateTeam: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const updatedTeam = await teamService.updateTeam(id, data);
            set((state) => ({
                teams: state.teams.map((t) => (t.id === id ? updatedTeam : t)),
                isLoading: false,
            }));
            return updatedTeam;
        } catch (err: unknown) {
            const message = (err as any).response?.data?.message || "Failed to update team";
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    deleteTeam: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await teamService.deleteTeam(id);
            set((state) => ({
                teams: state.teams.filter((t) => t.id !== id),
                total: Math.max(0, state.total - 1),
                isLoading: false,
            }));
        } catch (err: unknown) {
            const message = (err as any).response?.data?.message || "Failed to delete team";
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    setError: (error) => set({ error }),
}));
