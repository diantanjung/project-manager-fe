import { MdFlag, MdAccessTime } from "react-icons/md";
import type { Task, TaskPriority, TaskStatus } from "../../types/task";
import { getFullAvatarUrl } from "../../utils/avatar";

interface TaskListProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

const getPriorityColor = (priority: TaskPriority | null) => {
    switch (priority) {
        case "urgent":
            return "text-red-500 bg-red-50";
        case "high":
            return "text-orange-500 bg-orange-50";
        case "medium":
            return "text-blue-500 bg-blue-50";
        case "low":
            return "text-gray-500 bg-gray-50";
        default:
            return "text-gray-400 bg-gray-50";
    }
};

const getStatusColor = (status: TaskStatus) => {
    switch (status) {
        case "done":
            return "text-green-600 bg-green-50";
        case "in_progress":
            return "text-blue-600 bg-blue-50";
        case "review":
            return "text-purple-600 bg-purple-50";
        case "todo":
            return "text-yellow-600 bg-yellow-50";
        case "backlog":
        default:
            return "text-gray-600 bg-gray-50";
    }
};

const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export function TaskList({ tasks, onTaskClick }: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white rounded-xl border border-gray-100">
                <p>No tasks found</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Priority</th>
                        <th className="px-6 py-4">Assignee</th>
                        <th className="px-6 py-4">Due Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {tasks.map((task) => (
                        <tr
                            key={task.id}
                            onClick={() => onTaskClick(task)}
                            className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                        >
                            <td className="px-6 py-4 text-xs font-medium text-gray-400">
                                #{task.id}
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm font-medium text-text-main-light group-hover:text-primary transition-colors">
                                    {task.title}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                    {formatStatus(task.status)}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {task.priority && (
                                    <div className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                                        <MdFlag className="text-xs" />
                                        {task.priority}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    {task.assigneeAvatarUrl ? (
                                        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 shadow-sm border border-gray-100">
                                            <img
                                                src={getFullAvatarUrl(task.assigneeAvatarUrl)}
                                                alt={task.assigneeName || `User ${task.assigneeId}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-accent-purple flex items-center justify-center text-xs text-white uppercase font-bold shrink-0">
                                            {(task.assigneeName ? task.assigneeName.charAt(0) : 'U').toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-sm text-gray-600 truncate max-w-[120px]" title={task.assigneeName || `User ${task.assigneeId}`}>
                                        {task.assigneeName || `User ${task.assigneeId}`}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {task.dueDate && (
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                        <MdAccessTime className="text-gray-400" />
                                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
