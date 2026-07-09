import type { ReactNode } from "react";
import { useUIStore } from "../../stores/uiStore";
import { MdMenu } from "react-icons/md";
import { Breadcrumbs } from "./Breadcrumbs";
import { NotificationBell } from "../notifications/NotificationBell";

interface PageHeaderProps {
    rightContent?: ReactNode;
}

export function PageHeader({ rightContent }: PageHeaderProps) {
    const { isSidebarOpen, toggleSidebar } = useUIStore();

    return (
        <div className="min-h-[64px] py-3 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
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

                <div className="flex flex-col justify-center">
                    <Breadcrumbs />
                </div>
            </div>
            {/* Area for action buttons on the right */}
            <div className="flex items-center gap-3">
                {rightContent}
                {rightContent && <div className="h-8 w-px bg-gray-200 mx-1"></div>}
                <NotificationBell />
            </div>
        </div>
    );
}