import { api } from "../lib/axios";
import type { Notification } from "../types/notification";

export const notificationService = {
    getNotifications: async (): Promise<{ count: number; data: Notification[] }> => {
        const response = await api.get("/notifications");
        return response.data;
    },

    markAsRead: async (id: string): Promise<Notification> => {
        const response = await api.patch(`/notifications/${id}/read`);
        return response.data.data;
    },

    markAllAsRead: async (): Promise<void> => {
        const response = await api.patch("/notifications/read-all");
        return response.data;
    },
};
