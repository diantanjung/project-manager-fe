import type { ReactNode } from "react";
import { MdChevronLeft, MdChevronRight, MdSearch } from "react-icons/md";

export interface TableListFilter {
    label: string;
    ariaLabel: string;
    value: string;
    options: {
        label: string;
        value: string;
    }[];
    onChange: (value: string) => void;
}

interface TableListControlsProps {
    searchValue: string;
    searchPlaceholder: string;
    searchAriaLabel: string;
    onSearchChange: (value: string) => void;
    filters?: TableListFilter[];
    pageSize: number;
    pageSizeOptions: number[];
    onPageSizeChange: (value: number) => void;
    actions?: ReactNode;
}

interface TableListPaginationProps {
    itemLabel: string;
    page: number;
    totalPages: number;
    totalItems: number;
    pageStart: number;
    pageEnd: number;
    onPageChange: (page: number) => void;
}

export function TableListControls({
    searchValue,
    searchPlaceholder,
    searchAriaLabel,
    onSearchChange,
    filters = [],
    pageSize,
    pageSizeOptions,
    onPageSizeChange,
    actions,
}: TableListControlsProps) {
    return (
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
                <MdSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    aria-label={searchAriaLabel}
                    type="search"
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
            </div>
            <div className="flex flex-wrap items-center gap-3">
                {filters.map((filter) => (
                    <label key={filter.ariaLabel} className="flex items-center gap-2 text-sm text-gray-500">
                        {filter.label}
                        <select
                            aria-label={filter.ariaLabel}
                            value={filter.value}
                            onChange={(event) => filter.onChange(event.target.value)}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        >
                            {filter.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                ))}
                <label className="flex items-center gap-2 text-sm text-gray-500">
                    Show
                    <select
                        aria-label="Items per page"
                        value={pageSize}
                        onChange={(event) => onPageSizeChange(Number(event.target.value))}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    >
                        {pageSizeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>
                {actions}
            </div>
        </div>
    );
}

export function TableListPagination({
    itemLabel,
    page,
    totalPages,
    totalItems,
    pageStart,
    pageEnd,
    onPageChange,
}: TableListPaginationProps) {
    return (
        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
                Showing {pageStart}-{pageEnd} of {totalItems} {itemLabel}
            </span>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                >
                    <MdChevronLeft />
                </button>
                <span className="min-w-20 text-center">
                    Page {page} of {totalPages}
                </span>
                <button
                    type="button"
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                >
                    <MdChevronRight />
                </button>
            </div>
        </div>
    );
}
