import { useEffect, useMemo, useState } from "react";
import {
  MdCalendarToday,
  MdFolder,
  MdPriorityHigh,
  MdSchedule,
  MdTrendingUp,
  MdChatBubbleOutline,
  MdAttachFile,
} from "react-icons/md";
import StatCard from "../components/shared/StatCard";
import { Skeleton } from "../components/shared/Loading";
import { TaskDetailDialog } from "../components/tasks/TaskDetailDialog";
import { useDashboardStore } from "../stores/dashboardStore";
import type { ActivityLog } from "../types/activity";
import type { Task } from "../types/task";

const DUE_SOON_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const PRIORITY_STYLES = {
  urgent: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-blue-100 text-blue-700",
  low: "bg-green-100 text-green-700",
};
const STATUS_STYLES = {
  backlog: "bg-gray-100 text-gray-600",
  todo: "bg-blue-100 text-blue-700",
  in_progress: "bg-primary/10 text-primary",
  review: "bg-purple-100 text-purple-700",
  done: "bg-green-100 text-green-700",
};
const TASK_ACCENT_STYLES = {
  urgent: "bg-red-500",
  high: "bg-accent-orange",
  medium: "bg-primary",
  low: "bg-accent-green",
  none: "bg-gray-300",
};
const DASHBOARD_TABS = [
  { id: "recent", label: "Recent Tasks" },
  { id: "deadlines", label: "Upcoming Deadlines" },
  { id: "priority", label: "High Priority" },
] as const;

type DashboardTab = typeof DASHBOARD_TABS[number]["id"];

function formatDate(value: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getRelativeDate(value: string | null) {
  if (!value) return "Tanpa deadline";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  const diffDays = Math.round((date.getTime() - today.getTime()) / MS_PER_DAY);

  if (diffDays < 0) return `Terlambat ${Math.abs(diffDays)} hari`;
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Besok";
  return `${diffDays} hari lagi`;
}

function getTaskProjectName(task: Task) {
  return task.project?.name ?? `Project #${task.projectId}`;
}

function formatTaskStatus(status: Task["status"]) {
  return status.replace("_", " ");
}

function EmptyTaskState({ label }: { label: string }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 text-sm text-text-muted-light text-center">
      {label}
    </div>
  );
}

function TaskPreviewCard({
  task,
  meta,
  onClick,
}: {
  task: Task;
  meta?: React.ReactNode;
  onClick: (task: Task) => void;
}) {
  const accent = TASK_ACCENT_STYLES[task.priority ?? "none"];
  const isDone = task.status === "done";

  return (
    <button
      type="button"
      onClick={() => onClick(task)}
      className={`group w-full text-left bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all relative overflow-hidden min-h-28 ${isDone ? "opacity-75" : ""}`}
      aria-label={`Lihat detail task ${task.title}`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent}`} />
      <div className="flex items-start justify-between gap-4 pl-1">
        <div className="flex items-start gap-4 min-w-0">
          <span className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${isDone ? "bg-primary border-primary text-white" : "border-gray-300"}`}>
            {isDone && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
          </span>
          <div className="min-w-0">
            <h3 className={`text-base font-semibold text-text-main-light group-hover:text-primary transition-colors truncate ${isDone ? "line-through text-gray-500" : ""}`}>
              {task.title}
            </h3>
            <p className="text-sm text-text-muted-light mt-1 font-light truncate max-w-2xl">
              {task.description || getTaskProjectName(task)}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {task.priority && !isDone && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${PRIORITY_STYLES[task.priority]}`}>
                  {task.priority === "high" || task.priority === "urgent" ? "High Priority" : task.priority}
                </span>
              )}
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_STYLES[task.status]}`}>
                {isDone ? "Completed" : formatTaskStatus(task.status)}
              </span>
              {task.dueDate && (
                <span className="flex items-center gap-1 text-xs text-text-muted-light">
                  <MdCalendarToday className="text-sm" />
                  {formatDate(task.dueDate)}
                </span>
              )}
              {meta}
            </div>
          </div>
        </div>
        <div className="flex -space-x-2 shrink-0">
          {task.assigneeAvatarUrl ? (
            <img
              alt={task.assigneeName ?? "Assignee"}
              className="h-8 w-8 rounded-full border-2 border-white object-cover"
              src={task.assigneeAvatarUrl}
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-100 text-text-muted-light flex items-center justify-center text-[10px] font-semibold border-2 border-white">
              {(task.assigneeName ?? "NA").slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function formatActivityAction(action: string) {
  return action.replace(/[._]/g, " ");
}

function getActivityEntityLabel(activity: ActivityLog) {
  if (activity.entityType.includes("Task")) return `Task #${activity.entityId}`;
  if (activity.entityType.includes("Project")) return `Project #${activity.entityId}`;
  return `Item #${activity.entityId}`;
}

function LatestUpdates({ activities }: { activities: ActivityLog[] }) {
  return (
    <aside className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-text-main-light">Latest Updates</h2>
        <button className="text-xs text-primary hover:underline">View All</button>
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-text-muted-light text-center py-8">Belum ada update terbaru.</p>
      ) : (
        <div className="relative pl-4 border-l border-gray-200 space-y-6">
          {activities.map((activity, index) => (
            <div className="relative" key={activity.id}>
              <div className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-white ${index < 2 ? "bg-primary" : "bg-gray-300"}`} />
              <p className="text-sm text-text-main-light leading-snug">
                <span className="font-bold">{activity.actor?.name ?? "System"}</span>{" "}
                {formatActivityAction(activity.action)}{" "}
                <span className="text-primary">{getActivityEntityLabel(activity)}</span>.
              </p>
              {index === 1 && activity.after && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-text-muted-light border border-gray-100 leading-relaxed">
                  "{Object.entries(activity.after).slice(0, 2).map(([key, value]) => `${key}: ${String(value)}`).join(", ")}"
                </div>
              )}
              <p className="text-xs text-text-muted-light mt-2">{formatDate(activity.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Loading dashboard">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-40">
            <div className="flex items-start justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <Skeleton className="h-10 w-20 mt-12" />
            {index === 0 && <Skeleton className="h-1.5 w-full mt-4 rounded-full" />}
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.1fr)_minmax(320px,1fr)] gap-6">
        <div className="space-y-6">
          <div className="flex w-fit gap-2 rounded-xl border border-gray-100 bg-white p-1 shadow-sm">
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-36 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 min-h-28">
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-4 w-3/4 mt-3" />
                <div className="flex gap-3 mt-4">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Skeleton className="h-6 w-40 mb-8" />
          <div className="space-y-6">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index}>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
                <Skeleton className="h-3 w-20 mt-3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const {
    summary,
    isLoading,
    isRefreshing,
    error,
    fetchDashboard,
  } = useDashboardStore();
  const [activeTab, setActiveTab] = useState<DashboardTab>("recent");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const activeTasks = useMemo(() => {
    if (!summary) return [];
    if (activeTab === "deadlines") return summary.upcomingDeadlines.slice(0, 3);
    if (activeTab === "priority") return summary.highPriorityTasks.slice(0, 3);
    return summary.recentTasks.slice(0, 3);
  }, [activeTab, summary]);

  const activeEmptyLabel = {
    recent: "Belum ada recent task.",
    deadlines: "Belum ada upcoming deadline.",
    priority: "Tidak ada task high priority.",
  }[activeTab];

  return (
    <div className="flex flex-col h-full bg-background-light">
      <div className="flex-1 overflow-y-auto p-6 lg:px-10 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-main-light mb-1">Dashboard</h1>
            <p className="text-text-muted-light text-sm">Ringkasan project, task, deadline, dan aktivitas terbaru.</p>
          </div>
          {isRefreshing && summary && (
            <div className="flex items-center gap-2 text-xs text-text-muted-light">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Refreshing
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading && !summary ? (
          <DashboardSkeleton />
        ) : summary && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Active Progress"
                value={`${summary.activeProgress.doing}/${summary.activeProgress.total}`}
                icon={<MdTrendingUp />}
                color="green"
                progress={summary.activeProgress.percentage}
                helperText={`${Math.round(summary.activeProgress.percentage)}% doing from todo + doing`}
                showProgress
              />
              <StatCard
                title="In Review"
                value={String(summary.inReview)}
                icon={<MdFolder />}
                color="purple"
                helperText="Needs review"
              />
              <StatCard
                title="Due Soon"
                value={String(summary.dueSoon)}
                icon={<MdSchedule />}
                color="blue"
                helperText={`Next ${DUE_SOON_DAYS} days`}
              />
              <StatCard
                title="Overdue Tasks"
                value={String(summary.overdue)}
                icon={<MdPriorityHigh />}
                color="red"
                helperText="Requires immediate action"
                dangerValue
              />
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.1fr)_minmax(320px,1fr)] gap-6">
              <div className="space-y-6">
                <div className="flex items-center bg-white p-1 rounded-xl w-fit border border-gray-100 shadow-sm">
                  {DASHBOARD_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-1.5 rounded-lg text-sm transition-all ${activeTab === tab.id
                        ? "bg-gray-100 text-text-main-light font-medium shadow-sm"
                        : "text-text-muted-light hover:bg-gray-50"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {activeTasks.length === 0 ? (
                    <EmptyTaskState label={activeEmptyLabel} />
                  ) : activeTasks.map((task) => (
                    <TaskPreviewCard
                      key={task.id}
                      task={task}
                      onClick={setSelectedTask}
                      meta={
                        <>
                          {activeTab === "recent" && (
                            <span className="flex items-center gap-1 text-xs text-text-muted-light">
                              <MdChatBubbleOutline className="text-sm" />
                              {task.id}
                            </span>
                          )}
                          {activeTab === "deadlines" && (
                            <span className="text-xs font-medium text-text-muted-light">
                              {getRelativeDate(task.dueDate)}
                            </span>
                          )}
                          {activeTab === "priority" && (
                            <span className="flex items-center gap-1 text-xs text-text-muted-light">
                              <MdAttachFile className="text-sm" />
                              {task.assigneeName ?? "Unassigned"}
                            </span>
                          )}
                        </>
                      }
                    />
                  ))}
                </div>
              </div>

              <LatestUpdates activities={summary.latestUpdates} />
            </div>

            {selectedTask && (
              <TaskDetailDialog
                isOpen
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                projectId={selectedTask.projectId}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
