import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import { useUserStore } from "../../stores/userStore";

import { UserList } from "../../components/users/UserList";
import { UserDialog } from "../../components/users/UserDialog";
import type { User } from "../../types/auth";
import type { CreateUserData, UpdateUserData } from "../../services/user.service";
import { MdAdd, MdSearch, MdFilterList, MdChevronLeft, MdChevronRight } from "react-icons/md";

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
                    <div className="relative">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light text-xl" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-48 xl:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            value={filters.search || ""}
                            onChange={(e) => updateUrlParams({ search: e.target.value })}
                        />
                    </div>
                    <div className="relative w-40">
                        <MdFilterList className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light text-xl" />
                        <select
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all text-sm"
                            value={filters.role || ""}
                            onChange={(e) => updateUrlParams({ role: e.target.value })}
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="productOwner">Product Owner</option>
                            <option value="projectManager">Project Manager</option>
                            <option value="teamMember">Team Member</option>
                        </select>
                    </div>
                    <select
                        className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        value={limit}
                        onChange={(e) => updateUrlParams({ limit: Number(e.target.value) })}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
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
            />

            {/* Pagination Controls */}
            {!isLoading && total > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
                    <span className="text-sm text-text-muted-light">
                        Showing {users.length} of {total} users
                    </span>
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4">
                            <button
                                onClick={() => updateUrlParams({ page: page - 1 })}
                                disabled={page === 1}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <MdChevronLeft className="text-xl" />
                            </button>
                            <span className="text-sm font-medium text-text-muted-light">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => updateUrlParams({ page: page + 1 })}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <MdChevronRight className="text-xl" />
                            </button>
                        </div>
                    )}
                </div>
            )}

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
