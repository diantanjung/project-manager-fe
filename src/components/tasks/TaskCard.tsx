import type { Task } from "../../types/task";
import { MdFlag, MdAccessTime } from "react-icons/md";

interface TaskCardProps {
    task: Task;
    onClick?: () => void;
}

const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
        case "urgent":
            return "text-red-500 bg-red-50";
        case "high":
            return "text-orange-500 bg-orange-50";
        case "medium":
            return "text-blue-500 bg-blue-50";
        case "low":
        default:
            return "text-gray-500 bg-gray-50";
    }
};

export function TaskCard({ task, onClick }: TaskCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-gray-400">#{task.id}</span>
                {task.priority && (
                    <div
                        className={`flex items-center gap-1 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${getPriorityColor(
                            task.priority
                        )}`}
                    >
                        <MdFlag className="text-xs" />
                        {task.priority}
                    </div>
                )}
            </div>
            <h4 className="text-sm font-medium text-text-main-light mb-2 line-clamp-2">
                {task.title}
            </h4>
            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <MdAccessTime />
                    <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'}</span>
                </div>
                {/* Placeholder for assignee avatar */}
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 font-bold">
                    A
                </div>
            </div>
        </div>
    );
}
