export interface Attachment {
    id: number;
    fileName: string;
    fileUrl: string;
    fileSize: number | null;
    mimeType: string;
    taskId: number;
    uploaderId: number;
    createdAt: string;
    updatedAt: string;
    uploader?: {
        id: number;
        name: string;
        avatarUrl?: string;
    };
}

export interface CreateAttachmentResponse {
    attachment: Attachment;
}
