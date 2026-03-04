import { useForm, Controller } from "react-hook-form";
import type { CreateTaskData, TaskStatus, TaskPriority, Task } from "../../types/task";
import { useTaskStore } from "../../stores/taskStore";
// import Select from "react-select"; // User asked for react hook form, assuming we use basic select or custom for now to match UI or use react-select if preferred.
// Following existing patterns, I will use standard HTML selects for simplicity or reuse existing select components if any.
// The user previously installed react-select in a conversation but I will stick to standard form elements for speed unless requested otherwise.
// Wait, user's previous conversation mentioned fixing react-select. I should probably use it if available.
// Looking at package.json, react-select IS installed.

import Select from "react-select";
import { useEffect, useMemo } from "react";
// import { useTeamStore } from "../../stores/teamStore"; // To get members to assign?
// Actually we need project members. Project has team. Team has members.
// We probably need to fetch project team members. 
// For now, I'll use a mocked list or if I have access to users.
import { useUserStore } from "../../stores/userStore";
import { useAttachmentStore } from "../../stores/attachmentStore";
import { MdAttachFile } from "react-icons/md";

interface TaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: number;
    task?: Task; // If editing
    defaultStatus?: TaskStatus;
}

interface TaskFormValues {
    title: string;
    description: string;
    status: { value: TaskStatus; label: string };
    priority: { value: TaskPriority; label: string };
    assignee: { value: number; label: string } | null;
    dueDate: string;
    attachment?: FileList;
}

const statusOptions = [
    { value: "backlog" as const, label: "Backlog" },
    { value: "todo" as const, label: "To Do" },
    { value: "in_progress" as const, label: "In Progress" },
    { value: "review" as const, label: "Review" },
    { value: "done" as const, label: "Done" },
];

const priorityOptions = [
    { value: "low" as const, label: "Low" },
    { value: "medium" as const, label: "Medium" },
    { value: "high" as const, label: "High" },
    { value: "urgent" as const, label: "Urgent" },
];

export function TaskDialog({ isOpen, onClose, projectId, task, defaultStatus }: TaskDialogProps) {
    const { createTask, updateTask } = useTaskStore();
    const { uploadAttachment } = useAttachmentStore();
    const { users, fetchUsers } = useUserStore(); // Using global users for now, ideally filtered by project

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen, fetchUsers]);

    const userOptions = useMemo(() => users.map(u => ({ value: u.id, label: u.name })), [users]);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<TaskFormValues>({
        defaultValues: {
            title: "",
            description: "",
            status: statusOptions[1], // Todo default
            priority: priorityOptions[1], // Medium default
            assignee: null,
            dueDate: "",
        },
    });

    useEffect(() => {
        if (task) {
            reset({
                title: task.title,
                description: task.description || "",
                status: statusOptions.find(o => o.value === task.status) || statusOptions[0],
                priority: priorityOptions.find(o => o.value === task.priority) || priorityOptions[1],
                assignee: userOptions.find(u => u.value === task.assigneeId) || null,
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
            });
        } else {
            // Only reset to defaults if isOpen is true and there is no task (create mode)
            if (isOpen) {
                const initialStatus = defaultStatus
                    ? statusOptions.find(o => o.value === defaultStatus) || statusOptions[1]
                    : statusOptions[1];

                reset({
                    title: "",
                    description: "",
                    status: initialStatus,
                    priority: priorityOptions[1],
                    assignee: null,
                    dueDate: "",
                });
            }
        }
    }, [task, isOpen, reset, userOptions, defaultStatus]);

    if (!isOpen) return null;

    const onSubmit = async (data: TaskFormValues) => {
        try {
            const payload: CreateTaskData = {
                title: data.title,
                description: data.description,
                status: data.status.value,
                priority: data.priority.value,
                projectId,
                assigneeId: data.assignee?.value || 0, // Handle unassigned? Schema says Not Null usually.
                dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
            };

            let targetTaskId = task?.id;

            if (task) {
                // Optimization: only send changed fields in real app
                await updateTask(task.id, payload);
            } else {
                const newTask = await createTask(payload);
                targetTaskId = newTask?.id;
            }

            if (targetTaskId && data.attachment && data.attachment.length > 0) {
                await uploadAttachment(targetTaskId, data.attachment[0]);
            }

            onClose();
            reset();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">
                        {task ? "Edit Task" : "Create New Task"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            {...register("title", { required: "Title is required" })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="Task title"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            {...register("description")}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px]"
                            placeholder="Add details..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {(!defaultStatus || task) && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field} options={statusOptions} className="text-sm" />
                                    )}
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} options={priorityOptions} className="text-sm" />
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assignee
                            </label>
                            <Controller
                                name="assignee"
                                control={control}
                                rules={{ required: "Assignee is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={userOptions}
                                        className="text-sm"
                                        placeholder="Select user..."
                                    />
                                )}
                            />
                            {errors.assignee && (
                                <p className="text-red-500 text-xs mt-1">{errors.assignee.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Due Date
                            </label>
                            <input
                                type="date"
                                {...register("dueDate")}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Attachment
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                {...register("attachment")}
                                className="w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-semibold
                                file:bg-primary/10 file:text-primary
                                hover:file:bg-primary/20
                                cursor-pointer"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <MdAttachFile className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm shadow-primary/30 transition-colors"
                        >
                            {task ? "Save Changes" : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
