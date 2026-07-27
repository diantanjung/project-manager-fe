import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import { useUserStore } from "../../stores/userStore";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

import { UserList } from "../../components/users/UserList";
import { UserDialog } from "../../components/users/UserDialog";
import type { User } from "../../types/auth";
import type { CreateUserData, UpdateUserData } from "../../services/user.service";
import { MdAdd } from "react-icons/md";

const USER_PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

export function Users() {
    const {
        users,
        isLoading,
        error,
        page,
        totalPages,
        total,
        limit,
        filters,
        setParams,
        createUser,
        updateUser,
        deleteUser,
        setError,
    } = useUserStore();

    const [searchParams, setSearchParams] = useSearchParams();
    const searchFromParams = searchParams.get("search") || "";
    const [searchInput, setSearchInput] = useState(searchFromParams);

    // Sync URL -> Store
    useEffect(() => {
        const pageFromUrl = Number(searchParams.get("page")) || 1;
        const limitFromUrl = Number(searchParams.get("limit")) || 10;
        const searchFromUrl = searchParams.get("search") || undefined;
        const roleFromUrl = searchParams.get("role") || undefined;
        const sortByFromUrl = searchParams.get("sortBy") || undefined;
        const orderFromUrl = (searchParams.get("order") as "asc" | "desc") || undefined;

        setParams({
            page: pageFromUrl,
            limit: limitFromUrl,
            filters: {
                search: searchFromUrl,
                role: roleFromUrl,
                sortBy: sortByFromUrl,
                order: orderFromUrl,
            },
        });
    }, [searchParams, setParams]);

    useEffect(() => {
        setSearchInput(searchFromParams);
    }, [searchFromParams]);

    const updateUrlParams = useCallback((newParams: Record<string, string | number | undefined>) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            Object.entries(newParams).forEach(([key, value]) => {
                if (value === undefined || value === "") {
                    next.delete(key);
                } else {
                    next.set(key, String(value));
                }
            });
            // Reset page if filter changes (unless page is explicitly updated)
            if (
                !newParams.page &&
                (newParams.search !== undefined ||
                    newParams.role !== undefined ||
                    newParams.sortBy !== undefined ||
                    newParams.order !== undefined ||
                    newParams.limit !== undefined)
            ) {
                next.set("page", "1");
            }
            return next;
        });
    }, [setSearchParams]);

    const debouncedSearch = useDebouncedValue(searchInput, 500);

    useEffect(() => {
        if (debouncedSearch !== searchFromParams) {
            updateUrlParams({ search: debouncedSearch });
        }
    }, [debouncedSearch, searchFromParams, updateUrlParams]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleCreate = useCallback(() => {
        setError(null);
        setEditingUser(null);
        setIsDialogOpen(true);
    }, [setError]);

    const handleEdit = (user: User) => {
        setError(null);
        setEditingUser(user);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            await deleteUser(id);
        }
    };

    const handleSubmit = async (data: CreateUserData | UpdateUserData) => {
        if (editingUser) {
            await updateUser(editingUser.id, data);
        } else {
            await createUser(data as CreateUserData);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Page Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-main-light mb-1">User Management</h1>
                    <p className="text-text-muted-light text-sm">Manage users, roles, and permissions</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all shadow-sm shadow-primary/20 whitespace-nowrap text-sm font-medium"
                    >
                        <MdAdd className="text-lg" />
                        <span className="font-semibold">Add User</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-2">
                    <span>⚠️ {error}</span>
                </div>
            )}

            <UserList
                users={users}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                sortBy={filters.sortBy}
                order={filters.order}
                onSort={(field) => {
                    const order = filters.sortBy === field && filters.order === "asc" ? "desc" : "asc";
                    updateUrlParams({ sortBy: field, order });
                }}
                searchValue={searchInput}
                onSearchChange={setSearchInput}
                filters={[
                    {
                        label: "Role",
                        ariaLabel: "Filter by role",
                        value: filters.role || "",
                        onChange: (value) => updateUrlParams({ role: value }),
                        options: [
                            { label: "All Roles", value: "" },
                            { label: "Admin", value: "admin" },
                            { label: "Product Owner", value: "productOwner" },
                            { label: "Project Manager", value: "projectManager" },
                            { label: "Team Member", value: "teamMember" },
                        ],
                    },
                ]}
                page={page}
                totalPages={totalPages}
                totalItems={total}
                pageSize={limit}
                pageSizeOptions={USER_PAGE_SIZE_OPTIONS}
                onPageChange={(nextPage) => updateUrlParams({ page: nextPage })}
                onPageSizeChange={(value) => updateUrlParams({ limit: value })}
            />

            <UserDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleSubmit}
                user={editingUser}
                error={error}
            />
        </div>
    );
}
