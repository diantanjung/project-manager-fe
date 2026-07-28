import type { ReactNode } from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-gray-100 ${className}`}
    />
  );
}

export function PageLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-text-muted-light">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-b-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function InlineLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-text-muted-light">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-b-primary" />
      <span>{label}</span>
    </div>
  );
}

export function TableRowsSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <table className="w-full text-left">
      <tbody className="divide-y divide-gray-100">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }, (_, columnIndex) => (
              <td key={columnIndex} className="px-6 py-4">
                <Skeleton className="h-4 w-full max-w-[160px]" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function LoadingSection({
  children,
  isLoading,
  fallback,
}: {
  children: ReactNode;
  isLoading: boolean;
  fallback: ReactNode;
}) {
  return isLoading ? <>{fallback}</> : <>{children}</>;
}
