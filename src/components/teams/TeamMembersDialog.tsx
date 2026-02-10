import { useState, useEffect } from "react";
import Select from "react-select";
import { MdClose, MdAdd, MdDelete, MdPerson } from "react-icons/md";
import { teamService } from "../../services/team.service";
import { userService } from "../../services/user.service";
import type { Team } from "../../types/team";
import type { User } from "../../types/auth";

interface UserOption {
    value: number;
    label: string;
}

interface TeamMembersDialogProps {
    isOpen: boolean;
    onClose: () => void;
    team: Team | null;
}

interface TeamMember {
    id: number;
    userId: number;
    userName: string;
    userEmail: string;
    role: string;
    joinedAt: string;
}

export function TeamMembersDialog({
    isOpen,
    onClose,
    team,
}: TeamMembersDialogProps) {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && team) {
            loadData();
        } else {
            setMembers([]);
            setAvailableUsers([]);
            setSelectedUser(null);
            setError(null);
        }
    }, [isOpen, team]);

    const loadData = async () => {
        if (!team) return;
        setIsLoading(true);
        setError(null);
        try {
            const [membersData, usersData] = await Promise.all([
                teamService.getTeamMembers(team.id),
                userService.getUsers({ limit: 100 }), // Get first 100 users for now
            ]);
            setMembers(membersData);
            setAvailableUsers(usersData.data);
        } catch (err) {
            console.error("Failed to load data", err);
            setError("Failed to load members or users.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddMember = async () => {
        if (!team || !selectedUser) return;
        setIsLoading(true);
        setError(null);
        try {
            await teamService.addTeamMember(team.id, selectedUser.value);
            await loadData(); // Reload to refresh lists
            setSelectedUser(null);
        } catch (err: any) {
            console.error("Failed to add member", err);
            setError(err.response?.data?.message || "Failed to add member.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveMember = async (userId: number) => {
        if (!team || !window.confirm("Are you sure you want to remove this member?"))
            return;
        setIsLoading(true);
        setError(null);
        try {
            await teamService.removeTeamMember(team.id, userId);
            await loadData();
        } catch (err: any) {
            console.error("Failed to remove member", err);
            setError(err.response?.data?.message || "Failed to remove member.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !team) return null;

    // Filter out users who are already members and convert to options
    const userOptions: UserOption[] = availableUsers
        .filter((user) => !members.some((member) => member.userId === user.id))
        .map((user) => ({
            value: user.id,
            label: `${user.name} - ${user.email}`
        }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Manage Members</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Add or remove members for {team.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <MdClose className="text-xl" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Add Member Section */}
                    <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Add New Member
                        </label>
                        <div className="flex gap-2">
                            <Select
                                value={selectedUser}
                                onChange={(option) => setSelectedUser(option)}
                                options={userOptions}
                                isDisabled={isLoading}
                                isClearable
                                isSearchable
                                placeholder="Select a user..."
                                className="flex-1 text-sm"
                                classNames={{
                                    control: (state) =>
                                        `!border-gray-200 !rounded-lg !min-h-[38px] ${state.isFocused ? '!border-primary !ring-2 !ring-primary/20 !shadow-none' : ''}`,
                                    option: (state) =>
                                        `!text-sm ${state.isSelected ? '!bg-primary' : state.isFocused ? '!bg-primary/10' : ''}`,
                                    placeholder: () => '!text-gray-400',
                                    singleValue: () => '!text-gray-900',
                                }}
                            />

                            <button
                                onClick={handleAddMember}
                                disabled={!selectedUser || isLoading}
                                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
                            >
                                <MdAdd className="text-lg" />
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Members List */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            Current Members ({members.length})
                        </h3>
                        {isLoading && members.length === 0 ? (
                            <div className="text-center py-4 text-gray-500 text-sm">
                                Loading members...
                            </div>
                        ) : members.length === 0 ? (
                            <div className="text-center py-4 text-gray-500 text-sm italic">
                                No members found.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <MdPerson />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {member.userName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {member.userEmail}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveMember(member.userId)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                            title="Remove member"
                                        >
                                            <MdDelete className="text-lg" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
