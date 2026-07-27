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
import { projectService } from "../services/project.service";
import { taskService } from "../services/task.service";
import type { Project } from "../types/project";
import type { Task } from "../types/task";

const PAGE_SIZE = 100;
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

async function fetchAllProjects() {
  const firstPage = await projectService.getAllProjects({ page: 1, limit: PAGE_SIZE });
  const projects = [...firstPage.data];

  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const response = await projectService.getAllProjects({ page, limit: PAGE_SIZE });
    projects.push(...response.data);
  }

  return {
    projects,
    total: firstPage.pagination.totalItems,
  };
}

async function fetchAllTasksForProject(projectId: number) {
  const firstPage = await taskService.getTasks(projectId, { page: 1, limit: PAGE_SIZE });
  const tasks = [...firstPage.data];

  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const response = await taskService.getTasks(projectId, { page, limit: PAGE_SIZE });
    tasks.push(...response.data);
  }

  return tasks;
}

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

function getProjectName(projects: Project[], projectId: number) {
  return projects.find((project) => project.id === projectId)?.name ?? `Project #${projectId}`;
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
  projects,
  meta,
}: {
  task: Task;
  projects: Project[];
  meta?: React.ReactNode;
}) {
  const accent = TASK_ACCENT_STYLES[task.priority ?? "none"];
  const isDone = task.status === "done";

  return (
    <div className={`group bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-all relative overflow-hidden min-h-28 ${isDone ? "opacity-75" : ""}`}>
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
              {task.description || getProjectName(projects, task.projectId)}
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
    </div>
  );
}

function LatestUpdates({ tasks, projects }: { tasks: Task[]; projects: Project[] }) {
  return (
    <aside className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-text-main-light">Latest Updates</h2>
        <button className="text-xs text-primary hover:underline">View All</button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-sm text-text-muted-light text-center py-8">Belum ada update terbaru.</p>
      ) : (
        <div className="relative pl-4 border-l border-gray-200 space-y-6">
          {tasks.map((task, index) => (
            <div className="relative" key={task.id}>
              <div className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-white ${index < 2 ? "bg-primary" : "bg-gray-300"}`} />
              <p className="text-sm text-text-main-light leading-snug">
                <span className="font-bold">{task.title}</span> updated in{" "}
                <span className="text-primary">{getProjectName(projects, task.projectId)}</span>.
              </p>
              {index === 1 && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-text-muted-light border border-gray-100 leading-relaxed">
                  "{task.description || "Latest task detail has been updated."}"
                </div>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_STYLES[task.status]}`}>
                  {formatTaskStatus(task.status)}
                </span>
                {task.priority && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${PRIORITY_STYLES[task.priority]}`}>
                    {task.priority}
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted-light mt-2">{formatDate(task.updatedAt)}</p>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

export function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTotal, setProjectTotal] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>("recent");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      setIsLoading(true);
      setError(null);

      try {
        const projectResult = await fetchAllProjects();
        const projectTasks = await Promise.all(
          projectResult.projects.map((project) => fetchAllTasksForProject(project.id)),
        );

        if (!isMounted) return;

        setProjects(projectResult.projects);
        setProjectTotal(projectResult.total);
        setTasks(projectTasks.flat());
      } catch {
        if (isMounted) {
          setError("Dashboard belum bisa memuat data.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const doneTasks = tasks.filter((task) => task.status === "done").length;
    const overdueTasks = tasks.filter((task) => {
      if (!task.dueDate || task.status === "done") return false;
      return new Date(task.dueDate).getTime() < Date.now();
    }).length;
    const progress = tasks.length === 0 ? 0 : Math.round((doneTasks / tasks.length) * 100);

    return {
      doneTasks,
      overdueTasks,
      progress,
    };
  }, [tasks]);

  const deadlineTasks = useMemo(() => (
    tasks
      .filter((task) => task.dueDate && task.status !== "done")
      .sort((a, b) => new Date(a.dueDate ?? "").getTime() - new Date(b.dueDate ?? "").getTime())
      .slice(0, 5)
  ), [tasks]);

  const recentTasks = useMemo(() => (
    [...tasks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
  ), [tasks]);

  const highPriorityTasks = useMemo(() => (
    tasks
      .filter((task) => task.priority === "high" || task.priority === "urgent")
      .sort((a, b) => {
        const prioritySort = Number(b.priority === "urgent") - Number(a.priority === "urgent");
        if (prioritySort !== 0) return prioritySort;
        return new Date(a.dueDate ?? a.updatedAt).getTime() - new Date(b.dueDate ?? b.updatedAt).getTime();
      })
      .slice(0, 5)
  ), [tasks]);

  const recentActivities = useMemo(() => (
    [...tasks]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
  ), [tasks]);

  const activeTasks = useMemo(() => {
    if (activeTab === "deadlines") return deadlineTasks.slice(0, 3);
    if (activeTab === "priority") return highPriorityTasks.slice(0, 3);
    return recentTasks;
  }, [activeTab, deadlineTasks, highPriorityTasks, recentTasks]);

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
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Projects"
            value={isLoading ? "..." : String(projectTotal)}
            icon={<MdTrendingUp />}
            color="green"
          />
          <StatCard
            title="Total Tasks"
            value={isLoading ? "..." : String(tasks.length)}
            icon={<MdSchedule />}
            color="orange"
          />
          <StatCard
            title="Progress Project"
            value={isLoading ? "..." : `${stats.progress}%`}
            icon={<MdFolder />}
            color="blue"
            progress={stats.progress}
            showProgress
          />
          <StatCard
            title="Overdue Tasks"
            value={isLoading ? "..." : String(stats.overdueTasks)}
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
                  projects={projects}
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

          <LatestUpdates tasks={recentActivities} projects={projects} />
        </div>
      </div>
    </div>
  );
}
