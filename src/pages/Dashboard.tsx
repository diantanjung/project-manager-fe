// src/pages/Dashboard.tsx
import { useEffect } from "react";
import { StatsGrid } from "../features/dashboard/components/StatsGrid";
import { MdAdd } from "react-icons/md";
import { useUIStore } from "../stores/uiStore";

export function Dashboard() {
  const setHeader = useUIStore((state) => state.setHeader);

  useEffect(() => {
    setHeader({
      title: "Rebranding Campaign",
      description: "Complete overhaul of the visual identity system.",
      rightContent: (
        <button className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
          <MdAdd className="text-lg" /> Add Task
        </button>
      ),
    });
  }, [setHeader]);

  return (
    <div className="flex flex-col h-full bg-background-light">
      {/* Stats Grid */}
      <div className="flex-1 overflow-y-auto p-6 lg:px-10 py-10">
        <StatsGrid />
      </div>
    </div>
  );
}
