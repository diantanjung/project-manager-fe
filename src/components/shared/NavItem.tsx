import { NavLink } from "react-router";

function NavItem({
  to,
  icon,
  label,
  badge,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-text-muted-light hover:text-text-main-light hover:bg-gray-50"
        }`
      }
    >
      {icon}
      {label}
      {badge && (
        <span className="ml-auto bg-gray-100 text-xs px-2 py-0.5 rounded-full text-black">
          {badge}
        </span>
      )}
    </NavLink>
  );
}
export default NavItem;
