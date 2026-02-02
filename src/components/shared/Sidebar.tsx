// src/components/Sidebar.tsx
import {
  MdDonutLarge,
  MdDashboard,
  MdCheckCircle,
  MdInbox,
  MdPieChart,
  MdAdd,
  MdBugReport,
} from "react-icons/md";
import { useAuthStore } from "../../stores/authStore";
import { api } from "../../lib/axios";
import ProjectItem from "./ProjectItem";
import NavItem from "./NavItem";

const handleTestApi = async () => {
  console.log("🔄 Making authenticated API request...");
  try {
    const response = await api.get("/users");
    console.log("✅ API Response:", response.data);
    alert("API call successful! Check console for details.");
  } catch (error) {
    console.error("❌ API Error:", error);
    alert("API call failed! Check console for details.");
  }
};

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <aside className="w-[260px] h-full flex flex-col bg-surface-light border-r border-gray-100 shrink-0 z-40">
      <div className="h-16 flex items-center px-6 border-b border-gray-50">
        <MdDonutLarge className="text-primary text-3xl mr-2" />
        <span className="font-bold text-xl tracking-wide">TaskFlow</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        <nav className="space-y-1">
          <NavItem
            to="/dashboard"
            icon={<MdDashboard className="text-xl" />}
            label="Home / Dashboard"
          />
          <NavItem
            to="/tasks"
            icon={<MdCheckCircle className="text-xl" />}
            label="My Tasks"
            badge="8"
          />
          <NavItem
            to="/inbox"
            icon={<MdInbox className="text-xl" />}
            label="Inbox"
          />
          <NavItem
            to="/reports"
            icon={<MdPieChart className="text-xl" />}
            label="Reports"
          />
          {user?.role === "admin" && (
            <NavItem
              to="/admin/users"
              icon={<MdDonutLarge className="text-xl" />}
              label="Manage Users"
            />
          )}
          <button
            onClick={handleTestApi}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-text-muted-light hover:bg-amber-50 hover:text-amber-600 transition-colors cursor-pointer"
          >
            <MdBugReport className="text-xl" />
            <span className="font-medium text-sm">Test API (Refresh)</span>
          </button>
        </nav>
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-text-muted-light uppercase tracking-wider">
              Projects
            </span>
            <button className="text-text-muted-light hover:text-primary transition-colors">
              <MdAdd className="text-lg" />
            </button>
          </div>
          <ul className="space-y-1">
            <ProjectItem
              color="bg-accent-purple"
              label="Rebranding Campaign"
              count="14"
            />
            <ProjectItem color="bg-accent-orange" label="Website Redesign" />
            <ProjectItem color="bg-accent-green" label="Q4 Marketing" />
            <ProjectItem color="bg-blue-400" label="Mobile App" />
          </ul>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 relative" ref={menuRef}>
        {isMenuOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
            <div className="py-1">
              <button
                onClick={() => {
                  navigate("/profile");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-text-main-light hover:bg-gray-50 flex items-center gap-2"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  navigate("/settings");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-text-main-light hover:bg-gray-50 flex items-center gap-2"
              >
                Settings
              </button>
              <div className="h-px bg-gray-100 my-1" />
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                Logout
              </button>
            </div>
          </div>
        )}
        <div
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group select-none ${isMenuOpen ? "bg-gray-50" : ""
            }`}
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-accent-purple to-blue-500 p-[2px] ring-1 ring-gray-100">
            <div className="h-full w-full rounded-full bg-white flex items-center justify-center font-bold text-xs uppercase text-primary">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-main-light truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-text-muted-light truncate capitalize">
              {user?.role?.replace(/([A-Z])/g, " $1").trim() || "Team Member"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
