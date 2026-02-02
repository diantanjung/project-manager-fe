import type { User } from "../../types/auth";
import { MdEdit, MdDelete, MdArrowUpward, MdArrowDownward } from "react-icons/md";

interface UserListProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
    isLoading: boolean;
    sortBy?: string;
    order?: "asc" | "desc";
    onSort: (field: string) => void;
}

export function UserList({ users, onEdit, onDelete, isLoading, sortBy, order, onSort }: UserListProps) {
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
                        <th
                            className="px-6 py-4 text-xs font-semibold text-text-muted-light uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => onSort("email")}
                        >
                            <div className="flex items-center gap-1">
                                Email
                                {sortBy === "email" && (
                                    order === "asc" ? <MdArrowUpward /> : <MdArrowDownward />
                                )}
                            </div>
                        </th>
                        <th
                            className="px-6 py-4 text-xs font-semibold text-text-muted-light uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => onSort("role")}
                        >
                            <div className="flex items-center gap-1">
                                Role
                                {sortBy === "role" && (
                                    order === "asc" ? <MdArrowUpward /> : <MdArrowDownward />
                                )}
                            </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-text-muted-light uppercase tracking-wider text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {Array.isArray(users) && users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-accent-purple flex items-center justify-center text-white font-bold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="font-medium text-text-main-light">
                                        {user.name}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-text-muted-light">
                                    {user.email}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                  ${user.role === "admin"
                                            ? "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20"
                                            : user.role === "productOwner"
                                                ? "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20"
                                                : user.role === "projectManager"
                                                    ? "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
                                                    : "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20"
                                        }`}
                                >
                                    {user.role?.replace(/([A-Z])/g, " $1").trim() || "Team Member"}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="p-1.5 text-text-muted-light hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <MdEdit className="text-lg" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(user.id)}
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
            {users.length === 0 && (
                <div className="text-center py-12 text-text-muted-light">
                    No users found.
                </div>
            )}
        </div>
    );
}
