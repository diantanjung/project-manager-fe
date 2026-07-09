import { useLocation, Link } from "react-router";
import { MdChevronRight, MdHome } from "react-icons/md";

export function Breadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Skip rendering on the root path if desired
    if (pathnames.length === 0) {
        return null;
    }

    return (
        <nav className="flex items-center text-sm font-medium text-text-muted-light mb-1">
            <Link to="/" className="hover:text-primary flex items-center gap-1 transition-colors">
                <MdHome className="text-lg" />
            </Link>

            {pathnames.map((value, index) => {
                const isLast = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                // Format the label (capitalize first letter, replace dashes with spaces)
                const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

                return (
                    <div key={to} className="flex items-center">
                        <MdChevronRight className="mx-1 text-gray-400" />
                        {isLast ? (
                            <span className="text-text-main-light font-semibold" aria-current="page">
                                {label}
                            </span>
                        ) : (
                            <Link to={to} className="hover:text-primary transition-colors">
                                {label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
