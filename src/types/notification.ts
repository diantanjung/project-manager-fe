export type NotificationType = "task_assigned" | "mention" | "system_alert";

export interface Notification {
    id: number;
    userId: number;
    actorId: number | null;
    actorName: string | null;
    actorAvatarUrl: string | null;
    type: NotificationType;
    taskId: number | null;
    isRead: boolean;
    createdAt: string;
}
