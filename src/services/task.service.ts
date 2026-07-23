import { api } from "../lib/axios";
import type { Task, CreateTaskData, UpdateTaskData, TaskQueryParams } from "../types/task";
import type { ApiResource } from "../types/api";
import { unwrapResource, withPaginationFallback } from "../types/api";

const toTaskPayload = (data: CreateTaskData | UpdateTaskData) => ({
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    project_id: data.projectId,
    creator_id: data.creatorId,
    assignee_id: data.assigneeId,
    due_date: data.dueDate,
    position: "position" in data ? data.position : undefined,
});

const normalizeTask = (task: Task): Task => ({
    ...task,
    assigneeName: task.assignee?.name ?? task.assigneeName,
    assigneeAvatarUrl: task.assignee?.avatarUrl ?? task.assigneeAvatarUrl,
});

export const taskService = {
    getTasks: async (projectId: number, params?: TaskQueryParams) => {
        const response = await api.get<{ data: Task[]; pagination?: undefined }>("/tasks", { params });
        const tasks = response.data.data
            .filter((task) => task.projectId === projectId)
            .map(normalizeTask);
        return withPaginationFallback({ data: tasks }, params?.limit);
    },

    createTask: async (data: CreateTaskData) => {
        const response = await api.post<ApiResource<Task>>("/tasks", toTaskPayload(data));
        return normalizeTask(unwrapResource(response.data));
    },

    updateTask: async (id: number, data: UpdateTaskData) => {
        const response = await api.patch<ApiResource<Task>>(`/tasks/${id}`, toTaskPayload(data));
        return normalizeTask(unwrapResource(response.data));
    },

    deleteTask: async (id: number) => {
        await api.delete(`/tasks/${id}`);
    },

    updateTaskStatus: async (id: number, status: Task["status"], position?: number) => {
        const response = await api.patch<ApiResource<Task>>(`/tasks/${id}`, toTaskPayload({ status, position }));
        return normalizeTask(unwrapResource(response.data));
    }
};
