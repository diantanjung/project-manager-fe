// src/components/Sidebar.tsx
import {
  MdDonutLarge,
  MdDashboard,
  MdCheckCircle,
  MdInbox,
  MdPieChart,
  MdAdd,
} from "react-icons/md";
import ProjectItem from "./ProjectItem";
import NavItem from "./NavItem";
export function Sidebar() {
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

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group relative">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-accent-purple to-blue-500 p-[2px] ring-1 ring-gray-100">
            <div className="h-full w-full rounded-full bg-white flex items-center justify-center font-bold text-xs">
              AM
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-main-light truncate">
              Alex Morgan
            </p>
            <p className="text-xs text-text-muted-light truncate">
              Product Designer
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}


