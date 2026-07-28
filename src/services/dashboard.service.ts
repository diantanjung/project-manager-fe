import { api } from "../lib/axios";
import type { ActivityLog } from "../types/activity";
import type { Task, TaskStatus } from "../types/task";

export interface DashboardSummary {
    totalActiveProjects: number;
    taskCountPerStatus: Record<TaskStatus, number>;
    activeProgress: {
        doing: number;
        todo: number;
        total: number;
        ratio: number;
        percentage: number;
    };
    inReview: number;
    dueSoon: number;
    overdue: number;
    overdueTaskCount: number;
    workloadPerMember: Record<string, number>;
    recentlyUpdatedTasks: Task[];
    recentTasks: Task[];
    upcomingDeadlines: Task[];
    highPriorityTasks: Task[];
    latestUpdates: ActivityLog[];
}

const normalizeTask = (task: Task): Task => ({
    ...task,
    assigneeName: task.assignee?.name ?? task.assigneeName,
    assigneeAvatarUrl: task.assignee?.avatarUrl ?? task.assigneeAvatarUrl,
});

const normalizeDashboardSummary = (summary: DashboardSummary): DashboardSummary => ({
    ...summary,
    recentlyUpdatedTasks: summary.recentlyUpdatedTasks.map(normalizeTask),
    recentTasks: summary.recentTasks.map(normalizeTask),
    upcomingDeadlines: summary.upcomingDeadlines.map(normalizeTask),
    highPriorityTasks: summary.highPriorityTasks.map(normalizeTask),
});

export const dashboardService = {
    getDashboard: async () => {
        const response = await api.get<DashboardSummary>("/dashboard");
        return normalizeDashboardSummary(response.data);
    },
};
