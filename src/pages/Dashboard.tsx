// src/pages/Dashboard.tsx

import { StatsGrid } from "../features/dashboard/components/StatsGrid";
import { MdAdd } from "react-icons/md";


export function Dashboard() {
  return (
    <div className="flex flex-col h-full bg-background-light">
      {/* Page Header Area inside Content */}
      <div className="flex items-center justify-between p-6 lg:px-10 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-text-main-light mb-1">Rebranding Campaign</h1>
          <p className="text-text-muted-light text-sm">Complete overhaul of the visual identity system.</p>
        </div>
        <button className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
          <MdAdd className="text-lg" /> Add Task
        </button>
      </div>

      {/* Stats Grid */}
      <div className="flex-1 overflow-y-auto p-6 lg:px-10 py-6">
        <StatsGrid />
      </div>
    </div>
  );
}
