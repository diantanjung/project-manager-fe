import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useUIStore } from "../stores/uiStore";
import { MdPerson, MdEdit, MdSave, MdClose, MdCameraAlt } from "react-icons/md";
import { userService } from "../services/user.service";
import { uploadService } from "../services/upload.service";
import { isAxiosError } from "axios";
import { useRef } from "react";
import { getFullAvatarUrl } from "../utils/avatar";

export function Profile() {
    const { user, updateUser } = useAuthStore();
    const setHeader = useUIStore((state) => state.setHeader);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    useEffect(() => {
        setHeader({
            title: "My Profile",
            description: "Manage your personal information",
        });
    }, [setHeader]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
            });
            setError(null);
        }
    }, [user, isEditing]);

    if (!user) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const updatedUser = await userService.updateUser(user.id, formData);
            updateUser(updatedUser);
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update profile", err);
            if (isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message as string);
            } else {
                setError("Failed to update profile. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsLoading(true);
            setError(null);
            const { url } = await uploadService.uploadFile(file);
            const updatedUser = await userService.updateUser(user.id, { avatarUrl: url });
            updateUser(updatedUser);
        } catch (err) {
            console.error("Failed to upload avatar", err);
            setError("Failed to upload avatar. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary to-accent-purple" />
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6 flex justify-between items-end">
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-full border-4 border-white bg-white p-1 shadow-md">
                                {user.avatarUrl ? (
                                    <img
                                        src={getFullAvatarUrl(user.avatarUrl)}
                                        alt={user.name}
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full rounded-full bg-gradient-to-tr from-accent-purple to-blue-500 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-white uppercase">
                                            {user.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark hover:scale-105 transition-all focus:outline-none ring-2 ring-white"
                                    disabled={isLoading}
                                    title="Update Profile Picture"
                                >
                                    <MdCameraAlt className="text-lg" />
                                </button>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mb-2 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-text-main-light hover:bg-gray-50 transition-colors"
                            >
                                <MdEdit />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="mb-2 flex gap-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-text-main-light hover:bg-gray-50 transition-colors"
                                    disabled={isLoading}
                                >
                                    <MdClose />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-sm text-sm font-medium hover:bg-primary-dark transition-colors"
                                    disabled={isLoading}
                                >
                                    <MdSave />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-3">
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium text-text-muted-light mb-1">
                                Full Name
                            </label>
                            {isEditing ? (
                                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                    <MdPerson className="text-xl text-text-muted-light" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="flex-1 outline-none text-text-main-light font-medium placeholder:text-gray-300"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-text-main-light font-medium">
                                    <MdPerson className="text-xl text-text-muted-light" />
                                    {user.name}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-muted-light mb-1">
                                Email Address
                            </label>
                            {isEditing ? (
                                <div className="p-3 bg-white rounded-xl border border-gray-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full outline-none text-text-main-light font-medium placeholder:text-gray-300"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            ) : (
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-text-main-light font-medium">
                                    {user.email}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-muted-light mb-1">
                                Role
                            </label>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-text-main-light font-medium capitalize">
                                {user.role?.replace(/([A-Z])/g, " $1").trim() || "Team Member"}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-muted-light mb-1">
                                User ID
                            </label>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-text-muted-light font-mono text-sm">
                                {user.id}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
