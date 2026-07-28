import { describe, expect, it, vi } from "vitest";
import { api } from "../lib/axios";
import { dashboardService } from "./dashboard.service";

vi.mock("../lib/axios", () => ({
    api: {
        get: vi.fn(),
    },
}));

describe("dashboardService", () => {
    it("fetches dashboard summary from the optimized dashboard endpoint", async () => {
        vi.mocked(api.get).mockResolvedValueOnce({
            data: {
                totalActiveProjects: 2,
                taskCountPerStatus: {
                    backlog: 0,
                    todo: 3,
                    in_progress: 2,
                    review: 1,
                    done: 4,
                },
                activeProgress: {
                    doing: 2,
                    todo: 3,
                    total: 5,
                    ratio: 0.4,
                    percentage: 40,
                },
                inReview: 1,
                dueSoon: 2,
                overdue: 1,
                overdueTaskCount: 1,
                workloadPerMember: {},
                recentlyUpdatedTasks: [],
                recentTasks: [
                    {
                        id: 7,
                        title: "Review dashboard",
                        description: null,
                        status: "todo",
                        priority: "high",
                        projectId: 9,
                        creatorId: 1,
                        assigneeId: 2,
                        assignee: {
                            id: 2,
                            name: "Dian",
                            avatarUrl: "/avatar.png",
                        },
                        dueDate: null,
                        position: 1,
                        createdAt: "2026-07-28T00:00:00.000Z",
                        updatedAt: "2026-07-28T00:00:00.000Z",
                    },
                ],
                upcomingDeadlines: [],
                highPriorityTasks: [],
                latestUpdates: [],
            },
        });

        const summary = await dashboardService.getDashboard();

        expect(api.get).toHaveBeenCalledWith("/dashboard");
        expect(summary.activeProgress.percentage).toBe(40);
        expect(summary.recentTasks[0]).toMatchObject({
            assigneeName: "Dian",
            assigneeAvatarUrl: "/avatar.png",
        });
    });
});
