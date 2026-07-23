import { create } from "zustand";
import type { Notification } from "../types/notification";
import { notificationService } from "../services/notification.service";
import { getApiErrorMessage } from "../utils/apiError";

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,

    fetchNotifications: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await notificationService.getNotifications();
            const unreadCount = data.filter((n) => !n.isRead).length;
            set({ notifications: data, unreadCount, isLoading: false });
        } catch (error: unknown) {
            set({
                error: getApiErrorMessage(error, "Failed to fetch notifications"),
                isLoading: false,
            });
        }
    },

    markAsRead: async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            const { notifications, unreadCount } = get();
            const updatedNotifications = notifications.map((n) =>
                n.id === id ? { ...n, isRead: true } : n
            );
            set({
                notifications: updatedNotifications,
                unreadCount: Math.max(0, unreadCount - 1),
            });
        } catch (error: unknown) {
            console.error("Failed to mark notification as read", error);
        }
    },

    markAllAsRead: async () => {
        try {
            await notificationService.markAllAsRead();
            const { notifications } = get();
            const updatedNotifications = notifications.map((n) => ({
                ...n,
                isRead: true,
            }));
            set({ notifications: updatedNotifications, unreadCount: 0 });
        } catch (error: unknown) {
            console.error("Failed to mark all notifications as read", error);
        }
    },
}));
