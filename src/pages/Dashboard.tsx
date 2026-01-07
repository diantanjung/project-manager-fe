import StatCard from "../components/shared/StatCard";
import {
  MdAssignment,
  MdTrendingUp,
  MdSchedule,
  MdAccountBalanceWallet,
  MdChevronRight,
  MdAdd,
} from "react-icons/md";

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
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Progress"
          value="68%"
          icon={<MdTrendingUp />}
          color="green"
        />
        <StatCard
          title="Hours Logged"
          value="124hrs"
          icon={<MdSchedule />}
          color="orange"
        />
        <StatCard
          title="Budget"
          value="$12.5k"
          icon={<MdAccountBalanceWallet />}
          color="blue"
        />

        <div className="bg-primary text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between h-40 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 text-indigo-400/20">
            <MdAssignment className="text-9xl" />
          </div>
          <span className="text-indigo-100 text-sm font-medium relative z-10">
            Pending Tasks
          </span>
          <span className="font-display text-4xl block mb-1 font-semibold relative z-10">
            14
          </span>
          <p className="text-xs text-indigo-200">3 high priority</p>
        </div>
      </section>
    </div>
  );
}
