import { StatsGrid } from "../features/dashboard/components/StatsGrid";
import { MdChevronRight, MdAdd } from "react-icons/md";

// src/pages/Dashboard.tsx
export function Dashboard() {
  return (
    <div className="mx-auto px-6 lg:px-10 py-10 w-full">
      {/* Header */}
      <header className="mb-10 relative flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3 text-sm text-text-muted-light">
            <span>Projects</span>
            <MdChevronRight className="text-base" />
            <span className="text-primary font-medium">
              Rebranding Campaign
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-text-main-light mb-4 mt-2">
            Rebranding{" "}
            <span className="text-text-muted-light font-normal">Campaign</span>
          </h1>
          <p className="text-base md:text-lg text-text-muted-light max-w-3xl font-light leading-relaxed">
            Complete overhaul of the visual identity system.
          </p>
        </div>
        <div className="flex gap-3 mt-2">
          <button className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
            <MdAdd className="text-lg" /> Add Task
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <StatsGrid />
    </div>
  );
}
