import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useTaskStore } from "../stores/taskStore";
import { useProjectStore } from "../stores/projectStore";
import { useUIStore } from "../stores/uiStore";
import { TaskCard } from "../components/tasks/TaskCard";
import type { TaskStatus } from "../types/task";
import { MdAdd } from "react-icons/md";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { TaskDialog } from "../components/tasks/TaskDialog";
import { TaskDetailDialog } from "../components/tasks/TaskDetailDialog";

import { TaskList } from "../components/tasks/TaskList";
import type { Task } from "../types/task";
import { MdFormatListBulleted, MdGridView } from "react-icons/md";

// ... (existing imports and constants)

const COLUMNS: { id: TaskStatus; label: string }[] = [
    { id: "backlog", label: "Backlog" },
    { id: "todo", label: "To Do" },
    { id: "in_progress", label: "In Progress" },
    { id: "review", label: "Review" },
    { id: "done", label: "Done" },
];

export function ProjectBoard() {
    const { projectId } = useParams();
    const { tasks, fetchTasks, isLoading, error, moveTask } = useTaskStore();
    const { projects } = useProjectStore();
    const setHeader = useUIStore((state) => state.setHeader);
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [createTaskDefaultStatus, setCreateTaskDefaultStatus] = useState<TaskStatus | undefined>(undefined);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<"board" | "list">("board");

    // Find current project name for header
    const currentProject = projects.find(p => p.id === Number(projectId));

    const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null;

    useEffect(() => {
        if (projectId) {
            fetchTasks(Number(projectId));
        }
    }, [projectId, fetchTasks]);

    // Set Header
    useEffect(() => {
        setHeader({
            title: currentProject?.name || "Project Board",
            description: currentProject?.description || "Manage your tasks",
        });
    }, [setHeader, currentProject]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const taskId = Number(draggableId);
        const newStatus = destination.droppableId as TaskStatus;

        // Optimistic update handled by store's moveTask
        moveTask(taskId, newStatus, destination.index);
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTaskId(task.id);
    };

    if (!projectId) return <div>Invalid Project ID</div>;

    return (
        <div className="flex flex-col h-full bg-background-light">
            {/* Board Content */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode("board")}
                            className={`p-2 rounded-md transition-all ${viewMode === "board"
                                ? "bg-white text-primary shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                            title="Board View"
                        >
                            <MdGridView size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-md transition-all ${viewMode === "list"
                                ? "bg-white text-primary shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                            title="List View"
                        >
                            <MdFormatListBulleted size={20} />
                        </button>
                    </div>

                    {viewMode === "list" && (
                        <button
                            onClick={() => {
                                setCreateTaskDefaultStatus(undefined);
                                setIsCreateTaskOpen(true);
                            }}
                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <MdAdd size={20} />
                            Add Task
                        </button>
                    )}
                </div>

                {isLoading && <div className="text-center py-10">Loading tasks...</div>}
                {error && <div className="text-center py-10 text-red-500">{error}</div>}

                {!isLoading && !error && (
                    viewMode === "board" ? (
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className="flex h-full gap-6 min-w-max">
                                {COLUMNS.map((column) => {
                                    const columnTasks = tasks.filter((task) => task.status === column.id);

                                    return (
                                        <div key={column.id} className="w-80 flex flex-col shrink-0 h-full">
                                            <div className="flex items-center justify-between mb-4 px-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-text-main-light">{column.label}</h3>
                                                    <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">
                                                        {columnTasks.length}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setCreateTaskDefaultStatus(column.id);
                                                        setIsCreateTaskOpen(true);
                                                    }}
                                                    className="text-gray-400 hover:text-primary transition-colors"
                                                >
                                                    <MdAdd />
                                                </button>
                                            </div>

                                            <Droppable droppableId={column.id}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        className={`flex-1 bg-surface-light/50 rounded-xl border border-gray-100/50 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent ${snapshot.isDraggingOver ? "bg-blue-50/50 border-blue-100" : ""
                                                            }`}
                                                    >
                                                        <div className="space-y-3">
                                                            {columnTasks.map((task, index) => (
                                                                <Draggable
                                                                    key={task.id}
                                                                    draggableId={String(task.id)}
                                                                    index={index}
                                                                >
                                                                    {(provided, snapshot) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={{
                                                                                ...provided.draggableProps.style,
                                                                                opacity: snapshot.isDragging ? 0.8 : 1,
                                                                            }}
                                                                        >
                                                                            <TaskCard
                                                                                task={task}
                                                                                onClick={() => handleTaskClick(task)}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {provided.placeholder}
                                                        </div>
                                                        {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                                                            <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-lg mt-2">
                                                                No tasks
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    );
                                })}
                            </div>
                        </DragDropContext>
                    ) : (
                        <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
                    )
                )}
            </div>

            <TaskDialog
                isOpen={isCreateTaskOpen}
                onClose={() => {
                    setIsCreateTaskOpen(false);
                    setCreateTaskDefaultStatus(undefined);
                }}
                projectId={Number(projectId)}
                defaultStatus={createTaskDefaultStatus}
            />

            {selectedTask && (
                <TaskDetailDialog
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTaskId(null)}
                    task={selectedTask}
                    projectId={Number(projectId)}
                />
            )}
        </div>
    );
}
