import { api } from "../lib/axios";
import type { Task, CreateTaskData, UpdateTaskData, TaskQueryParams } from "../types/task";
import type { ApiResource, PaginatedResource } from "../types/api";
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
        const response = await api.get<PaginatedResource<Task> | { data: Task[] }>("/tasks", {
            params: {
                ...params,
                project_id: projectId,
                projectId,
            },
        });
        const pagination = "pagination" in response.data ? response.data.pagination : undefined;
        const normalizedTasks = response.data.data.map(normalizeTask);
        const tasks = normalizedTasks.filter((task) => task.projectId === projectId);
        const hasOutOfProjectTasks = tasks.length !== normalizedTasks.length;

        return withPaginationFallback({
            ...response.data,
            data: tasks,
            pagination: pagination && hasOutOfProjectTasks
                ? {
                    ...pagination,
                    totalItems: tasks.length,
                    totalPages: Math.max(1, Math.ceil(tasks.length / pagination.limit)),
                }
                : pagination,
        }, params?.limit);
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
