import { beforeEach, describe, expect, it, vi } from "vitest";
import { taskService } from "../services/task.service";
import { useTaskStore } from "./taskStore";
import type { Task } from "../types/task";

vi.mock("../services/task.service", () => ({
    taskService: {
        getTasks: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        updateTaskStatus: vi.fn(),
    },
}));

const task: Task = {
    id: 1,
    title: "Release checklist",
    description: null,
    status: "done",
    priority: "urgent",
    projectId: 7,
    creatorId: 1,
    assigneeId: 2,
    assigneeName: "Dian",
    dueDate: null,
    position: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("taskStore", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useTaskStore.setState({
            tasks: [],
            total: 0,
            page: 1,
            totalPages: 1,
            limit: 10,
            filters: {},
            isLoading: false,
            error: null,
        });
    });

    it("stores paginated task responses and active params", async () => {
        vi.mocked(taskService.getTasks).mockResolvedValueOnce({
            data: [task],
            pagination: {
                page: 2,
                limit: 25,
                totalItems: 40,
                totalPages: 2,
            },
        });

        await useTaskStore.getState().fetchTasks(7, {
            page: 2,
            limit: 25,
            search: "release",
            status: "done",
            priority: "urgent",
        });

        expect(taskService.getTasks).toHaveBeenCalledWith(7, {
            page: 2,
            limit: 25,
            search: "release",
            status: "done",
            priority: "urgent",
        });
        expect(useTaskStore.getState()).toMatchObject({
            tasks: [task],
            total: 40,
            page: 2,
            totalPages: 2,
            limit: 25,
            filters: {
                page: 2,
                limit: 25,
                search: "release",
                status: "done",
                priority: "urgent",
            },
            isLoading: false,
            error: null,
        });
    });
});
