import { create } from "zustand";
import { projectService } from "../services/project.service";
import type { ProjectQueryParams } from "../services/project.service";
import type { CreateProjectData, UpdateProjectData, Project } from "../types/project";

interface ProjectState {
    projects: Project[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchProjects: (params?: ProjectQueryParams) => Promise<void>;
    createProject: (data: CreateProjectData) => Promise<Project | undefined>;
    updateProject: (id: number, data: UpdateProjectData) => Promise<Project | undefined>;
    deleteProject: (id: number) => Promise<void>;
    setCurrentPage: (page: number) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: [],
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 10,
    isLoading: false,
    error: null,

    fetchProjects: async (params) => {
        set({ isLoading: true, error: null });
        try {
            const response = await projectService.getAllProjects(params);
            set({
                projects: response.data,
                total: response.pagination.totalItems,
                page: response.pagination.page,
                totalPages: response.pagination.totalPages,
                isLoading: false,
            });
        } catch (err: unknown) {
            const message = (err as any).response?.data?.message || "Failed to fetch projects";
            set({ error: message, isLoading: false });
        }
    },

    createProject: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const newProject = await projectService.createProject(data);
            // Refresh the list to include the new project
            await get().fetchProjects();
            return newProject;
        } catch (err: unknown) {
            const message = (err as any).response?.data?.message || "Failed to create project";
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    updateProject: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const updatedProject = await projectService.updateProject(id, data);
            set((state) => ({
                projects: state.projects.map((p) => (p.id === id ? updatedProject : p)),
                isLoading: false,
            }));
            return updatedProject;
        } catch (err: unknown) {
            const message = (err as any).response?.data?.message || "Failed to update project";
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    deleteProject: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await projectService.deleteProject(id);
            set((state) => ({
                projects: state.projects.filter((p) => p.id !== id),
                total: Math.max(0, state.total - 1),
                isLoading: false,
            }));
        } catch (err: unknown) {
            const message = (err as any).response?.data?.message || "Failed to delete project";
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    setCurrentPage: (page) => {
        set({ page });
        get().fetchProjects({ page });
    },
}));
