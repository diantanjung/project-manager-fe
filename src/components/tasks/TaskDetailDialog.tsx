import { useEffect, useState } from "react";
import { MdClose, MdPerson, MdCalendarToday, MdSend, MdDelete } from "react-icons/md";
import type { Task } from "../../types/task";
import { useCommentStore } from "../../stores/commentStore";
import { useAuthStore } from "../../stores/authStore";
import { TaskDialog } from "./TaskDialog";

interface TaskDetailDialogProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task;
    projectId: number;
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

const formatDate = (dateString?: string | null) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export function TaskDetailDialog({ isOpen, onClose, task, projectId }: TaskDetailDialogProps) {
    const { comments, fetchComments, addComment, deleteComment, isLoading } = useCommentStore();
    const { user } = useAuthStore();
    const [newComment, setNewComment] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        if (isOpen && task) {
            fetchComments(task.id);
        }
    }, [isOpen, task, fetchComments]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await addComment(task.id, newComment);
            setNewComment("");
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (window.confirm("Delete this comment?")) {
            await deleteComment(commentId);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh] animate-in fade-in zoom-in-95 duration-200">

                {/* Left: Task Details */}
                <div className="flex-1 flex flex-col border-r border-gray-100 overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${getPriorityColor(task.priority)}`}>
                                    {task.priority || "No Priority"}
                                </span>
                                <span className="text-xs text-gray-400 font-mono">#{task.id}</span>
                            </div>
                            <button onClick={() => setIsEditOpen(true)} className="text-sm text-primary hover:underline">
                                Edit
                            </button>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{task.title}</h2>

                        <div className="flex items-center gap-6 mb-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                    <MdPerson />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400">Assignee</span>
                                    {/* Ideally fetch assignee name or pass full user object if available in task */}
                                    <span className="font-medium">User {task.assigneeId}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-gray-50 text-gray-500">
                                    <MdCalendarToday />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400">Due Date</span>
                                    <span className="font-medium">{formatDate(task.dueDate)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                            <div className="prose prose-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                                {task.description || "No description provided."}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Comments */}
                <div className="w-full md:w-[400px] flex flex-col bg-gray-50/50">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                        <h3 className="font-semibold text-gray-800">Comments</h3>
                        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600">
                            <MdClose />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {isLoading ? (
                            <div className="text-center text-gray-400 text-sm py-4">Loading comments...</div>
                        ) : comments.length === 0 ? (
                            <div className="text-center text-gray-400 text-sm py-8">
                                No comments yet. Only existing team members can comment.
                            </div>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className="group flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0 text-xs">
                                        {/* Fallback initials */}
                                        {comment.author?.name?.charAt(0) || "U"}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {comment.author?.name || `User ${comment.authorId}`}
                                            </span>
                                            <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-700 bg-white p-2 rounded-lg border border-gray-100 shadow-sm relative group-hover:border-gray-300 transition-colors">
                                            {comment.content}
                                            {user?.id === comment.authorId && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                                                >
                                                    <MdDelete className="text-xs" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleAddComment} className="flex gap-2">
                            <input
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 bg-gray-50 border-0 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="p-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
                            >
                                <MdSend />
                            </button>
                        </form>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 shadow-sm md:flex hidden"
                >
                    <MdClose className="text-xl" />
                </button>
            </div>

            <TaskDialog
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                projectId={projectId}
                task={task}
            />
        </div>
    );
}
