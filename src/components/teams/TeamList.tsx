import type { Team } from "../../types/team";
import { MdEdit, MdDelete, MdArrowUpward, MdArrowDownward, MdPeople } from "react-icons/md";

interface TeamListProps {
    teams: Team[];
    onEdit: (team: Team) => void;
    onDelete: (id: number) => void;
    onManageMembers: (team: Team) => void;
    isLoading: boolean;
    sortBy?: string;
    order?: "asc" | "desc";
    onSort: (field: string) => void;
}

export function TeamList({ teams, onEdit, onDelete, onManageMembers, isLoading, sortBy, order, onSort }: TeamListProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th
                            className="px-6 py-4 text-xs font-semibold text-text-muted-light uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => onSort("name")}
                        >
                            <div className="flex items-center gap-1">
                                Name
                                {sortBy === "name" && (
                                    order === "asc" ? <MdArrowUpward /> : <MdArrowDownward />
                                )}
                            </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-text-muted-light uppercase tracking-wider">
                            Description
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-text-muted-light uppercase tracking-wider text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {Array.isArray(teams) && teams.map((team) => (
                        <tr key={team.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                                        {team.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="font-medium text-text-main-light">
                                        {team.name}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-text-muted-light max-w-md truncate">
                                    {team.description || "-"}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onManageMembers(team)}
                                        className="p-1.5 text-text-muted-light hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                        title="Manage Members"
                                    >
                                        <MdPeople className="text-lg" />
                                    </button>
                                    <button
                                        onClick={() => onEdit(team)}
                                        className="p-1.5 text-text-muted-light hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <MdEdit className="text-lg" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(team.id)}
                                        className="p-1.5 text-text-muted-light hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <MdDelete className="text-lg" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {teams.length === 0 && (
                <div className="text-center py-12 text-text-muted-light">
                    No teams found.
                </div>
            )}
        </div>
    );
}
