import { create } from "zustand";
import { taskService } from "../services/task.service";
import type { Task, CreateTaskData, UpdateTaskData, TaskQueryParams } from "../types/task";

interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchTasks: (projectId: number, params?: TaskQueryParams) => Promise<void>;
    createTask: (data: CreateTaskData) => Promise<Task | undefined>;
    updateTask: (id: number, data: UpdateTaskData) => Promise<Task | undefined>;
    deleteTask: (id: number) => Promise<void>;
    moveTask: (taskId: number, newStatus: Task["status"], newPosition?: number) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,

    fetchTasks: async (projectId, params) => {
        set({ isLoading: true, error: null });
        try {
            const response = await taskService.getTasks(projectId, params);
            // Assuming response has data property which is the array of tasks
            set({ tasks: response.data, isLoading: false });
        } catch (err: unknown) {
            const message =
                // eslint-disable-next-line
                (err as any).response?.data?.message || "Failed to fetch tasks";
            set({ error: message, isLoading: false });
        }
    },

    createTask: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const newTask = await taskService.createTask(data);
            set((state) => ({
                tasks: [...state.tasks, newTask],
                isLoading: false
            }));
            return newTask;
        } catch (err: unknown) {
            const message =
                // eslint-disable-next-line
                (err as any).response?.data?.message || "Failed to create task";
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    updateTask: async (id, data) => {
        // We do optimistic update for better UX on drag and drop (if we add it later)
        // For now, standard async update
        set({ isLoading: true, error: null });
        try {
            const updatedTask = await taskService.updateTask(id, data);
            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
                isLoading: false
            }));
            return updatedTask;
        } catch (err: unknown) {
            const message =
                // eslint-disable-next-line
                (err as any).response?.data?.message || "Failed to update task";
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    deleteTask: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await taskService.deleteTask(id);
            set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id),
                isLoading: false
            }));
        } catch (err: unknown) {
            const message =
                // eslint-disable-next-line
                (err as any).response?.data?.message || "Failed to delete task";
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    moveTask: async (taskId: number, newStatus: Task["status"], newPosition?: number) => {
        // Optimistic update
        set((state) => {
            const tasks = [...state.tasks];
            const taskIndex = tasks.findIndex((t) => t.id === taskId);
            if (taskIndex === -1) return state;

            // Update status immediately
            tasks[taskIndex] = { ...tasks[taskIndex], status: newStatus };

            // If position is involved, we might need more complex reordering logic here
            // For now, we just update status and let the backend handle exact position or refresh

            return { tasks };
        });

        try {
            await taskService.updateTaskStatus(taskId, newStatus, newPosition);
            // Optionally refetch or rely on returned data
        } catch (err: unknown) {
            const message =
                // eslint-disable-next-line
                (err as any).response?.data?.message || "Failed to move task";
            set({ error: message });
            // Revert on failure (could store previous state)
            get().fetchTasks(get().tasks[0].projectId); // fallback to refetch
        }
    },
}));
