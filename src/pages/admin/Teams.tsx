import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useTeamStore } from "../../stores/teamStore";
import { TeamList } from "../../components/teams/TeamList";
import { TeamDialog } from "../../components/teams/TeamDialog";
import type { Team, CreateTeamData, UpdateTeamData } from "../../types/team";
import { MdAdd, MdSearch, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { TeamMembersDialog } from "../../components/teams/TeamMembersDialog";

export function Teams() {
    const {
        teams,
        isLoading,
        error,
        page,
        totalPages,
        filters,
        setParams,
        createTeam,
        updateTeam,
        deleteTeam,
        setError,
    } = useTeamStore();

    const [searchParams, setSearchParams] = useSearchParams();

    // Sync URL -> Store
    useEffect(() => {
        const pageFromUrl = Number(searchParams.get("page")) || 1;
        const searchFromUrl = searchParams.get("search") || undefined;
        const sortByFromUrl = searchParams.get("sortBy") || undefined;
        const orderFromUrl = (searchParams.get("order") as "asc" | "desc") || undefined;

        setParams({
            page: pageFromUrl,
            filters: {
                search: searchFromUrl,
                sortBy: sortByFromUrl,
                order: orderFromUrl,
            },
        });
    }, [searchParams, setParams]);

    const updateUrlParams = (newParams: Record<string, string | number | undefined>) => {
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
            if (!newParams.page && newParams.search !== undefined) {
                next.set("page", "1");
            }
            return next;
        });
    };

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);

    const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
    const [selectedTeamForMembers, setSelectedTeamForMembers] = useState<Team | null>(null);

    const handleCreate = () => {
        setError(null);
        setEditingTeam(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (team: Team) => {
        setError(null);
        setEditingTeam(team);
        setIsDialogOpen(true);
    };

    const handleManageMembers = (team: Team) => {
        setSelectedTeamForMembers(team);
        setIsMembersDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this team?")) {
            await deleteTeam(id);
        }
    };

    const handleSubmit = async (data: CreateTeamData | UpdateTeamData) => {
        if (editingTeam) {
            await updateTeam(editingTeam.id, data);
        } else {
            await createTeam(data as CreateTeamData);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-main-light">
                        Team Management
                    </h1>
                    <p className="text-text-muted-light mt-1">
                        Manage teams and their descriptions
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light text-xl" />
                        <input
                            type="text"
                            placeholder="Search teams by name..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            value={filters.search || ""}
                            onChange={(e) => updateUrlParams({ search: e.target.value })}
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all shadow-sm shadow-primary/20 whitespace-nowrap"
                    >
                        <MdAdd className="text-lg" />
                        <span className="font-semibold">Add Team</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-2">
                    <span>⚠️ {error}</span>
                </div>
            )}

            <TeamList
                teams={teams}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onManageMembers={handleManageMembers}
                sortBy={filters.sortBy}
                order={filters.order}
                onSort={(field) => {
                    const order = filters.sortBy === field && filters.order === "asc" ? "desc" : "asc";
                    updateUrlParams({ sortBy: field, order });
                }}
            />

            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
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

            <TeamDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleSubmit}
                team={editingTeam}
                error={error}
            />

            <TeamMembersDialog
                isOpen={isMembersDialogOpen}
                onClose={() => setIsMembersDialogOpen(false)}
                team={selectedTeamForMembers}
            />
        </div>
    );
}
