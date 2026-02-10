import { api } from "../lib/axios";
import type { Comment, CreateCommentData, UpdateCommentData } from "../types/comment";

export const commentService = {
    getComments: async (taskId: number) => {
        const response = await api.get<Comment[]>(`/tasks/${taskId}/comments`);
        return response.data;
    },

    createComment: async (taskId: number, data: CreateCommentData) => {
        const response = await api.post<Comment>(`/tasks/${taskId}/comments`, data);
        return response.data;
    },

    updateComment: async (id: number, data: UpdateCommentData) => {
        const response = await api.patch<Comment>(`/comments/${id}`, data);
        return response.data;
    },

    deleteComment: async (id: number) => {
        await api.delete(`/comments/${id}`);
    },
};
