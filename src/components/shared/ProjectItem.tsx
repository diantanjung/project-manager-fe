function ProjectItem({
  color,
  label,
  count,
}: {
  color: string;
  label: string;
  count?: string;
}) {
  return (
    <li>
      <a
        href="#"
        className="flex items-center gap-3 px-3 py-2 text-text-muted-light hover:text-text-main-light hover:bg-gray-50 rounded-lg text-sm transition-colors group"
      >
        <span className={`w-2.5 h-2.5 rounded-full ${color} shadow-sm`}></span>
        <span className="flex-1 truncate">{label}</span>
        {count && (
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
            {count}
          </span>
        )}
      </a>
    </li>
  );
}
export default ProjectItem;
