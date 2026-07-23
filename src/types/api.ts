export interface ApiResource<T> {
    data: T;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface PaginatedResource<T> {
    data: T[];
    pagination: PaginationMeta;
}

export interface ApiValidationError {
    message: string;
    errors?: Record<string, string[]>;
}

export const unwrapResource = <T>(resource: ApiResource<T>): T => resource.data;

export const withPaginationFallback = <T>(
    resource: { data: T[]; pagination?: PaginationMeta },
    limit = resource.data.length || 1,
): PaginatedResource<T> => ({
    data: resource.data,
    pagination: resource.pagination ?? {
        page: 1,
        limit,
        totalItems: resource.data.length,
        totalPages: 1,
    },
});
