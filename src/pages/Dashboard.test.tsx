import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Dashboard } from "./Dashboard";
import { dashboardService } from "../services/dashboard.service";
import type { DashboardSummary } from "../services/dashboard.service";
import { useDashboardStore } from "../stores/dashboardStore";
import type { Task } from "../types/task";

vi.mock("../services/dashboard.service", () => ({
    dashboardService: {
        getDashboard: vi.fn(),
    },
}));

vi.mock("../components/tasks/TaskDetailDialog", () => ({
    TaskDetailDialog: ({ isOpen, task }: { isOpen: boolean; task: Task }) => (
        isOpen ? <div role="dialog">Task detail: {task.title}</div> : null
    ),
}));

const makeDashboardSummary = (): DashboardSummary => ({
    totalActiveProjects: 1,
    taskCountPerStatus: {
        backlog: 0,
        todo: 2,
        in_progress: 3,
        review: 1,
        done: 4,
    },
    activeProgress: {
        doing: 3,
        todo: 2,
        total: 5,
        ratio: 0.6,
        percentage: 60,
    },
    inReview: 1,
    dueSoon: 2,
    overdue: 1,
    overdueTaskCount: 1,
    workloadPerMember: {},
    recentlyUpdatedTasks: [],
    recentTasks: [
        {
            id: 11,
            title: "Finalize API contract",
            description: "Match dashboard payload",
            status: "todo",
            priority: "high",
            projectId: 1,
            creatorId: 1,
            assigneeId: 2,
            assigneeName: "Dian",
            dueDate: "2026-07-30",
            position: 1,
            createdAt: "2026-07-28T00:00:00.000Z",
            updatedAt: "2026-07-28T00:00:00.000Z",
        },
    ],
    upcomingDeadlines: [],
    highPriorityTasks: [],
    latestUpdates: [
        {
            id: 1,
            actorId: 2,
            entityType: "App\\Models\\Task",
            entityId: 11,
            action: "task.status_updated",
            before: null,
            after: { status: "todo" },
            ipAddress: null,
            userAgent: null,
            createdAt: "2026-07-28T00:00:00.000Z",
            actor: {
                id: 2,
                name: "Dian",
                email: "dian@example.com",
                role: "admin",
            },
        },
    ],
});

describe("Dashboard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useDashboardStore.getState().reset();
    });

    afterEach(() => {
        cleanup();
    });

    it("renders skeleton while loading dashboard summary without cache", async () => {
        vi.mocked(dashboardService.getDashboard).mockReturnValue(new Promise(() => undefined));

        render(<Dashboard />);

        expect(await screen.findByRole("status", { name: /loading dashboard/i })).toBeInTheDocument();
    });

    it("renders optimized dashboard summary data", async () => {
        vi.mocked(dashboardService.getDashboard).mockResolvedValueOnce(makeDashboardSummary());

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText("3/5")).toBeInTheDocument();
        });

        expect(dashboardService.getDashboard).toHaveBeenCalledTimes(1);
        expect(screen.getByText("Active Progress")).toBeInTheDocument();
        expect(screen.getByText("In Review")).toBeInTheDocument();
        expect(screen.getByText("Due Soon")).toBeInTheDocument();
        expect(screen.getByText("Overdue Tasks")).toBeInTheDocument();
        expect(screen.getByText("Finalize API contract")).toBeInTheDocument();
        expect(screen.getByText("Dian")).toBeInTheDocument();
        expect(screen.getByText("Task #11")).toBeInTheDocument();
    });

    it("opens task detail when a dashboard task is clicked", async () => {
        vi.mocked(dashboardService.getDashboard).mockResolvedValueOnce(makeDashboardSummary());

        render(<Dashboard />);

        const taskButton = await screen.findByRole("button", {
            name: /lihat detail task finalize api contract/i,
        });
        fireEvent.click(taskButton);

        expect(screen.getByRole("dialog")).toHaveTextContent("Task detail: Finalize API contract");
    });

    it("shows cached dashboard data while refreshing in the background", async () => {
        useDashboardStore.setState({
            summary: makeDashboardSummary(),
            lastFetchedAt: Date.now() - 60_000,
            isLoading: false,
            isRefreshing: false,
            error: null,
        });
        vi.mocked(dashboardService.getDashboard).mockReturnValue(new Promise(() => undefined));

        render(<Dashboard />);

        expect(screen.getByText("3/5")).toBeInTheDocument();
        expect(screen.queryByRole("status", { name: /loading dashboard/i })).not.toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("Refreshing")).toBeInTheDocument();
        });
        expect(dashboardService.getDashboard).toHaveBeenCalledTimes(1);
    });
});
