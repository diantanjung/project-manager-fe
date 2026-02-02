import { useAuthStore } from "../stores/authStore";
import { MdPerson } from "react-icons/md";

export function Profile() {
    const { user } = useAuthStore();

    if (!user) {
        return null;
    }

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-text-main-light mb-8">My Profile</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary to-accent-purple" />
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6">
                        <div className="h-32 w-32 rounded-full border-4 border-white bg-white p-1">
                            <div className="h-full w-full rounded-full bg-gradient-to-tr from-accent-purple to-blue-500 flex items-center justify-center">
                                <span className="text-4xl font-bold text-white uppercase">
                                    {user.name.charAt(0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium text-text-muted-light mb-1">
                                Full Name
                            </label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-text-main-light font-medium">
                                <MdPerson className="text-xl text-text-muted-light" />
                                {user.name}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-muted-light mb-1">
                                Email Address
                            </label>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-text-main-light font-medium">
                                {user.email}
                            </div>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
