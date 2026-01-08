import {
  MdAssignment,
  MdTrendingUp,
  MdSchedule,
  MdAccountBalanceWallet,
} from "react-icons/md";
import StatCard from "../../../components/shared/StatCard";

export function StatsGrid() {
  return (
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
  );
}
