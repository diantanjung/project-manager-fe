// src/components/Sidebar.tsx
import {
  MdDonutLarge,
  MdDashboard,
  MdGroups,
  MdPerson,
  MdAdd,
  MdChevronLeft,
} from "react-icons/md";
import { useAuthStore } from "../../stores/authStore";
import { useUIStore } from "../../stores/uiStore";
import ProjectItem from "./ProjectItem";
import NavItem from "./NavItem";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

// ... imports
import { ProjectDialog } from "../projects/ProjectDialog";
import { useProjectStore } from "../../stores/projectStore";
import type { CreateProjectData } from "../../types/project";
import { getFullAvatarUrl } from "../../utils/avatar";
import { projectService, type SidebarProject } from "../../services/project.service";
import { Skeleton } from "./Loading";

// ... existing imports

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const { createProject } = useProjectStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [sidebarProjects, setSidebarProjects] = useState<SidebarProject[]>([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchSidebarProjects() {
      setIsProjectsLoading(true);
      try {
        const projects = await projectService.getSidebarProjects();
        if (isMounted) {
          setSidebarProjects(projects);
        }
      } finally {
        if (isMounted) {
          setIsProjectsLoading(false);
        }
      }
    }

    fetchSidebarProjects();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleCreateProject = async (data: CreateProjectData) => {
    try {
      await createProject(data);
      setSidebarProjects(await projectService.getSidebarProjects());
      console.log("Project created successfully");
      // Dialog close is handled by the Dialog component calling its own onClose logic or we pass a wrapper
      // In this implementation ProjectDialog closes itself on submit success, but we passed a wrapper below.
    } catch (error) {
      console.error("Failed to create project", error);
      throw error;
    }
  };

  // Helper to assign random colors for now, or use a deterministic mapping
  const getProjectColor = (id: number) => {
    const colors = ["bg-accent-purple", "bg-accent-orange", "bg-accent-green", "bg-blue-400", "bg-pink-400", "bg-indigo-400"];
    return colors[id % colors.length];
  };

  return (
    <aside
      className={`h-full flex flex-col bg-surface-light border-r border-gray-100 shrink-0 z-40 transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-[260px]" : "w-0 border-r-0 opacity-0 pointer-events-none"
        }`}
    >
      <div className="w-[260px] h-full flex flex-col overflow-hidden">
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-50">
          <div className="flex items-center">
            <MdDonutLarge className="text-primary text-3xl mr-2" />
            <span className="font-bold text-xl tracking-wide">TaskFlow</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-text-muted-light hover:text-primary transition-colors p-1 rounded hover:bg-gray-100"
            aria-label="Close Sidebar"
          >
            <MdChevronLeft className="text-2xl" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          <nav className="space-y-1">
            <NavItem
              to="/"
              icon={<MdDashboard className="text-xl" />}
              label="Home"
            />
            {user?.role === "admin" && (
              <>
                <NavItem
                  to="/admin/users"
                  icon={<MdPerson className="text-xl" />}
                  label="Users"
                />
                <NavItem
                  to="/admin/teams"
                  icon={<MdGroups className="text-xl" />}
                  label="Teams"
                />
              </>
            )}
          </nav>
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-semibold text-text-muted-light uppercase tracking-wider">
                Projects
              </span>
              <button
                onClick={() => setIsProjectDialogOpen(true)}
                className="text-text-muted-light hover:text-primary transition-colors"
              >
                <MdAdd className="text-lg" />
              </button>
            </div>
            <ul className="space-y-1">
              {isProjectsLoading && Array.from({ length: 4 }, (_, index) => (
                <li key={index} className="flex items-center gap-3 px-3 py-2">
                  <Skeleton className="h-2.5 w-2.5 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-5" />
                </li>
              ))}
              {!isProjectsLoading && sidebarProjects.map((project) => (
                <ProjectItem
                  key={project.id}
                  color={getProjectColor(project.id)}
                  label={project.name}
                  to={`/project/${project.id}`}
                  count={project.openTaskCount > 0 ? String(project.openTaskCount) : undefined}
                />
              ))}
              {!isProjectsLoading && sidebarProjects.length === 0 && (
                <li className="px-3 py-2 text-sm text-text-muted-light">No projects yet.</li>
              )}
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
                    navigate("/profile");
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
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-accent-purple to-blue-500 p-[2px] ring-1 ring-gray-100 overflow-hidden shrink-0">
              {user?.avatarUrl ? (
                <img
                  src={getFullAvatarUrl(user.avatarUrl)}
                  alt={user?.name || "User"}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-white flex items-center justify-center font-bold text-xs uppercase text-primary">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
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

        <ProjectDialog
          isOpen={isProjectDialogOpen}
          onClose={() => setIsProjectDialogOpen(false)}
          onSubmit={handleCreateProject}
        />
      </div>
    </aside>
  );
}
