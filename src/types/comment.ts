import type { User } from "./auth";

export interface Comment {
    id: number;
    content: string;
    taskId: number;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    author?: User; // Backend usually includes this
}

export interface CreateCommentData {
    content: string;
}

export interface UpdateCommentData {
    content: string;
}
