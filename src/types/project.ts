export interface Project {
    id: number;
    name: string;
    description: string | null;
    ownerId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectData {
    name: string;
    description?: string;
    ownerId?: number;
    teamId?: number;
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
    ownerId?: number;
}
