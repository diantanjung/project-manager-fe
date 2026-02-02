import { create } from "zustand";
import { userService } from "../services/user.service";
import type { CreateUserData, UpdateUserData, UserQueryParams } from "../services/user.service";
import type { User } from "../types/auth";

interface UserState {
    users: User[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
    filters: UserQueryParams;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchUsers: () => Promise<void>;
    setFilters: (filters: Partial<UserQueryParams>) => void;
    setPage: (page: number) => void;
    setParams: (params: { page?: number; filters?: UserQueryParams }) => void;
    createUser: (data: CreateUserData) => Promise<User | undefined>;
    updateUser: (id: string, data: UpdateUserData) => Promise<User | undefined>;
    deleteUser: (id: string) => Promise<void>;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 10,
    filters: {},
    isLoading: false,
    error: null,

    fetchUsers: async () => {
        const { page, limit, filters } = get();
        set({ isLoading: true, error: null });
        try {
            const response = await userService.getUsers({ ...filters, page, limit });
            console.log("Store: Values from API:", response);

            // Handle both array (legacy) and paginated object responses
            if (Array.isArray(response)) {
                set({ users: response, total: response.length, totalPages: 1, isLoading: false });
            } else {
                set({
                    users: response.data,
                    total: response.pagination.totalItems,
                    page: response.pagination.page,
                    totalPages: response.pagination.totalPages,
                    isLoading: false
                });
            }
        } catch (err: unknown) {
            const message =
                // eslint-disable-next-line
                (err as any).response?.data?.message || "Failed to fetch users";
            set({ error: message, isLoading: false });
        }
    },

    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
            page: 1 // Reset to first page on filter change
        }));
        get().fetchUsers();
    },

    setPage: (page) => {
        set({ page });
        get().fetchUsers();
    },

    setParams: ({ page, filters }) => {
        set((state) => ({
            page: page ?? state.page,
            filters: { ...state.filters, ...filters }
        }));
        get().fetchUsers();
    },

    createUser: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const newUser = await userService.createUser(data);
            // Fetch users again to ensure sort/pagination is correct
            await get().fetchUsers();
            return newUser;
        } catch (err: unknown) {
            const message =
                // eslint-disable-next-line
                (err as any).response?.data?.message || "Failed to create user";
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    updateUser: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const updatedUser = await userService.updateUser(id, data);
            set((state) => ({
                users: state.users.map((u) => (u.id === id ? updatedUser : u)),
                isLoading: false
            }));
            return updatedUser;
        } catch (err: unknown) {
            const message =
                // eslint-disable-next-line
                (err as any).response?.data?.message || "Failed to update user";
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    deleteUser: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await userService.deleteUser(id);
            set((state) => ({
                users: state.users.filter((u) => u.id !== id),
                total: Math.max(0, state.total - 1),
                isLoading: false
            }));
        } catch (err: unknown) {
            const message =
                // eslint-disable-next-line
                (err as any).response?.data?.message || "Failed to delete user";
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));
