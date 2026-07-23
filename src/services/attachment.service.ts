import { api } from "../lib/axios";
import type { Attachment } from "../types/attachment";
import type { ApiResource } from "../types/api";
import { unwrapResource } from "../types/api";

export const attachmentService = {
    getAttachments: async (taskId: number): Promise<Attachment[]> => {
        const response = await api.get<{ data: Attachment[] }>("/attachments");
        return response.data.data.filter((attachment) => attachment.taskId === taskId);
    },

    uploadAttachment: async (taskId: number, file: File, uploaderId: number): Promise<Attachment> => {
        const response = await api.post<ApiResource<Attachment>>("/attachments", {
            file_name: file.name,
            file_url: `${window.location.origin}/uploads/${encodeURIComponent(file.name)}`,
            file_size: file.size,
            mime_type: file.type || null,
            task_id: taskId,
            uploader_id: uploaderId,
        });
        return unwrapResource(response.data);
    },

    deleteAttachment: async (id: number): Promise<void> => {
        await api.delete(`/attachments/${id}`);
    },
};
