import { api } from "../lib/axios";
import type { Attachment } from "../types/attachment";
import type { ApiResource } from "../types/api";
import { unwrapResource } from "../types/api";

type AttachmentResource = Partial<Attachment> & {
    file_name?: string;
    original_name?: string;
    originalName?: string;
    file_url?: string;
    download_url?: string;
    downloadUrl?: string;
    file_size?: number | null;
    size?: number | null;
    mime_type?: string | null;
    task_id?: number;
    uploader_id?: number;
    created_at?: string;
    updated_at?: string;
};

const normalizeAttachment = (attachment: AttachmentResource): Attachment => ({
    id: attachment.id ?? 0,
    fileName: attachment.fileName ?? attachment.originalName ?? attachment.original_name ?? attachment.file_name ?? "",
    fileUrl: attachment.fileUrl ?? attachment.file_url ?? "",
    downloadUrl: attachment.downloadUrl ?? attachment.download_url,
    fileSize: attachment.fileSize ?? attachment.size ?? attachment.file_size ?? null,
    mimeType: attachment.mimeType ?? attachment.mime_type ?? "",
    taskId: attachment.taskId ?? attachment.task_id ?? 0,
    uploaderId: attachment.uploaderId ?? attachment.uploader_id ?? 0,
    createdAt: attachment.createdAt ?? attachment.created_at ?? "",
    updatedAt: attachment.updatedAt ?? attachment.updated_at ?? "",
    uploader: attachment.uploader,
});

const getAttachmentDownloadUrl = (id: number) => {
    const baseUrl = String(api.defaults.baseURL ?? "").replace(/\/+$/, "");
    return `${baseUrl}/attachments/${id}/download`;
};

const getBackendOrigin = () => {
    const baseUrl = String(api.defaults.baseURL ?? "").replace(/\/+$/, "");
    return baseUrl.replace(/\/api(\/v1)?$/, "");
};

const getAttachmentViewUrl = (attachment: Pick<Attachment, "id" | "fileUrl">) => {
    if (!attachment.fileUrl) {
        return getAttachmentDownloadUrl(attachment.id);
    }

    if (/^(https?:|blob:|data:)/.test(attachment.fileUrl)) {
        return attachment.fileUrl;
    }

    const path = attachment.fileUrl.startsWith("/")
        ? attachment.fileUrl
        : `/${attachment.fileUrl}`;

    return `${getBackendOrigin()}${path}`;
};

export const attachmentService = {
    getAttachments: async (taskId: number): Promise<Attachment[]> => {
        const response = await api.get<{ data: AttachmentResource[] }>(`/tasks/${taskId}/attachments`);
        return response.data.data.map(normalizeAttachment);
    },

    uploadAttachment: async (taskId: number, file: File): Promise<Attachment> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post<ApiResource<AttachmentResource>>(`/tasks/${taskId}/attachments`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return normalizeAttachment(unwrapResource(response.data));
    },

    deleteAttachment: async (id: number): Promise<void> => {
        await api.delete(`/attachments/${id}`);
    },

    downloadAttachment: async (attachment: Pick<Attachment, "id" | "downloadUrl">): Promise<Blob> => {
        const response = await api.get<Blob>(attachment.downloadUrl ?? `/attachments/${attachment.id}/download`, {
            responseType: "blob",
        });
        return response.data;
    },

    getAttachmentDownloadUrl,
    getAttachmentViewUrl,
};
