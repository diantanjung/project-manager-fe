import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { MdClose } from "react-icons/md";
import type { Team } from "../../types/team";
import { teamService } from "../../services/team.service";
import type { CreateProjectData } from "../../types/project";

interface ProjectDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateProjectData) => Promise<void>;
}

interface ProjectFormInputs {
    name: string;
    description: string;
    teamId: string; // Form inputs are usually strings, we'll parse it
}

export function ProjectDialog({ isOpen, onClose, onSubmit }: ProjectDialogProps) {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoadingTeams, setIsLoadingTeams] = useState(false);
    const [teamsError, setTeamsError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors },
    } = useForm<ProjectFormInputs>();

    useEffect(() => {
        if (isOpen) {
            reset();
            fetchTeams();
        }
    }, [isOpen, reset]);

    const fetchTeams = async () => {
        setIsLoadingTeams(true);
        setTeamsError(null);
        try {
            const response = await teamService.getAllTeams({ limit: 100 }); // Fetch enough teams for dropdown
            setTeams(response.data);
        } catch (err) {
            setTeamsError("Failed to load teams. Please try again.");
            console.error("Failed to fetch teams:", err);
        } finally {
            setIsLoadingTeams(false);
        }
    };

    const onFormSubmit: SubmitHandler<ProjectFormInputs> = async (data) => {
        await onSubmit({
            name: data.name,
            description: data.description,
            teamId: Number(data.teamId),
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-text-main-light">
                        Create New Project
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-text-muted-light hover:text-text-main-light hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <MdClose className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-main-light mb-1.5">
                            Project Name
                        </label>
                        <input
                            type="text"
                            {...register("name", {
                                required: "Project Name is required",
                                minLength: {
                                    value: 2,
                                    message: "Name must be at least 2 characters",
                                },
                            })}
                            className={`w-full px-3 py-2 rounded-lg bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.name ? "border-red-500" : "border-gray-200"
                                }`}
                            placeholder="e.g. Website Redesign"
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
                            placeholder="Brief description of the project..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main-light mb-1.5">
                            Team
                        </label>
                        {isLoadingTeams ? (
                            <div className="text-sm text-text-muted-light">Loading teams...</div>
                        ) : teamsError ? (
                            <div className="text-sm text-red-500">{teamsError}</div>
                        ) : (
                            <select
                                {...register("teamId", { required: "Please select a team" })}
                                className={`w-full px-3 py-2 rounded-lg bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.teamId ? "border-red-500" : "border-gray-200"
                                    }`}
                            >
                                <option value="">Select a team</option>
                                {teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {errors.teamId && (
                            <p className="mt-1 text-xs text-red-500">{errors.teamId.message}</p>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-text-muted-light hover:text-text-main-light bg-transparent hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoadingTeams}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Creating..." : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
