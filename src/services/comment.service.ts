import { api } from "../lib/axios";
import type { Comment, CreateCommentData, UpdateCommentData } from "../types/comment";
import type { ApiResource } from "../types/api";
import { unwrapResource } from "../types/api";

export const commentService = {
    getComments: async (taskId: number) => {
        const response = await api.get<{ data: Comment[] }>("/comments");
        return response.data.data.filter((comment) => comment.taskId === taskId);
    },

    createComment: async (taskId: number, data: CreateCommentData) => {
        const response = await api.post<ApiResource<Comment>>("/comments", {
            content: data.content,
            task_id: taskId,
            author_id: data.authorId,
        });
        return unwrapResource(response.data);
    },

    updateComment: async (id: number, data: UpdateCommentData) => {
        const response = await api.patch<ApiResource<Comment>>(`/comments/${id}`, data);
        return unwrapResource(response.data);
    },

    deleteComment: async (id: number) => {
        await api.delete(`/comments/${id}`);
    },
};
