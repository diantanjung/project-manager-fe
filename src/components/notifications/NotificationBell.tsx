import { useState, useRef, useEffect } from "react";
import { MdNotifications } from "react-icons/md";
import { useNotificationStore } from "../../stores/notificationStore";
import { getFullAvatarUrl } from "../../utils/avatar";

export function NotificationBell() {
    const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
    const [isOpen, setIsOpen] = useState(false);
    const hasFetched = useRef(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!hasFetched.current) {
            fetchNotifications();
            hasFetched.current = true;
        }
    }, [fetchNotifications]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const togglePopover = () => setIsOpen(!isOpen);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="relative" ref={popoverRef}>
            <button
                onClick={togglePopover}
                className="relative p-2 text-gray-500 hover:text-primary transition-colors hover:bg-gray-50 rounded-full"
                aria-label="Notifications"
            >
                <MdNotifications className="text-2xl" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-[400px] bg-white rounded-xl shadow-2xl border border-gray-100 flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-text-main-light">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllAsRead()}
                                className="text-xs text-primary hover:text-primary-dark tracking-wide font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto w-full">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-sm text-text-muted-light">
                                You have no new notifications.
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-50">
                                {notifications.map((notif) => (
                                    <li
                                        key={notif.id}
                                        className={`flex items-start gap-3 p-4 transition-colors hover:bg-gray-50 cursor-pointer ${notif.isRead ? "bg-white" : "bg-blue-50/30"
                                            }`}
                                        onClick={() => !notif.isRead && markAsRead(notif.id)}
                                    >
                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            {notif.actorAvatarUrl ? (
                                                <img
                                                    src={getFullAvatarUrl(notif.actorAvatarUrl)}
                                                    alt={notif.actorName || "?"}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs font-bold text-gray-500">
                                                    {notif.actorName ? notif.actorName[0].toUpperCase() : "U"}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-text-main-light">
                                                <span className="font-semibold mr-1">{notif.actorName || "System"}</span>
                                                {notif.type === "task_assigned"
                                                    ? "assigned you a task."
                                                    : notif.type === "mention"
                                                        ? "mentioned you in a comment."
                                                        : "sent a system alert."}
                                            </p>
                                            <p className="text-xs text-text-muted-light mt-1">
                                                {formatTime(notif.createdAt)}
                                            </p>
                                        </div>
                                        {!notif.isRead && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
