export interface Project {
    id: number;
    name: string;
    description: string | null;
    teamId: number;
    ownerId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectData {
    name: string;
    description?: string;
    teamId: number;
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
    teamId?: number;
}
