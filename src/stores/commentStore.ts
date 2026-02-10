import { create } from "zustand";
import { commentService } from "../services/comment.service";
import type { Comment } from "../types/comment";

interface CommentState {
    comments: Comment[];
    isLoading: boolean;
    error: string | null;

    fetchComments: (taskId: number) => Promise<void>;
    addComment: (taskId: number, content: string) => Promise<Comment | undefined>;
    deleteComment: (id: number) => Promise<void>;
}

export const useCommentStore = create<CommentState>((set) => ({
    comments: [],
    isLoading: false,
    error: null,

    fetchComments: async (taskId) => {
        set({ isLoading: true, error: null });
        try {
            const comments = await commentService.getComments(taskId);
            set({ comments, isLoading: false });
        } catch (err: unknown) {
            const message =
                // eslint-disable-next-line
                (err as any).response?.data?.message || "Failed to fetch comments";
            set({ error: message, isLoading: false });
        }
    },

    addComment: async (taskId, content) => {
        // Determine if we need optimistic UI here. Comments usually benefit from it.
        // But we need the author info which might be tricky to mock fully without auth store access here easily.
        // Let's stick to standard async for now.
        try {
            const newComment = await commentService.createComment(taskId, { content });
            set((state) => ({
                comments: [...state.comments, newComment],
            }));
            return newComment;
        } catch (err: unknown) {
            const message =
                // eslint-disable-next-line
                (err as any).response?.data?.message || "Failed to add comment";
            console.error(message);
            throw err;
        }
    },

    deleteComment: async (id) => {
        try {
            await commentService.deleteComment(id);
            set((state) => ({
                comments: state.comments.filter((c) => c.id !== id),
            }));
        } catch (err: unknown) {
            const message =
                // eslint-disable-next-line
                (err as any).response?.data?.message || "Failed to delete comment";
            console.error(message);
            throw err;
        }
    },
}));
