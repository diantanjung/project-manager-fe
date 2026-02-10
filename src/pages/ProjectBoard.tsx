import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useTaskStore } from "../stores/taskStore";
import { useProjectStore } from "../stores/projectStore";
import { TaskCard } from "../components/tasks/TaskCard";
import type { TaskStatus } from "../types/task";
import { MdAdd } from "react-icons/md";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { TaskDialog } from "../components/tasks/TaskDialog";
import { TaskDetailDialog } from "../components/tasks/TaskDetailDialog";
import type { Task } from "../types/task";

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
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

    // Find current project name for header
    const currentProject = projects.find(p => p.id === Number(projectId));

    const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null;

    useEffect(() => {
        if (projectId) {
            fetchTasks(Number(projectId));
        }
    }, [projectId, fetchTasks]);

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
            {/* Header */}
            <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-text-main-light">
                        {currentProject?.name || "Project Board"}
                    </h1>
                    <p className="text-sm text-text-muted-light">
                        {currentProject?.description || "Manage your tasks"}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Filter placeholders */}
                    <button className="text-sm font-medium text-text-muted-light hover:text-primary transition-colors">
                        Filter
                    </button>
                    <button
                        onClick={() => setIsTaskDialogOpen(true)}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm"
                    >
                        <MdAdd className="text-lg" />
                        New Task
                    </button>
                </div>
            </div>

            {/* Board Content */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                {isLoading && <div className="text-center py-10">Loading tasks...</div>}
                {error && <div className="text-center py-10 text-red-500">{error}</div>}

                {!isLoading && !error && (
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
                                                onClick={() => setIsTaskDialogOpen(true)}
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
                )}
            </div>

            <TaskDialog
                isOpen={isTaskDialogOpen}
                onClose={() => setIsTaskDialogOpen(false)}
                projectId={Number(projectId)}
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
