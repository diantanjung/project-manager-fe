import type { ReactNode } from "react";
import { useUIStore } from "../../stores/uiStore";
import { MdMenu } from "react-icons/md";

interface PageHeaderProps {
    title: string;
    description: string;
    rightContent?: ReactNode;
}

export function PageHeader({ title, description, rightContent }: PageHeaderProps) {
    const { isSidebarOpen, toggleSidebar } = useUIStore();

    return (
        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
            <div className="flex items-center gap-3">
                {/* Only show menu button if sidebar is closed */}
                {!isSidebarOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <MdMenu className="text-2xl" />
                    </button>
                )}

                <div>
                    <h1 className="text-xl font-bold text-text-main-light">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm text-text-muted-light">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            {/* Area for action buttons on the right */}
            {rightContent && (
                <div className="flex items-center gap-3">
                    {rightContent}
                </div>
            )}
        </div>
    );
}