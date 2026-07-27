import { describe, expect, it, vi } from "vitest";
import { api } from "../lib/axios";
import { taskService } from "./task.service";
import type { Task } from "../types/task";

vi.mock("../lib/axios", () => ({
    api: {
        get: vi.fn(),
    },
}));

const makeTask = (id: number, projectId: number): Task => ({
    id,
    title: `Task ${id}`,
    description: null,
    status: "todo",
    priority: "medium",
    projectId,
    creatorId: 1,
    assigneeId: 2,
    assignee: {
        id: 2,
        name: "Dian",
        avatarUrl: "/avatar.png",
    },
    dueDate: null,
    position: id,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
});

describe("taskService", () => {
    it("passes pagination, search, and filters to the tasks API", async () => {
        vi.mocked(api.get).mockResolvedValueOnce({
            data: {
                data: [makeTask(1, 7)],
                pagination: {
                    page: 2,
                    limit: 25,
                    totalItems: 40,
                    totalPages: 2,
                },
            },
        });

        const response = await taskService.getTasks(7, {
            page: 2,
            limit: 25,
            search: "release",
            status: "done",
            priority: "urgent",
        });

        expect(api.get).toHaveBeenCalledWith("/tasks", {
            params: {
                page: 2,
                limit: 25,
                search: "release",
                status: "done",
                priority: "urgent",
                project_id: 7,
                projectId: 7,
            },
        });
        expect(response.pagination).toEqual({
            page: 2,
            limit: 25,
            totalItems: 40,
            totalPages: 2,
        });
        expect(response.data[0]).toMatchObject({
            assigneeName: "Dian",
            assigneeAvatarUrl: "/avatar.png",
        });
    });

    it("keeps the project filter fallback for non-paginated task responses", async () => {
        vi.mocked(api.get).mockResolvedValueOnce({
            data: {
                data: [makeTask(1, 7), makeTask(2, 8)],
            },
        });

        const response = await taskService.getTasks(7, { limit: 10 });

        expect(response.data).toHaveLength(1);
        expect(response.data[0].projectId).toBe(7);
        expect(response.pagination).toEqual({
            page: 1,
            limit: 10,
            totalItems: 1,
            totalPages: 1,
        });
    });

    it("filters out other project tasks when a paginated response is not scoped by the API", async () => {
        vi.mocked(api.get).mockResolvedValueOnce({
            data: {
                data: [makeTask(1, 7), makeTask(2, 8)],
                pagination: {
                    page: 1,
                    limit: 10,
                    totalItems: 2,
                    totalPages: 1,
                },
            },
        });

        const response = await taskService.getTasks(7, { page: 1, limit: 10 });

        expect(response.data).toHaveLength(1);
        expect(response.data[0].projectId).toBe(7);
        expect(response.pagination.totalItems).toBe(1);
    });
});
