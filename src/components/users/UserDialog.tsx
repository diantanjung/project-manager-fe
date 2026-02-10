import { useEffect } from "react";
import type { User } from "../../types/auth";
import type { CreateUserData, UpdateUserData } from "../../services/user.service";
import { MdClose } from "react-icons/md";
import { useForm, type SubmitHandler } from "react-hook-form";

interface UserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateUserData | UpdateUserData) => Promise<void>;
    user?: User | null; // If provided, we are in edit mode
    error?: string | null;
}

interface UserFormInputs {
    name: string;
    email: string;
    password?: string;
    role: User["role"];
}

export function UserDialog({ isOpen, onClose, onSubmit, user, error }: UserDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors },
    } = useForm<UserFormInputs>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "teamMember",
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (user) {
                reset({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    password: "", // Password is not editable directly here usually, or optional in updates
                });
            } else {
                reset({
                    name: "",
                    email: "",
                    password: "",
                    role: "teamMember",
                });
            }
        }
    }, [user, isOpen, reset]);

    const onFormSubmit: SubmitHandler<UserFormInputs> = async (data) => {
        try {
            await onSubmit(data);
            onClose();
        } catch {
            // Error is handled by parent
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

                <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-main-light mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            {...register("name", { required: "Full Name is required" })}
                            className={`w-full px-3 py-2 rounded-lg bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.name ? "border-red-500" : "border-gray-200"
                                }`}
                            placeholder="e.g. Sarah Connor"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main-light mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address",
                                },
                            })}
                            className={`w-full px-3 py-2 rounded-lg bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.email ? "border-red-500" : "border-gray-200"
                                }`}
                            placeholder="sarah@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    {!user && (
                        <div>
                            <label className="block text-sm font-medium text-text-main-light mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                {...register("password", { required: "Password is required" })}
                                className={`w-full px-3 py-2 rounded-lg bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.password ? "border-red-500" : "border-gray-200"
                                    }`}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-text-main-light mb-1.5">
                            Role
                        </label>
                        <select
                            {...register("role")}
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
