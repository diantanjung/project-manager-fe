import type { User } from "./auth";

export interface ActivityLog {
    id: number;
    actorId: number | null;
    entityType: string;
    entityId: number;
    action: string;
    before: Record<string, unknown> | null;
    after: Record<string, unknown> | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
    actor?: User;
}
