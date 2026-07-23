export type NotificationType = "task_assigned" | "mention" | "system_alert";

export interface Notification {
    id: string;
    userId: number | string;
    actorId: number | string | null;
    actorName: string | null;
    actorAvatarUrl: string | null;
    type: NotificationType;
    taskId: number | null;
    isRead: boolean;
    createdAt: string;
}
