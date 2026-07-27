interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "green" | "orange" | "blue" | "red" | "purple";
  progress?: number;
  helperText?: string;
  showProgress?: boolean;
  dangerValue?: boolean;
}
function StatCard({
  title,
  value,
  icon,
  color,
  progress = 0,
  helperText,
  showProgress = false,
  dangerValue = false,
}: StatCardProps) {
  const colorClasses = {
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
  };
  const progressWidth = `${Math.max(0, Math.min(100, progress))}%`;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 group hover:border-primary/30 transition-all">
      <div className="flex justify-between items-start">
        <span className="text-text-muted-light text-sm font-medium">
          {title}
        </span>
        <span className={`${colorClasses[color]} p-2 rounded-md`}>
          <span className="text-sm flex items-center justify-center">
            {icon}
          </span>
        </span>
      </div>
      <span className="font-display text-4xl block mb-1 font-semibold tracking-normal">
        <span className={dangerValue ? "text-red-600" : undefined}>{value}</span>
      </span>
      <div>
        {helperText && (
          <p className={`text-xs text-text-muted-light truncate ${showProgress ? "mb-2" : ""}`}>
            {helperText}
          </p>
        )}
        {showProgress && (
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: progressWidth }}></div>
          </div>
        )}
      </div>
    </div>
  );
}
export default StatCard;
