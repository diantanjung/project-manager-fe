interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "green" | "orange" | "blue"; // Limit color to strictly these keys
}
function StatCard({ title, value, icon, color }: StatCardProps) {
  // Remove ': any' here so TS infers the object type correctly
  const colorClasses = {
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 group hover:border-primary/30 transition-all">
      <div className="flex justify-between items-start">
        <span className="text-text-muted-light text-sm font-medium">
          {title}
        </span>
        <span className={`${colorClasses[color]} p-1 rounded-md`}>
          <span className="text-base flex items-center justify-center">
            {icon}
          </span>
        </span>
      </div>
      <span className="font-display text-4xl block mb-2 font-semibold">
        {value}
      </span>
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className="bg-primary h-1.5 rounded-full" style={{ width: "68%" }}></div>
      </div>
    </div>
  );
}
export default StatCard;
