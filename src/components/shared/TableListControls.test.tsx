import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TableListControls, TableListPagination } from "./TableListControls";

describe("TableListControls", () => {
    afterEach(() => {
        cleanup();
    });

    it("emits search, filter, and page size changes", () => {
        const onSearchChange = vi.fn();
        const onFilterChange = vi.fn();
        const onPageSizeChange = vi.fn();

        render(
            <TableListControls
                searchValue=""
                searchPlaceholder="Search items..."
                searchAriaLabel="Search items"
                onSearchChange={onSearchChange}
                filters={[
                    {
                        label: "Status",
                        ariaLabel: "Filter by status",
                        value: "all",
                        onChange: onFilterChange,
                        options: [
                            { label: "All", value: "all" },
                            { label: "Done", value: "done" },
                        ],
                    },
                ]}
                pageSize={10}
                pageSizeOptions={[10, 25]}
                onPageSizeChange={onPageSizeChange}
            />,
        );

        fireEvent.change(screen.getByRole("searchbox", { name: "Search items" }), {
            target: { value: "release" },
        });
        fireEvent.change(screen.getByLabelText("Filter by status"), {
            target: { value: "done" },
        });
        fireEvent.change(screen.getByLabelText("Items per page"), {
            target: { value: "25" },
        });

        expect(onSearchChange).toHaveBeenCalledWith("release");
        expect(onFilterChange).toHaveBeenCalledWith("done");
        expect(onPageSizeChange).toHaveBeenCalledWith(25);
    });
});

describe("TableListPagination", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders range text and emits bounded page changes", () => {
        const onPageChange = vi.fn();

        render(
            <TableListPagination
                itemLabel="items"
                page={2}
                totalPages={3}
                totalItems={24}
                pageStart={11}
                pageEnd={20}
                onPageChange={onPageChange}
            />,
        );

        expect(screen.getByText("Showing 11-20 of 24 items")).toBeInTheDocument();
        expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
        fireEvent.click(screen.getByRole("button", { name: "Next page" }));

        expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
        expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
    });
});
