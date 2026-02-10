export interface Team {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTeamData {
    name: string;
    description?: string;
}

export interface UpdateTeamData {
    name?: string;
    description?: string;
}
