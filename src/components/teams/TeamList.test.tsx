import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TeamList } from "./TeamList";
import type { Team } from "../../types/team";

const teams: Team[] = [
    {
        id: 1,
        name: "Platform",
        description: "Core delivery team",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
    },
];

describe("TeamList", () => {
    afterEach(() => {
        cleanup();
    });

    it("uses shared table controls and keeps team actions available", () => {
        const onSearchChange = vi.fn();
        const onPageSizeChange = vi.fn();
        const onPageChange = vi.fn();
        const onManageMembers = vi.fn();

        render(
            <TeamList
                teams={teams}
                isLoading={false}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
                onManageMembers={onManageMembers}
                onSort={vi.fn()}
                searchValue=""
                onSearchChange={onSearchChange}
                page={1}
                totalPages={2}
                totalItems={11}
                pageSize={10}
                pageSizeOptions={[10, 25]}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
            />,
        );

        fireEvent.change(screen.getByRole("searchbox", { name: "Search teams" }), {
            target: { value: "plat" },
        });
        fireEvent.change(screen.getByLabelText("Items per page"), {
            target: { value: "25" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Next page" }));
        fireEvent.click(screen.getByTitle("Manage Members"));

        expect(screen.getByText("Platform")).toBeInTheDocument();
        expect(screen.getByText("Showing 1-1 of 11 teams")).toBeInTheDocument();
        expect(onSearchChange).toHaveBeenCalledWith("plat");
        expect(onPageSizeChange).toHaveBeenCalledWith(25);
        expect(onPageChange).toHaveBeenCalledWith(2);
        expect(onManageMembers).toHaveBeenCalledWith(teams[0]);
    });
});
