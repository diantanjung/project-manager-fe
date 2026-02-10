import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { MdClose } from "react-icons/md";
import type { Team, CreateTeamData, UpdateTeamData } from "../../types/team";

interface TeamDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTeamData | UpdateTeamData) => Promise<void>;
    team?: Team | null; // If provided, we are in edit mode
    error?: string | null;
}

interface TeamFormInputs {
    name: string;
    description?: string;
}

export function TeamDialog({ isOpen, onClose, onSubmit, team, error }: TeamDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors },
    } = useForm<TeamFormInputs>();

    useEffect(() => {
        if (isOpen) {
            if (team) {
                reset({
                    name: team.name,
                    description: team.description || "",
                });
            } else {
                reset({
                    name: "",
                    description: "",
                });
            }
        }
    }, [team, isOpen, reset]);

    const onFormSubmit: SubmitHandler<TeamFormInputs> = async (data) => {
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
                        {team ? "Edit Team" : "Create New Team"}
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
                            Team Name
                        </label>
                        <input
                            type="text"
                            {...register("name", {
                                required: "Team Name is required",
                                minLength: {
                                    value: 2,
                                    message: "Name must be at least 2 characters",
                                },
                            })}
                            className={`w-full px-3 py-2 rounded-lg bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.name ? "border-red-500" : "border-gray-200"
                                }`}
                            placeholder="e.g. Engineering"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main-light mb-1.5">
                            Description <span className="text-text-muted-light font-normal">(Optional)</span>
                        </label>
                        <textarea
                            {...register("description")}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                            placeholder="Brief description of the team..."
                        />
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
                                : team
                                    ? "Save Changes"
                                    : "Create Team"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
