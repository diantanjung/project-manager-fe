export interface Attachment {
    id: number;
    filename: string;
    url: string;
    mimeType: string;
    size: number;
    taskId: number;
    uploaderId: number;
    uploadedAt: string;
    uploader?: {
        id: number;
        name: string;
        avatarUrl?: string;
    };
}

export interface CreateAttachmentResponse {
    attachment: Attachment;
}
