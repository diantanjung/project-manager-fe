import { create } from "zustand";
import { attachmentService } from "../services/attachment.service";
import type { Attachment } from "../types/attachment";

interface AttachmentState {
    attachments: Attachment[];
    isLoading: boolean;
    error: string | null;

    fetchAttachments: (taskId: number) => Promise<void>;
    uploadAttachment: (taskId: number, file: File) => Promise<void>;
    deleteAttachment: (id: number) => Promise<void>;
}

export const useAttachmentStore = create<AttachmentState>((set) => ({
    attachments: [],
    isLoading: false,
    error: null,

    fetchAttachments: async (taskId) => {
        set({ isLoading: true, error: null });
        try {
            const attachments = await attachmentService.getAttachments(taskId);
            set({ attachments, isLoading: false });
        } catch (err: unknown) {
            const message = (err as any).response?.data?.message || "Failed to fetch attachments";
            set({ error: message, isLoading: false });
        }
    },

    uploadAttachment: async (taskId, file) => {
        set({ isLoading: true, error: null });
        try {
            const newAttachment = await attachmentService.uploadAttachment(taskId, file);
            set((state) => ({
                attachments: [...state.attachments, newAttachment],
                isLoading: false,
            }));
        } catch (err: unknown) {
            const message = (err as any).response?.data?.message || "Failed to upload attachment";
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    deleteAttachment: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await attachmentService.deleteAttachment(id);
            set((state) => ({
                attachments: state.attachments.filter((a) => a.id !== id),
                isLoading: false,
            }));
        } catch (err: unknown) {
            const message = (err as any).response?.data?.message || "Failed to delete attachment";
            set({ error: message, isLoading: false });
            throw err;
        }
    },
}));
