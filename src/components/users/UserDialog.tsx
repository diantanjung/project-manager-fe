import { useState, useEffect } from "react";
import type { User } from "../../types/auth";
import type { CreateUserData, UpdateUserData } from "../../services/user.service";
import { MdClose } from "react-icons/md";

interface UserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateUserData | UpdateUserData) => Promise<void>;
    user?: User | null; // If provided, we are in edit mode
    error?: string | null;
}

export function UserDialog({ isOpen, onClose, onSubmit, user, error }: UserDialogProps) {
    const [formData, setFormData] = useState<CreateUserData>({
        name: "",
        email: "",
        password: "",
        role: "teamMember",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "teamMember",
            });
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch {
            // Error is handled by parent or hook
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-text-main-light">
                        {user ? "Edit User" : "Create New User"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-text-muted-light hover:text-text-main-light hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <MdClose className="text-xl" />
                    </button>
                </div>

                {error && (
                    <div className="mx-6 mt-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-start gap-2">
                        <span>⚠️ {error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-main-light mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="e.g. Sarah Connor"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main-light mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="sarah@example.com"
                        />
                    </div>

                    {!user && (
                        <div>
                            <label className="block text-sm font-medium text-text-main-light mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-text-main-light mb-1.5">
                            Role
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    role: e.target.value as User["role"],
                                })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        >
                            <option value="teamMember">Team Member</option>
                            <option value="projectManager">Project Manager</option>
                            <option value="productOwner">Product Owner</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-text-muted-light hover:text-text-main-light bg-trasnparent hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : user
                                    ? "Save Changes"
                                    : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
